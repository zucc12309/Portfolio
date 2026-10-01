export const profile = {
  name: "Priyanshu Patel",
  handle: "priyanshu",
  trajectory: "Business Analyst → Product / AI",
  tagline: "AI Product Builder",
  role: "Associate Manager — Business Analyst",
  company: "Digit Life Insurance",
  building: "AI-native products",
  location: "Bengaluru, India",
  status: "available for interesting opportunities",
  email: "itsmepriyanshu36@gmail.com",
  github: "https://github.com/zucc12309",
  linkedin: "https://www.linkedin.com/in/priyanshupatel/",
  resume: "/cv/priyanshu-patel-business-analyst-cv.pdf",
  summary:
    "I turn business requirements into working systems — API contracts, SQL investigations, validation rules, UAT — and I ship AI-native products on the side.",
};

export const headlineStats = [
  { value: "₹1,500+ Cr", label: "premium portfolio supported" },
  { value: "2L+", label: "monthly transactions" },
  { value: "8", label: "products built" },
  { value: "Tech Titan", label: "award, Digit" },
];

export const systemInfo = {
  rows: [
    { key: "ROLE", value: "Business Analyst / Product Builder" },
    { key: "DOMAIN", value: "Insurance + FinTech" },
    { key: "SPECIALIZATION", value: "Product · APIs · AI · Automation · Analytics" },
    { key: "CURRENT MODE", value: "Building AI-native products" },
    { key: "LOCATION", value: "Bengaluru, India" },
    { key: "STATUS", value: "Available for interesting opportunities" },
  ],
  stack: [
    { group: "Data", items: ["SQL", "PostgreSQL", "SQLite / FTS5", "Power BI"] },
    { group: "Languages", items: ["Python", "TypeScript", "Node.js", "Dart"] },
    { group: "Interfaces", items: ["React", "Next.js", "Flutter"] },
    { group: "Integration", items: ["REST APIs", "MCP", "OAuth / PKCE", "Webhooks"] },
    { group: "AI", items: ["LLMs", "Embeddings", "Agents", "Model routing"] },
    { group: "Delivery", items: ["Jira", "Confluence", "Postman", "Camunda", "Figma"] },
  ],
  education: [
    { title: "MBA — Finance & Business Analytics", where: "NMIMS MPSTME, Mumbai", when: "2025" },
    { title: "B.Tech — Computer Science & Engineering", where: "NMIMS MPSTME, Mumbai", when: "2025" },
  ],
  certifications: [
    "NISM Series VIII — Equity Derivatives",
    "NISM Series XV — Research Analyst",
    "Financial Modelling & Valuation Analyst (FMVA)",
    "Business Process Modelling — LinkedIn",
  ],
  awards: ["Tech Titan Award — Digit Life Insurance", "Finalist — EY Young Leaders Business Case Competition 2024"],
};

export const experience = {
  company: "Digit Life Insurance",
  role: "Associate Manager — Business Analyst",
  period: "Jun 2025 — Present",
  location: "Bengaluru",
  scope: "Group Life products",
  metrics: [
    { value: "₹1,500+ Cr", label: "premium portfolio", note: "Group Life products" },
    { value: "2L+", label: "transactions / month", note: "through the systems I own" },
    { value: "80+", label: "UAT test cases", note: "end-to-end validation" },
    { value: "−40%", label: "post-release defects", note: "after UAT I led" },
    { value: "−30%", label: "manual effort", note: "10+ automated business rules" },
    { value: "+18%", label: "data accuracy", note: "from validation logic" },
  ],
  capabilities: [
    "Policy issuance",
    "Underwriting journeys",
    "API integrations",
    "Production issue resolution",
    "SQL / data investigation",
    "UAT",
    "SDLC",
    "Stakeholder management",
    "Insurance workflows",
  ],
  owned: [
    "End-to-end SDLC for Group Life products in Agile sprints",
    "Policy issuance and underwriting journeys — rules, edge cases, sign-off",
    "UAT strategy, test design and release go / no-go",
    "Production issue triage and RCA with engineering and cloud / infra teams",
    "Priorities across 10–12 cross-functional stakeholders",
    "Regulatory accuracy of customer-facing documents",
  ],
  built: [
    "API contracts — request / response shapes and error handling",
    "Validation logic and 10+ automated business rules",
    "Database schemas and UI workflows aligned to Figma designs",
    "BRDs, SRS and user stories with cross-module impact analysis",
    "SQL investigations into failure patterns and edge cases",
    "Monitoring of API success / failure rates and processing efficiency",
  ],
  impact: [
    "Post-release defects down 40% through 80+ case UAT",
    "Manual effort down 30%, accuracy up 18% via automated rules",
    "Smoother policy issuance from validation built into the flow",
    "Faster production fixes using API logs + database RCA",
    "Recognised with the Tech Titan Award",
  ],
  tools: ["SQL", "PostgreSQL", "DBeaver", "Postman", "REST APIs", "Jira", "Confluence", "Camunda", "Figma", "Excel", "Python"],
};

