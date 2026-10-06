import { describe, expect, it } from "vitest"

import {
  EMPTY_OPEN_SOURCE_STATS,
  fetchOpenSourceStats,
  filterQualifiedOpenSourceRepos,
  formatPullRequestCount,
  formatStarCount,
  getOpenSourceDisplaySignature,
  refreshOpenSourceStats,
  type OpenSourceRepoCandidate,
  type OpenSourceStatsSnapshot,
} from "./open-source-stats"

type TestPullRequest = {
  id: number
  number: number
  repository_url: string
  created_at: string
}

type TestRequestLog = {
  search: URL[]
  repositories: string[]
}

const API_BASE_URL = "https://api.github.com"

function pullRequest(
  id: number,
  repo: string,
  createdAt = "2026-01-01T00:00:00Z"
): TestPullRequest {
  return {
    id,
    number: id,
    repository_url: `${API_BASE_URL}/repos/${repo}`,
    created_at: createdAt,
  }
}

function createFetcher(
  pullRequests: readonly TestPullRequest[],
  starsByRepo: Readonly<Record<string, number>>,
  log: TestRequestLog = { search: [], repositories: [] }
): { fetcher: typeof fetch; log: TestRequestLog } {
  const fetcher: typeof fetch = async (input) => {
    const url = new URL(input.toString())

    if (url.pathname === "/search/issues") {
      log.search.push(url)
      const query = url.searchParams.get("q") ?? ""
      const dateRange = query.match(
        /created:(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})/
      )
      const matches = dateRange
        ? pullRequests.filter((item) => {
            const createdAt = item.created_at.slice(0, 10)
            return createdAt >= dateRange[1]! && createdAt <= dateRange[2]!
          })
        : [...pullRequests]
      const page = Number(url.searchParams.get("page") ?? "1")
      const perPage = Number(url.searchParams.get("per_page") ?? "100")
      const items = matches.slice((page - 1) * perPage, page * perPage)

      return Response.json({
        total_count: matches.length,
        incomplete_results: false,
        items,
      })
    }

    if (url.pathname.startsWith("/repos/")) {
      const repo = decodeURIComponent(url.pathname.slice("/repos/".length))
      log.repositories.push(repo)
      const [owner] = repo.split("/")
      return Response.json({
        owner: { login: owner },
        stargazers_count: starsByRepo[repo.toLowerCase()] ?? 0,
      })
    }

    throw new Error(`Unexpected GitHub API request: ${url}`)
  }

  return { fetcher, log }
}

function candidate(
  repo: string,
  stars: number,
  mergedPrs: number,
  ownerLogin = repo.split("/")[0] ?? "owner"
): OpenSourceRepoCandidate {
  return {
    repo,
    url: `https://github.com/${repo}`,
    ownerLogin,
    stars,
    mergedPrs,
  }
}

function snapshotFromCandidates(
  candidates: readonly OpenSourceRepoCandidate[]
): OpenSourceStatsSnapshot {
  const featuredRepos = filterQualifiedOpenSourceRepos(candidates)

  return {
    generatedAt: "2026-01-01T00:00:00.000Z",
    summary: {
      qualifiedRepoCount: featuredRepos.length,
      mergedPrs: featuredRepos.reduce(
        (total, repo) => total + repo.mergedPrs,
        0
      ),
    },
    featuredRepos,
  }
}

