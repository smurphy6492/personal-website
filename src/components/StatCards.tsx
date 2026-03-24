import type { StatItem } from "@/data/projects";

interface StatCardsProps {
  stats: StatItem[];
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl p-5 text-center"
        >
          <div className="text-3xl font-display font-extrabold text-primary mb-1">
            {stat.value}
          </div>
          <div className="text-sm font-medium text-foreground">{stat.label}</div>
          {stat.detail && (
            <div className="text-xs text-muted-foreground mt-1">{stat.detail}</div>
          )}
        </div>
      ))}
    </div>
  );
}
