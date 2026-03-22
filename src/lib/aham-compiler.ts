// A.HAM Compiler — Lexer, Parser, Semantic Analyzer

export interface SymbolEntry {
  identifier: string;
  dataType: string;
  level: number;
  offset: number;
  size: number;
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
  | "TYPE_CHAR"
  | "ASSIGN"
  | "IF"
  | "CONDITION_OP"
  | "LOGIC_OP"    
  | "LOOP"
  | "PRINT"
  | "BOOL_TRUE"
  | "BOOL_FALSE"
  | "PROGRAM_END"
  | "IDENTIFIER"
  | "INT_LITERAL"
  | "STRING_LITERAL"
  | "CHAR_LITERAL"   // Added
  | "DELIMITER"
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
    STROKE: "TYPE_CHAR",     
    WRITE: "ASSIGN",
    IF: "IF",
    "YOURE LIKE ME": "CONDITION_OP",
    OUTGUNNED: "CONDITION_OP", 
    "TALK LESS": "CONDITION_OP", 
    AND: "LOGIC_OP",         
    OR: "LOGIC_OP",          
    "NON STOP": "LOOP",
    "DROP KNOWLEDGE": "PRINT",
    SATISFIED: "BOOL_TRUE",
    HELPLESS: "BOOL_FALSE", 
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
      if (w === "TALK" && words[wi + 1] === "LESS") {
        lineTokens.push({ type: "CONDITION_OP", value: "TALK LESS", line: i + 1 });
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

      // Delimiter 
      if (w === "!") {
        lineTokens.push({ type: "DELIMITER", value: "!", line: i + 1 });
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
        } else if (clean === "HELPLESS") {
          lineTokens.push({ type: "BOOL_FALSE", value: clean, line: i + 1 });
        } else {
          lineTokens.push({ type: "IDENTIFIER", value: clean, line: i + 1 });
        }
        lineTokens.push({ type: "DELIMITER", value: "!", line: i + 1 });
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
  logs.push("═══ PARSER & SEMANTIC PHASE ═══");

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
    STROKE: 1,
  };

  const TYPE_NAMES: Record<string, string> = {
    SHOT: "INT",
    LETTER: "STRING",
    VOTE: "BOOL",
    STROKE: "CHAR",
  };

  let foundStart = false;
  let foundEnd = false;
  let isSuccess = true;
  
  for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      let trimmed = raw.trim();
      if (trimmed === "") continue;

