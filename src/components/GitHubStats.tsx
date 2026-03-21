import { useState, useEffect } from "react";
import { GitBranch, Star, GitCommitHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface GitHubStats {
  updated_at: string;
  public_repos: number;
  total_stars: number;
  commits_this_year: number;
  top_languages: Array<{ name: string; percentage: number }>;
}

export function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/github-stats.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Silently hide section on error
  if (error || (!loading && !stats)) {
    return null;
  }

  // Format relative time (e.g., "2 hours ago")
  const getRelativeTime = (isoString: string): string => {
    const now = new Date();
    const updated = new Date(isoString);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  return (
    <section id="github-stats" className="w-full max-w-6xl mx-auto px-6 py-24 z-10 relative">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
          Live GitHub Activity
        </h2>
        <div className="w-20 h-1.5 bg-primary rounded-full" />
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg">
          Stats fetched daily from GitHub API and cached as static data — a live data pipeline baked into the build process.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <GitBranch className="w-5 h-5 text-primary" />
              </div>
              <div className="text-4xl font-display font-bold text-foreground mb-2">
                {stats?.public_repos}
              </div>
              <div className="text-sm text-muted-foreground">Public Repos</div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div className="text-4xl font-display font-bold text-foreground mb-2">
                {stats?.total_stars}
              </div>
              <div className="text-sm text-muted-foreground">Stars</div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <GitCommitHorizontal className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-4xl font-display font-bold text-foreground mb-2">
                {stats?.commits_this_year}
              </div>
              <div className="text-sm text-muted-foreground">Commits This Year</div>
            </div>
          </div>

          {/* Top Languages */}
          <div className="bg-card/50 border border-border rounded-2xl p-6 md:p-8">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Top Languages
            </h3>
            <div className="space-y-4">
              {stats?.top_languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-secondary text-secondary-foreground text-xs font-mono font-medium border border-border/50 px-2.5 py-1 rounded-md">
                      {lang.name}
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">
                      {lang.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {stats?.updated_at && (
              <div className="mt-6 text-right">
                <span className="text-muted-foreground text-xs">
                  Updated: {getRelativeTime(stats.updated_at)}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
