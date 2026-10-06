import { afterEach, describe, expect, it, vi } from "vitest"

import { getCachedContributions } from "./get-cached-contributions"

vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe("cached GitHub contribution data", () => {
  it("renders without a configured activity API", async () => {
    vi.stubEnv("NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL", "")
    const fetcher = vi.fn()
    vi.stubGlobal("fetch", fetcher)

    expect(await getCachedContributions("0verme")).toEqual([])
    expect(fetcher).not.toHaveBeenCalled()
  })

  it("uses a bounded request and falls back when the API fails", async () => {
    vi.stubEnv(
      "NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL",
      "https://activity.example"
    )
    const fetcher = vi.fn().mockRejectedValue(new Error("network unavailable"))
    vi.stubGlobal("fetch", fetcher)

    expect(await getCachedContributions("0verme")).toEqual([])
    expect(fetcher.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal)
  })

  it("ignores failed responses and malformed activity data", async () => {
    vi.stubEnv(
      "NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL",
      "https://activity.example"
    )
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))
    expect(await getCachedContributions("0verme")).toEqual([])

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ contributions: null }),
      })
    )
    expect(await getCachedContributions("0verme")).toEqual([])
  })
})
