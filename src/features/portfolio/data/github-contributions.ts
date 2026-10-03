import "server-only"

import { unstable_cache } from "next/cache"

import { GITHUB_USERNAME } from "@/config/site"
import type { Activity } from "@/registry/components/contribution-graph"

// A third-party activity service must never hold up the personal homepage.
export const getGitHubContributions = unstable_cache(
  async (): Promise<Activity[]> => {
    const apiUrl = process.env.NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL
    if (!apiUrl) return []
    try {
      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/${GITHUB_USERNAME}?y=last`,
        { signal: AbortSignal.timeout(5000) }
      )
      if (!response.ok) return []
      const data = await response.json()
      if (
        !data ||
        typeof data !== "object" ||
        !("contributions" in data) ||
        !Array.isArray(data.contributions)
      )
        return []
      return data.contributions.filter(
        (item: unknown): item is Activity =>
          !!item &&
          typeof item === "object" &&
          "date" in item &&
          typeof item.date === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
          "count" in item &&
          typeof item.count === "number" &&
          Number.isFinite(item.count) &&
          item.count >= 0 &&
          "level" in item &&
          typeof item.level === "number" &&
          Number.isInteger(item.level) &&
          item.level >= 0 &&
          item.level <= 4
      )
    } catch {
      return []
    }
  },
  ["portfolio-contributions"],
  { revalidate: 86400 }
)
