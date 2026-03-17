export interface Project {
  id: string;
  name: string;
  tagline: string;
  problem: string;
  workflow: string[];
  stack: string[];
  status: "In Progress" | "Planned";
}

export const projects: Project[] = [
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
  headline: "Building autonomous analytics systems with AI agents.",
  subtext: "Former Director of Analytics. Now building AI-augmented data systems.",
  about: [
    "I am an Analytics Leader turned AI Systems Builder. Throughout my career as a Director of Analytics, I've seen firsthand how much time highly skilled data professionals spend on repetitive tasks: writing routine SQL, debugging pipeline failures, and churning out weekly executive summaries.",
    "Now, I'm combining my deep background in data engineering, BI, and strategy with modern AI agent frameworks (LangGraph, CrewAI).",
    "My focus is building autonomous, multi-agent systems that don't just act as 'copilots' — they operate as an entire virtual data team. The goal is to scale the impact of a single analytics professional 10x by automating the mechanics of data work, freeing human minds to focus entirely on strategy."
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/seanmurphy2014/",
    github: "https://github.com/smurphy6492/personal-website",
    email: "smurphy1357@gmail.com"
  }
};
