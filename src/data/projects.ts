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
  {
    id: "customer-insights-engine",
    name: "AI Customer Insights Engine",
    tagline: "Turn raw transaction data into customer segments, CLV predictions, and marketing strategy.",
    problem: "Ecommerce teams have rich data but lack the time and tooling to systematically turn it into actionable customer insights. This pipeline does it automatically.",
    workflow: ["Raw Orders Data", "Feature Engineering Agent", "Segmentation Agent", "CLV Prediction Agent", "Strategy Recommendation Agent", "Marketing Playbook"],
    stack: ["Python", "Postgres", "CrewAI", "scikit-learn", "Pandas"],
    status: "In Progress"
  },
  {
    id: "bi-migration-agent",
    name: "Automated BI Migration Agent",
    tagline: "From Tableau workbooks to dbt models — automatically.",
    problem: "BI platform migrations are expensive and time-consuming. This agent parses Tableau workbooks, extracts the embedded SQL, and converts it to well-documented dbt models with lineage graphs.",
    workflow: ["Tableau Workbook Input", "Parser Agent", "SQL Extraction Agent", "dbt Model Generator", "Documentation Agent", "Lineage Graph Output"],
    stack: ["Python", "dbt", "LangGraph", "Claude", "SQLGlot"],
    status: "In Progress"
  },
  {
    id: "self-healing-pipeline",
    name: "Self-Healing Data Pipeline",
    tagline: "When your pipeline breaks, the agent diagnoses it and opens the fix as a PR.",
    problem: "Data engineers spend too much time responding to pipeline failures. This agent monitors Airflow jobs, reads failure logs, diagnoses root causes, writes fixes, and opens GitHub PRs automatically.",
    workflow: ["Airflow Job Failure", "Log Reader Agent", "Diagnosis Agent", "Fix Writer Agent", "GitHub PR Agent", "Slack Notification"],
    stack: ["Python", "Airflow", "LangGraph", "GitHub API", "OpenAI"],
    status: "Planned"
  },
  {
    id: "autonomous-data-team",
    name: "Autonomous Data Team",
    tagline: "What if one person could run a full analytics team — powered by AI?",
    problem: "Small companies can't afford full analytics teams. This system simulates a complete team of AI analysts — data engineer, analytics engineer, BI analyst, and data scientist — collaborating to answer complex business questions.",
    workflow: ["User Request", "Planner Agent", "Data Engineer Agent", "Analytics Engineer Agent", "Data Scientist Agent", "BI Dashboard Agent", "Executive Memo"],
    stack: ["Python", "LangGraph", "DuckDB", "Postgres", "Streamlit", "Claude"],
    status: "Planned"
  }
];

export const personalInfo = {
  name: "Sean Murphy",
  title: "Analytics + AI Systems Builder",
  headline: "I build AI agents that do the work of analytics teams.",
  subtext: "Former Director of Analytics. Now designing multi-agent systems that automate the repetitive mechanics of data work — from query generation to pipeline monitoring to executive reporting.",
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