describe("open-source GitHub stats", () => {
  it("automatically discovers repos, aggregates PRs, excludes own repos, and deduplicates repository requests", async () => {
    const pullRequests = [
      pullRequest(1, "t8y2/dbx"),
      pullRequest(2, "t8y2/dbx"),
      pullRequest(3, "t8y2/dbx"),
      pullRequest(4, "owner/alpha"),
      pullRequest(5, "owner/alpha"),
      pullRequest(6, "owner/beta"),
      pullRequest(7, "0verme/overme-home"),
    ]
    const { fetcher, log } = createFetcher(pullRequests, {
      "t8y2/dbx": 24_809,
      "owner/alpha": 1_000,
      "owner/beta": 999,
    })

    const stats = await fetchOpenSourceStats({
      fetcher,
      now: () => new Date("2026-01-02T03:04:05.000Z"),
    })

    expect(stats.featuredRepos).toEqual([
      {
        repo: "t8y2/dbx",
        url: "https://github.com/t8y2/dbx",
        stars: 24_809,
        mergedPrs: 3,
      },
      {
        repo: "owner/alpha",
        url: "https://github.com/owner/alpha",
        stars: 1_000,
        mergedPrs: 2,
      },
    ])
    expect(stats.summary).toEqual({ qualifiedRepoCount: 2, mergedPrs: 5 })
    expect(stats.generatedAt).toBe("2026-01-02T03:04:05.000Z")
    expect(log.repositories.sort()).toEqual([
      "owner/alpha",
      "owner/beta",
      "t8y2/dbx",
    ])
    expect(log.repositories.filter((repo) => repo === "t8y2/dbx")).toHaveLength(
      1
    )
    expect(log.repositories.some((repo) => repo.startsWith("0verme/"))).toBe(
      false
    )
    expect(log.search).toHaveLength(1)
    expect(log.search[0]?.searchParams.get("q")).toBe(
      "author:0verme is:pr is:merged"
    )
  })

  it("paginates merged PR results and counts every PR without per-repository Search requests", async () => {
    const pullRequests = Array.from({ length: 201 }, (_, index) =>
      pullRequest(index + 1, "owner/repo")
    )
    const { fetcher, log } = createFetcher(pullRequests, {
      "owner/repo": 1_284,
    })

    const stats = await fetchOpenSourceStats({ fetcher })

    expect(stats.featuredRepos[0]?.mergedPrs).toBe(201)
    expect(log.search).toHaveLength(3)
    expect(log.search.map((url) => url.searchParams.get("page"))).toEqual([
      "1",
      "2",
      "3",
    ])
    expect(
      log.search.every((url) => url.searchParams.get("per_page") === "100")
    ).toBe(true)
    expect(log.repositories).toEqual(["owner/repo"])
  })

  it("splits searches over the 1,000-result boundary and aggregates each date range", async () => {
    const pullRequests = [
      ...Array.from({ length: 500 }, (_, index) =>
        pullRequest(index + 1, "owner/repo", "2010-01-01T00:00:00Z")
      ),
      ...Array.from({ length: 501 }, (_, index) =>
        pullRequest(index + 501, "owner/repo", "2020-01-01T00:00:00Z")
      ),
    ]
    const { fetcher, log } = createFetcher(pullRequests, {
      "owner/repo": 1_500,
    })

    const stats = await fetchOpenSourceStats({
      fetcher,
      now: () => new Date("2026-10-06T00:00:00.000Z"),
    })

    expect(stats.featuredRepos[0]?.mergedPrs).toBe(1_001)
    expect(
      log.search.some((url) =>
        (url.searchParams.get("q") ?? "").includes("created:")
      )
    ).toBe(true)
    expect(log.repositories).toEqual(["owner/repo"])
  })

  it("fails safely when a single creation day still reaches the Search result limit", async () => {
    const saturatedDay = "2010-01-01"
    const fetcher: typeof fetch = async (input) => {
      const url = new URL(input.toString())
      const query = url.searchParams.get("q") ?? ""
      const range = query.match(
        /created:(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})/
      )
      const containsSaturatedDay =
        !range || (range[1]! <= saturatedDay && range[2]! >= saturatedDay)
      const totalCount = containsSaturatedDay ? 1_000 : 0
      const page = Number(url.searchParams.get("page") ?? "1")
      const items = containsSaturatedDay
        ? Array.from({ length: Math.min(100, totalCount) }, (_, index) =>
            pullRequest(index + 1, "owner/repo", `${saturatedDay}T00:00:00Z`)
          )
        : []

      return Response.json({
        total_count: totalCount,
        incomplete_results: false,
        items: page === 1 ? items : [],
      })
    }

    await expect(
      fetchOpenSourceStats({
        fetcher,
        now: () => new Date("2026-10-06T00:00:00.000Z"),
      })
    ).rejects.toThrow("still reaches the 1000-result boundary")
  })

  it("rejects an incomplete or untrustworthy Search response", async () => {
    const fetcher: typeof fetch = async () =>
      Response.json({
        total_count: 1,
        incomplete_results: true,
        items: [pullRequest(1, "owner/repo")],
      })

    await expect(fetchOpenSourceStats({ fetcher })).rejects.toThrow(
      "incomplete merged PR search results"
    )
  })

  it("does not qualify self-owned repos, 999 stars, or repos without merged PRs", () => {
    expect(
      filterQualifiedOpenSourceRepos([
        candidate("0verme/self", 10_000, 20),
        candidate("owner/owned-by-self", 10_000, 20, "0VERME"),
        candidate("owner/under-threshold", 999, 20),
        candidate("owner/no-merged-prs", 20_000, 0),
      ])
    ).toEqual([])
  })

  it("includes repos at 1,000 stars with at least one merged PR", () => {
    expect(
      filterQualifiedOpenSourceRepos([candidate("owner/threshold", 1_000, 1)])
    ).toEqual([
      {
        repo: "owner/threshold",
        url: "https://github.com/owner/threshold",
        stars: 1_000,
        mergedPrs: 1,
      },
    ])
  })

  it("supports explicit repo exclusions without using them as an allowlist", () => {
    const { fetcher, log } = createFetcher(
      [pullRequest(1, "owner/included"), pullRequest(2, "owner/excluded")],
      { "owner/included": 2_000, "owner/excluded": 3_000 }
    )

    return fetchOpenSourceStats({
      fetcher,
      excludedRepos: ["OWNER/EXCLUDED"],
    }).then((stats) => {
      expect(stats.featuredRepos.map((repo) => repo.repo)).toEqual([
        "owner/included",
      ])
      expect(log.repositories).toEqual(["owner/included"])
    })
  })

  it("sorts by merged PRs, then stars, then repository name", () => {
    const sorted = filterQualifiedOpenSourceRepos([
      candidate("owner/zulu", 5_000, 4),
      candidate("owner/alpha", 5_000, 4),
      candidate("owner/beta", 6_000, 4),
      candidate("owner/deepest", 1_000, 5),
    ])

    expect(sorted.map((repo) => repo.repo)).toEqual([
      "owner/deepest",
      "owner/beta",
      "owner/alpha",
      "owner/zulu",
    ])
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

  it("includes the qualified repo count and merged PR total in the summary", () => {
    const snapshot = snapshotFromCandidates([
      candidate("owner/first", 2_000, 3),
      candidate("owner/second", 1_000, 4),
      candidate("owner/too-small", 999, 200),
    ])

    expect(snapshot.summary).toEqual({ qualifiedRepoCount: 2, mergedPrs: 7 })
  })

  it("changes the display signature when a repo qualifies or falls below 1,000 stars", () => {
    const oneRepo = snapshotFromCandidates([candidate("owner/one", 1_000, 3)])
    const twoRepos = snapshotFromCandidates([
      candidate("owner/one", 1_000, 3),
      candidate("owner/new", 1_001, 1),
    ])
    const repoDropsBelowThreshold = snapshotFromCandidates([
      candidate("owner/one", 999, 3),
    ])

    expect(getOpenSourceDisplaySignature(twoRepos)).not.toBe(
      getOpenSourceDisplaySignature(oneRepo)
    )
    expect(getOpenSourceDisplaySignature(repoDropsBelowThreshold)).not.toBe(
      getOpenSourceDisplaySignature(oneRepo)
    )
  })

  it("only persists an updated snapshot when displayed buckets change", async () => {
    const current: OpenSourceStatsSnapshot = {
      generatedAt: "2026-01-01T00:00:00.000Z",
      summary: { qualifiedRepoCount: 1, mergedPrs: 119 },
      featuredRepos: [
        {
          repo: "t8y2/dbx",
          url: "https://github.com/t8y2/dbx",
          stars: 24_805,
          mergedPrs: 119,
        },
      ],
    }
    const latest = {
      ...current,
      generatedAt: "2026-01-02T00:00:00.000Z",
      summary: { qualifiedRepoCount: 1, mergedPrs: 120 },
      featuredRepos: [
        {
          ...current.featuredRepos[0]!,
          stars: 24_806,
          mergedPrs: 120,
        },
      ],
    }

    const unchanged = await refreshOpenSourceStats(current, async () => latest)
    expect(unchanged.changed).toBe(false)
    expect(unchanged.snapshot).toBe(current)

    const changed = await refreshOpenSourceStats(current, async () => ({
      ...latest,
      summary: { qualifiedRepoCount: 2, mergedPrs: 120 },
    }))
    expect(changed.changed).toBe(true)
    expect(changed.snapshot.summary?.qualifiedRepoCount).toBe(2)
  })

  it("preserves the last successful snapshot when GitHub API requests fail", async () => {
    const current: OpenSourceStatsSnapshot = {
      generatedAt: "2026-01-01T00:00:00.000Z",
      summary: { qualifiedRepoCount: 1, mergedPrs: 90 },
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
    expect(emptyFallback.snapshot.summary).toBeNull()
    expect(emptyFallback.snapshot.featuredRepos).toEqual([])
  })
})
