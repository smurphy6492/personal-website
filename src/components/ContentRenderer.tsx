import type { ContentBlock } from "@/data/projects";
import { StatCards } from "@/components/StatCards";
import { CodeBlock } from "@/components/CodeBlock";
import { ProjectImage } from "@/components/ProjectImage";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { Quote } from "lucide-react";

interface ContentRendererProps {
  blocks: ContentBlock[];
  workflow?: string[];
}

export function ContentRenderer({ blocks, workflow }: ContentRendererProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return (
              <p key={i} className="text-lg text-muted-foreground leading-relaxed">
                {block.value}
              </p>
            );

          case "bullets":
            return (
              <ul key={i} className="space-y-2.5 text-lg text-muted-foreground">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed">
                    <span className="text-primary mt-2 shrink-0">
                      <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                        <circle cx="3" cy="3" r="3" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "stats":
            return <StatCards key={i} stats={block.items} />;

          case "image":
            return (
              <ProjectImage
                key={i}
                src={block.src}
                alt={block.alt}
                caption={block.caption}
              />
            );

          case "code":
            return (
              <CodeBlock
                key={i}
                language={block.language}
                code={block.value}
                caption={block.caption}
              />
            );

          case "callout":
            return (
              <blockquote
                key={i}
                className="relative border-l-4 border-primary bg-primary/5 rounded-r-xl px-6 py-5 my-2"
              >
                <Quote className="absolute top-4 right-4 w-5 h-5 text-primary/20" />
                <p className="text-lg font-medium text-foreground leading-relaxed italic">
                  {block.value}
                </p>
              </blockquote>
            );

          case "table":
            return (
              <div key={i} className="w-full overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-card">
                      {block.headers.map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-sm font-semibold text-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        className="border-b border-border/50 last:border-0 hover:bg-card/50 transition-colors"
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className="px-4 py-3 text-sm text-muted-foreground"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "embed":
            return (
              <div key={i} className="w-full rounded-xl border border-border overflow-hidden shadow-lg shadow-black/20">
                <iframe
                  src={block.src}
                  title={block.title}
                  className="w-full bg-white"
                  style={{ height: block.height ?? 500 }}
                />
              </div>
            );

          case "workflow":
            return workflow ? <WorkflowDiagram key={i} steps={workflow} /> : null;

          default:
            return null;
        }
      })}
    </div>
  );
}
