import {
  BotIcon,
  CloudIcon,
  CodeXmlIcon,
  DatabaseIcon,
  ServerIcon,
} from "lucide-react"

import type { TechStack } from "../types/tech-stack"

export const TECH_STACK: TechStack[] = [
  {
    key: "python",
    title: "Python",
    href: "https://www.python.org/",
    icon: <CodeXmlIcon />,
    categories: ["Data"],
  },
  {
    key: "sql",
    title: "SQL",
    href: "https://www.postgresql.org/docs/current/sql.html",
    icon: <DatabaseIcon />,
    categories: ["Data"],
  },
  {
    key: "postgresql",
    title: "PostgreSQL",
    href: "https://www.postgresql.org/",
    icon: <DatabaseIcon />,
    categories: ["Data"],
  },
  {
    key: "dbx",
    title: "DBX",
    href: "https://github.com/t8y2/dbx",
    icon: <DatabaseIcon />,
    categories: ["Data"],
  },
  {
    key: "typescript",
    title: "TypeScript",
    href: "https://www.typescriptlang.org/",
    icon: <CodeXmlIcon />,
    categories: ["Build"],
  },
  {
    key: "react",
    title: "React",
    href: "https://react.dev/",
    icon: <CodeXmlIcon />,
    categories: ["Build"],
  },
  {
    key: "nextjs",
    title: "Next.js",
    href: "https://nextjs.org/",
    icon: <CodeXmlIcon />,
    categories: ["Build"],
  },
  {
    key: "fastapi",
    title: "FastAPI",
    href: "https://fastapi.tiangolo.com/",
    icon: <CodeXmlIcon />,
    categories: ["Build"],
  },
  {
    key: "llm-apis",
    title: "LLM APIs",
    href: "https://github.com/0verme/LarkLedger",
    icon: <BotIcon />,
    categories: ["AI"],
  },
  {
    key: "docker-compose",
    title: "Docker Compose",
    href: "https://docs.docker.com/compose/",
    icon: <ServerIcon />,
    categories: ["Infrastructure"],
  },
  {
    key: "linux",
    title: "Linux",
    href: "https://www.kernel.org/",
    icon: <ServerIcon />,
    categories: ["Infrastructure"],
  },
  {
    key: "cloudflare-workers",
    title: "Cloudflare Workers",
    href: "https://developers.cloudflare.com/workers/",
    icon: <CloudIcon />,
    categories: ["Infrastructure"],
  },
  {
    key: "github-actions",
    title: "GitHub Actions",
    href: "https://github.com/features/actions",
    icon: <CodeXmlIcon />,
    categories: ["Infrastructure"],
  },
]
