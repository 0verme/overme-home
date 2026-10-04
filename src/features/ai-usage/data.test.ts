import { afterEach, describe, expect, it, vi } from "vitest"

import { numberLabel } from "./copy"
import { loadUsage, parseUsage, shares, USAGE_API } from "./data"

function overview() {
  return {
    ok: true,
    totalDays: 30,
    activeDays: 2,
    totalSessions: 0,
    totalEvents: 99,
    totalCostUsd: 12,
    averageDailyCostUsd: 0.4,
    tokenComposition: [
      {
        usageDate: "2026-10-03",
        totalTokens: 170,
        inputTokens: 20,
        cachedInputTokens: 100,
        cacheWriteTokens: 10,
        outputTokens: 30,
        reasoningOutputTokens: 10,
      },
      {
        usageDate: "2026-10-02",
        totalTokens: 85,
        inputTokens: 10,
        cachedInputTokens: 50,
        cacheWriteTokens: 5,
        outputTokens: 15,
        reasoningOutputTokens: 5,
      },
    ],
    modelCostShare: [
      { value: "a", label: "A", totalTokens: 85, estimatedCostUsd: 10 },
      { value: "b", label: "B", totalTokens: 170, estimatedCostUsd: 2 },
    ],
    interactionMetrics: { userMessageCount: 4, topTools: ["private tool"] },
    filters: {
      options: {
        providers: [{ value: "p", label: "Provider", estimatedCostUsd: 12 }],
        projects: ["private project"],
        devices: ["private device"],
      },
    },
    sankey: { name: "private project" },
  }
}

afterEach(() => vi.restoreAllMocks())

describe("AI usage projection", () => {
  it("preserves upstream token totals, combines reasoning output, and uses the cache-read denominator", () => {
    const report = parseUsage(overview())
    expect(report.stats).toMatchObject({
      totalTokens: 255,
      inputTokens: 30,
      outputTokens: 60,
      cachedTokens: 150,
      sessions: 0,
      messages: 4,
    })
    expect(report.stats.cacheRate).toBeCloseTo((150 / 180) * 100)
    expect(report.days?.map((day) => day.usageDate)).toEqual([
      "2026-10-02",
      "2026-10-03",
    ])
    expect(report.models?.map((model) => model.name)).toEqual(["B", "A"])
    expect(report.models?.[0].percent).toBeCloseTo((170 / 255) * 100)
    expect(report.providers).toEqual([
      { name: "Provider", amount: 12, percent: 100 },
    ])
  })

  it("never substitutes event counts for missing sessions or incomplete totals", () => {
    const value = overview()
    const withoutSessions = { ...value, totalSessions: undefined }
    const incompleteDay = {
      ...value.tokenComposition[0],
      cachedInputTokens: undefined,
    }
    const report = parseUsage({
      ...withoutSessions,
      tokenComposition: [incompleteDay, value.tokenComposition[1]],
      interactionMetrics: {},
    })
    expect(report.stats.sessions).toBeNull()
    expect(report.stats.messages).toBeNull()
    expect(report.stats.cachedTokens).toBeNull()
    expect(report.stats.cacheRate).toBeNull()
    expect(report.stats.totalTokens).toBe(255)
  })

  it("does not leak project, device, raw model, tool or session details", () => {
    const value = overview()
    const report = parseUsage({ ...value, sessions: ["private session"] })
    const serialized = JSON.stringify(report)
    expect(serialized).not.toMatch(
      /private|sankey|filters|topTools|totalEvents/
    )
    expect(Object.keys(report)).toEqual([
      "days",
      "stats",
      "models",
      "providers",
    ])
  })

  it("keeps undefined denominators distinct from real zero values", () => {
    expect(shares([{ name: "zero", amount: 0 }])).toEqual([
      { name: "zero", amount: 0, percent: null },
    ])
    expect(
      shares([
        { name: "known", amount: 10 },
        { name: "missing", amount: null },
      ]).every((item) => item.percent === null)
    ).toBe(true)
    expect(shares([])).toEqual([])
    expect(numberLabel(0, "zh")).toBe("0")
    expect(numberLabel(null, "zh")).toBe("暂无数据")
    expect(numberLabel(null, "en")).toBe("Unavailable")
  })

  it("does not turn missing collections into zero-use collections", () => {
    const report = parseUsage({ ok: true })
    expect(report.days).toBeNull()
    expect(report.models).toBeNull()
    expect(report.providers).toBeNull()
    expect(report.stats.totalTokens).toBeNull()
  })

  it.each([-1, NaN, Infinity, "100"])(
    "rejects invalid metrics %s",
    (totalCostUsd) => {
      expect(() => parseUsage({ ...overview(), totalCostUsd })).toThrow()
    }
  )

  it("rejects duplicate or impossible dates rather than double counting", () => {
    const value = overview()
    expect(() =>
      parseUsage({
        ...value,
        tokenComposition: [
          value.tokenComposition[0],
          value.tokenComposition[0],
        ],
      })
    ).toThrow()
    expect(() =>
      parseUsage({
        ...value,
        tokenComposition: [
          { ...value.tokenComposition[0], usageDate: "2026-02-30" },
        ],
      })
    ).toThrow()
  })
})

describe("AI usage fetching", () => {
  it("uses only the public endpoint, a five-minute cache and an eight-second timeout", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout")
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json(overview()))
    expect((await loadUsage(fetcher)).status).toBe("ready")
    expect(timeout).toHaveBeenCalledWith(8_000)
    expect(fetcher).toHaveBeenCalledWith(
      USAGE_API,
      expect.objectContaining({
        next: { revalidate: 300 },
        headers: { Accept: "application/json" },
        signal: expect.any(AbortSignal),
      })
    )
  })

  it("distinguishes an empty response from an unavailable service", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        ...overview(),
        activeDays: 0,
        tokenComposition: [],
        modelCostShare: [],
      })
    )
    expect((await loadUsage(fetcher)).status).toBe("empty")
  })

  it.each([
    () => new Response("bad gateway", { status: 502 }),
    () =>
      new Response("<html>not JSON</html>", {
        headers: { "content-type": "text/html" },
      }),
    () =>
      new Response("{bad", { headers: { "content-type": "application/json" } }),
    () => Response.json({ ok: false }),
  ])("degrades safely for an invalid upstream response", async (response) => {
    expect(
      await loadUsage(vi.fn<typeof fetch>().mockResolvedValue(response()))
    ).toEqual({ status: "unavailable" })
  })

  it.each([
    new Error("offline"),
    new DOMException("Request timed out", "TimeoutError"),
  ])("handles transport failure without demo data", async (error) => {
    expect(
      await loadUsage(vi.fn<typeof fetch>().mockRejectedValue(error))
    ).toEqual({ status: "unavailable" })
  })
})
