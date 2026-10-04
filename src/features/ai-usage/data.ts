import { z } from "zod"

export const USAGE_API =
  "https://token.overme.cn/api/v1/public/overview?range=30d"
export const USAGE_SOURCE = "https://token.overme.cn/"

const metric = z
  .number()
  .finite()
  .nonnegative()
  .nullish()
  .transform((value) => value ?? null)
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`)
    return (
      Number.isFinite(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    )
  })
const daySchema = z.object({
  usageDate: date,
  totalTokens: metric,
  inputTokens: metric,
  cachedInputTokens: metric,
  cacheWriteTokens: metric,
  outputTokens: metric,
  reasoningOutputTokens: metric,
})
const shareSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  totalTokens: metric,
  estimatedCostUsd: metric,
})
const overviewSchema = z.object({
  ok: z.literal(true),
  totalDays: metric,
  activeDays: metric,
  totalSessions: metric,
  totalCostUsd: metric,
  averageDailyCostUsd: metric,
  tokenComposition: z.array(daySchema).nullish(),
  modelCostShare: z.array(shareSchema).nullish(),
  interactionMetrics: z.object({ userMessageCount: metric }).nullish(),
  filters: z
    .object({
      options: z
        .object({ providers: z.array(shareSchema).nullish() })
        .nullish(),
    })
    .nullish(),
})

export type UsageDay = z.infer<typeof daySchema>
export type UsageShare = {
  name: string
  amount: number | null
  percent: number | null
}

function sum(values: (number | null)[]): number | null {
  if (!values.length || values.some((value) => value === null)) return null
  return values.reduce<number>((total, value) => total + (value ?? 0), 0)
}

export function shares(
  items: { name: string; amount: number | null }[]
): UsageShare[] {
  const total = sum(items.map((item) => item.amount))
  return items
    .map((item) => ({
      ...item,
      percent:
        total !== null && total > 0 && item.amount !== null
          ? (item.amount / total) * 100
          : null,
    }))
    .sort(
      (a, b) =>
        (b.amount ?? -1) - (a.amount ?? -1) || a.name.localeCompare(b.name)
    )
}

export function parseUsage(value: unknown) {
  // Strip unrelated public API fields before passing anything to the page.
  const raw = overviewSchema.parse(value)
  const days =
    raw.tokenComposition?.toSorted((a, b) =>
      a.usageDate.localeCompare(b.usageDate)
    ) ?? null
  if (days && new Set(days.map((day) => day.usageDate)).size !== days.length) {
    throw new Error("Duplicate usage dates")
  }
  const total = (key: keyof Omit<UsageDay, "usageDate">) =>
    sum((days ?? []).map((day) => day[key]))
  const input = total("inputTokens")
  const cached = total("cachedInputTokens")
  const output = total("outputTokens")
  const reasoning = total("reasoningOutputTokens")
  const denominator = input !== null && cached !== null ? input + cached : null
  return {
    days,
    stats: {
      totalCost: raw.totalCostUsd,
      totalTokens: total("totalTokens"),
      inputTokens: input,
      outputTokens:
        output !== null && reasoning !== null ? output + reasoning : null,
      cachedTokens: cached,
      activeDays: raw.activeDays,
      totalDays: raw.totalDays,
      sessions: raw.totalSessions,
      messages: raw.interactionMetrics?.userMessageCount ?? null,
      dailyCost: raw.averageDailyCostUsd,
      cacheRate:
        denominator !== null && denominator > 0 && cached !== null
          ? (cached / denominator) * 100
          : null,
    },
    models: raw.modelCostShare
      ? shares(
          raw.modelCostShare.map((item) => ({
            name: item.label,
            amount: item.totalTokens,
          }))
        )
      : null,
    providers: raw.filters?.options?.providers
      ? shares(
          raw.filters.options.providers.map((item) => ({
            name: item.label,
            amount: item.estimatedCostUsd,
          }))
        )
      : null,
  }
}

export type UsageReport = ReturnType<typeof parseUsage>
export type UsageResult =
  | { status: "ready" | "empty"; report: UsageReport }
  | { status: "unavailable" }

export async function loadUsage(
  fetcher: typeof fetch = fetch
): Promise<UsageResult> {
  try {
    const response = await fetcher(USAGE_API, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/json" },
    })
    if (
      !response.ok ||
      !response.headers.get("content-type")?.includes("application/json")
    ) {
      return { status: "unavailable" }
    }
    const report = parseUsage(await response.json())
    const empty =
      report.days?.length === 0 &&
      report.models?.length === 0 &&
      report.stats.activeDays === 0
    return { status: empty ? "empty" : "ready", report }
  } catch {
    return { status: "unavailable" }
  }
}
