import { useState, useCallback } from "react";
import { Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import Terminal from "@/components/Terminal";
import SymbolTable from "@/components/SymbolTable";
import { compile, type SymbolEntry } from "@/lib/aham-compiler";
import { Book, X } from "lucide-react"; 

//Default code
const DEFAULT_CODE = `DEAR ALEXANDER

LETTER greeting WRITE "Hello, World!"!
DROP KNOWLEDGE greeting!

YOUR OBEDIENT SERVANT A.HAM`;

const Index = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [logs, setLogs] = useState<string[]>([]);
  const [symbols, setSymbols] = useState<SymbolEntry[]>([]);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);

  const handleRun = useCallback(() => {
    const result = compile(code);
    setLogs(result.logs);
    if (result.success) {
      setSymbols(result.symbols);
    }
  }, [code]);

  const handleClear = useCallback(() => {
    setLogs([]);
    setSymbols([]);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card">
        <h1 className="font-display text-lg md:text-xl font-bold tracking-wide text-foreground">
          The <span className="text-accent">A.HAM</span> Administration
        </h1>
        <div className="flex items-center gap-2">
          
          <Button size="sm" variant="outline" onClick={() => setIsCheatSheetOpen(true)}>
            <Book className="w-3.5 h-3.5 mr-1.5" />
            Cheat Sheet
          </Button>

          <Button size="sm" variant="outline" onClick={handleClear}>
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear
          </Button>
          <Button size="sm" onClick={handleRun} className="shadow-[var(--gold-glow)]">
            <Play className="w-3.5 h-3.5 mr-1.5" />
            Run Code
          </Button>
        </div>
      </header>

      {/* Main split */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left: Editor */}
        <div className="flex-1 p-2 min-h-0 flex flex-col md:border-r border-border">
          <CodeEditor value={code} onChange={setCode} />
        </div>

        {/* Right: Terminal + Symbol Table */}
        <div className="flex-1 flex flex-col p-2 gap-2 min-h-0">
          <div className="flex-1 min-h-0">
            <Terminal logs={logs} />
          </div>
          <div className="flex-1 min-h-0">
            <SymbolTable symbols={symbols} />
          </div>
        </div>
      </div>

      {/* --- CHEAT SHEET MODAL --- */}
      {isCheatSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl p-8 overflow-y-auto rounded shadow-2xl bg-[#fdfaf5] text-stone-800 max-h-[80vh] border-2 border-[#d4c5b0]">
            
            <button 
              onClick={() => setIsCheatSheetOpen(false)}
              className="absolute p-2 transition-colors rounded top-4 right-4 hover:bg-stone-200 text-stone-500"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="mb-6 text-2xl font-bold tracking-wider text-center uppercase text-[#8b7355] border-b-2 border-[#8b7355]/20 pb-4">
              A.HAM Language Rules
            </h2>

            <div className="space-y-6 font-mono text-sm leading-relaxed">
              <section>
                <h3 className="mb-2 text-lg font-bold font-sans text-[#8b7355]">1. Structure</h3>
                <p>Start: <span className="px-2 py-1 bg-stone-200 rounded">DEAR ALEXANDER</span></p>
                <p>End: <span className="px-2 py-1 bg-stone-200 rounded">YOUR OBEDIENT SERVANT A.HAM</span></p>
              </section>

              <section>
                <h3 className="mb-2 text-lg font-bold font-sans text-[#8b7355]">2. Memory & Data Types</h3>
                <ul className="pl-5 space-y-1 list-disc">
                  <li><strong>SHOT:</strong> Integer (4 Bytes)</li>
                  <li><strong>LETTER:</strong> String (8 Bytes)</li>
                  <li><strong>VOTE:</strong> Boolean [SATISFIED (<span className="text-green-600 font-bold">TRUE</span>) / HELPLESS (<span className="text-red-600 font-bold">FALSE</span>)] (1 Byte)</li>
                  <li><strong>STROKE:</strong> Character (1 Byte)</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-lg font-bold font-sans text-[#8b7355]">3. Operators & Syntax</h3>
                <ul className="pl-5 space-y-1 list-disc">
                  <li><strong>(!):</strong> Delimiter</li>
                  <li><strong>WRITE:</strong> Assignment (=)</li>
                  <li><strong>YOURE LIKE ME:</strong> Equality (==)</li>
                  <li><strong>OUTGUNNED:</strong> Greater Than </li> 
                  <li><strong>TALK LESS:</strong> Less Than </li> 
                  <li><strong>AND / OR:</strong> Logical Conjunctions</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-lg font-bold font-sans text-[#8b7355]">4. Scope Architecture</h3>
                <p>Strict Indentation is required for Control Flow (<strong>IF</strong> and <strong>NON STOP</strong>).</p>
                <p className="mt-1"><span className="px-2 py-1 bg-stone-200 rounded text-amber-800">4 Spaces / 1 Tab = 1 Indent Level</span></p>
              </section>

              {/* --- NEW SAMPLE CODE SECTION --- */}
              <section className="pt-6 mt-6 border-t-2 border-[#8b7355]/20">
                <h3 className="mb-3 text-lg font-bold font-sans text-[#8b7355]">5. Sample Code</h3>
                <pre className="p-4 overflow-x-auto text-sm bg-[#8b7355]/10 text-black rounded-md border border-[#8b7355]/30">
                  <code>
{`DEAR ALEXANDER

SHOT year WRITE 1776!
LETTER status WRITE "Revolution"!
VOTE isReady WRITE SATISFIED!
STROKE initial WRITE 'A'!

IF year YOURE LIKE ME 1776 AND isReady YOURE LIKE ME SATISFIED!
    DROP KNOWLEDGE status!
    SHOT troops WRITE 5000 + 5000!

    IF troops OUTGUNNED 5000 AND initial YOURE LIKE ME 'A'!
        DROP KNOWLEDGE "Hamilton is in command!"!
        DROP KNOWLEDGE troops!

    IF troops TALK LESS 20000 OR isReady YOURE LIKE ME HELPLESS!
        DROP KNOWLEDGE "Send a letter to Congress!"!

YOUR OBEDIENT SERVANT A.HAM`}
                  </code>
                </pre>
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;