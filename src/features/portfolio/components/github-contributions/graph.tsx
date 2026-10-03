"use client"

import { LoaderIcon } from "lucide-react"

import { formatDate, type Locale } from "@/lib/i18n"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Activity } from "@/registry/components/contribution-graph"
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/registry/components/contribution-graph"
import { SOCIAL } from "@/features/portfolio/data/social-links"

export function GitHubContributionGraph({
  contributions: data,
  locale = "zh",
}: {
  contributions: Activity[]
  locale?: Locale
}) {
  if (data.length === 0) {
    return null
  }

  return (
    <figure>
      <ContributionGraph
        className="mx-auto gap-4 py-4"
        data={data}
        blockSize={12}
        blockMargin={2}
        blockRadius={0}
        labels={
          locale === "zh"
            ? {
                months: Array.from(
                  { length: 12 },
                  (_, index) => `${index + 1}月`
                ),
                weekdays: ["日", "一", "二", "三", "四", "五", "六"],
                legend: { less: "少", more: "多" },
              }
            : undefined
        }
        aria-label={
          locale === "zh" ? "GitHub 贡献图" : "GitHub contributions graph"
        }
      >
        <ContributionGraphCalendar
          className="px-4 **:data-[slot=month-labels]:text-muted-foreground"
          title={locale === "zh" ? "GitHub 贡献记录" : "GitHub contributions"}
          aria-hidden
        >
          {({ activity, dayIndex, weekIndex }) => (
            <Tooltip>
              <TooltipTrigger
                render={
                  <g>
                    <ContributionGraphBlock
                      activity={activity}
                      dayIndex={dayIndex}
                      weekIndex={weekIndex}
                    />
                  </g>
                }
              />
              <TooltipContent className="font-sans">
                <p>
                  {locale === "zh"
                    ? `${formatDate(activity.date, locale)}：${activity.count} 次贡献`
                    : `${activity.count} contribution${activity.count === 1 ? "" : "s"} on ${formatDate(activity.date, locale)}`}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </ContributionGraphCalendar>

        <ContributionGraphFooter className="px-4 text-sm">
          <ContributionGraphTotalCount>
            {({ totalCount }) => (
              <figcaption className="text-pretty tabular-nums">
                <span className="mr-2 tracking-wide text-muted-foreground/80">
                  {locale === "zh" ? "图 2." : "Fig. 2."}
                </span>
                {totalCount.toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}
                {locale === "zh" ? " 次贡献，" : " contributions, "}
                {formatDate(data[0].date, locale)} –{" "}
                {formatDate(data[data.length - 1].date, locale)}.
                {locale === "zh" ? " 来源：" : " Source: "}
                <a
                  href={SOCIAL.github.href}
                  className="link-underline"
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </a>
                .
              </figcaption>
            )}
          </ContributionGraphTotalCount>

          <ContributionGraphLegend aria-hidden />
        </ContributionGraphFooter>
      </ContributionGraph>
    </figure>
  )
}

export function GitHubContributionFallback({
  locale = "zh",
}: {
  locale?: Locale
}) {
  return (
    <div
      className="flex h-45 w-full items-center justify-center"
      role="status"
      aria-label={
        locale === "zh" ? "正在加载贡献记录" : "Loading contributions"
      }
    >
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  )
}
