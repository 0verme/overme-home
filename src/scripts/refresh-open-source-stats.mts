import { readFile, rename, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { EXCLUDED_OPEN_SOURCE_REPOS } from "../features/portfolio/data/open-source"
import {
  EMPTY_OPEN_SOURCE_STATS,
  fetchOpenSourceStats,
  refreshOpenSourceStats,
  type OpenSourceStatsSnapshot,
} from "../features/portfolio/data/open-source-stats"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const snapshotPath = resolve(
  projectRoot,
  "src/features/portfolio/data/generated/open-source-stats.json"
)

async function readSnapshot(): Promise<OpenSourceStatsSnapshot> {
  try {
    const content = await readFile(snapshotPath, "utf8")
    return JSON.parse(content) as OpenSourceStatsSnapshot
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return EMPTY_OPEN_SOURCE_STATS
    }
    throw error
  }
}

const current = await readSnapshot()
const result = await refreshOpenSourceStats(current, () =>
  fetchOpenSourceStats({
    token: process.env.GITHUB_TOKEN,
    excludedRepos: EXCLUDED_OPEN_SOURCE_REPOS,
  })
)

if (result.usedFallback) {
  console.warn(
    "GitHub stats refresh failed; preserving the last successful snapshot.",
    result.error
  )
} else if (!result.changed) {
  console.info(
    "Open-source stats display buckets are unchanged; no update needed."
  )
} else {
  const temporaryPath = `${snapshotPath}.tmp`
  await writeFile(
    temporaryPath,
    `${JSON.stringify(result.snapshot, null, 2)}\n`,
    "utf8"
  )
  await rename(temporaryPath, snapshotPath)
  console.info("Updated the generated open-source stats snapshot.")
}
