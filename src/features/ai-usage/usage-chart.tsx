"use client"

import { useEffect, useId, useRef, useState } from "react"
import { scaleBand, scaleLinear } from "@visx/scale"
import { Bar, LinePath } from "@visx/shape"

import type { Locale } from "@/lib/i18n"

import { numberLabel, usageCopy } from "./copy"
import type { UsageDay } from "./data"

const series = [
  { key: "inputTokens", label: "input", color: "var(--usage-input)" },
  { key: "cachedInputTokens", label: "cached", color: "var(--usage-cached)" },
  { key: "cacheWriteTokens", label: "write", color: "var(--usage-write)" },
  { key: "outputTokens", label: "output", color: "var(--usage-output)" },
  {
    key: "reasoningOutputTokens",
    label: "reasoning",
    color: "var(--usage-reasoning)",
  },
] as const

export function UsageChart({
  days,
  locale,
}: {
  days: UsageDay[]
  locale: Locale
}) {
  const t = usageCopy[locale]
  const titleId = useId()
  const container = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(720)
  useEffect(() => {
    if (!container.current) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width)
    })
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])
  const [selected, setSelected] = useState<string | null>(null)
  const active = days.find((day) => day.usageDate === selected) ?? days.at(-1)
  const top = 20
  const bottom = 228
  const x = scaleBand({
    domain: days.map((day) => day.usageDate),
    range: [62, width - 16],
    padding: 0.3,
  })
  const maximum = Math.max(
    1,
    ...days.map((day) =>
      Math.max(
        day.totalTokens ?? 0,
        series.reduce((total, item) => total + (day[item.key] ?? 0), 0)
      )
    )
  )
  const y = scaleLinear({
    domain: [0, maximum],
    range: [bottom, top],
    nice: true,
  })
  const ticks = y.ticks(4)
  const dateTicks = new Set([
    0,
    Math.floor((days.length - 1) / 2),
    days.length - 1,
  ])

  return (
    <figure className="[--usage-cached:#849994] [--usage-input:#586e82] [--usage-output:#a99a7e] [--usage-reasoning:#a18e9f] [--usage-write:#9198ad] dark:[--usage-cached:#8faea5] dark:[--usage-input:#96aec2] dark:[--usage-output:#bfae8d] dark:[--usage-reasoning:#c0a7ba] dark:[--usage-write:#a5adc3]">
      <div ref={container} className="px-2 pt-4 sm:px-4">
        <svg
          viewBox={`0 0 ${width} 270`}
          className="h-67.5 w-full"
          aria-labelledby={titleId}
        >
          <title id={titleId}>{t.trend}</title>
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={62}
                x2={width - 16}
                y1={y(tick)}
                y2={y(tick)}
                stroke="var(--chart-grid)"
              />
              <text
                x={54}
                y={y(tick) + 4}
                textAnchor="end"
                className="fill-muted-foreground font-mono text-[11px]"
              >
                {numberLabel(tick, locale, "compact")}
              </text>
            </g>
          ))}
          {days.map((day, index) => {
            let stacked = 0
            const complete = series.every((item) => day[item.key] !== null)
            return (
              <g key={day.usageDate}>
                {complete &&
                  series.map((item) => {
                    const value = day[item.key] ?? 0
                    const start = stacked
                    stacked += value
                    return (
                      <Bar
                        key={item.key}
                        x={x(day.usageDate)}
                        y={y(stacked)}
                        width={x.bandwidth()}
                        height={y(start) - y(stacked)}
                        fill={item.color}
                        opacity={
                          selected && selected !== day.usageDate ? 0.45 : 1
                        }
                      />
                    )
                  })}
                {dateTicks.has(index) && (
                  <text
                    x={(x(day.usageDate) ?? 0) + x.bandwidth() / 2}
                    y={252}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono text-[12px]"
                  >
                    {day.usageDate.slice(5).replace("-", "/")}
                  </text>
                )}
              </g>
            )
          })}
          <LinePath<UsageDay>
            data={days}
            defined={(day) => day.totalTokens !== null}
            x={(day) => (x(day.usageDate) ?? 0) + x.bandwidth() / 2}
            y={(day) => y(day.totalTokens ?? 0)}
            stroke="var(--foreground)"
            strokeWidth={1.5}
            pointerEvents="none"
          />
          {days.map((day, index) => (
            <rect
              key={day.usageDate}
              x={(x(day.usageDate) ?? 0) - 3}
              y={top}
              width={x.bandwidth() + 6}
              height={bottom - top}
              fill="transparent"
              stroke={selected === day.usageDate ? "var(--foreground)" : "none"}
              strokeWidth={0.8}
              tabIndex={0}
              role="button"
              aria-label={`${day.usageDate}: ${t.total} ${numberLabel(day.totalTokens, locale)}`}
              aria-pressed={selected === day.usageDate}
              onPointerEnter={() => setSelected(day.usageDate)}
              onPointerDown={() => setSelected(day.usageDate)}
              onFocus={() => setSelected(day.usageDate)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  setSelected(day.usageDate)
                }
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault()
                  const next =
                    event.currentTarget.parentElement?.querySelectorAll<SVGRectElement>(
                      "rect[role=button]"
                    )[index + (event.key === "ArrowRight" ? 1 : -1)]
                  next?.focus()
                }
              }}
            />
          ))}
        </svg>
      </div>
      <figcaption className="border-t p-4">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs">
          <span className="text-muted-foreground">{active?.usageDate}</span>
          <span>
            {t.total} · {numberLabel(active?.totalTokens ?? null, locale)}
          </span>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-3">
          {series.map((item) => (
            <div key={item.key}>
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="size-2 shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                {t[item.label]}
              </dt>
              <dd className="mt-1 font-mono tabular-nums">
                {numberLabel(active?.[item.key] ?? null, locale)}
              </dd>
            </div>
          ))}
        </dl>
      </figcaption>
      <details className="border-t">
        <summary className="cursor-pointer px-4 py-3 text-sm text-muted-foreground hover:text-foreground">
          {t.table}
        </summary>
        <div
          className="overflow-x-auto px-4 pb-4"
          tabIndex={0}
          role="region"
          aria-label={t.table}
        >
          <table className="w-full text-left text-xs whitespace-nowrap tabular-nums">
            <caption className="sr-only">{t.trend}</caption>
            <thead>
              <tr>
                {[t.date, t.total, ...series.map((item) => t[item.label])].map(
                  (label) => (
                    <th
                      key={label}
                      scope="col"
                      className="border-b px-3 py-2 font-medium"
                    >
                      {label}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day.usageDate}>
                  <th
                    scope="row"
                    className="border-b px-3 py-2 font-mono font-normal"
                  >
                    {day.usageDate}
                  </th>
                  {[
                    day.totalTokens,
                    ...series.map((item) => day[item.key]),
                  ].map((value, index) => (
                    <td key={index} className="border-b px-3 py-2 font-mono">
                      {numberLabel(value, locale)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
