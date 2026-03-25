import { motion } from "framer-motion";
import { ArrowDown, Cpu, Database, Network, User, BarChart, FileText, CheckCircle, Wrench, Github, Sparkles, ShieldCheck, Cog, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowItem, WorkflowStep, StepType } from "@/data/projects";

interface WorkflowDiagramProps {
  steps: WorkflowItem[];
}

function normalizeStep(item: WorkflowItem): WorkflowStep {
  return typeof item === "string" ? { label: item } : item;
}

function getStepTypes(step: WorkflowStep): StepType[] {
  if (!step.type) return [];
  return Array.isArray(step.type) ? step.type : [step.type];
}

function getIconForStep(step: WorkflowStep) {
  const lower = step.label.toLowerCase();
  if (lower.includes("user")) return <User className="w-5 h-5 text-primary" />;
  if (lower.includes("data") || lower.includes("sql") || lower.includes("postgres") || lower.includes("db")) return <Database className="w-5 h-5 text-accent" />;
  if (lower.includes("agent")) return <Cpu className="w-5 h-5 text-indigo-400" />;
  if (lower.includes("chart") || lower.includes("dashboard") || lower.includes("visual") || lower.includes("viz")) return <BarChart className="w-5 h-5 text-emerald-400" />;
  if (lower.includes("summary") || lower.includes("memo") || lower.includes("document") || lower.includes("report")) return <FileText className="w-5 h-5 text-amber-400" />;
  if (lower.includes("pr") || lower.includes("github")) return <Github className="w-5 h-5 text-white" />;
  if (lower.includes("fix") || lower.includes("diagnos")) return <Wrench className="w-5 h-5 text-rose-400" />;
  if (lower.includes("pipeline") || lower.includes("airflow") || lower.includes("flow")) return <Network className="w-5 h-5 text-cyan-400" />;
  if (lower.includes("coverage") || lower.includes("validat") || lower.includes("sanity")) return <ShieldCheck className="w-5 h-5 text-amber-400" />;
  if (lower.includes("orchestrat")) return <Cpu className="w-5 h-5 text-indigo-400" />;
  if (lower.includes("profiler")) return <Database className="w-5 h-5 text-accent" />;
  return <CheckCircle className="w-5 h-5 text-muted-foreground" />;
}

const BADGE_CONFIG: Record<StepType, { bg: string; text: string; border: string; icon: typeof Sparkles; label: string }> = {
  llm: { bg: "bg-indigo-500/15", text: "text-indigo-400", border: "border-indigo-500/20", icon: Sparkles, label: "LLM" },
  validation: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/20", icon: ShieldCheck, label: "Validation" },
  deterministic: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20", icon: Cog, label: "Deterministic" },
};

function getTypeBadges(step: WorkflowStep) {
  const types = getStepTypes(step);
  if (types.length === 0) return null;

  return types.map((t) => {
    const cfg = BADGE_CONFIG[t];
    const Icon = cfg.icon;
    return (
      <span key={t} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border", cfg.bg, cfg.text, cfg.border)}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
    );
  });
}

// Border and accent use the first (primary) type
function getStepBorderClass(step: WorkflowStep, index: number, total: number) {
  const types = getStepTypes(step);
  const primary = types[0];
  if (primary === "llm") return "border-indigo-500/30 shadow-indigo-500/5";
  if (primary === "validation") return "border-amber-500/30 shadow-amber-500/5";
  if (primary === "deterministic") return "border-emerald-500/30 shadow-emerald-500/5";
  if (index === 0) return "border-primary/30 shadow-primary/5";
  if (index === total - 1) return "border-accent/30 shadow-accent/5";
  return "";
}

function getAccentBarClass(step: WorkflowStep) {
  const types = getStepTypes(step);
  const primary = types[0];
  if (primary === "llm") return "from-indigo-500/50 to-indigo-400/50";
  if (primary === "validation") return "from-amber-500/50 to-amber-400/50";
  if (primary === "deterministic") return "from-emerald-500/50 to-emerald-400/50";
  return "from-primary/50 to-accent/50";
}

export function WorkflowDiagram({ steps }: WorkflowDiagramProps) {
  const normalized = steps.map(normalizeStep);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-center"
      >
        {normalized.map((step, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <motion.div
              variants={item}
              className={cn(
                "w-full sm:w-[420px] relative overflow-hidden bg-card border rounded-xl p-5 shadow-lg flex items-center gap-4 transition-colors hover:border-primary/50",
                step.conditional && "border-dashed",
                getStepBorderClass(step, index, normalized.length)
              )}
            >
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b opacity-50",
                getAccentBarClass(step)
              )} />
              <div className="shrink-0 p-3 rounded-lg bg-background border border-border">
                {getIconForStep(step)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">
                    Step 0{index + 1}
                  </span>
                  {getTypeBadges(step)}
                  {step.retryLoop && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/20">
                      <RefreshCw className="w-3 h-3" />
                      Retry
                    </span>
                  )}
                </div>
                <span className="font-display font-bold text-foreground text-base sm:text-lg leading-snug block">
                  {step.label}
                </span>
              </div>
            </motion.div>

            {index < normalized.length - 1 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, scaleY: 0 },
                  show: { opacity: 1, scaleY: 1, transition: { duration: 0.3 } }
                }}
                className="py-3 flex flex-col items-center origin-top text-muted-foreground/50"
              >
                <div className={cn(
                  "w-px h-6 bg-gradient-to-b from-border to-primary/30",
                  normalized[index + 1]?.conditional && "border-l border-dashed border-muted-foreground/30 bg-transparent w-0"
                )} />
                <ArrowDown className={cn(
                  "w-4 h-4 text-primary/50 -mt-1",
                  normalized[index + 1]?.conditional && "text-amber-400/50"
                )} />
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
