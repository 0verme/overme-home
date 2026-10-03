import { afterEach, describe, expect, it, vi } from "vitest"

import { getGitHubContributions } from "./github-contributions"

vi.mock("server-only", () => ({}))
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe("optional contribution data", () => {
  it("does not require an activity service to render the homepage", async () => {
    vi.stubEnv("NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL", "")
    const fetcher = vi.fn()
    vi.stubGlobal("fetch", fetcher)
    expect(await getGitHubContributions()).toEqual([])
    expect(fetcher).not.toHaveBeenCalled()
  })
  it("uses a bounded request and falls back when the service fails", async () => {
    vi.stubEnv(
      "NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL",
      "https://activity.example"
    )
    const fetcher = vi.fn().mockRejectedValue(new Error("network unavailable"))
    vi.stubGlobal("fetch", fetcher)
    expect(await getGitHubContributions()).toEqual([])
    expect(fetcher.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal)
  })
  it("renders valid activities and ignores malformed upstream entries", async () => {
    vi.stubEnv(
      "NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL",
      "https://activity.example/"
    )
    const activity = { date: "2026-10-03", count: 3, level: 2 }
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          contributions: [null, activity, { date: "invalid", count: -1 }],
        }),
      })
    )
    expect(await getGitHubContributions()).toEqual([activity])
  })
})
