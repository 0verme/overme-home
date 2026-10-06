import { ArrowUpRightIcon } from "lucide-react"

import type { Locale } from "@/lib/i18n"
import generatedStats from "@/features/portfolio/data/generated/open-source-stats.json"
import { OPEN_SOURCE_REPO_METADATA } from "@/features/portfolio/data/open-source"
import {
  formatPullRequestCount,
  formatStarCount,
  type OpenSourceStatsSnapshot,
} from "@/features/portfolio/data/open-source-stats"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const OPEN_SOURCE_STATS = generatedStats as OpenSourceStatsSnapshot

export function OpenSource({ locale }: { locale: Locale }) {
  const summary = OPEN_SOURCE_STATS.summary

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
          {OPEN_SOURCE_STATS.featuredRepos.map((repo) => {
            const metadata = OPEN_SOURCE_REPO_METADATA[repo.repo]
            const name =
              metadata?.name ?? repo.repo.split("/").at(-1) ?? repo.repo
            const description = metadata?.description?.[locale]

            return (
              <li key={repo.repo} className="py-4">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <a
                    className="inline-flex w-fit items-center gap-1.5 font-heading text-base font-medium transition-colors hover:text-muted-foreground"
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {name}
                    <ArrowUpRightIcon
                      className="size-3.5 text-muted-foreground"
                      aria-hidden
                    />
                  </a>
                  <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-muted-foreground tabular-nums">
                    <span>{formatStarCount(repo.stars)} Stars</span>
                    <span aria-hidden>·</span>
                    <span>
                      {formatPullRequestCount(repo.mergedPrs)}{" "}
                      {locale === "zh"
                        ? "已合并 PR"
                        : repo.mergedPrs === 1
                          ? "merged PR"
                          : "merged PRs"}
                    </span>
                  </p>
                </div>
                {description ? (
                  <p className="mt-1 text-sm/relaxed text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {summary ? (
            <p className="text-sm text-muted-foreground">
              {locale === "zh" ? (
                <>
                  {summary.qualifiedRepoCount} 个 1k+ Stars 开源项目 ·{" "}
                  <strong className="font-medium text-foreground">
                    {formatPullRequestCount(summary.mergedPrs)} 个已合并 PR
                  </strong>
                </>
              ) : (
                <>
                  {summary.qualifiedRepoCount} open-source projects with 1k+
                  Stars ·{" "}
                  <strong className="font-medium text-foreground">
                    {formatPullRequestCount(summary.mergedPrs)}{" "}
                    {summary.mergedPrs === 1 ? "merged PR" : "merged PRs"}
                  </strong>
                </>
              )}
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
