interface CodeBlockProps {
  language: string;
  code: string;
  caption?: string;
}

export function CodeBlock({ language, code, caption }: CodeBlockProps) {
  return (
    <figure className="w-full">
      <div className="relative rounded-xl border border-border bg-[#0d1117] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-card/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs font-mono text-muted-foreground ml-2 uppercase">
            {language}
          </span>
        </div>
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="font-mono text-[#e6edf3] whitespace-pre">{code}</code>
        </pre>
      </div>
      {caption && (
        <figcaption className="text-sm text-muted-foreground mt-3 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
