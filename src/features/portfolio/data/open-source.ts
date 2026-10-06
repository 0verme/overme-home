import type { Locale } from "@/lib/i18n"

type OpenSourceRepoMetadata = {
  name?: string
  description?: Record<Locale, string>
}

export const OPEN_SOURCE_REPO_METADATA: Readonly<
  Record<string, OpenSourceRepoMetadata>
> = {
  "t8y2/dbx": {
    name: "DBX",
    description: {
      zh: "插件系统 · Host API · Workbench · 稳定性",
      en: "Plugin system · Host API · Workbench · Reliability",
    },
  },
}

export const EXCLUDED_OPEN_SOURCE_REPOS: readonly string[] = []
