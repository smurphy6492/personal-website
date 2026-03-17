import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { projects } from "@/data/projects";
import { ArrowLeft, Github, ExternalLink, Clock, CheckCircle2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 pt-32">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Return Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isInProgress = project.status === "In Progress";

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      {/* Subtle top glow matching project */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50" />
      
      <Navbar />

      <main className="flex-1 w-full pt-32 pb-24 z-10">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-12 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Header Area */}
          <header className="mb-16">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
                isInProgress 
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              )}>
                {isInProgress ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                {project.status}
              </span>
              
              <div className="flex flex-wrap gap-2">
                {project.stack.map(tech => (
                  <span key={tech} className="px-2.5 py-1 rounded-md bg-secondary border border-border text-secondary-foreground text-xs font-mono font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-6 leading-tight">
              {project.name}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              {project.tagline}
            </p>
          </header>

          {/* Problem Statement */}
          <section className="mb-20 bg-card border border-border rounded-2xl p-8 md:p-10 shadow-lg shadow-black/20">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">The Problem</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {project.problem}
            </p>
          </section>

          {/* Workflow Architecture */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">System Architecture</h2>
              <p className="text-muted-foreground">Autonomous agent workflow from request to output.</p>
            </div>
            
            <WorkflowDiagram steps={project.workflow} />
          </section>

          {/* CTA / Repo Link */}
          <section className="text-center py-12 border-t border-border mt-12">
            <h3 className="text-2xl font-display font-bold text-foreground mb-6">Explore the Code</h3>
            <a 
              href="https://github.com/smurphy6492/personal-website" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold bg-foreground text-background hover:scale-105 transition-transform duration-300 shadow-xl shadow-white/5"
            >
              <Github className="w-5 h-5" />
              View on GitHub
              <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              Note: Links to personal GitHub while code is being organized.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
