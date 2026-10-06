# Homepage open-source stats

The homepage's featured repository list is curated in `src/features/portfolio/data/open-source.ts`. Add a repository there only when it is intentionally featured; the current confirmed entry is `t8y2/dbx`. Generated counts are kept separately in `src/features/portfolio/data/generated/open-source-stats.json`.

The `Refresh open-source stats` GitHub Actions workflow runs daily at 04:17 UTC and can also be started with **Actions → Refresh open-source stats → Run workflow** on `main`. It uses the Actions-provided `GITHUB_TOKEN` to query GitHub's public REST API; no PAT is required. It commits the generated JSON only when a displayed count bucket changes. To refresh locally, install Bun and run `pnpm open-source:refresh` (unauthenticated public API access is sufficient for a manual refresh).

The snapshot stores exact values, but is intentionally updated only when the formatted homepage values change. If an API request times out, is rate-limited, returns an error, or produces incomplete results, the script leaves the previous snapshot untouched. The homepage reads only this static JSON and never calls GitHub from the browser. If no successful snapshot exists yet, repository links and descriptions still render while dynamic counts stay hidden.

A successful scheduled update pushes to `main`; the Actions token needs write access and repository rules must permit that bot push. Production reflects the update when the existing deployment integration builds `main`. The repository workflow itself validates and publishes a standalone build artifact but does not deploy the site.
