export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  problem: string;
  workflow: string[];
  stack: string[];
  status: "Live" | "In Progress" | "Planned";
  githubUrl?: string;
  caseStudy?: CaseStudySection[];
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
    problem: "Every analytics team knows the pattern: a stakeholder asks a question, an analyst writes SQL, builds a chart, drafts the summary, and two hours later delivers something that prompts three follow-up questions. It's not that the work is hard — it's that the work is repetitive, and the cycle time kills momentum. I wanted to build a system where a question goes in and a self-contained report comes out, with no human in the loop unless something breaks.",
    workflow: [
      "Data Profiler → DuckDB schema + stats",
      "Orchestrator → SQL query plan",
      "SQL Analyst → execute + retry on error (×3)",
      "Orchestrator → executive summary + chart specs",
      "Viz Agent → Plotly charts (deterministic)",
      "Report Builder → self-contained HTML"
    ],
    stack: ["Python", "Claude API", "DuckDB", "Plotly", "Pydantic", "Jinja2", "Typer"],
    status: "Live",
    githubUrl: "https://github.com/smurphy6492/autonomous-analytics-agent",
    caseStudy: [
      {
        heading: "What I Built",
        body: "A multi-agent pipeline that takes a natural language business question and produces a complete HTML report — SQL queries, rendered Plotly charts, and a written executive summary — with no manual intervention. Six specialized agents handle different stages of the workflow, from schema discovery to final report assembly. The output is a single self-contained HTML file you can email to a stakeholder or drop into Slack."
      },
      {
        heading: "The Architecture",
        body: "The pipeline chains six agents in sequence. Data Profiler connects to DuckDB and extracts schema metadata plus summary statistics. Orchestrator takes the user's question and the schema context, then plans which queries are needed. SQL Analyst generates the SQL and executes it — if execution fails, it feeds the DuckDB error back to Claude for correction, retrying up to three times. Orchestrator runs again to synthesize results and specify chart types. Viz Agent renders Plotly charts deterministically with no API call. Report Builder assembles everything into a Jinja2 HTML template."
      },
      {
        heading: "Key Technical Decisions",
        body: "DuckDB handles all data access — it's in-memory, requires zero setup, and reads CSVs natively, so there's no Postgres to spin up or connection strings to manage. All inter-agent communication uses JSON mode with Pydantic validation; Claude outputs structured JSON that Pydantic models validate before the next agent touches it, eliminating the hallucinated field names that silently break pipelines. The SQL retry loop is the self-correcting heart of the system: when a query fails, the actual DuckDB error message goes back to Claude with the original context, letting the model fix its own mistakes without hardcoded fallbacks."
      },
      {
        heading: "What It Demonstrates",
        body: "This project proves that autonomous task execution across multiple specialized agents is production-viable when you enforce structure at every boundary. Typed contracts between agents and self-correcting loops that consume real error messages — not just retry blindly — are what make agentic systems work with messy real-world data instead of just clean demos."
      }
    ]
  },
];

export const personalInfo = {
  name: "Sean Murphy",
  title: "Analytics + AI Systems Builder",
  headline: "I lead analytics teams and build the AI systems that scale them.",
  subtext: "Analytics leader and multi-agent systems builder — designing the AI infrastructure that lets small teams operate at scale.",
  about: [
    "I spent years directing analytics teams, and the pattern was always the same: talented people burning hours on tasks a machine should handle. Writing routine SQL. Debugging pipeline failures at 2am. Manually formatting the same executive summary every Monday. The strategic work got whatever time was left over.",
    "Now I build systems that change that ratio. Using the Claude API and Python, I design multi-agent architectures with custom orchestration — specialized agents collaborate on analytics workflows, from data profiling and SQL generation to visualization and executive summary writing.",
    "My goal isn't to replace data professionals. It's to multiply them. A single analytics engineer paired with the right agent infrastructure should be able to operate at the scale of a full team. That's what I'm building toward — and proving out — with every project on this site."
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/seanmurphy2014/",
    github: "https://github.com/smurphy6492",
    email: "smurphy1357@gmail.com"
  }
};
