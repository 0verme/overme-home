import { describe, expect, it } from "vitest"

import {
  EMPTY_OPEN_SOURCE_STATS,
  fetchOpenSourceStats,
  formatPullRequestCount,
  formatStarCount,
  refreshOpenSourceStats,
  type OpenSourceStatsSnapshot,
} from "./open-source-stats"

describe("open-source GitHub stats", () => {
  it("counts only authored PRs and separates merged PRs", async () => {
    const requests: URL[] = []
    const fetcher: typeof fetch = async (input) => {
      const url = new URL(input.toString())
      requests.push(url)

      if (url.pathname === "/search/issues") {
        const query = url.searchParams.get("q") ?? ""
        const repo = query.includes("repo:t8y2/dbx")
        const merged = query.includes("is:merged")
        const total_count = repo ? (merged ? 119 : 123) : merged ? 743 : 758

        return Response.json({ total_count, incomplete_results: false })
      }

      return Response.json({ stargazers_count: 24_805 })
    }

    const stats = await fetchOpenSourceStats([{ repo: "t8y2/dbx" }], {
      fetcher,
      token: "test-token",
      now: () => new Date("2026-01-02T03:04:05.000Z"),
    })

    expect(stats.global).toEqual({ submittedPrs: 758, mergedPrs: 743 })
    expect(stats.featuredRepos).toEqual([
      {
        repo: "t8y2/dbx",
        url: "https://github.com/t8y2/dbx",
        stars: 24_805,
        submittedPrs: 123,
        mergedPrs: 119,
      },
    ])
    expect(stats.generatedAt).toBe("2026-01-02T03:04:05.000Z")

    const searchQueries = requests
      .filter((url) => url.pathname === "/search/issues")
      .map((url) => url.searchParams.get("q") ?? "")
    expect(searchQueries).toHaveLength(4)
    expect(
      searchQueries.every(
        (query) => query.includes("author:0verme") && query.includes("is:pr")
      )
    ).toBe(true)
    expect(
      searchQueries.filter((query) => query.includes("is:merged"))
    ).toHaveLength(2)
    expect(
      requests.every(
        (url) =>
          url.pathname === "/repos/t8y2/dbx" ||
          url.pathname === "/search/issues"
      )
    ).toBe(true)
  })

  it("falls back to unauthenticated public queries when the Actions token is denied", async () => {
    const authenticated: boolean[] = []
    const fetcher: typeof fetch = async (input, init) => {
      const url = new URL(input.toString())
      const hasToken = new Headers(init?.headers).has("Authorization")
      authenticated.push(hasToken)

      if (hasToken) return new Response(null, { status: 403 })
      return url.pathname.startsWith("/search/issues")
        ? Response.json({ total_count: 1, incomplete_results: false })
        : Response.json({ stargazers_count: 1 })
    }

    const stats = await fetchOpenSourceStats([{ repo: "owner/repo" }], {
      fetcher,
      token: "workflow-token",
    })

    expect(stats.global).toEqual({ submittedPrs: 1, mergedPrs: 1 })
    expect(stats.featuredRepos[0]?.stars).toBe(1)
    expect(authenticated).toHaveLength(10)
    expect(authenticated.filter(Boolean)).toHaveLength(5)
  })

  it("loads stars from the repository endpoint", async () => {
    const requests: URL[] = []
    const fetcher: typeof fetch = async (input) => {
      const url = new URL(input.toString())
      requests.push(url)
      return url.pathname.startsWith("/search/issues")
        ? Response.json({ total_count: 1, incomplete_results: false })
        : Response.json({ stargazers_count: 12_843 })
    }

    const stats = await fetchOpenSourceStats([{ repo: "owner/repo" }], {
      fetcher,
    })

    expect(stats.featuredRepos[0]?.stars).toBe(12_843)
    expect(requests.some((url) => url.pathname === "/repos/owner/repo")).toBe(
      true
    )
  })

  it("formats PR counts into stable display buckets", () => {
    const cases: [number, string][] = [
      [0, "0"],
      [9, "9"],
      [10, "10+"],
      [49, "40+"],
      [50, "50+"],
      [99, "90+"],
      [100, "100+"],
      [199, "100+"],
      [200, "200+"],
      [999, "900+"],
      [1_000, "1k+"],
      [24_805, "24k+"],
    ]

    for (const [count, expected] of cases) {
      expect(formatPullRequestCount(count)).toBe(expected)
    }
  })

  it("formats stars separately from exact values", () => {
    expect(formatStarCount(999)).toBe("999")
    expect(formatStarCount(1_284)).toBe("1.2k")
    expect(formatStarCount(9_999)).toBe("9.9k")
    expect(formatStarCount(12_843)).toBe("12k+")
  })

  it("only persists an updated snapshot when displayed buckets change", async () => {
    const current: OpenSourceStatsSnapshot = {
      generatedAt: "2026-01-01T00:00:00.000Z",
      global: { submittedPrs: 758, mergedPrs: 743 },
      featuredRepos: [
        {
          repo: "t8y2/dbx",
          url: "https://github.com/t8y2/dbx",
          stars: 24_805,
          submittedPrs: 123,
          mergedPrs: 119,
        },
      ],
    }
    const latest = {
      ...current,
      generatedAt: "2026-01-02T00:00:00.000Z",
      global: { submittedPrs: 759, mergedPrs: 744 },
      featuredRepos: [
        {
          ...current.featuredRepos[0]!,
          stars: 24_806,
          submittedPrs: 124,
          mergedPrs: 120,
        },
      ],
    }

    const unchanged = await refreshOpenSourceStats(current, async () => latest)
    expect(unchanged.changed).toBe(false)
    expect(unchanged.snapshot).toBe(current)

    const changed = await refreshOpenSourceStats(current, async () => ({
      ...latest,
      global: { submittedPrs: 800, mergedPrs: 743 },
    }))
    expect(changed.changed).toBe(true)
    expect(changed.snapshot.global?.submittedPrs).toBe(800)
  })

  it("preserves the last successful data when GitHub API requests fail", async () => {
    const current: OpenSourceStatsSnapshot = {
      generatedAt: "2026-01-01T00:00:00.000Z",
      global: { submittedPrs: 100, mergedPrs: 90 },
      featuredRepos: [],
    }

    const result = await refreshOpenSourceStats(current, async () => {
      throw new Error("GitHub API timeout")
    })

    expect(result.usedFallback).toBe(true)
    expect(result.changed).toBe(false)
    expect(result.snapshot).toBe(current)
    expect(result.error).toEqual(new Error("GitHub API timeout"))

    const emptyFallback = await refreshOpenSourceStats(
      EMPTY_OPEN_SOURCE_STATS,
      async () => {
        throw new Error("GitHub API unavailable")
      }
    )
    expect(emptyFallback.snapshot.global).toBeNull()
    expect(emptyFallback.snapshot.featuredRepos).toEqual([])
  })
})
