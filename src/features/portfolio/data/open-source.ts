import type { Locale } from "@/lib/i18n"

type FeaturedOpenSourceRepo = {
  repo: string
  name: string
  description: Record<Locale, string>
}

export const FEATURED_OPEN_SOURCE_REPOS = [
  {
    repo: "t8y2/dbx",
    name: "DBX",
    description: {
      zh: "插件系统 · Host API · Workbench · 稳定性",
      en: "Plugin system · Host API · Workbench · Reliability",
    },
  },
] as const satisfies readonly FeaturedOpenSourceRepo[]
