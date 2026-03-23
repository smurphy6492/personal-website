import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const QUERY = "What drove the Q4 revenue drop?";
const STEPS = [
  { label: "Analyzing question", ms: 700 },
  { label: "Generating SQL query", ms: 950 },
  { label: "Running against dataset", ms: 1100 },
  { label: "Writing executive summary", ms: 850 },
];
const OUTPUT =
  "Revenue declined 12% in Q4, driven by SMB churn (−23%) and reduced enterprise expansion revenue.";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function AgentDemo() {
  const [typedQuery, setTypedQuery] = useState("");
  const [showQuery, setShowQuery] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setTypedQuery("");
      setShowQuery(false);
      setActiveStep(null);
      setCompletedSteps([]);
      setShowOutput(false);

      await delay(600);
      if (cancelled) return;
      setShowQuery(true);

      for (let i = 1; i <= QUERY.length; i++) {
        if (cancelled) return;
        setTypedQuery(QUERY.slice(0, i));
        await delay(48);
      }

      await delay(500);

      for (let i = 0; i < STEPS.length; i++) {
        if (cancelled) return;
        setActiveStep(i);
        await delay(STEPS[i].ms);
        if (cancelled) return;
        setCompletedSteps((prev) => [...prev, i]);
        setActiveStep(null);
        await delay(100);
      }

      await delay(400);
      if (!cancelled) setShowOutput(true);

      await delay(4000);
      if (!cancelled) run();
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
        <span className="w-3 h-3 rounded-full bg-destructive/60" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
        <span className="ml-2 text-xs font-mono text-muted-foreground">analytics-agent</span>
      </div>

      <div className="p-5 space-y-4 font-mono text-sm min-h-[220px]">
        {/* User query */}
        {showQuery && (
          <div className="flex gap-2">
            <span className="text-primary shrink-0">›</span>
            <span className="text-foreground">
              {typedQuery}
              {typedQuery.length < QUERY.length && (
                <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />
              )}
            </span>
          </div>
        )}

        {/* Agent steps */}
        <div className="space-y-2.5 pl-4">
          {STEPS.map((step, i) => {
            const isCompleted = completedSteps.includes(i);
            const isActive = activeStep === i;
            if (!isActive && !isCompleted) return null;

            return (
              <div key={i} className="flex items-center gap-2.5 text-xs">
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Loader2 className="w-3.5 h-3.5 text-primary shrink-0 animate-spin" />
                )}
                <span className={isCompleted ? "text-muted-foreground" : "text-foreground"}>
                  {step.label}
                  {isActive && <span className="text-muted-foreground">...</span>}
                </span>
              </div>
            );
          })}
        </div>

        {/* Output */}
        {showOutput && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-300 leading-relaxed">
            {OUTPUT}
          </div>
        )}
      </div>
    </div>
  );
}
