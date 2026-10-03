import {
  ActivityIcon,
  DatabaseIcon,
  GitBranchIcon,
  LayersIcon,
} from "lucide-react"

import type { Locale } from "@/lib/i18n"

import type { Project } from "../types/projects"

const projects: Record<Locale, Project[]> = {
  zh: [
    {
      id: "data-warehouse-visualized",
      title: "数据仓库图解",
      link: "https://sql.sb/",
      repositoryUrl: "https://github.com/0verme/data-warehouse-visualized",
      demoUrl: "https://sql.sb/",
      summary:
        "通过图解和交互实验，理解数据仓库中的建模、指标、调度、质量与血缘。",
      description:
        "把抽象概念放进可以操作的场景，结合图解、SQL 示例和实验观察，梳理数据如何从来源走向分析。",
      skills: ["TypeScript", "React", "SQL"],
      icon: <LayersIcon />,
    },
    {
      id: "data-asset-portal",
      title: "Data Asset Portal",
      link: "https://data.overme.cn/",
      repositoryUrl: "https://github.com/0verme/data-asset-portal-community",
      demoUrl: "https://data.overme.cn/",
      summary:
        "面向数据仓库团队的轻量资产目录，集中管理表、字段、指标与元数据。",
      description:
        "提供数据资产查询与元数据管理入口，也能浏览导入的血缘快照，帮助团队理解已有的数据结构。",
      skills: ["Python", "FastAPI", "React"],
      icon: <DatabaseIcon />,
    },
    {
      id: "lineage-viewer",
      title: "lineage-viewer",
      link: "https://lineage.overme.cn/",
      repositoryUrl: "https://github.com/0verme/lineage-viewer",
      demoUrl: "https://lineage.overme.cn/",
      summary: "可嵌入任意网页的表级、字段级血缘可视化组件。",
      description:
        "将已有血缘数据呈现为可交互的关系图，使用 Web Components 集成到现有页面。血缘数据由使用方提供。",
      skills: ["TypeScript", "Web Components"],
      icon: <GitBranchIcon />,
    },
    {
      id: "pi-agent-pulse",
      title: "Pi Agent Pulse",
      link: "https://github.com/0verme/pi-agent-pulse",
      repositoryUrl: "https://github.com/0verme/pi-agent-pulse",
      summary: "为 Pi Agent 长任务提供状态观察、疑似停滞提醒和通知。",
      description:
        "在长时间运行的编程任务中观察执行状态，并通过提醒了解何时需要重新关注任务。",
      skills: ["TypeScript", "Pi Agent"],
      icon: <ActivityIcon />,
    },
  ],
  en: [
    {
      id: "data-warehouse-visualized",
      title: "Data Warehouse Visualized",
      link: "https://sql.sb/",
      repositoryUrl: "https://github.com/0verme/data-warehouse-visualized",
      demoUrl: "https://sql.sb/",
      summary:
        "Learn warehouse modeling, metrics, scheduling, quality, and lineage through diagrams and interactive experiments.",
      description:
        "Explore abstract concepts in hands-on scenarios, using diagrams, SQL examples, and experiments to follow data from source to analysis.",
      skills: ["TypeScript", "React", "SQL"],
      icon: <LayersIcon />,
    },
    {
      id: "data-asset-portal",
      title: "Data Asset Portal",
      link: "https://data.overme.cn/",
      repositoryUrl: "https://github.com/0verme/data-asset-portal-community",
      demoUrl: "https://data.overme.cn/",
      summary:
        "A lightweight catalog for warehouse teams to manage tables, fields, metrics, and metadata.",
      description:
        "Browse data assets, manage metadata, and explore imported lineage snapshots to understand existing data structures.",
      skills: ["Python", "FastAPI", "React"],
      icon: <DatabaseIcon />,
    },
    {
      id: "lineage-viewer",
      title: "lineage-viewer",
      link: "https://lineage.overme.cn/",
      repositoryUrl: "https://github.com/0verme/lineage-viewer",
      demoUrl: "https://lineage.overme.cn/",
      summary:
        "An embeddable component for table-level and field-level lineage visualization.",
      description:
        "Turn existing lineage data into an interactive graph and embed it in a web page with Web Components. The host application supplies the lineage data.",
      skills: ["TypeScript", "Web Components"],
      icon: <GitBranchIcon />,
    },
    {
      id: "pi-agent-pulse",
      title: "Pi Agent Pulse",
      link: "https://github.com/0verme/pi-agent-pulse",
      repositoryUrl: "https://github.com/0verme/pi-agent-pulse",
      summary:
        "Status monitoring, possible-stall alerts, and notifications for long-running Pi Agent tasks.",
      description:
        "Follow the progress of long-running coding tasks and get a signal when a task may need your attention again.",
      skills: ["TypeScript", "Pi Agent"],
      icon: <ActivityIcon />,
    },
  ],
}

export function getProjects(locale: Locale = "zh") {
  return projects[locale]
}

export const PROJECTS = projects.zh
