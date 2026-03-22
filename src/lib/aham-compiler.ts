// A.HAM Compiler — Lexer, Parser, Semantic Analyzer

export interface SymbolEntry {
  identifier: string;
  dataType: string;
  level: number;
  offset: number;
}

export interface CompileResult {
  logs: string[];
  symbols: SymbolEntry[];
  success: boolean;
}

// Token types
type TokenType =
  | "PROGRAM_START"
  | "TYPE_INT"
  | "TYPE_STRING"
  | "TYPE_BOOL"
  | "ASSIGN"
  | "IF"
  | "CONDITION_OP"
  | "LOOP"
  | "PRINT"
  | "BOOL_TRUE"
  | "BOOL_FALSE"
  | "PROGRAM_END"
  | "IDENTIFIER"
  | "INT_LITERAL"
  | "STRING_LITERAL"
  | "BANG"
  | "UNKNOWN";

interface Token {
  type: TokenType;
  value: string;
  line: number;
}

// ─── LEXER ───
function tokenize(source: string, logs: string[]): Token[] {
  logs.push("═══ LEXER PHASE ═══");
  const lines = source.split("\n");
  const tokens: Token[] = [];

  const KEYWORDS: Record<string, TokenType> = {
    DEAR: "PROGRAM_START",
    SHOT: "TYPE_INT",
    LETTER: "TYPE_STRING",
    VOTE: "TYPE_BOOL",
    WRITE: "ASSIGN",
    IF: "IF",
    "YOURE LIKE ME": "CONDITION_OP",
    "NON STOP": "LOOP",
    "DROP KNOWLEDGE": "PRINT",
    SATISFIED: "BOOL_TRUE",
    DISSATISFIED: "BOOL_FALSE",
    "YOUR OBEDIENT SERVANT": "PROGRAM_END",
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (trimmed === "") continue;

    let matched = false;

    // Multi-word keywords first (order matters)
    const multiKeys = [
      "YOUR OBEDIENT SERVANT",
      "YOURE LIKE ME",
      "NON STOP",
      "DROP KNOWLEDGE",
    ];

    let remaining = trimmed;

    // Check DEAR ALEXANDER (program start)
    if (remaining.startsWith("DEAR ")) {
      tokens.push({ type: "PROGRAM_START", value: "DEAR", line: i + 1 });
      const name = remaining.slice(5).trim();
      if (name) tokens.push({ type: "IDENTIFIER", value: name, line: i + 1 });
      logs.push(`  Line ${i + 1}: Found PROGRAM_START → "DEAR ${name}"`);
      continue;
    }

    // Check YOUR OBEDIENT SERVANT (program end)
    if (remaining.startsWith("YOUR OBEDIENT SERVANT")) {
      tokens.push({ type: "PROGRAM_END", value: "YOUR OBEDIENT SERVANT", line: i + 1 });
      const rest = remaining.slice(21).trim();
      if (rest) tokens.push({ type: "IDENTIFIER", value: rest, line: i + 1 });
      logs.push(`  Line ${i + 1}: Found PROGRAM_END → "YOUR OBEDIENT SERVANT"`);
      continue;
    }

    // Tokenize line word-by-word with multi-word lookahead
    const words = remaining.split(/\s+/);
    let wi = 0;
    const lineTokens: Token[] = [];

    while (wi < words.length) {
      const w = words[wi];

      // Try multi-word matches
      if (w === "YOURE" && words[wi + 1] === "LIKE" && words[wi + 2] === "ME") {
        lineTokens.push({ type: "CONDITION_OP", value: "YOURE LIKE ME", line: i + 1 });
        wi += 3;
        continue;
      }
      if (w === "NON" && words[wi + 1] === "STOP") {
        lineTokens.push({ type: "LOOP", value: "NON STOP", line: i + 1 });
        wi += 2;
        continue;
      }
      if (w === "DROP" && words[wi + 1] === "KNOWLEDGE") {
        lineTokens.push({ type: "PRINT", value: "DROP KNOWLEDGE", line: i + 1 });
        wi += 2;
        continue;
      }

      // Single keywords
      if (KEYWORDS[w]) {
        lineTokens.push({ type: KEYWORDS[w], value: w, line: i + 1 });
        wi++;
        continue;
      }

      // String literal
      if (w.startsWith('"')) {
        let str = w;
        while (!str.endsWith('"') || str === '"') {
          wi++;
          if (wi >= words.length) break;
          str += " " + words[wi];
        }
        // Remove trailing !
        let val = str;
        if (val.endsWith('!')) {
          val = val.slice(0, -1);
        }
        lineTokens.push({ type: "STRING_LITERAL", value: val, line: i + 1 });
        wi++;
        continue;
      }

      // Bang (statement terminator)
      if (w === "!") {
        lineTokens.push({ type: "BANG", value: "!", line: i + 1 });
        wi++;
        continue;
      }

      // Check if word ends with !
      if (w.endsWith("!")) {
        const clean = w.slice(0, -1);
        if (/^\d+$/.test(clean)) {
          lineTokens.push({ type: "INT_LITERAL", value: clean, line: i + 1 });
        } else if (clean === "SATISFIED") {
          lineTokens.push({ type: "BOOL_TRUE", value: clean, line: i + 1 });
        } else if (clean === "DISSATISFIED") {
          lineTokens.push({ type: "BOOL_FALSE", value: clean, line: i + 1 });
        } else {
          lineTokens.push({ type: "IDENTIFIER", value: clean, line: i + 1 });
        }
        lineTokens.push({ type: "BANG", value: "!", line: i + 1 });
        wi++;
        continue;
      }

      // Int literal
      if (/^\d+$/.test(w)) {
        lineTokens.push({ type: "INT_LITERAL", value: w, line: i + 1 });
        wi++;
        continue;
      }

      // Bool literals
      if (w === "SATISFIED") {
        lineTokens.push({ type: "BOOL_TRUE", value: w, line: i + 1 });
        wi++;
        continue;
      }
      if (w === "DISSATISFIED") {
        lineTokens.push({ type: "BOOL_FALSE", value: w, line: i + 1 });
        wi++;
        continue;
      }

      // Identifier
      lineTokens.push({ type: "IDENTIFIER", value: w, line: i + 1 });
      wi++;
    }

    for (const t of lineTokens) {
      logs.push(`  Line ${i + 1}: ${t.type} → "${t.value}"`);
    }
    tokens.push(...lineTokens);
  }

  logs.push(`  Total tokens: ${tokens.length}`);
  logs.push("");
  return tokens;
}

