export interface StatItem {
  value: string;
  label: string;
  detail?: string;
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
  | { type: "workflow" };

export interface ProjectSection {
  heading: string;
  content: ContentBlock[];
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  problem: ContentBlock[];
  workflow: string[];
  stack: string[];
  status: "Live" | "In Progress" | "Planned" | "Complete";
  githubUrl?: string;
  liveUrl?: string;
  metrics?: StatItem[];
  sections: ProjectSection[];
}

export const projects: Project[] = [
  {
    id: "autonomous-analytics-agent",
    name: "Autonomous Analytics Agent",
    tagline: "Ask a business question. Get SQL, charts, and an executive summary. Automatically.",
    problem: [
      { type: "text", value: "Every analytics team knows this cycle: a stakeholder asks a question, an analyst writes SQL, builds a chart, drafts a summary, and two hours later delivers something that prompts three follow-up questions." },
      { type: "bullets", items: [
        "Stakeholder asks a business question",
        "Analyst writes SQL, builds chart, drafts summary",
        "Two hours later: answer prompts follow-up questions",
        "Cycle repeats. The work isn't hard, it's repetitive"
      ]},
      { type: "callout", value: "I wanted to build a system where a question goes in and a complete report comes out, with no human in the loop unless something breaks." }
    ],
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
    metrics: [
      { value: "~60s", label: "Question to Report", detail: "Replaces a ~2hr analyst workflow" },
      { value: "6", label: "Specialized Agents" },
      { value: "0", label: "Human Steps Required" },
      { value: "3x", label: "Self-Correcting Retries" }
    ],
    sections: [
      {
        heading: "System Architecture",
        content: [
          { type: "text", value: "Six agents chain in sequence. Each one handles a specific stage, passes structured output to the next, and the pipeline self-corrects when queries fail." },
          { type: "workflow" },
          { type: "bullets", items: [
            "Data Profiler connects to DuckDB and extracts schema metadata plus summary statistics",
            "Orchestrator takes the user's question and schema context, then plans which queries are needed",
            "SQL Analyst generates and executes SQL. If it fails, the DuckDB error feeds back to Claude for self-correction, up to 3 retries",
            "Viz Agent renders Plotly charts deterministically with no API call",
            "Report Builder assembles everything into a self-contained HTML file via Jinja2"
          ]}
        ]
      },
      {
        heading: "Sample Output",
        content: [
          { type: "text", value: "Each report is a self-contained HTML file with interactive Plotly charts and an executive summary that cites actual numbers from the query results. Here's a real report generated from the question: \"What are the revenue trends by product category?\"" },
          { type: "embed", src: "/reports/analytics-agent-demo.html", title: "Auto-generated revenue analysis report", height: 600 }
        ]
      },
      {
        heading: "Key Technical Decisions",
        content: [
          { type: "bullets", items: [
            "DuckDB for all data access: in-memory, zero setup, reads CSVs natively. No Postgres to spin up or connection strings to manage.",
            "Pydantic JSON contracts between agents. Claude outputs structured JSON that gets validated before the next agent touches it. Eliminates hallucinated field names that silently break pipelines.",
            "Self-correcting SQL: when a query fails, the actual DuckDB error message goes back to Claude with original context. The model fixes its own mistakes without hardcoded fallbacks."
          ]},
          { type: "callout", value: "Typed contracts between agents and self-correcting loops that consume real error messages are what make agentic systems work with messy data, not just clean demos." }
        ]
      },
      {
        heading: "Self-Review Loop",
        content: [
          { type: "text", value: "The first demo required hours of manual debugging. Charts showed row indices instead of revenue figures. Queries returned zero rows because of date filter edge cases. Reports answered half the question and ignored the rest. So I built the debugging into the pipeline itself." },
          { type: "bullets", items: [
            "Coverage validation: After the orchestrator proposes a report layout, a separate LLM call reviews it against the original question. Multi-part questions like \"Which states have the highest CLV AND what payment methods do they prefer?\" get checked for dedicated coverage of each facet. Gaps trigger automatic re-synthesis with specific feedback.",
            "Zero-row detection: Catches date filter bugs on historical data before they produce empty charts.",
            "Sequential-index detection: Flags when chart axes show 0, 1, 2, 3 instead of actual values, which signals column encoding bugs.",
            "Binary encoding guard: Catches Plotly's bdata regression, where chart data silently corrupts during serialization.",
            "Zero-variance detection: Catches wrong column mappings where every bar is the same height."
          ]},
          { type: "callout", value: "The first demo failed repeatedly and needed manual fixes. Every subsequent demo ran clean on the first try. The system learns from its failures structurally. Not through better prompts, but through validators that make the same mistake impossible twice." }
        ]
      }
    ]
  },
  {
    id: "ecommerce-data-story",
    name: "E-Commerce Disruption Analysis",
    tagline: "25 years of US retail data reveal which categories e-commerce has gutted, and which it hasn't touched.",
    problem: [
      { type: "text", value: "Everyone knows e-commerce transformed retail, but the disruption hasn't been uniform. Electronics stores have been hollowed out while grocery barely flinched." },
      { type: "callout", value: "Which retail categories have been most disrupted by e-commerce? I wanted to answer that with 25 years of Census Bureau data, not opinions." }
    ],
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
    liveUrl: "/reports/ecommerce-disruption.html",
    metrics: [
      { value: "20x", label: "E-Commerce Growth", detail: "0.8% → 16.4% of US retail" },
      { value: "98.7", label: "Electronics Disruption Index", detail: "Most disrupted category" },
      { value: "25 yrs", label: "Data Span", detail: "Quarterly FRED data, 2000–2025" },
      { value: "6 of 7", label: "Hypotheses Confirmed" }
    ],
    sections: [
      {
        heading: "Key Findings",
        content: [
          { type: "table", headers: ["Category", "Disruption Index", "Signal"],
            rows: [
              ["Electronics", "98.7", "Essentially zero growth in 25 years"],
              ["Furniture", "81.8", "Showrooming gutted physical retail"],
              ["Books / Hobby / Music", "81.6", "Amazon's original beachhead"],
              ["Clothing", "73.4", "5yr CAGR 7.2%, next battleground"],
              ["Food & Beverage", "62.8", "Most resilient, physical stays"],
              ["Gasoline", "59.6", "Immune to e-commerce disruption"]
            ]
          },
          { type: "bullets", items: [
            "COVID permanently accelerated e-commerce by 4.1 percentage points above the pre-COVID trend. It stuck.",
            "Clothing's 5-year CAGR of 7.2% vs. its 25-year CAGR of 2.9% marks it as the next major disruption battleground",
            "Nonstore retailers grew 9.4% annually while Electronics barely moved"
          ]},
          { type: "embed", src: "/reports/ecommerce-disruption.html", title: "Full Interactive Report", height: 600 }
        ]
      },
      {
        heading: "How It Was Built",
        content: [
          { type: "text", value: "Claude bookended the analysis. It didn't do it. The AI helped me think before I started and communicate after I finished." },
          { type: "workflow" },
          { type: "bullets", items: [
            "Before: Claude generated 7 testable hypotheses from the data dictionary. These structured the entire investigation.",
            "During: I directed the SQL/Python analysis against 9 FRED time series. Claude Code wrote the code. I decided what to ask and how to interpret it.",
            "After: Claude wrote the executive summary and chart captions from actual metrics. I reviewed every cited number against the data."
          ]},
          { type: "callout", value: "Six of seven AI-generated hypotheses were confirmed by the data. The surprise: Electronics, not Books, turned out to be the most disrupted category." }
        ]
      }
    ]
  },
  {
    id: "tableau-migration-toolkit",
    name: "Tableau Migration Toolkit",
    tagline: "98 dashboards migrated from Redshift to Databricks. Then the process got packaged into portable AI tooling.",
    problem: [
      { type: "text", value: "BI migrations are one of the most tedious jobs in analytics. Nothing intellectually hard, just repetitive work where the real risk is human error on dashboard #73. I ran this migration in production with Claude Code as my copilot throughout, translating SQL dialects, catching edge cases, and validating patterns across 98 real Tableau workbooks on live clusters." },
      { type: "bullets", items: [
        "Extract Custom SQL from each Tableau workbook",
        "Translate Redshift dialect → Spark SQL",
        "Update table names to Unity Catalog",
        "Materialize as gold tables in Databricks",
        "Validate row counts against the source",
        "Reconnect Tableau and set refresh schedules"
      ]},
      { type: "callout", value: "98 dashboards. Same 8-step process. Each one with its own edge cases: date spines, LOD expressions, Initial SQL temp tables, blended data sources. Claude handled the dialect translation and pattern matching; I handled the judgment calls." }
    ],
    workflow: [
      "Download Tableau workbook (.twb/.twbx)",
      "Extract Custom SQL from data sources",
      "Map table names → Unity Catalog",
      "Translate Redshift dialect → Spark SQL",
      "Materialize as gold table in Databricks",
      "Validate row counts + revenue totals",
      "Reconnect Tableau → new data source",
      "Set refresh schedule"
    ],
    stack: ["Claude Code", "SQL", "Databricks", "Tableau", "Python", "Redshift"],
    status: "Complete",
    githubUrl: "https://github.com/smurphy6492/tableau-migration-toolkit",
    metrics: [
      { value: "8→1 wk", label: "Timeline with Claude", detail: "8-week estimate cut to 1 week" },
      { value: "98", label: "Dashboards Migrated" },
      { value: "40+", label: "Dialect Translations", detail: "Redshift → Spark SQL" },
      { value: "2", label: "Packaged Artifacts", detail: "Claude Code skill + agent" }
    ],
    sections: [
      {
        heading: "The Toolkit",
        content: [
          { type: "text", value: "The migration itself was AI-assisted. Claude Code was in the loop for every dashboard. Afterward, I packaged the methodology into portable tooling that any team can drop into their workspace." },
          { type: "bullets", items: [
            "A Claude Code skill (/migrate-tableau-workbook) that walks an analyst through migrating a single workbook in 7 guided steps",
            "An agent persona that plans full migration projects, batches workbooks by complexity, estimates timelines, and advises on edge cases like RAWSQL fields or parameters embedded in Custom SQL",
            "Reference docs: dialect translation table covering 40+ function differences across Redshift, SQL Server, and Postgres, plus validation queries and naming conventions"
          ]},
          { type: "workflow" }
        ]
      },
      {
        heading: "SQL Migration Examples",
        content: [
          { type: "text", value: "Five sanitized examples show the real patterns at each complexity level. Here are the dialect notes from two of them:" },
          { type: "code", language: "sql", value: `-- DIALECT NOTES (Redshift → Databricks Spark SQL)
--
-- Date arithmetic:
--   Redshift:   DATEADD(MONTH, -49, GETDATE())
--   Databricks: ADD_MONTHS(CURRENT_DATE(), -49)
--
-- Null coalescing:
--   Redshift:   NVL(col, default)
--   Databricks: COALESCE(col, default)
--
-- IMPORTANT: All column aliases are lowercase.
-- Redshift returns lowercase regardless of alias case.
-- Databricks preserves case. Tableau field references
-- break if case changes — enforce lowercase explicitly.`, caption: "From simple_select.sql — basic dialect translation for a weekly KPI dashboard" },
          { type: "code", language: "sql", value: `-- DIALECT NOTES (Redshift → Databricks Spark SQL)
--
-- Integer division:
--   Redshift:   DIV(expr, n)  — function
--   Databricks: expr DIV n    — infix operator
--
-- Sequence generation (replacing recursive CTE):
--   Redshift:   Recursive CTE or GENERATE_SERIES
--   Databricks: EXPLODE(SEQUENCE(0, 60))
--   Generates integers 0-60 as quarter offsets.
--
-- Date diff (argument order flipped):
--   Redshift:   DATEDIFF(day, start_date, end_date)
--   Databricks: DATEDIFF(end_date, start_date)`, caption: "From window_functions.sql — customer cohort dashboard with running totals and period offsets" }
        ]
      },
      {
        heading: "From Job to Asset",
        content: [
          { type: "text", value: "After the migration, the methodology lived in my Claude Code session history and commit messages. Nothing was portable. So I extracted it into a structured METHODOLOGY.md, a platform-agnostic guide any analyst could follow." },
          { type: "bullets", items: [
            "5 sanitized SQL files from simple SELECTs to 300-line cohort analyses with window functions",
            "All company-specific table names, column names, and business logic replaced with a fictional demo schema",
            "A Python sanitization script that applies regex-based table name mapping and checks output against a blocklist of sensitive patterns"
          ]},
          { type: "callout", value: "The 98-dashboard migration was a job. The toolkit is an asset. It turns one person's experience into something any team can use." }
        ]
      }
    ]
  },
];

export const personalInfo = {
  name: "Sean Murphy",
  title: "Analytics + AI Systems Builder",
  headline: "I lead analytics teams and build the AI systems that scale them.",
  subtext: "Analytics leader and multi-agent systems builder. Designing the AI infrastructure that lets small teams operate at scale.",
  about: [
    "I spent years directing analytics teams, and the pattern was always the same: talented people burning hours on tasks a machine should handle. Writing routine SQL. Debugging pipeline failures at 2am. Manually formatting the same executive summary every Monday. The strategic work got whatever time was left over.",
    "Now I build systems that change that ratio. Using the Claude API and Python, I design multi-agent architectures with custom orchestration. Specialized agents collaborate on analytics workflows, from data profiling and SQL generation to visualization and executive summary writing.",
    "My goal isn't to replace data professionals. It's to multiply them. A single analytics engineer paired with the right agent infrastructure should be able to operate at the scale of a full team. That's what I'm building toward, and proving out, with every project on this site."
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/seanmurphy2014/",
    github: "https://github.com/smurphy6492",
    email: "smurphy1357@gmail.com"
  }
};
