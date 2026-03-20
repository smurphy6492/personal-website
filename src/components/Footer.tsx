import { personalInfo } from "@/data/projects";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href={personalInfo.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
          <a href={`mailto:${personalInfo.links.email}`} className="hover:text-accent transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}
