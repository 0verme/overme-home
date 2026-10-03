import { Suspense } from "react"

import type { Locale } from "@/lib/i18n"
import type { Activity } from "@/registry/components/contribution-graph"
import { getGitHubContributions } from "@/features/portfolio/data/github-contributions"

import { Panel } from "../panel"
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph"

const PANEL_CLASS = "screen-line-top-border"

export function GitHubContributions({ locale = "zh" }: { locale?: Locale }) {
  const contributions = getGitHubContributions()

  return (
    <Suspense fallback={<ContributionFallbackPanel locale={locale} />}>
      <ResolvedGitHubContributions
        contributions={contributions}
        locale={locale}
      />
    </Suspense>
  )
}

async function ResolvedGitHubContributions({
  contributions,
  locale,
}: {
  contributions: Promise<Activity[]>
  locale: Locale
}) {
  let data: Activity[]

  try {
    data = await contributions
  } catch {
    return null
  }

  if (data.length === 0) return null

  return (
    <Panel className={PANEL_CLASS}>
      <h2 className="sr-only">
        {locale === "zh" ? "GitHub 贡献记录" : "GitHub contributions"}
      </h2>
      <GitHubContributionGraph contributions={data} locale={locale} />
    </Panel>
  )
}

function ContributionFallbackPanel({ locale }: { locale: Locale }) {
  return (
    <Panel className={PANEL_CLASS}>
      <h2 className="sr-only">
        {locale === "zh" ? "GitHub 贡献记录" : "GitHub contributions"}
      </h2>
      <GitHubContributionFallback locale={locale} />
    </Panel>
  )
}