      // --- ERROR RECOVERY STRATEGIES ---
      if (!trimmed.startsWith("DEAR") && !trimmed.startsWith("YOUR") && !trimmed.endsWith("!")) {
        // If it starts with a valid keyword, apply Phrase-Level Recovery
        if (/^(SHOT|LETTER|VOTE|STROKE|IF|NON STOP|DROP KNOWLEDGE)/.test(trimmed)) {
          logs.push(`  Line ${i + 1}: ⚠ SYNTAX WARNING: Missing delimiter '!'. Applying Phrase-Level Recovery (auto-inserting)...`);
          trimmed += "!"; // Auto-fixes the code so the parser can continue
        } else {
          // If it's completely unrecognized garbage, apply Panic Mode
          logs.push(`  Line ${i + 1}: ✗ SYNTAX ERROR: Unrecognized sequence "${trimmed}". Applying Panic Mode Recovery (skipping to next statement)...`);
          isSuccess = false;
          continue; // Skips this broken line to prevent cascading crashes
        }
      }

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
    const declMatch = trimmed.match(/^(SHOT|LETTER|VOTE|STROKE)\s+(\w+)\s+WRITE\s+(.+)!$/);
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
        size,
      });

      scopeOffsets[level] = offset + size;

      logs.push(`  Line ${i + 1}: ✓ Declaration: ${TYPE_NAMES[typeKw]} ${name} [${size} bytes] at level ${level}`);
      
      // Semantic type check
      if (typeKw === "SHOT") {
        if (!/^(\d+|\d+\s*[\+\-\*\/]\s*\d+)$/.test(value.trim())) {
          logs.push(`  Line ${i + 1}: ✗ FATAL SEMANTIC ERROR: Expected INT literal or basic Math expression for SHOT, got ${value}`);
          isSuccess = false;
        } else {
          const mathResult = eval(value.trim());
          logs.push(`  Line ${i + 1}: ✓ Type check & Math evaluation passed: INT = ${mathResult}`);
        }
      } else if (typeKw === "LETTER") {
        if (!value.trim().startsWith('"')) {
          logs.push(`  Line ${i + 1}: ✗ FATAL SEMANTIC ERROR: Expected STRING literal for LETTER, got ${value}`);
          isSuccess = false;
        } else {
          logs.push(`  Line ${i + 1}: ✓ Type check passed: STRING = ${value}`);
        }
      } else if (typeKw === "VOTE") {
        if (!["SATISFIED", "HELPLESS"].includes(value.trim())) {
          logs.push(`  Line ${i + 1}: ✗ FATAL SEMANTIC ERROR: Expected BOOL literal for VOTE, got ${value}`);
          isSuccess = false;
        } else {
          logs.push(`  Line ${i + 1}: ✓ Type check passed: BOOL = ${value}`);
        }
      } else if (typeKw === "STROKE") {
        if (!value.trim().startsWith("'") || !value.trim().endsWith("'") || value.trim().length !== 3) {
          logs.push(`  Line ${i + 1}: ✗ FATAL SEMANTIC ERROR: Expected CHAR literal for STROKE, got ${value}`);
          isSuccess = false;
        } else {
          logs.push(`  Line ${i + 1}: ✓ Type check passed: CHAR = ${value}`);
        }
      }
      logs.push("");
      continue;
    }

    // IF statement
    const ifMatch = trimmed.match(/^IF\s+(.+)!$/);
    if (ifMatch) {
      const condition = ifMatch[1]
        .replace(/YOURE LIKE ME/g, "==")
        .replace(/OUTGUNNED/g, ">")
        .replace(/TALK LESS/g, "<")
        .replace(/AND/g, "&&")
        .replace(/OR/g, "||");
      
      logs.push(`  Line ${i + 1}: ✓ Conditional: IF (${condition})`);
      currentLevel = indentLevel + 1;
      scopeStack.push(currentLevel);
      if (!(currentLevel in scopeOffsets)) scopeOffsets[currentLevel] = 0;
      continue;
    }

    // NON STOP loop
    const loopMatch = trimmed.match(/^NON STOP\s+(.+)!$/);
    if (loopMatch) {
      const condition = loopMatch[1]
        .replace(/YOURE LIKE ME/g, "==")
        .replace(/OUTGUNNED/g, ">")
        .replace(/TALK LESS/g, "<")
        .replace(/AND/g, "&&")
        .replace(/OR/g, "||");

      logs.push(`  Line ${i + 1}: ✓ Loop: WHILE (${condition})`);
      currentLevel = indentLevel + 1;
      scopeStack.push(currentLevel);
      if (!(currentLevel in scopeOffsets)) scopeOffsets[currentLevel] = 0;
      continue;
    }

    // DROP KNOWLEDGE (print)
    const printMatch = trimmed.match(/^DROP KNOWLEDGE\s+(.+)!$/);
    if (printMatch) {
      const varName = printMatch[1].trim();
      
      // Is it just a raw string/char literal?
      if (varName.startsWith('"') || varName.startsWith("'")) {
        logs.push(`  Line ${i + 1}: ✓ Print literal: ${varName}`);
        logs.push(`>>> [A.HAM CONSOLE OUTPUT]: ${varName} <<<`);
        continue;
      }

      // It's a variable. Let's hunt for it in the active scope!
      const foundVar = symbols.find(s => s.identifier === varName && s.level <= currentLevel);
      
      if (foundVar) {
        logs.push(`  Line ${i + 1}: ✓ Scope check passed: "${varName}" found at Level ${foundVar.level}`);
        logs.push(`>>> [A.HAM CONSOLE OUTPUT]: (Value of ${varName}) <<<`);
      } else {
        logs.push(`  Line ${i + 1}: ✗ FATAL SEMANTIC ERROR: Identifier "${varName}" is undefined or out of scope!`);
        isSuccess = false; // Flags the compilation as failed
      }
      continue;
    }
    logs.push(`  Line ${i + 1}: ✗ FATAL SYNTAX ERROR: Unrecognized statement or missing delimiter (!): "${trimmed}"`);
    isSuccess = false;
  }

  if (!foundStart) {
    logs.push("  ✗ Error: Missing program start (DEAR ALEXANDER)");
    return { symbols, success: false };
  }
  if (!foundEnd) {
    logs.push("  ✗ Error: Missing program end (YOUR OBEDIENT SERVANT)");
    return { symbols, success: false };
  }
  

  logs.push("");
  logs.push("═══ COMPILATION COMPLETE ═══");
  logs.push(`  ✓ ${symbols.length} symbol(s) registered`);
  if (!isSuccess) {
    logs.push(`  ✗ Compilation failed due to error/s.`);
  } else {
    logs.push(`  ✓ No fatal errors`);
  }

  return { symbols, success: isSuccess };
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
