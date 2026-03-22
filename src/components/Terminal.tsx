import { useEffect, useRef } from "react";

interface TerminalProps {
  logs: string[];
}

const Terminal = ({ logs }: TerminalProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="h-full rounded-md border border-border overflow-hidden flex flex-col bg-terminal">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border/30">
        <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-600/60" />
        <span className="ml-3 text-xs text-terminal-foreground/50 font-mono">terminal</span>
      </div>
      <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-5">
        {logs.length === 0 ? (
          <span className="text-terminal-foreground/40">
            {">"} Awaiting orders, General...
          </span>
        ) : (
          logs.map((line, i) => (
            <div
              key={i}
              className={
                line.includes("✗")
                  ? "text-destructive"
                  : line.includes("✓")
                  ? "text-green-400"
                  : line.includes("═══")
                  ? "text-terminal-accent font-semibold"
                  : line.includes("╔") || line.includes("║") || line.includes("╚")
                  ? "text-terminal-accent"
                  : "text-terminal-foreground"
              }
            >
              {line || "\u00A0"}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default Terminal;
