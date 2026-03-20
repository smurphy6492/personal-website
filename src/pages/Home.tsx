import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { projects, personalInfo } from "@/data/projects";
import { ArrowDown, Mail, Github, Linkedin, TerminalSquare, GitBranch, Bot, Cpu } from "lucide-react";

export function Home() {
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 w-full pt-32">
        {/* HERO SECTION */}
        <section className="relative w-full max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border text-sm font-medium text-muted-foreground mb-8">
            <TerminalSquare className="w-4 h-4 text-primary" />
            <span>{personalInfo.title}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.1] mb-6">
            {personalInfo.headline}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
            {personalInfo.subtext}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <button 
              onClick={scrollToProjects}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              View Projects
              <ArrowDown className="w-4 h-4" />
            </button>
            <button 
              onClick={scrollToContact}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get in Touch
            </button>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="w-full max-w-6xl mx-auto px-6 py-24 z-10 relative">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Flagship Projects
            </h2>
            <div className="w-20 h-1.5 bg-primary rounded-full" />
            <p className="text-muted-foreground mt-6 max-w-2xl text-lg">
              Architecting multi-agent systems that autonomously answer complex questions, monitor data health, and scale analytics output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className={index === projects.length - 1 && projects.length % 2 !== 0 ? "md:col-span-2 md:w-1/2 md:mx-auto" : ""}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="w-full bg-card/50 border-y border-border py-24 z-10 relative">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 text-center">
              About Me
            </h2>
            <div className="w-20 h-1.5 bg-accent rounded-full mx-auto mb-12" />
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              {personalInfo.about.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* HOW I BUILT THIS SECTION */}
        <section id="how-built" className="w-full max-w-6xl mx-auto px-6 py-24 z-10 relative">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How I Built This
            </h2>
            <div className="w-20 h-1.5 bg-accent rounded-full" />
            <p className="text-muted-foreground mt-6 max-w-2xl text-lg">
              This site was built by an AI agent — not with AI assistance, but <em>by</em> an AI agent. Here's how.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Agentic Development</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Claude Code reads the codebase, plans changes, writes the implementation, and commits to GitHub. I provide direction and review. The agent handles the execution.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Specialized Agents</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Different agents handle different work: <code className="text-xs bg-secondary px-1 py-0.5 rounded">web-developer</code> for UI, <code className="text-xs bg-secondary px-1 py-0.5 rounded">content-writer</code> for copy, <code className="text-xs bg-secondary px-1 py-0.5 rounded">planner</code> for architecture. Each agent specializes.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <GitBranch className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Visible Proof</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The GitHub commit history is the record. Every feature, every content update, every deployment — all routed through an agentic workflow. The work is auditable.
              </p>
            </div>
          </div>

          <div className="bg-card/50 border border-border rounded-2xl p-6 md:p-8">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Most portfolios claim AI skills and then show a static list of technologies. This site is the proof. If you're evaluating whether I can build with AI agents — you're looking at the output right now.
            </p>
            <div className="flex flex-wrap gap-2">
              {["React", "Vite", "Tailwind", "shadcn/ui", "Claude Code", "GitHub", "Netlify"].map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-mono font-medium border border-border/50">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="w-full max-w-4xl mx-auto px-6 py-24 text-center z-10 relative">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Let's Build Together
          </h2>
          <div className="w-20 h-1.5 bg-primary rounded-full mx-auto mb-12" />
          
          <p className="text-xl text-muted-foreground mb-12">
            Currently exploring new opportunities in data architecture, AI system building, and analytics leadership.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a 
              href={`mailto:${personalInfo.links.email}`}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-foreground text-background hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-3 shadow-xl shadow-white/5"
            >
              <Mail className="w-5 h-5" />
              Email Me
            </a>
            <a 
              href={personalInfo.links.linkedin}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-card border border-border text-foreground hover:border-primary/50 hover:bg-secondary transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
            <a 
              href={personalInfo.links.github}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-card border border-border text-foreground hover:border-primary/50 hover:bg-secondary transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
