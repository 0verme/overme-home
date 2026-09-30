import type { Project } from "../types/projects"

export const PROJECTS: Project[] = [
  {
    id: "lakehouse-toolkit",
    title: "Lakehouse Toolkit",
    description:
      "面向湖仓与数据开发的工具集，处理 SQL 审计、任务依赖和数据血缘。",
    category: "Data engineering",
    status: "Open Source",
    link: "https://github.com/0verme/lakehouse-toolkit",
    skills: ["Python", "SQL", "Data lineage"],
  },
  {
    id: "schemaseed",
    title: "SchemaSeed",
    description: "从表结构生成可重复的合成测试数据，并在 DBX 中预览与导出。",
    category: "DBX plugin",
    status: "Open Source",
    link: "https://github.com/0verme/dbx-plugin-SchemaSeed",
    skills: ["DBX", "Synthetic data", "Deterministic generation"],
  },
  {
    id: "plan-detective",
    title: "Plan Detective",
    description:
      "解析数据库的预估执行计划，提示扫描、Join 与排序等值得检查的热点。",
    category: "DBX plugin",
    status: "Open Source",
    link: "https://github.com/0verme/dbx-plugin-plan-detective",
    skills: ["DBX", "Estimated plans", "PostgreSQL"],
  },
  {
    id: "sql-sb",
    title: "sql.sb",
    description: "以交互实验讲解数据建模、指标、调度与血缘等数仓工程问题。",
    category: "Knowledge product",
    status: "Independent",
    link: "https://sql.sb",
    skills: ["Data modeling", "Metrics", "Interactive learning"],
  },
  {
    id: "lineage-viewer",
    title: "lineage-viewer",
    description: "轻量 Web Component，用来嵌入并交互查看表级、字段级数据血缘。",
    category: "Web Component",
    status: "Open Source",
    link: "https://lineage.overme.cn",
    skills: ["TypeScript", "Web Component", "SVG"],
  },
  {
    id: "larkledger",
    title: "LarkLedger",
    description:
      "将自然语言记账请求转为经过校验的动作，并交给确定性账本逻辑处理。",
    category: "Personal finance",
    status: "Open Source",
    link: "https://github.com/0verme/LarkLedger",
    skills: ["Python", "FastAPI", "PostgreSQL"],
  },
]
