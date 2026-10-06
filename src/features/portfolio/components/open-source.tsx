import { ArrowUpRightIcon } from "lucide-react"

import type { Locale } from "@/lib/i18n"
import generatedStats from "@/features/portfolio/data/generated/open-source-stats.json"
import { FEATURED_OPEN_SOURCE_REPOS } from "@/features/portfolio/data/open-source"
import {
  formatPullRequestCount,
  formatStarCount,
  type OpenSourceStatsSnapshot,
} from "@/features/portfolio/data/open-source-stats"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const OPEN_SOURCE_STATS = generatedStats as OpenSourceStatsSnapshot

export function OpenSource({ locale }: { locale: Locale }) {
  const statsByRepo = new Map(
    OPEN_SOURCE_STATS.featuredRepos.map((stats) => [stats.repo, stats])
  )

  return (
    <Panel id="open-source">
      <PanelHeader>
        <PanelTitle>
          <a href="#open-source">
            {locale === "zh" ? "开源贡献" : "Open-source contributions"}
          </a>
          <PanelTitleCopy id="open-source" locale={locale} />
        </PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-4">
        <p className="text-sm/relaxed text-muted-foreground">
          {locale === "zh"
            ? "持续参与数据库工具与开发者工具开源生态。"
            : "Ongoing contributions to open-source database and developer tools."}
        </p>
        <ul className="divide-y divide-dashed divide-line border-y border-dashed border-line">
          {FEATURED_OPEN_SOURCE_REPOS.map((repo) => {
            const stats = statsByRepo.get(repo.repo)

            return (
              <li key={repo.repo} className="py-4">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <a
                    className="inline-flex w-fit items-center gap-1.5 font-heading text-base font-medium transition-colors hover:text-muted-foreground"
                    href={`https://github.com/${repo.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.name}
                    <ArrowUpRightIcon
                      className="size-3.5 text-muted-foreground"
                      aria-hidden
                    />
                  </a>
                  {stats ? (
                    <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-muted-foreground tabular-nums">
                      <span>{formatStarCount(stats.stars)} Stars</span>
                      <span aria-hidden>·</span>
                      <span>
                        {formatPullRequestCount(stats.mergedPrs)}{" "}
                        {locale === "zh" ? "已合并 PR" : "merged PRs"}
                      </span>
                    </p>
                  ) : null}
                </div>
                <p className="mt-1 text-sm/relaxed text-muted-foreground">
                  {repo.description[locale]}
                </p>
              </li>
            )
          })}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {OPEN_SOURCE_STATS.global ? (
            <p className="text-sm text-muted-foreground">
              {formatPullRequestCount(OPEN_SOURCE_STATS.global.submittedPrs)}
              {locale === "zh" ? " 个 PR 已提交 · " : " PRs submitted · "}
              <strong className="font-medium text-foreground">
                {formatPullRequestCount(OPEN_SOURCE_STATS.global.mergedPrs)}
                {locale === "zh" ? " 个已合并" : " merged"}
              </strong>
            </p>
          ) : null}
          <a
            className="inline-flex w-fit items-center gap-1.5 text-sm transition-colors hover:text-muted-foreground"
            href="https://github.com/0verme"
            target="_blank"
            rel="noopener noreferrer"
          >
            {locale === "zh" ? "查看 GitHub" : "View GitHub"}
            <ArrowUpRightIcon className="size-3.5" aria-hidden />
          </a>
        </div>
      </PanelContent>
    </Panel>
  )
}
