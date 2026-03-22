import { useRef, useCallback } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lines = value.split("\n");

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newVal = value.substring(0, start) + "    " + value.substring(end);
        onChange(newVal);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 4;
        });
      }
    },
    [value, onChange]
  );

  return (
    <div className="flex h-full rounded-md border border-border overflow-hidden bg-editor">
      {/* Line numbers */}
      <div className="flex flex-col items-end py-3 px-3 bg-editor-line select-none font-mono text-sm leading-6 text-editor-line-fg border-r border-border min-w-[3rem]">
        {lines.map((_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="flex-1 p-3 font-mono text-sm leading-6 bg-transparent text-foreground resize-none outline-none"
      />
    </div>
  );
};

export default CodeEditor;
