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
  githubUrl?: string;
  liveUrl?: string;
  metrics?: StatItem[];
  sections: ProjectSection[];
  hidden?: boolean;
}

export const projects: Project[] = [
  {
    id: "compute-capacity-forecasting",
    name: "Compute Capacity Forecasting",
    tagline: "ML-driven capacity planning for an AI compute provider. Built a hybrid forecasting system that gave leadership a 6-month capacity runway under three scenarios.",
    category: "Data Science",
    problem: [
      { type: "text", value: "I designed the forecasting methodology for an AI compute provider's capacity planning problem. GPU capacity takes 3-6 months to procure, but demand grows 40-80% annually with strong weekly seasonality and unpredictable spikes. Under-provision and customers churn. Over-provision and you burn capital." },
      { type: "callout", value: "I designed a forecasting system that delivers daily P10/P50/P90 predictions with scenario planning, giving leadership a capacity threshold chart that answers: when do we run out under each scenario?" },
      { type: "text", value: "This project uses realistic synthetic data to demonstrate methodology, not production telemetry. The data simulates 16 compute series with real-world patterns (step-changes, seasonality, outages, variable growth), and all metrics are evaluated on held-out test periods. See the Data section below for details on the generation approach." }
    ],
    workflow: [
      "Synthetic data generation (16 series, 3 years)",
      "EDA: trend decomposition, seasonality, events",
      "Feature engineering (25 features)",
      "LightGBM quantile regression (P10/P50/P90)",
      "Hybrid trend + residual decomposition",
      "Conformal calibration for coverage",
      "Recursive 6-month forecast",
      "Three-scenario capacity threshold analysis"
    ],
    stack: ["Python", "LightGBM", "Pandas", "NumPy", "Matplotlib", "scikit-learn", "SHAP"],
    githubUrl: "https://github.com/smurphy6492/compute-forecasting",
    hidden: false,
    metrics: [
      { value: "7.9%", label: "Test MAPE", detail: "Hybrid model, 6-month holdout (synthetic data)" },
      { value: "4.9%", label: "Enterprise GPU MAPE", detail: "Down from 14.1% (original model)" },
      { value: "83.8%", label: "P10-P90 Coverage", detail: "Target: 80% (conformal calibration)" },
      { value: "16", label: "Series Forecasted", detail: "4 compute types x 4 segments" }
    ],
    sections: [
      {
        heading: "The Data",
        content: [
          { type: "text", value: "Realistic synthetic data: 4 compute types (GPU Training, GPU Inference, CPU Batch, CPU Interactive) across 4 customer segments, totaling 16 time series over 3 years. Each series has compound growth, weekly seasonality, holiday effects, step-changes from customer onboardings, conference spikes, and a GPU outage." },
          { type: "image", src: "/images/compute-forecasting/overview_with_events.png", alt: "3-year compute usage overview with business events annotated", caption: "Total daily compute hours with documented business events. Growth is ~47% annualized with strong weekly seasonality." },
          { type: "bullets", items: [
            "17,536 rows: deterministic generation (seed=42) with layered multiplicative signals",
            "Every anomaly has a documented business reason in event_log.csv",
            "Variable growth rates: GPU Inference ~60%/yr, CPU Batch ~13%/yr, Research near-flat"
          ]}
        ]
      },
      {
        heading: "The Model: Hybrid Trend + Residual",
        content: [
          { type: "text", value: "Tree-based models (LightGBM, XGBoost) can't extrapolate beyond their training range. For fast-growing Enterprise GPU Training, test-period values exceed the training maximum and the model plateaus. The hybrid approach solves this by separating the problem:" },
          { type: "table", headers: ["Component", "Method", "Handles"],
            rows: [
              ["Trend", "Per-series exponential regression", "Growth extrapolation beyond training range"],
              ["Residual", "Global LightGBM (25 features)", "Seasonality, holidays, day-of-week, noise"]
            ]
          },
          { type: "text", value: "The residual target (actual / trend) is stationary and bounded, so LightGBM never needs to predict outside its training range. The trend handles extrapolation; LightGBM handles pattern recognition." },
          { type: "image", src: "/images/compute-forecasting/hybrid_improvement.png", alt: "Original vs hybrid model comparison for Enterprise GPU Training", caption: "Enterprise GPU Training: the original model plateaus at training-range max (14.1% MAPE). The hybrid model tracks the growth trajectory (4.9% MAPE)." },
          { type: "bullets", items: [
            "Per-series exponential trend via log-linear regression, capped at 5%/month",
            "LightGBM trained on log(residual_ratio) with quantile regression for P10/P50/P90",
            "Per-type proportional conformal calibration for honest prediction intervals",
            "Walk-forward backtesting (3 folds) confirms consistent improvement"
          ]},
          { type: "image", src: "/images/compute-forecasting/feature_importance.png", alt: "Feature importance chart showing lag and rolling features dominate", caption: "SHAP-derived feature importance on the residual target. Lag and rolling features dominate; calendar features matter less once the trend is removed." }
        ]
      },
      {
        heading: "Model Iteration: Diagnosing the Extrapolation Problem",
        content: [
          { type: "text", value: "The hybrid model wasn't the first approach. The project went through a deliberate iteration cycle: build, evaluate, diagnose, fix." },
          { type: "table", headers: ["Stage", "Approach", "Overall MAPE", "Enterprise GPU Training"],
            rows: [
              ["Baselines", "Seasonal naive, growth-adjusted", "10.5%", "~15%"],
              ["First model", "LightGBM on log(compute_hours)", "8.57%", "14.1%"],
              ["Diagnosis", "Coverage analysis + residual inspection", "—", "21% of actuals above P90"],
              ["Hybrid model", "Trend decomposition + LightGBM on residuals", "7.94%", "4.9%"]
            ]
          },
          { type: "text", value: "The first LightGBM model beat every baseline convincingly. But the per-series MAPE table revealed a problem: Enterprise GPU Training at 14.1% while CPU series sat at 4-7%. Coverage analysis showed 21% of GPU Training actuals exceeded P90. The model was systematically under-predicting." },
          { type: "text", value: "The root cause was structural, not tunable. Tree models partition the feature space into regions and assign constant leaf values. When Enterprise GPU Training grew 15% beyond its training maximum, the model literally could not predict those values. More trees, different hyperparameters, and the log transform all helped but couldn't solve a fundamental architectural limitation." },
          { type: "callout", value: "The fix was the right decomposition: separate the trend (which needs extrapolation) from the residual (which doesn't), and handle each with the method suited to it." }
        ]
      },
      {
        heading: "Honest Limitations",
        content: [
          { type: "bullets", items: [
            "Synthetic data: the model is validated on data I designed, not production telemetry. Real compute usage has messier patterns, missing data, and distribution drift that would likely degrade performance",
            "Research/Academic GPU series slightly worse (+4pp MAPE) because the exponential trend is noisier for low-growth series",
            "Unpredictable events (outages, conference spikes) can't be forecast. The model reacts via lags but can't anticipate",
            "Trend extrapolation assumes growth rates continue. Actual acceleration or deceleration would shift timelines",
            "Hyperparameters are sensible defaults, not optimized. Tuning would likely improve results but wasn't the focus"
          ]},
          { type: "text", value: "On the positive side: recursive forecast validation shows 7.96% MAPE over 6 months vs 7.94% single-step. The hybrid decomposition prevents the error compounding that plagues most recursive forecasts." },
          { type: "callout", value: "Stating limitations honestly is what separates a methodology demonstration from production claims." }
        ]
      },
      {
        heading: "Scenario Planning & Capacity Threshold",
        content: [
          { type: "text", value: "The executive deliverable: a 6-month recursive forecast under three scenarios, plotted against the capacity ceiling. This answers the procurement question directly: when does each scenario hit the ceiling?" },
          { type: "image", src: "/images/compute-forecasting/capacity_threshold_scenarios.png", alt: "Capacity threshold analysis with three scenarios", caption: "Three scenarios vs. current capacity ceiling. All scenarios breach capacity by late September — the question isn't if, but how severe the shortfall." },
          { type: "table", headers: ["Scenario", "Description", "P90 Crosses Ceiling"],
            rows: [
              ["Base", "Current trends continue", "Sep 9"],
              ["High", "Sales pipeline converts (probability-weighted)", "Sep 2"],
              ["Low", "15% GPU Inference efficiency gain", "Sep 23"]
            ]
          },
          { type: "text", value: "The tight 21-day spread between scenarios tells its own story: capacity procurement is urgent regardless of assumptions. The scenarios diverge more meaningfully in shortfall magnitude (how many GPU-hours/day of unmet demand we face in Q4), which is where the sensitivity analysis below adds value." },
          { type: "image", src: "/images/compute-forecasting/60day_forecast_fan_chart.png", alt: "60-day forecast with P10-P90 confidence bands", caption: "Near-term 60-day forecast with confidence bands. The trend model ensures the forecast continues growing rather than plateauing." }
        ]
      },
      {
        heading: "How It Was Built",
        content: [
          { type: "text", value: "The modeling iteration is covered above. The rest of the build:" },
          { type: "bullets", items: [
            "Designed synthetic data with layered multiplicative signals (trend × seasonality × events × noise) to create realistic forecasting challenges including step-changes, outages, and variable growth rates across segments",
            "EDA (51 cells) confirmed multiplicative seasonality and guided feature selection. ACF/PACF analysis justified specific lag choices; volatility heatmaps revealed segment-level risk differences",
            "Recursive backtest validated 6-month forecasts before trusting the scenario planning outputs",
            "Reframed sensitivity analysis from 'days earlier/later' to 'GPU-hours of shortfall × dollar cost', making pipeline deals visible to procurement decisions"
          ]},
          { type: "text", value: "Built with Claude Code as an AI-assisted development workflow. The full commit history is visible in the repo." }
        ]
      }
    ]
  },
  {
    id: "autonomous-analytics-agent",
    name: "Autonomous Analytics Agent",
    tagline: "Ask a business question. Get SQL, charts, and an executive summary. Automatically.",
    category: "AI Tooling",
    problem: [
      { type: "text", value: "I architected a multi-agent system to replace the most repetitive cycle in analytics: a stakeholder asks a question, an analyst writes SQL, builds a chart, drafts a summary, and two hours later delivers something that prompts three follow-up questions." },
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
          { type: "text", value: "Five specialized agents chain in sequence, making 8+ LLM calls per report. Each stage passes Pydantic-validated output to the next. Validation gates between stages catch data quality issues, coverage gaps, and implausible metrics. When problems are found, re-synthesis triggers automatically." },
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
          { type: "callout", value: "Typed contracts between agents and self-correcting loops that consume real error messages are what make agentic systems survive messy real-world data." }
        ]
      },
      {
        heading: "Self-Review Loop",
        content: [
          { type: "text", value: "The first demo required hours of manual debugging. Charts showed row indices instead of revenue figures. Queries returned zero rows because of date filter edge cases. Reports answered half the question and ignored the rest. So I built the debugging into the pipeline itself." },
          { type: "bullets", items: [
            "Coverage validation: After the orchestrator proposes a report layout, a separate LLM call reviews it against the original question. Multi-part questions like \"Which states have the highest CLV AND what payment methods do they prefer?\" get checked for dedicated coverage of each facet. Gaps trigger automatic re-synthesis with specific feedback.",
            "Metric sanity check: A dedicated LLM call reviews key metrics against the data profile. Catches implausible figures like cost-per-acquisition exceeding total campaign budget, or revenue numbers that imply impossible average order values.",
            "Zero-row detection: Catches date filter bugs on historical data before they produce empty charts.",
            "Sequential-index detection: Flags when chart axes show 0, 1, 2, 3 instead of actual values, which signals column encoding bugs.",
            "Binary encoding guard: Catches Plotly's bdata regression, where chart data silently corrupts during serialization.",
            "Zero-variance detection: Catches wrong column mappings where every bar is the same height.",
            "Auto-formatting: The report builder infers column types from names. Revenue columns get dollar signs and commas, percentages get proper formatting, counts get separators. Adaptive decimal precision prevents data loss when rounding would collapse distinct values into the same number."
          ]},
          { type: "callout", value: "The first demo failed repeatedly and needed manual fixes. Every subsequent demo ran clean on the first try. The system learns from its failures structurally: each validator makes the same mistake impossible twice." }
        ]
      }
    ]
  },
  {
    id: "customer-segmentation",
    name: "Customer Segmentation & Churn Prediction",
    tagline: "Which customers are about to leave, and which ones are worth saving? Segmented 5,800 customers into lifecycle stages and predicted churn at 0.80 AUC from 800K+ transactions.",
    category: "Data Science",
    problem: [
      { type: "text", value: "I owned the full pipeline from 800K raw transactions to actionable segments and churn predictions. Every e-commerce company has the same question: which customers are we about to lose, and which ones are worth fighting to keep? The data exists in transaction logs, but most teams rely on gut feel or static reports." },
      { type: "callout", value: "End-to-end data science: from raw transactions to lifecycle segments to churn classification, using statistics and ML. Pure Python and scikit-learn. No AI tooling." }
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
          { type: "text", value: "Churn rates map directly to lifecycle segments, so a retention team knows both who will churn and what kind of customer they're losing." },
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
            "Churn threshold: 180 days, derived from retention curve analysis.",
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
    category: "Data Analytics",
    problem: [
      { type: "text", value: "I framed the research questions and directed the analysis across 25 years of Census Bureau data. Everyone knows e-commerce transformed retail, but the disruption hasn't been uniform. Electronics stores have been hollowed out while grocery barely flinched." },
      { type: "callout", value: "Which retail categories have been most disrupted by e-commerce? I wanted an answer backed by 25 years of data." }
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
    tagline: "Directed a 98-dashboard platform migration — Redshift to Databricks — cutting the timeline from 8 weeks to 1 using Claude Code as copilot.",
    category: "Data Engineering",
    problem: [
      { type: "text", value: "I led a 98-dashboard platform migration from Redshift to Databricks as analytics lead. BI migrations are tedious — nothing intellectually hard, just repetitive work where the real risk is human error on dashboard #73. Claude Code was my copilot throughout, directing the SQL dialect translation, catching edge cases, and validating patterns across real Tableau workbooks on live clusters." },
      { type: "bullets", items: [
        "Extract Custom SQL from each Tableau workbook",
        "Translate Redshift dialect → Spark SQL",
        "Update table names to Unity Catalog",
        "Materialize as gold tables in Databricks",
        "Validate row counts against the source",
        "Reconnect Tableau and set refresh schedules"
      ]},
      { type: "callout", value: "98 dashboards. Same 8-step process. Each one with its own edge cases: date spines, LOD expressions, Initial SQL temp tables, blended data sources. Claude took the dialect translation and pattern matching. The judgment calls — which workbooks to batch, when a translation needed a human eye — were mine." }
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
          { type: "code", language: "sql", value: `-- DIALECT NOTES (Redshift → Databricks Spark SQL)\n--\n-- Date arithmetic:\n--   Redshift:   DATEADD(MONTH, -49, GETDATE())\n--   Databricks: ADD_MONTHS(CURRENT_DATE(), -49)\n--\n-- Null coalescing:\n--   Redshift:   NVL(col, default)\n--   Databricks: COALESCE(col, default)\n--\n-- IMPORTANT: All column aliases are lowercase.\n-- Redshift returns lowercase regardless of alias case.\n-- Databricks preserves case. Tableau field references\n-- break if case changes — enforce lowercase explicitly.`, caption: "From simple_select.sql — basic dialect translation for a weekly KPI dashboard" },
          { type: "code", language: "sql", value: `-- DIALECT NOTES (Redshift → Databricks Spark SQL)\n--\n-- Integer division:\n--   Redshift:   DIV(expr, n)  — function\n--   Databricks: expr DIV n    — infix operator\n--\n-- Sequence generation (replacing recursive CTE):\n--   Redshift:   Recursive CTE or GENERATE_SERIES\n--   Databricks: EXPLODE(SEQUENCE(0, 60))\n--   Generates integers 0-60 as quarter offsets.\n--\n-- Date diff (argument order flipped):\n--   Redshift:   DATEDIFF(day, start_date, end_date)\n--   Databricks: DATEDIFF(end_date, start_date)`, caption: "From window_functions.sql — customer cohort dashboard with running totals and period offsets" }
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
  {
    id: "claude-workspace-config",
    name: "Claude Code Workspace Config",
    tagline: "The AI operating system behind every project on this site. Seven specialized agents, 14 reusable skills, and 6 coding standards — refined across 5 shipped projects.",
    category: "AI Tooling",
    problem: [
      { type: "text", value: "I designed this workspace configuration iteratively across 5 shipped projects, adding agents, skills, and rules as real gaps emerged. Claude Code is powerful out of the box, but using it effectively for complex projects requires structure. Without it, every session starts from scratch: no consistent coding standards, no specialized agents, no reusable workflows." },
      { type: "callout", value: "The result: a coordinated team of specialized agents, each with defined roles, tools, and instructions. Skills codify repeatable workflows into single commands. Rules enforce standards automatically." }
    ],
    workflow: [
      "User request enters via CLAUDE.md routing layer",
      "Route to /skill (guided workflow) or agent (autonomous persona)",
      "Agent executes with domain-specific instructions and tools",
      "Rules enforce coding standards automatically on matching files",
      "/verification-loop and enforced CI gates validate before merge",
      "Workspace self-improves via /create when gaps are found"
    ],
    stack: ["Claude Code", "Markdown", "Python", "TypeScript", "SQL"],
    githubUrl: "https://github.com/smurphy6492/claude-workspace-config",
    metrics: [
      { value: "7", label: "Specialized Agents", detail: "Planner, plan-judge, web-dev, content, data, 2 reviewers" },
      { value: "14", label: "Skills", detail: "Slash commands for repeatable workflows" },
      { value: "6", label: "Rules", detail: "Always-on coding and writing standards" },
      { value: "5", label: "Projects Built", detail: "Every project on this site used this config" }
    ],
    sections: [
      {
        heading: "How It Works",
        content: [
          { type: "text", value: "CLAUDE.md is the control plane. It tells Claude Code which agents exist, which skills are available, which rules are active, and how to route work. Think of it as the operating manual for a software team — except the team is a set of AI agents." },
          { type: "workflow" },
          { type: "bullets", items: [
            "Skills are invoked explicitly (/verification-loop, /systematic-debugging). They define phases, gates, and output formats, turning repeatable processes into one-command operations.",
            "Agents are spawned for complex tasks. Each has a defined role, model, tools, and detailed instructions. The planner agent produces implementation plans. The web-developer builds UI. The python-reviewer checks code quality.",
            "Rules fire automatically on matching file patterns. Python files get type hint enforcement. SQL files get CTE conventions. All files get commit message standards."
          ]}
        ]
      },
      {
        heading: "The Agents",
        content: [
          { type: "text", value: "Each agent is purpose-built with its own system prompt, tool access, and model selection. They don't share a generic prompt. Specialization keeps instructions focused and prevents competing objectives." },
          { type: "table", headers: ["Agent", "Role", "Why It Exists"],
            rows: [
              ["planner", "Architecture + implementation planning", "Forces structured thinking before code. The most expensive bugs are design bugs."],
              ["web-developer", "HTML/CSS/JS/React frontend work", "Knows the site stack, accessibility requirements, and performance patterns."],
              ["content-writer", "Case studies, READMEs, portfolio copy", "Writes in a specific voice: direct, technical, not corporate."],
              ["data-pipeline", "ETL, API integrations, data pipelines", "Handles fetch/transform/store with proper error handling and scheduling."],
              ["python-reviewer", "Python code review", "Checks types, patterns, security, testing. Structured severity output."],
              ["code-reviewer", "General code review (any language)", "Same rigor as the Python reviewer, adapted per file type."],
              ["plan-judge", "Independent plan review", "Scores a draft plan against a fixed rubric and finds the methodology gaps the author can't see, because it never wrote the plan."]
            ]
          },
          { type: "callout", value: "Agents can be chained: planner designs the approach, web-developer builds it, code-reviewer validates it, content-writer documents it. Each step uses the right specialist." }
        ]
      },
      {
        heading: "The Skills",
        content: [
          { type: "text", value: "Skills are guided workflows invoked with /skill-name. They codify processes that would otherwise require remembering a checklist every time. These are six of the fourteen, the ones I reach for most." },
          { type: "table", headers: ["Skill", "What It Does", "Key Design Choice"],
            rows: [
              ["/systematic-debugging", "4-phase: Reproduce, Isolate, Root-Cause, Fix", "No jumping to fixes before understanding the bug"],
              ["/verification-loop", "Pre-commit: lint, type-check, test, security", "Multiple modes (full, quick, security) for different contexts"],
              ["/bootstrap-python-project", "Scaffold project with full tooling", "One command for pyproject.toml, ruff, mypy, pytest, pre-commit"],
              ["/qa-validate", "End-to-end functional QA", "Checks features work, not just that code lints"],
              ["/create", "Scaffold new agents, skills, or rules", "The workspace builds its own tooling"],
              ["/improve-plan", "Independent judge scores a plan, then revises it", "Catches methodology footguns — leaked backtests, wrong metrics — that pass a structural read"]
            ]
          }
        ]
      },
      {
        heading: "The Rules",
        content: [
          { type: "text", value: "Rules apply automatically to files matching their glob pattern. No invocation needed — they're the coding standards every agent and skill follows." },
          { type: "table", headers: ["Rule", "Scope", "What It Enforces"],
            rows: [
              ["workflow-orchestration", "All files", "Plan before building, verify before committing, capture lessons"],
              ["git-workflow", "All files", "Conventional commits, branch naming, PR templates"],
              ["python-style", "**/*.py", "Type hints, ruff, pathlib, dataclasses over bare dicts"],
              ["sql-style", "**/*.sql", "CTEs over subqueries, explicit JOINs, named conventions"],
              ["writing-style", "**/*.md, **/*.txt", "Voice, tone, AI trope avoidance, content patterns"],
              ["mechanical-gates", "All files", "Every repo enforces lint, type-check, and tests as CI and hooks, not optional skills"]
            ]
          }
        ]
      },
      {
        heading: "Enforced Quality Gates",
        content: [
          { type: "text", value: "A skill like /verification-loop only helps if you remember to run it. A check you have to invoke is a check you will skip the moment you are in a hurry, and the repo quietly accumulates lint warnings, type errors, and broken tests. So the standards the rules define are also enforced mechanically: every project repo gets lint, type-check, and tests that run on their own and block the change when they fail." },
          { type: "text", value: "Two layers do the enforcing. Pre-commit hooks run on each commit locally. GitHub Actions runs the same checks on every push and pull request. Both call the repo's make check, so there is one definition of passing and no way to route around it." },
          { type: "table", headers: ["Artifact", "What it does"],
            rows: [
              ["mechanical-gates rule", "States the standard: every repo enforces lint, type-check, and tests on every change, with the checks living in CI and hooks rather than skills you remember to run."],
              ["/add-gates skill", "Installs the enforcement into a target repo. It reads the existing tooling and writes the GitHub Actions workflow plus the pre-commit wiring, invoking the repo's own make check instead of duplicating the logic."],
              ["analytics-agent CI", "Runs the full test pyramid on every push and pull request. A green run is required before a change can merge."]
            ]
          },
          { type: "callout", value: "The workspace holds itself to the standard it sets. Whether a repo passes no longer depends on anyone remembering to check." }
        ]
      },
      {
        heading: "Pressure-Tested Plans",
        content: [
          { type: "text", value: "Planning catches design bugs, but only the ones the author can see. A plan can read as solid and still hide a methodology problem that surfaces mid-build: a backtest that leaks future data, or a metric that doesn't fit the decision. The /improve-plan skill moves that catch earlier, to before any code runs." },
          { type: "text", value: "It works by separating the author from the critic. After the planner drafts a plan, a separate plan-judge agent scores it against a fixed rubric. The judge never saw the plan get written, so it reads the plan the way the engineer who has to execute it will: cold. It is told to become the right expert for the plan's domain and reason from first principles rather than run down a checklist, because the most expensive footgun is usually the one no checklist anticipated. The plan is then revised from the judge's specific critiques rather than its score, so the fix addresses substance instead of gaming a number." },
          { type: "callout", value: "Tested on a forecasting plan with planted methodology holes, the judge caught all of them cold: full-dataset leakage, shuffled cross-validation on time series, and MAPE on intermittent demand. It also flagged deeper problems no one planted, like training on stockout-censored demand. The revise pass took the plan from 28 to 74 out of 100." }
        ]
      },
      {
        heading: "Design Philosophy",
        content: [
          { type: "text", value: "Five principles shaped this setup:" },
          { type: "bullets", items: [
            "Plan before building. The planner agent exists because thinking is cheaper than refactoring.",
            "Separate concerns. The web-developer doesn't review Python. The python-reviewer doesn't write copy. Specialization keeps instructions focused.",
            "Verify before shipping. /verification-loop runs before every significant commit, so quality doesn't depend on remembering a checklist.",
            "The workspace improves itself. When a task reveals a missing capability, /create scaffolds a new agent, skill, or rule.",
            "Elegance over cleverness. Simple solutions with fewer moving parts. If code needs a comment to explain why it works, simplify the code."
          ]}
        ]
      },
      {
        heading: "How It Was Built",
        content: [
          { type: "text", value: "The workspace started as a CLAUDE.md file and a single planner agent. Each project revealed gaps: a missing reviewer, an undocumented workflow, a quality check I kept forgetting. The /create skill was built to formalize that feedback loop: use the workspace, find a gap, scaffold the fix." },
          { type: "bullets", items: [
            "Started with planner + CLAUDE.md routing table during the first portfolio project",
            "Added python-reviewer and code-reviewer after catching the same issues repeatedly in manual review",
            "Built /verification-loop after a commit introduced a type error that lint would have caught",
            "Added content-writer when case study writing became a recurring task with consistent voice requirements",
            "Built /create so the workspace could grow from use without manual file scaffolding",
            "Published as a public repo after 5 projects proved the system works"
          ]},
          { type: "callout", value: "Every agent, skill, and rule exists because a real project needed it." }
        ]
      }
    ]
  },
];

export const personalInfo = {
  name: "Sean Murphy",
  title: "Analytics + AI Systems Builder",
  headline: "I lead data teams and build the AI systems that multiply them.",
  subtext: "Analytics director and AI systems builder. I design the infrastructure that lets a small data team operate like a large one.",
  about: [
    "I've directed analytics teams of 5-15 across e-commerce, retail, and SaaS. The pattern was always the same: talented people burning hours on routine SQL, pipeline debugging, and Monday morning report formatting. The strategic work got whatever time was left.",
    "Now I build the systems that change that ratio. Multi-agent architectures where specialized AI agents handle data profiling, SQL generation, visualization, and report writing — so analysts focus on the questions that actually matter.",
    "One analytics engineer paired with the right agent infrastructure should produce the output of a full team. That's what I'm building toward — and proving — with every project here."
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/seanmurphy2014/",
    github: "https://github.com/smurphy6492",
    email: "smurphy1357@gmail.com"
  }
};
