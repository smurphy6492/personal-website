import { Link, useLocation } from "wouter";
import { Github, Linkedin, Mail, Terminal } from "lucide-react";
import { personalInfo } from "@/data/projects";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const [location] = useLocation();
  const isHome = location === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    // If not home, the standard wouter Link will navigate to /#target, 
    // which works natively on next render if standard anchor logic kicks in, 
    // but React needs a bit of help. We'll let Wouter handle the route change.
  };

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border py-4 shadow-sm shadow-black/20"
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
            Sean Murphy
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link 
            href="/#projects" 
            onClick={(e) => handleNavClick(e, "projects")}
            className="hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <Link 
            href="/#about" 
            onClick={(e) => handleNavClick(e, "about")}
            className="hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link 
            href="/#contact" 
            onClick={(e) => handleNavClick(e, "contact")}
            className="hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href={personalInfo.links.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-full"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a 
            href={personalInfo.links.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}
