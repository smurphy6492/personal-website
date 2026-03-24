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
  {
    id: "ecommerce-data-story",
    name: "E-Commerce Disruption Analysis",
    tagline: "25 years of US retail data reveal which categories e-commerce has gutted — and which it hasn't touched.",
    problem: "Everyone knows e-commerce has transformed retail, but the disruption hasn't been uniform. Electronics stores have been hollowed out while grocery barely flinched. I wanted to quantify this — not with opinions, but with 25 years of official US Census Bureau data. The goal: a single, polished analytical artifact that answers \"which retail categories have been most disrupted by e-commerce?\" with specific numbers, not hand-waving.",
    workflow: [
      "Claude API → 7 testable hypotheses",
      "FRED data download → 9 time series (2000–2025)",
      "DuckDB → SQL analysis + derived metrics",
      "Python → 5 core analyses + Disruption Index",
      "Claude API → executive summary + chart captions",
      "Plotly + Jinja2 → self-contained HTML report"
    ],
    stack: ["Python", "Claude API", "DuckDB", "Plotly", "Pandas", "Jinja2"],
    status: "Live",
    githubUrl: "https://github.com/smurphy6492/ecommerce-data-story",
    caseStudy: [
      {
        heading: "The Business Question",
        body: "How has the shift to e-commerce reshaped US retail, and which categories are still being disrupted? E-commerce grew from 0.8% of US retail in Q1 2000 to 16.4% by Q3 2025 — a 20x increase. But the disruption has been wildly uneven. I used 9 FRED time series covering retail categories from electronics to groceries to gasoline stations, spanning 25 years of quarterly and monthly data."
      },
      {
        heading: "AI Integration Design",
        body: "Claude bookended the analysis — it didn't do it. Before any code was written, I prompted Claude with the data dictionary and business question to generate 7 testable hypotheses. These structured the entire investigation: instead of fishing for patterns, I was testing specific claims. After the analysis, I fed Claude the actual metrics and it wrote the executive summary and chart captions. I reviewed every cited number against the data. The AI helped me think before I started and communicate after I finished."
      },
      {
        heading: "Key Findings",
        body: "Electronics scored 98.7 on the Disruption Index — essentially zero growth over 25 years while nonstore retailers grew 9.4% annually. Furniture (81.8) and Books/Hobby/Music (81.6) followed. Food & Beverage (62.8) and Gasoline (59.6) proved most resilient. COVID permanently accelerated e-commerce by 4.1 percentage points above the pre-COVID trend — it stuck. The biggest surprise: Clothing's 5-year CAGR of 7.2% versus its 25-year CAGR of 2.9% marks it as the next major disruption battleground."
      },
      {
        heading: "What It Demonstrates",
        body: "This project complements the Autonomous Analytics Agent: that project shows the system, this one shows the output. It demonstrates business question framing, genuine SQL/Python analysis with real government data, a custom Disruption Index metric, and practical AI integration where Claude adds value at specific points rather than running the whole show. Six of seven AI-generated hypotheses were confirmed by the data — one was nuanced when Electronics, not Books, turned out to be the most disrupted category."
      }
    ]
  },
  {
    id: "tableau-migration-toolkit",
    name: "Tableau Migration Toolkit",
    tagline: "98 dashboards migrated from Redshift to Databricks — then the process got packaged into portable AI tooling.",
    problem: "BI migrations are one of the most tedious jobs in analytics. You're not doing anything intellectually hard — you're copying Custom SQL out of Tableau, updating table names, translating dialect-specific functions, validating row counts, and reconnecting data sources. Multiply that by 98 dashboards and you've got weeks of repetitive work where the real risk isn't complexity, it's human error on dashboard number 73. I did the migration manually, dashboard by dashboard, assisted by Claude Code. Then I extracted the repeatable methodology and packaged it as a skill and agent that any team can drop into their workspace.",
    workflow: [
      "Migration Notes PDF → methodology extraction",
      "98 SQL files → pattern analysis",
      "METHODOLOGY.md → portable 8-step process",
      "Sanitize SQL → 5 public examples",
      "Claude Code skill → 7-step guided workflow",
      "Agent persona → planning + edge case advisor"
    ],
    stack: ["Claude Code", "SQL", "Databricks", "Tableau", "Python", "Redshift"],
    status: "Live",
    githubUrl: "https://github.com/smurphy6492/tableau-migration-toolkit",
    caseStudy: [
      {
        heading: "The Real Work",
        body: "At an e-commerce company, I migrated 98 Tableau dashboards from Redshift to Databricks. Every dashboard followed the same pattern: download the workbook, extract the Custom SQL, translate Redshift syntax to Spark SQL, update table names from the old schema to Unity Catalog, materialize as a gold table, validate row counts against the source, reconnect Tableau, and set up the refresh schedule. The work wasn't hard. It was just 98 repetitions of the same 8-step process, where each dashboard had its own edge cases — date spines, LOD expressions, Initial SQL temp tables, blended data sources."
      },
      {
        heading: "What I Extracted",
        body: "After the migration was done, the methodology was in my head and scattered across commit messages. Nothing was portable. So I went back and extracted the process into a structured METHODOLOGY.md — a platform-agnostic guide that any analyst could follow without knowing which company it came from. I sanitized 5 representative SQL files (from simple SELECTs to 300-line cohort analyses with window functions) to show the real patterns at each complexity level. All company-specific table names, column names, and business logic were replaced with a fictional demo schema."
      },
      {
        heading: "The Toolkit",
        body: "The methodology became two Claude Code artifacts. A skill (/migrate-tableau-workbook) that walks an analyst through migrating a single workbook in 7 steps — inventory, extract SQL, map tables, adapt dialect, build the target table, validate, and reconnect Tableau. And an agent persona that can plan a full migration project: scope it, batch workbooks by complexity, estimate timelines, and advise on edge cases like RAWSQL calculated fields or Tableau parameters embedded in Custom SQL. Both reference the same set of documents: a dialect translation table covering 40+ function differences across Redshift, SQL Server, and Postgres, a validation query reference, and a naming convention guide."
      },
      {
        heading: "What It Demonstrates",
        body: "This project is about the difference between doing work and packaging work. The 98-dashboard migration was a job. The toolkit is an asset — it turns one person's experience into something any team can use. It also shows a practical use case for Claude Code skills and agents beyond toy examples: a real workflow with real edge cases, built from real production migrations, not hypothetical scenarios. The sanitization pipeline (including a Python script that applies regex-based table name mapping and checks output against a blocklist of sensitive patterns) is itself a reusable tool."
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
