import type { Locale } from "@/lib/i18n"

export const usageCopy = {
  zh: {
    title: "AI 足迹",
    eyebrow: "公开用量记录",
    range: "最近 30 天",
    dates: "记录日期",
    description:
      "AI 如何参与我的创作与技术工作：用量、预估费用，以及模型使用的变化。",
    core: "核心数据",
    trend: "Token 趋势",
    models: "模型使用排行",
    providers: "服务商占比",
    activity: "活跃与效率",
    totalCost: "预估费用",
    totalTokens: "总 Token",
    inputTokens: "输入 Token",
    outputTokens: "输出 Token",
    cachedTokens: "缓存读取 Token",
    activeDays: "活跃天数",
    sessions: "会话数",
    messages: "用户消息数",
    dailyCost: "日均预估费用",
    cacheRate: "缓存命中率",
    input: "输入",
    cached: "缓存读取",
    write: "缓存写入",
    output: "输出",
    reasoning: "推理输出",
    total: "总量",
    modelNote: "按已记录 Token 数排序，占比以全部模型的 Token 合计为基准。",
    providerNote: "按预估费用排序，展示各服务商的预估费用占比。",
    trendNote: "按天查看用量与组成。悬停、触摸或聚焦柱形可查看明细。",
    table: "查看每日数据",
    date: "日期",
    missing: "暂无数据",
    empty: "最近 30 天暂无已记录用量。",
    unavailable: "用量数据暂时无法获取，请稍后刷新重试。",
    source: "查看数据源",
    reading: "如何阅读这些数据",
    privacy: "公开数据的边界",
    readingText:
      "Token 来自受支持工具的日志汇总，费用按模型与可用单价估算，以美元显示。日志缺失和价格调整可能带来偏差，适合观察趋势，不作为财务对账依据。输出 Token 包含推理输出；缓存命中率按缓存读取量占输入与缓存读取合计计算。缺失字段显示“暂无数据”，不代表零用量。",
    privacyText:
      "这里只展示模型、服务商、Token、预估费用和活跃度的聚合结果，不展示提示词、回复正文、私有项目名、文件路径、密钥或会话明细。",
    partial: "部分统计字段暂无数据，已保留可用记录。",
  },
  en: {
    title: "AI usage",
    eyebrow: "Public usage journal",
    range: "Last 30 days",
    dates: "Recorded dates",
    description:
      "How AI participates in my creative and technical work: usage, estimated costs, and the models behind it.",
    core: "At a glance",
    trend: "Token trend",
    models: "Model usage",
    providers: "Provider share",
    activity: "Activity and efficiency",
    totalCost: "Estimated cost",
    totalTokens: "Total tokens",
    inputTokens: "Input tokens",
    outputTokens: "Output tokens",
    cachedTokens: "Cache read tokens",
    activeDays: "Active days",
    sessions: "Sessions",
    messages: "User messages",
    dailyCost: "Avg. daily cost",
    cacheRate: "Cache hit rate",
    input: "Input",
    cached: "Cache read",
    write: "Cache write",
    output: "Output",
    reasoning: "Reasoning",
    total: "Total",
    modelNote:
      "Ranked by recorded tokens; shares use the token total across all models.",
    providerNote:
      "Ranked by estimated cost, showing each provider’s share of estimated spending.",
    trendNote:
      "Daily usage and composition. Hover, touch, or focus a bar for details.",
    table: "View daily data",
    date: "Date",
    missing: "Unavailable",
    empty: "No usage recorded in the last 30 days.",
    unavailable: "Usage data is temporarily unavailable. Please refresh later.",
    source: "View data source",
    reading: "Reading these numbers",
    privacy: "What is public",
    readingText:
      "Tokens are aggregated from supported tools’ logs; costs are estimated from recorded models and available prices, in USD. Missing logs and price changes can affect the numbers. Use them to understand trends, not for financial reconciliation. Output tokens include reasoning; cache hit rate is cache reads divided by input plus cache reads. Unavailable fields do not mean zero usage.",
    privacyText:
      "Only aggregate models, providers, tokens, estimated costs, and activity are shown. Prompts, responses, private project names, file paths, keys, and session details are excluded.",
    partial: "Some metrics are unavailable. Available records are shown below.",
  },
} as const

export function numberLabel(
  value: number | null,
  locale: Locale,
  kind: "number" | "compact" | "usd" | "percent" = "number"
) {
  if (value === null) return usageCopy[locale].missing
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
    ...(kind === "usd"
      ? {
          style: "currency",
          currency: "USD",
          currencyDisplay: "code",
          maximumFractionDigits: 2,
        }
      : {}),
    ...(kind === "compact"
      ? { notation: "compact", maximumFractionDigits: 2 }
      : {}),
    ...(kind === "percent"
      ? { style: "percent", maximumFractionDigits: 1 }
      : {}),
  }).format(kind === "percent" ? value / 100 : value)
}
