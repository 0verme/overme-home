import type { Locale } from "@/lib/i18n"
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"

import { numberLabel, usageCopy } from "./copy"
import { loadUsage, USAGE_SOURCE, type UsageShare } from "./data"
import { UsageChart } from "./usage-chart"

function Section({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <Panel>
      <PanelHeader className="py-4">
        <PanelTitle className="text-xl">{title}</PanelTitle>
        {note && <p className="mt-2 text-sm/6 text-muted-foreground">{note}</p>}
      </PanelHeader>
      {children}
    </Panel>
  )
}

function Stats({
  items,
}: {
  items: { label: string; value: string; full?: string }[]
}) {
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="border-b p-4 odd:border-r sm:border-r sm:nth-[3n]:border-r-0"
        >
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd
            title={item.full}
            className="mt-2 font-mono text-lg tracking-tight wrap-anywhere tabular-nums sm:text-xl"
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Ranking({
  items,
  locale,
  currency = false,
}: {
  items: UsageShare[] | null
  locale: Locale
  currency?: boolean
}) {
  if (!items?.length)
    return (
      <PanelContent className="text-sm text-muted-foreground">
        {usageCopy[locale].missing}
      </PanelContent>
    )
  return (
    <ol className="divide-y">
      {items.map((item, index) => (
        <li key={`${item.name}-${index}`} className="px-4 py-3">
          <div className="flex items-baseline gap-3 text-sm">
            <span className="w-5 shrink-0 font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 wrap-anywhere">{item.name}</span>
            <span className="shrink-0 font-mono text-xs tabular-nums">
              {numberLabel(item.percent, locale, "percent")}
            </span>
          </div>
          <div className="mt-2 ml-8 h-1 bg-muted" aria-hidden>
            <div
              className="h-full bg-foreground/45"
              style={{ width: `${item.percent ?? 0}%` }}
            />
          </div>
          <p className="mt-2 ml-8 font-mono text-xs text-muted-foreground">
            {numberLabel(item.amount, locale, currency ? "usd" : "number")}
            {!currency && item.amount !== null ? " tokens" : ""}
          </p>
        </li>
      ))}
    </ol>
  )
}

export async function UsagePage({ locale }: { locale: Locale }) {
  const t = usageCopy[locale]
  const result = await loadUsage()
  const report = result.status === "unavailable" ? null : result.report
  const s = report?.stats
  const days = report?.days
  const partial =
    report &&
    (Object.values(report.stats).some((value) => value === null) ||
      report.models === null ||
      report.providers === null ||
      report.models?.some((item) => item.amount === null) ||
      report.providers?.some((item) => item.amount === null) ||
      report.days === null ||
      report.days.some((day) => Object.values(day).includes(null)))
  const stat = (
    key: Exclude<keyof NonNullable<typeof s>, "totalDays">,
    kind: "compact" | "usd" | "percent" | "number" = "number"
  ) => ({
    label: t[key],
    value: numberLabel(s?.[key] ?? null, locale, kind),
    full: numberLabel(s?.[key] ?? null, locale),
  })

  return (
    <div className="mx-auto mb-8 md:max-w-3xl">
      <header className="screen-line-bottom border-x px-4 py-10 sm:py-14">
        <p className="mb-4 font-mono text-xs text-muted-foreground">
          {t.eyebrow} / 30D
        </p>
        <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-xl text-sm/7 text-muted-foreground sm:text-base">
          {t.description}
        </p>
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {t.range}
          {days?.length
            ? ` · ${t.dates} ${days[0].usageDate} — ${days[days.length - 1].usageDate}`
            : ""}
        </p>
      </header>
      <div className="stripe-divider border-x" aria-hidden />
      {result.status !== "ready" && (
        <Panel>
          <PanelContent>
            <p role="status" className="text-sm text-muted-foreground">
              {result.status === "empty" ? t.empty : t.unavailable}
            </p>
          </PanelContent>
        </Panel>
      )}
      {partial && result.status === "ready" && (
        <Panel>
          <PanelContent className="text-sm text-muted-foreground">
            {t.partial}
          </PanelContent>
        </Panel>
      )}
      <Section title={t.core}>
        <Stats
          items={[
            stat("totalCost", "usd"),
            stat("totalTokens", "compact"),
            stat("inputTokens", "compact"),
            stat("outputTokens", "compact"),
            stat("cachedTokens", "compact"),
          ]}
        />
      </Section>
      <Section title={t.trend} note={t.trendNote}>
        {days?.length ? (
          <UsageChart days={days} locale={locale} />
        ) : (
          <PanelContent className="py-12 text-center text-sm text-muted-foreground">
            {t.missing}
          </PanelContent>
        )}
      </Section>
      <Section title={t.models} note={t.modelNote}>
        <Ranking items={report?.models ?? null} locale={locale} />
      </Section>
      <Section title={t.providers} note={t.providerNote}>
        <Ranking items={report?.providers ?? null} locale={locale} currency />
      </Section>
      <Section title={t.activity}>
        <Stats
          items={[
            {
              ...stat("activeDays"),
              value: `${numberLabel(s?.activeDays ?? null, locale)} / ${numberLabel(s?.totalDays ?? null, locale)}`,
            },
            stat("sessions"),
            stat("messages"),
            stat("dailyCost", "usd"),
            stat("cacheRate", "percent"),
          ]}
        />
      </Section>
      <div className="stripe-divider border-x" aria-hidden />
      <Section title={t.reading}>
        <PanelContent className="space-y-6 text-sm/7 text-muted-foreground">
          <p>{t.readingText}</p>
          <div>
            <h3 className="mb-2 font-medium text-foreground">{t.privacy}</h3>
            <p>{t.privacyText}</p>
          </div>
          <a
            href={USAGE_SOURCE}
            className="inline-block text-foreground link-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.source} ↗
          </a>
        </PanelContent>
      </Section>
    </div>
  )
}
