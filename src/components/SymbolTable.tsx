import type { SymbolEntry } from "@/lib/aham-compiler";

interface SymbolTableProps {
  symbols: SymbolEntry[];
}

const SymbolTable = ({ symbols }: SymbolTableProps) => {
  // Logic to calculate total bytes per level
  const levelTotals = symbols.reduce((acc, s) => {
    acc[s.level] = (acc[s.level] || 0) + (s.size || 0);
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="h-full rounded-md border border-border overflow-hidden flex flex-col bg-card shadow-sm">
      <div className="px-3 py-2 border-b border-border font-display text-xs tracking-wider text-muted-foreground uppercase bg-secondary/20">
        Generated Symbol Table — Memory Architecture
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-3 py-2 text-muted-foreground font-semibold text-xs">Identifier</th>
              <th className="text-left px-3 py-2 text-muted-foreground font-semibold text-xs">Type</th>
              <th className="text-left px-3 py-2 text-muted-foreground font-semibold text-xs">Level</th>
              <th className="text-left px-3 py-2 text-muted-foreground font-semibold text-xs">Offset</th>
            </tr>
          </thead>
          <tbody>
            {symbols.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground text-xs italic">
                  "The table is not yet set, General. Run your code to begin."
                </td>
              </tr>
            ) : (
              symbols.map((s, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-3 py-1.5 text-accent font-semibold">{s.identifier}</td>
                  <td className="px-3 py-1.5 text-xs">{s.dataType} ({s.size}B)</td>
                  <td className="px-3 py-1.5">{s.level}</td>
                  <td className="px-3 py-1.5">{s.offset}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- NEW TOTAL OFFSET SUMMARY SECTION --- */}
      {symbols.length > 0 && (
        <div className="p-3 bg-[#fdfaf5] border-t border-border">
          <h4 className="text-[10px] font-bold uppercase text-[#8b7355] mb-2 tracking-widest">
            Memory Allocation Summary
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(levelTotals).map(([level, total]) => (
              <div key={level} className="flex justify-between items-center text-xs font-mono border-l-2 border-[#d4c5b0] pl-2">
                <span className="text-muted-foreground">Level {level}:</span>
                <span className="font-bold text-stone-800">{total} Bytes</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolTable;