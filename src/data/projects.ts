export interface StatItem {
  value: string;
  label: string;
  detail?: string;
}

export interface DemoLink {
  label: string;
  href: string;
}

export interface DemoCard {
  dataset: string;
  description: string;
  reports: DemoLink[];
}

export type ContentBlock =
  | { type: "text"; value: string }
  | { type: "bullets"; items: string[] }
  | { type: "stats"; items: StatItem[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "code"; language: string; value: string; caption?: string }
  | { type: "callout"; value: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "embed"; src: string; title: string; height?: number }
  | { type: "demoGrid"; cards: DemoCard[] }
  | { type: "workflow" };

export interface ProjectSection {
  heading: string;
  content: ContentBlock[];
}

export type StepType = "llm" | "deterministic" | "validation";

export interface WorkflowStep {
  label: string;
  type?: StepType | StepType[];
  retryLoop?: boolean;
  conditional?: boolean;
}

export type WorkflowItem = string | WorkflowStep;

export type ProjectCategory = "AI Tooling" | "Data Science" | "Data Analytics" | "Data Engineering";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: ProjectCategory;
  problem: ContentBlock[];
  workflow: WorkflowItem[];
  stack: string[];
  status: "Live" | "In Progress" | "Planned" | "Complete";
  githubUrl?: string;
  liveUrl?: string;
  metrics?: StatItem[];
  sections: ProjectSection[];
  hidden?: boolean;
}
