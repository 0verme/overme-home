import { ArrowUpRightIcon, GitMergeIcon } from "lucide-react"

import type { Locale } from "@/lib/i18n"
import { OPEN_SOURCE_CONTRIBUTIONS } from "@/features/portfolio/data/open-source"

import { GitHubContributions } from "./github-contributions"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

export function OpenSource({ locale }: { locale: Locale }) {
  return (
    <>
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
              ? "参与 DBX 的插件与工作台交互改进，以下改动已合并。"
              : "Contributing improvements to DBX plugin and workbench interactions. These pull requests have been merged."}
          </p>
          <ul className="divide-y divide-dashed divide-line">
            {OPEN_SOURCE_CONTRIBUTIONS.map((contribution) => (
              <li key={contribution.number}>
                <a
                  className="flex items-start gap-3 py-3 text-sm transition-colors hover:text-muted-foreground"
                  href={contribution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitMergeIcon
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 leading-relaxed">
                    {contribution.title[locale]}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground">
                    #{contribution.number}
                    <ArrowUpRightIcon className="size-3.5" aria-hidden />
                  </span>
                  <span className="sr-only">
                    {locale === "zh" ? "已合并" : "Merged"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </PanelContent>
      </Panel>
      <GitHubContributions locale={locale} />
    </>
  )
}
