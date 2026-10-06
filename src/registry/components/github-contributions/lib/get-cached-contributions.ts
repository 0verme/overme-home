import { unstable_cache } from "next/cache"

import type { Activity } from "@/registry/components/contribution-graph"

type GitHubContributionsResponse = {
  contributions: Activity[]
}

export const getCachedContributions = unstable_cache(
  async (username: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL
    if (!apiUrl) return []

    try {
      const res = await fetch(`${apiUrl}/${username}?y=last`, {
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) return []

      const data = (await res.json()) as GitHubContributionsResponse
      return Array.isArray(data.contributions) ? data.contributions : []
    } catch {
      return []
    }
  },
  ["github-contributions"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)