export const earlierRoles = [
  {
    role: "Finance & Accounting Intern",
    org: "Bharat Heavy Electricals (BHEL)",
    period: "May — Aug 2024",
    points: ["Oracle ERP billing, invoice processing and reconciliation", "Excel MIS dashboards; ~15% better reporting accuracy"],
  },
  {
    role: "Deep Learning Intern",
    org: "MANIT Bhopal",
    period: "May — Jul 2023",
    points: ["CNN-based cancer diagnosis classifier in Python", "~89% diagnostic accuracy after iterative tuning"],
  },
];

export const skillCategories = [
  {
    title: "Product & Analysis",
    skills: ["Requirements gathering", "BRD / SRS", "User stories", "GAP analysis", "Product discovery", "Stakeholder management", "RCA"],
  },
  {
    title: "Technical",
    skills: ["SQL", "PostgreSQL", "Python", "APIs & integrations", "System design", "TypeScript / Node", "Data analysis"],
  },
  {
    title: "AI & Agents",
    skills: ["LLM integration", "MCP servers", "Agentic workflows", "Embeddings & retrieval", "Model routing", "Guardrails & approvals"],
  },
  {
    title: "Delivery & Tools",
    skills: ["Agile / Scrum", "UAT & test cases", "Jira", "Confluence", "Postman", "DBeaver", "Camunda", "Power BI", "Figma", "n8n"],
  },
];

export type LabNode = {
  name: string;
  note?: string;
  tags?: string[];
  href?: string;
  external?: boolean;
  children?: LabNode[];
};

export const labTree: LabNode[] = [
  {
    name: "memory-router/",
    note: "Experiments around local-first memory and routing",
    children: [
      { name: "playground.app", note: "Sandboxed web demo: context summary, optimised prompt, token savings", tags: ["live"], href: "/projects/memory-router/playground" },
      { name: "mycelium-network.py", note: "Associative memory graph with spreading activation for related-memory recall", tags: ["retrieval"], href: "https://github.com/zucc12309/memory-router", external: true },
      { name: "adaptive-routing.py", note: "Router that learns from quality, cost and latency of past outcomes", tags: ["routing"], href: "https://github.com/zucc12309/memory-router", external: true },
    ],
  },
  {
    name: "agents/",
    note: "Giving agents tools — safely",
    children: [
      { name: "splitwise-mcp/", note: "Personal Splitwise MCP server: reads and immutable expense previews; writes need a signed draft", tags: ["mcp", "public"], href: "https://github.com/zucc12309/splitwise-mcp", external: true },
      { name: "agent-gateway/", note: "Approval-gated tool access with a hash-chained audit trail", tags: ["security"], href: "/projects/ai-agent-os" },
      { name: "bull-bear-judge.md", note: "Deterministic debate scaffold for reviewing investment theses", tags: ["fintech"], href: "/projects/ai-hedge-fund" },
    ],
  },
  {
    name: "embeddings/",
    note: "Retrieval that stays small and explainable",
    children: [
      { name: "fact-recall/", note: "FTS5 + 768-dim embeddings, importance-ranked and scenario-scoped for token-efficient prompts", tags: ["sqlite"], href: "/projects/lifepilot" },
      { name: "semantic-dedup.py", note: "Similarity check before storing; merges near-duplicate memories", tags: ["memory"], href: "https://github.com/zucc12309/memory-router", external: true },
    ],
  },
  {
    name: "automation/",
    note: "Removing manual steps from business processes",
    children: [
      { name: "crm-briefing-pipeline/", note: "Gmail export → n8n → Python cleaning → AI briefing → Power BI refresh", tags: ["n8n"], href: "/projects/crm-workflow-automation" },
      { name: "auto-restock-schedules/", note: "Recurring grocery orders with reminders and skip / pause / delay controls", tags: ["telegram"], href: "https://github.com/zucc12309/Swiggy-bot", external: true },
    ],
  },
  {
    name: "commerce-ai/",
    note: "Conversational and agentic commerce",
    children: [
      { name: "swiggy-bot/", note: "Order food and groceries inside Telegram via Swiggy OAuth 2.1 + PKCE", tags: ["public"], href: "https://github.com/zucc12309/Swiggy-bot", external: true },
      { name: "cart-cap-executor.py", note: "Two-stage spend cap around cart updates; clears the cart on breach", tags: ["guardrails"], href: "/projects/lifepilot" },
      { name: "drop-reservation.lua", note: "Atomic stock claim for limited drops in a single Redis call", tags: ["concurrency"], href: "/projects/lecrec" },
    ],
  },
  {
    name: "prototypes/",
    note: "Small builds and explorations",
    children: [
      { name: "premium-ride-ui/", note: "UI exploration for a premium ride-comparison experience", tags: ["design"], href: "https://github.com/zucc12309/Premiumridecomparisonappui", external: true },
      { name: "priyanshu-os/", note: "This site — a desktop shell with terminal, command palette and windows", tags: ["next.js"], href: "https://github.com/zucc12309/Portfolio", external: true },
      { name: "cnn-diagnosis/", note: "Internship project: CNN cancer-diagnosis classifier, ~89% accuracy", tags: ["ml"] },
    ],
  },
];
