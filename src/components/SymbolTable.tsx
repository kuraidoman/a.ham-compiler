import type { SymbolEntry } from "@/lib/aham-compiler";

interface SymbolTableProps {
  symbols: SymbolEntry[];
}

const SymbolTable = ({ symbols }: SymbolTableProps) => {
  return (
    <div className="h-full rounded-md border border-border overflow-hidden flex flex-col bg-card">
      <div className="px-3 py-2 border-b border-border font-display text-xs tracking-wider text-muted-foreground uppercase">
        Generated Symbol Table — Memory Architecture
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-3 py-2 text-muted-foreground font-semibold text-xs">Identifier</th>
              <th className="text-left px-3 py-2 text-muted-foreground font-semibold text-xs">Data Type</th>
              <th className="text-left px-3 py-2 text-muted-foreground font-semibold text-xs">Level</th>
              <th className="text-left px-3 py-2 text-muted-foreground font-semibold text-xs">Offset</th>
            </tr>
          </thead>
          <tbody>
            {symbols.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground text-xs italic">
                  No symbols yet — run your code to populate.
                </td>
              </tr>
            ) : (
              symbols.map((s, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-3 py-1.5 text-accent font-semibold">{s.identifier}</td>
                  <td className="px-3 py-1.5">{s.dataType}</td>
                  <td className="px-3 py-1.5">{s.level}</td>
                  <td className="px-3 py-1.5">{s.offset}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SymbolTable;
