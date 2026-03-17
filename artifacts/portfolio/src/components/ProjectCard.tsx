import { Link } from "wouter";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import type { Project } from "@/data/projects";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isInProgress = project.status === "In Progress";

  return (
    <div className="group relative flex flex-col justify-between bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
      {/* Decorative gradient blob on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 pointer-events-none" />

      <div>
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="font-display font-bold text-xl md:text-2xl text-foreground">
            {project.name}
          </h3>
          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shrink-0",
            isInProgress 
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
          )}>
            {isInProgress ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            {project.status}
          </span>
        </div>
        
        <p className="text-muted-foreground leading-relaxed mb-6">
          {project.tagline}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.stack.slice(0, 4).map((tech) => (
            <span 
              key={tech}
              className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-mono font-medium border border-border/50"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="px-2.5 py-1 rounded-md bg-transparent text-muted-foreground text-xs font-mono font-medium border border-border border-dashed">
              +{project.stack.length - 4} more
            </span>
          )}
        </div>
      </div>

      <Link 
        href={`/projects/${project.id}`}
        className="inline-flex items-center gap-2 font-semibold text-sm text-foreground group-hover:text-primary transition-colors mt-auto w-fit"
      >
        View Project Details
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  );
}