// ─── PARSER & SEMANTIC ANALYZER ───
function parseAndAnalyze(
  source: string,
  tokens: Token[],
  logs: string[]
): { symbols: SymbolEntry[]; success: boolean } {
  logs.push("═══ PARSER PHASE ═══");

  const lines = source.split("\n");
  const symbols: SymbolEntry[] = [];

  // Track scope via indentation
  const scopeOffsets: Record<number, number> = { 0: 0 };
  let currentLevel = 0;
  const scopeStack: number[] = [0];

  const TYPE_SIZES: Record<string, number> = {
    SHOT: 4,
    LETTER: 8,
    VOTE: 1,
  };

  const TYPE_NAMES: Record<string, string> = {
    SHOT: "INT",
    LETTER: "STRING",
    VOTE: "BOOL",
  };

  let foundStart = false;
  let foundEnd = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (trimmed === "") continue;

    // Calculate indent level
    const leadingSpaces = raw.length - raw.trimStart().length;
    const indentLevel = Math.floor(leadingSpaces / 4);

    // Pop scope stack when decreasing indent
    while (indentLevel < currentLevel && scopeStack.length > 1) {
      const popped = scopeStack.pop()!;
      logs.push(`  Line ${i + 1}: Exiting scope level ${popped}`);
      currentLevel--;
    }

    // DEAR — program start
    if (trimmed.startsWith("DEAR ")) {
      foundStart = true;
      logs.push(`  Line ${i + 1}: ✓ Program start declaration`);
      continue;
    }

    // YOUR OBEDIENT SERVANT — program end
    if (trimmed.startsWith("YOUR OBEDIENT SERVANT")) {
      foundEnd = true;
      logs.push(`  Line ${i + 1}: ✓ Program end declaration`);
      continue;
    }

    // Variable declarations: TYPE name WRITE value!
    const declMatch = trimmed.match(/^(SHOT|LETTER|VOTE)\s+(\w+)\s+WRITE\s+(.+)!$/);
    if (declMatch) {
      const [, typeKw, name, value] = declMatch;
      const level = indentLevel;

      if (!(level in scopeOffsets)) scopeOffsets[level] = 0;
      const offset = scopeOffsets[level];
      const size = TYPE_SIZES[typeKw];

      symbols.push({
        identifier: name,
        dataType: TYPE_NAMES[typeKw],
        level,
        offset,
      });

      scopeOffsets[level] = offset + size;

      logs.push(`  Line ${i + 1}: ✓ Declaration: ${TYPE_NAMES[typeKw]} ${name} = ${value} [level=${level}, offset=${offset}]`);

      // Semantic type check
      logs.push("");
      logs.push("═══ SEMANTIC PHASE ═══");
      if (typeKw === "SHOT") {
        if (!/^\d+$/.test(value.trim())) {
          logs.push(`  Line ${i + 1}: ⚠ Type warning: expected INT literal for SHOT`);
        } else {
          logs.push(`  Line ${i + 1}: ✓ Type check passed: INT = ${value}`);
        }
      } else if (typeKw === "LETTER") {
        if (!value.trim().startsWith('"')) {
          logs.push(`  Line ${i + 1}: ⚠ Type warning: expected STRING literal for LETTER`);
        } else {
          logs.push(`  Line ${i + 1}: ✓ Type check passed: STRING = ${value}`);
        }
      } else if (typeKw === "VOTE") {
        if (!["SATISFIED", "DISSATISFIED"].includes(value.trim())) {
          logs.push(`  Line ${i + 1}: ⚠ Type warning: expected BOOL literal for VOTE`);
        } else {
          logs.push(`  Line ${i + 1}: ✓ Type check passed: BOOL = ${value}`);
        }
      }
      logs.push("");
      continue;
    }

    // IF statement
    const ifMatch = trimmed.match(/^IF\s+(\w+)\s+YOURE LIKE ME\s+(.+)!$/);
    if (ifMatch) {
      const [, varName, condVal] = ifMatch;
      logs.push(`  Line ${i + 1}: ✓ Conditional: IF ${varName} == ${condVal}`);
      currentLevel = indentLevel + 1;
      scopeStack.push(currentLevel);
      if (!(currentLevel in scopeOffsets)) scopeOffsets[currentLevel] = 0;
      continue;
    }

    // NON STOP loop
    const loopMatch = trimmed.match(/^NON STOP\s+(\w+)\s+YOURE LIKE ME\s+(.+)!$/);
    if (loopMatch) {
      const [, varName, condVal] = loopMatch;
      logs.push(`  Line ${i + 1}: ✓ Loop: WHILE ${varName} == ${condVal}`);
      currentLevel = indentLevel + 1;
      scopeStack.push(currentLevel);
      if (!(currentLevel in scopeOffsets)) scopeOffsets[currentLevel] = 0;
      continue;
    }

    // DROP KNOWLEDGE (print)
    const printMatch = trimmed.match(/^DROP KNOWLEDGE\s+(.+)!$/);
    if (printMatch) {
      logs.push(`  Line ${i + 1}: ✓ Print statement: ${printMatch[1]}`);
      continue;
    }

    logs.push(`  Line ${i + 1}: ? Unrecognized statement: "${trimmed}"`);
  }

  if (!foundStart) {
    logs.push("  ✗ Error: Missing program start (DEAR <name>)");
    return { symbols, success: false };
  }
  if (!foundEnd) {
    logs.push("  ✗ Error: Missing program end (YOUR OBEDIENT SERVANT)");
    return { symbols, success: false };
  }

  logs.push("");
  logs.push("═══ COMPILATION COMPLETE ═══");
  logs.push(`  ✓ ${symbols.length} symbol(s) registered`);
  logs.push(`  ✓ No fatal errors`);

  return { symbols, success: true };
}

export function compile(source: string): CompileResult {
  const logs: string[] = [];
  logs.push("╔══════════════════════════════════╗");
  logs.push("║   A.HAM COMPILER v1.0            ║");
  logs.push("║   \"I am not throwing away        ║");
  logs.push("║    my shot.\"                     ║");
  logs.push("╚══════════════════════════════════╝");
  logs.push("");

  const tokens = tokenize(source, logs);
  const { symbols, success } = parseAndAnalyze(source, tokens, logs);

  return { logs, symbols, success };
}
