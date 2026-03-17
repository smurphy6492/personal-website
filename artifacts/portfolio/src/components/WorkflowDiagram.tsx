import { motion } from "framer-motion";
import { ArrowDown, Cpu, Database, Network, User, BarChart, FileText, CheckCircle, Wrench, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowDiagramProps {
  steps: string[];
}

function getIconForStep(step: string) {
  const lower = step.toLowerCase();
  if (lower.includes("user")) return <User className="w-5 h-5 text-primary" />;
  if (lower.includes("data") || lower.includes("sql") || lower.includes("postgres") || lower.includes("db")) return <Database className="w-5 h-5 text-accent" />;
  if (lower.includes("agent")) return <Cpu className="w-5 h-5 text-indigo-400" />;
  if (lower.includes("chart") || lower.includes("dashboard") || lower.includes("visual")) return <BarChart className="w-5 h-5 text-emerald-400" />;
  if (lower.includes("summary") || lower.includes("memo") || lower.includes("document")) return <FileText className="w-5 h-5 text-amber-400" />;
  if (lower.includes("pr") || lower.includes("github")) return <Github className="w-5 h-5 text-white" />;
  if (lower.includes("fix") || lower.includes("diagnos")) return <Wrench className="w-5 h-5 text-rose-400" />;
  if (lower.includes("pipeline") || lower.includes("airflow") || lower.includes("flow")) return <Network className="w-5 h-5 text-cyan-400" />;
  return <CheckCircle className="w-5 h-5 text-muted-foreground" />;
}

export function WorkflowDiagram({ steps }: WorkflowDiagramProps) {
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
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <motion.div 
              variants={item}
              className={cn(
                "w-full sm:w-[400px] relative overflow-hidden bg-card border border-border rounded-xl p-5 shadow-lg flex items-center gap-4 transition-colors hover:border-primary/50",
                index === 0 && "border-primary/30 shadow-primary/5",
                index === steps.length - 1 && "border-accent/30 shadow-accent/5"
              )}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-accent/50 opacity-50" />
              <div className="shrink-0 p-3 rounded-lg bg-background border border-border">
                {getIconForStep(step)}
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider block mb-1">
                  Step 0{index + 1}
                </span>
                <span className="font-display font-bold text-foreground text-lg">
                  {step}
                </span>
              </div>
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div 
                variants={{
                  hidden: { opacity: 0, scaleY: 0 },
                  show: { opacity: 1, scaleY: 1, transition: { duration: 0.3 } }
                }}
                className="py-3 flex flex-col items-center origin-top text-muted-foreground/50"
              >
                <div className="w-px h-6 bg-gradient-to-b from-border to-primary/30" />
                <ArrowDown className="w-4 h-4 text-primary/50 -mt-1" />
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
