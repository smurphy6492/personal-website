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

export interface Project {
  id: string;
  name: string;
  tagline: string;
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
      { label: "Data Profiler → DuckDB stats + LLM structuring", type: ["deterministic", "llm"] },
      { label: "Orchestrator → SQL query plan", type: "llm" },
      { label: "SQL Analyst → execute with self-correcting retry loop", type: ["llm", "validation"], retryLoop: true },
      { label: "Orchestrator → summary + chart specs", type: "llm" },
      { label: "Coverage + Metric Sanity → validate + re-synthesize if needed", type: ["llm", "validation"], conditional: true },
      { label: "Viz Agent + chart validators", type: ["deterministic", "validation"] },
      { label: "Report Builder → self-contained HTML", type: "deterministic" },
    ],
    stack: ["Python", "Claude API", "DuckDB", "Plotly", "Pydantic", "Jinja2", "Typer"],
    status: "Live",
    githubUrl: "https://github.com/smurphy6492/autonomous-analytics-agent",
    metrics: [
      { value: "~60s", label: "Question to Report", detail: "Replaces a ~2hr analyst workflow" },
      { value: "3", label: "Datasets Tested", detail: "Finance, marketing, e-commerce" },
      { value: "8", label: "Demo Reports", detail: "All generated autonomously" },
      { value: "8", label: "Validation Gates", detail: "Coverage, sanity, zero-row, bdata, and more" }
    ],
    sections: [
      {
        heading: "System Architecture",
        content: [
          { type: "text", value: "Five specialized agents chain in sequence, making 8+ LLM calls per report. Each stage passes Pydantic-validated output to the next. Validation gates between stages catch data quality issues, coverage gaps, and implausible metrics — triggering automatic re-synthesis when problems are found." },
          { type: "workflow" },
          { type: "bullets", items: [
            "Data Profiler connects to DuckDB and extracts schema metadata plus summary statistics. Claude structures this into a typed DataProfile with semantic annotations.",
            "Orchestrator plans 2-4 SQL queries based on the question and data profile.",
            "SQL Analyst generates and executes SQL. If DuckDB rejects a query, the error feeds back to Claude for self-correction (up to 3 attempts per query, 2-4 queries per report).",
            "Deterministic validators run after each query: zero-row detection, sequential-index detection, zero-variance checks.",
            "Orchestrator synthesizes results into an executive summary, key metrics, and chart specifications.",
            "Coverage validation reviews the synthesis against the original question. Multi-part questions get checked for dedicated coverage of each facet. Gaps trigger automatic re-synthesis with specific feedback.",
            "Metric sanity check cross-references reported metrics against the data profile to catch implausible figures.",
            "Viz Agent renders Plotly charts deterministically (no LLM call). Chart validators catch bdata encoding bugs and column mapping errors.",
            "Report Builder assembles everything into a self-contained HTML file via Jinja2."
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
        heading: "Multi-Dataset Demos",
        content: [
          { type: "text", value: "The agent runs on any CSV dataset with no configuration. Point it at a directory, ask a question, get a report. Here are demos across three domains:" },
          { type: "demoGrid", cards: [
            {
              dataset: "Financial Markets",
              description: "Top 50 S&P 500 stocks, 5 years of daily prices from Yahoo Finance.",
              reports: [
                { label: "Sector Performance vs S&P 500", href: "/reports/finance_sector_performance.html" },
                { label: "Sharpe Ratio Rankings", href: "/reports/finance_sharpe_ratio.html" },
                { label: "Correlation & Diversification", href: "/reports/finance_correlation.html" }
              ]
            },
            {
              dataset: "Marketing Analytics",
              description: "240K sessions, 4K transactions, 7 campaigns. Synthetic B2C e-commerce site.",
              reports: [
                { label: "Channel Performance & CPA", href: "/reports/marketing_channel_performance.html" },
                { label: "Device vs Channel Conversion", href: "/reports/marketing_device_conversion.html" },
                { label: "Campaign ROI Analysis", href: "/reports/marketing_campaign_roi.html" }
              ]
            },
            {
              dataset: "E-Commerce (Olist)",
              description: "100K orders from a Brazilian marketplace. Real public dataset from Kaggle.",
              reports: [
                { label: "Revenue Analysis", href: "/reports/analytics-agent-demo.html" },
                { label: "Customer Segmentation", href: "/reports/customer-segmentation.html" }
              ]
            }
          ]}
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
            "Metric sanity check: A dedicated LLM call reviews key metrics against the data profile. Catches implausible figures — like cost-per-acquisition exceeding total campaign budget, or revenue numbers that imply impossible average order values.",
            "Zero-row detection: Catches date filter bugs on historical data before they produce empty charts.",
            "Sequential-index detection: Flags when chart axes show 0, 1, 2, 3 instead of actual values, which signals column encoding bugs.",
            "Binary encoding guard: Catches Plotly's bdata regression, where chart data silently corrupts during serialization.",
            "Zero-variance detection: Catches wrong column mappings where every bar is the same height.",
            "Auto-formatting: The report builder infers column types from names — revenue columns get dollar signs and commas, percentages get proper formatting, counts get separators. Adaptive decimal precision prevents data loss when rounding would collapse distinct values into the same number."
          ]},
          { type: "callout", value: "The first demo failed repeatedly and needed manual fixes. Every subsequent demo ran clean on the first try. The system learns from its failures structurally. Not through better prompts, but through validators that make the same mistake impossible twice." }
        ]
      }
    ]
  },
  {
    id: "customer-segmentation",
    name: "Customer Segmentation & Churn Prediction",
    tagline: "Which customers are about to leave — and which ones are worth saving? End-to-end segmentation and churn prediction from 800K+ retail transactions.",
    problem: [
      { type: "text", value: "Every e-commerce company has the same question: which customers are we about to lose, and which ones are worth fighting to keep? The data exists in transaction logs, but most teams rely on gut feel or static reports." },
      { type: "callout", value: "I built an end-to-end data science pipeline, from raw transactions to actionable segments to churn predictions, using statistics and ML. Pure Python and scikit-learn. No AI tooling." }
    ],
    workflow: [
      "Raw transactions → data cleaning (805K rows)",
      "RFMT feature engineering → Recency, Frequency, Monetary, Tenure",
      "K-Means clustering → 5 lifecycle segments",
      "Retention curve analysis → data-driven 180-day churn threshold",
      "Temporal split → no data leakage",
      "Logistic Regression + Random Forest → churn classification"
    ],
    stack: ["Python", "scikit-learn", "Pandas", "Plotly", "scipy"],
    status: "Live",
    githubUrl: "https://github.com/smurphy6492/customer-segmentation",
    liveUrl: "/reports/customer-segmentation.html",
    metrics: [
      { value: "5,878", label: "Customers Segmented" },
      { value: "75%", label: "Revenue from Champions", detail: "Top segment drives the business" },
      { value: "0.802", label: "Churn AUC-ROC", detail: "Logistic Regression" },
      { value: "84%", label: "Lost Segment Churn Rate", detail: "Highest-churn segment identified" }
    ],
    sections: [
      {
        heading: "Key Findings",
        content: [
          { type: "text", value: "RFMT-based clustering separated customers into five lifecycle segments. Adding Tenure (days since first purchase) was the key insight: without it, new customers and lapsed customers are indistinguishable. Champions are 20% of customers but generate 75% of revenue." },
          { type: "table", headers: ["Segment", "Customers", "Avg Recency", "Avg Frequency", "Avg Spend", "Avg Tenure", "Revenue Share"],
            rows: [
              ["Champions", "1,152", "46 days", "20.0 orders", "$11,522", "647 days", "74.8%"],
              ["Loyal Customers", "1,686", "73 days", "4.7 orders", "$1,451", "491 days", "13.8%"],
              ["Potential Loyalists", "883", "56 days", "1.8 orders", "$625", "80 days", "3.1%"],
              ["Win-Back Targets", "970", "383 days", "3.1 orders", "$1,223", "561 days", "6.7%"],
              ["Lost", "1,187", "494 days", "1.2 orders", "$241", "508 days", "1.6%"]
            ]
          },
          { type: "callout", value: "Potential Loyalists have just 80 days of tenure. They are genuinely new customers, not lapsed ones. Win-Back Targets have similar recency to Lost but 5x the historical spend. They are worth pursuing." }
        ]
      },
      {
        heading: "Segmentation Deep Dive",
        content: [
          { type: "text", value: "K-Means clustering on standardized, log-transformed RFMT features with K=5. Silhouette analysis favors fewer clusters, but K=5 gives the lifecycle resolution needed to distinguish new, loyal, and lapsed customers. PCA captures 90% of variance in 2 components." },
          { type: "embed", src: "/reports/customer-segmentation.html", title: "Full Interactive Report", height: 600 }
        ]
      },
      {
        heading: "Defining Churn",
        content: [
          { type: "text", value: "Instead of picking an arbitrary inactivity threshold, we used the data. Inter-purchase interval analysis shows 90% of repeat purchases happen within 134 days. A retention curve measures what fraction of inactive customers ever return at each level of inactivity." },
          { type: "bullets", items: [
            "P90 inter-purchase interval: 134 days (normal buying window)",
            "Return probability drops below 50% at ~155 days",
            "Data-driven threshold: 180 days (defensible, not arbitrary)",
            "Resulting churn rate: 48%, near-balanced classes for classification"
          ]}
        ]
      },
      {
        heading: "Predicting Churn",
        content: [
          { type: "text", value: "With the 180-day threshold, churn was defined using a strict temporal split: features from transactions before the cutoff, labels from the 180 days after. No future information leaks into training." },
          { type: "bullets", items: [
            "Logistic Regression (AUC=0.802) slightly outperformed Random Forest (AUC=0.801). Simpler model, same accuracy, full interpretability.",
            "Balanced class weights handled the 48% churn rate without oversampling",
            "Top predictor: Recency. How recently a customer purchased is the strongest churn signal.",
            "Segment membership improves predictions: adding it as a feature helps the model distinguish lifecycle stages"
          ]}
        ]
      },
      {
        heading: "Connecting Segments to Churn",
        content: [
          { type: "text", value: "Churn rates map directly to lifecycle segments. This tells a retention team not just who will churn, but what kind of customer they are losing." },
          { type: "table", headers: ["Segment", "Churn Rate", "Action"],
            rows: [
              ["Champions", "8%", "Protect with loyalty programs"],
              ["Loyal Customers", "35%", "Monitor, light-touch engagement"],
              ["Potential Loyalists", "46%", "New customers still deciding. Nurture."],
              ["Win-Back Targets", "67%", "Were valuable, now lapsing. Reactivation campaigns."],
              ["Lost", "84%", "Deprioritize — reactivation ROI is negative"]
            ]
          }
        ]
      },
      {
        heading: "Methodology",
        content: [
          { type: "text", value: "Built with pure Python and scikit-learn. No LLMs, no AI orchestration. Feature engineering, unsupervised clustering, survival-style threshold analysis, and supervised classification." },
          { type: "bullets", items: [
            "Data: UCI Online Retail II (1M+ transactions, 2009-2011). ~23% of rows dropped due to missing Customer ID.",
            "Clustering features: RFMT (Recency, Frequency, Monetary, Tenure). Log-transformed and standardized.",
            "Churn features: RFMT + AvgOrderValue, AvgDaysBetween, UniqueProducts, Segment membership",
            "Churn threshold: 180 days, derived from retention curve analysis (not arbitrary).",
            "Classification: Logistic Regression vs Random Forest, evaluated on AUC-ROC, F1, precision/recall.",
            "Temporal split prevents data leakage: features before cutoff, churn defined by behavior after."
          ]}
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
    tagline: "AI tooling that compressed a 98-dashboard platform migration from 8 weeks to 1.",
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
