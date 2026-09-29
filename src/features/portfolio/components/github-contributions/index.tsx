import { Suspense } from "react"

import type { Activity } from "@/registry/components/contribution-graph"
import { getGitHubContributions } from "@/features/portfolio/data/github-contributions"

import { Panel } from "../panel"
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph"

const PANEL_CLASS = "screen-line-top-border"

export function GitHubContributions() {
  const contributions = getGitHubContributions()

  return (
    <Suspense fallback={<ContributionFallbackPanel />}>
      <ResolvedGitHubContributions contributions={contributions} />
    </Suspense>
  )
}

async function ResolvedGitHubContributions({
  contributions,
}: {
  contributions: Promise<Activity[]>
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
      <h2 className="sr-only">GitHub contributions</h2>
      <GitHubContributionGraph contributions={data} />
    </Panel>
  )
}

function ContributionFallbackPanel() {
  return (
    <Panel className={PANEL_CLASS}>
      <h2 className="sr-only">GitHub contributions</h2>
      <GitHubContributionFallback />
    </Panel>
  )
}
