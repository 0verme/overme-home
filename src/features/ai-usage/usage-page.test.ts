import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { UsagePage } from "./usage-page"

afterEach(() => vi.unstubAllGlobals())

describe("AI usage server rendering", () => {
  it.each(["zh", "en"] as const)(
    "renders %s data, an accessible table and every model without private fields",
    async (locale) => {
      const models = Array.from({ length: 12 }, (_, index) => ({
        value: `model-${index}`,
        label: `Model ${index} with a long descriptive name`,
        totalTokens: index,
        estimatedCostUsd: 0,
      }))
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          Response.json({
            ok: true,
            totalDays: 30,
            activeDays: 1,
            totalSessions: 0,
            totalCostUsd: 1,
            averageDailyCostUsd: 1 / 30,
            tokenComposition: [
              {
                usageDate: "2026-10-03",
                totalTokens: 66,
                inputTokens: 20,
                cachedInputTokens: 30,
                cacheWriteTokens: 0,
                outputTokens: 10,
                reasoningOutputTokens: 6,
              },
            ],
            modelCostShare: models,
            interactionMetrics: { userMessageCount: 2 },
            filters: {
              options: {
                providers: [
                  { value: "provider", label: "Provider", estimatedCostUsd: 1 },
                ],
                projects: ["PRIVATE_PROJECT_SENTINEL"],
              },
            },
          })
        )
      )
      const html = renderToStaticMarkup(await UsagePage({ locale }))
      expect(html).toContain(locale === "zh" ? "AI 足迹" : "AI usage")
      expect(html).toContain("<details")
      expect(html).toContain("<table")
      expect(html).toContain('role="button"')
      expect(html).toContain('scope="row"')
      expect(html).toContain("2026-10-03")
      for (const model of models) expect(html).toContain(model.label)
      expect(html).not.toContain("PRIVATE_PROJECT_SENTINEL")
      expect(html).not.toContain("<iframe")
    }
  )

  it("renders a useful page even when the upstream request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")))
    const html = renderToStaticMarkup(await UsagePage({ locale: "zh" }))
    expect(html).toContain("用量数据暂时无法获取")
    expect(html).toContain("公开数据的边界")
    expect(html).toContain("https://token.overme.cn/")
    expect(html).not.toContain("<svg")
    expect(html).not.toContain("USD 0.00")
  })
})
