export interface Project {
  id: string;
  name: string;
  tagline: string;
  problem: string;
  workflow: string[];
  stack: string[];
  status: "Live" | "In Progress" | "Planned";
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: "personal-website",
    name: "This Portfolio Site",
    tagline: "A portfolio site built entirely through agentic development with Claude Code.",
    problem: "Most AI portfolios describe skills without demonstrating them. This site is different — it was planned, built, and documented by AI agents working through Claude Code. The commit history is the proof. Every component, every case study, and every line of copy went through an agentic workflow, making the site itself a live demonstration of the development approach it describes.",
    workflow: ["Session Plan", "Planner Agent", "Web Developer Agent", "Content Writer Agent", "Git Commit", "Netlify Deploy"],
    stack: ["React", "Vite", "Tailwind", "shadcn/ui", "Claude Code", "Netlify"],
    status: "Live",
    githubUrl: "https://github.com/smurphy6492/personal-website"
  },
  {
    id: "autonomous-analytics-agent",
    name: "Autonomous Analytics Agent",
    tagline: "Ask a business question. Get SQL, charts, and an executive summary — automatically.",
    problem: "Business teams waste hours manually querying databases, building charts, and writing reports. This agent automates the entire analytics workflow end-to-end.",
    workflow: ["User Question", "Planner Agent", "SQL Agent", "Analysis Agent", "Visualization Agent", "Executive Summary"],
    stack: ["Python", "DuckDB", "LangGraph", "OpenAI", "Claude", "Streamlit"],
    status: "In Progress"
  },
];

export const personalInfo = {
  name: "Sean Murphy",
  title: "Analytics + AI Systems Builder",
  headline: "I lead analytics teams and build the AI systems that scale them.",
  subtext: "Analytics leader and multi-agent systems builder — designing the AI infrastructure that lets small teams operate at scale.",
  about: [
    "I spent years directing analytics teams, and the pattern was always the same: talented people burning hours on tasks a machine should handle. Writing routine SQL. Debugging pipeline failures at 2am. Manually formatting the same executive summary every Monday. The strategic work got whatever time was left over.",
    "Now I build systems that change that ratio. Using LangGraph, CrewAI, and Claude, I design multi-agent architectures where specialized AI agents collaborate on analytics workflows — one generates the SQL, another builds the visualization, a third writes the narrative. The agents handle the mechanics. The human handles the thinking.",
    "My goal isn't to replace data professionals. It's to multiply them. A single analytics engineer paired with the right agent infrastructure should be able to operate at the scale of a full team. That's what I'm building toward — and proving out — with every project on this site."
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/seanmurphy2014/",
    github: "https://github.com/smurphy6492",
    email: "smurphy1357@gmail.com"
  }
};
