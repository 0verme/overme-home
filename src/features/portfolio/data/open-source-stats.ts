export type PullRequestCounts = {
  submittedPrs: number
  mergedPrs: number
}

export type FeaturedRepoStats = {
  repo: string
  url: string
  stars: number
  submittedPrs: number
  mergedPrs: number
}

export type OpenSourceStatsSnapshot = {
  generatedAt: string | null
  global: PullRequestCounts | null
  featuredRepos: FeaturedRepoStats[]
}

type FeaturedRepoConfig = {
  repo: string
}

type RefreshResult = {
  snapshot: OpenSourceStatsSnapshot
  changed: boolean
  usedFallback: boolean
  error?: unknown
}

type GitHubSearchResponse = {
  total_count: number
  incomplete_results?: boolean
}

type GitHubRepositoryResponse = {
  stargazers_count: number
}

const GITHUB_API_BASE_URL = "https://api.github.com"
const GITHUB_API_TIMEOUT_MS = 10_000
const GITHUB_USERNAME = "0verme"

export const EMPTY_OPEN_SOURCE_STATS: OpenSourceStatsSnapshot = {
  generatedAt: null,
  global: null,
  featuredRepos: [],
}

export function formatPullRequestCount(count: number): string {
  if (count < 10) return String(count)
  if (count < 100) return `${Math.floor(count / 10) * 10}+`
  if (count < 1_000) return `${Math.floor(count / 100) * 100}+`
  return `${Math.floor(count / 1_000)}k+`
}

export function formatStarCount(count: number): string {
  if (count < 1_000) return String(count)
  if (count < 10_000) {
    const compact = (Math.floor(count / 100) / 10).toFixed(1)
    return `${compact.replace(/\.0$/, "")}k`
  }
  return `${Math.floor(count / 1_000)}k+`
}

export async function fetchOpenSourceStats(
  featuredRepos: readonly FeaturedRepoConfig[],
  options: {
    fetcher?: typeof fetch
    token?: string
    now?: () => Date
  } = {}
): Promise<OpenSourceStatsSnapshot> {
  const fetcher = options.fetcher ?? fetch
  const [submittedPrs, mergedPrs, repoStats] = await Promise.all([
    fetchPullRequestCount(fetcher, options.token),
    fetchPullRequestCount(fetcher, options.token, undefined, true),
    Promise.all(
      featuredRepos.map(async ({ repo }) => {
        const [repository, submittedPrs, mergedPrs] = await Promise.all([
          fetchGitHubJson<GitHubRepositoryResponse>(
            `${GITHUB_API_BASE_URL}/repos/${repo}`,
            fetcher,
            options.token
          ),
          fetchPullRequestCount(fetcher, options.token, repo),
          fetchPullRequestCount(fetcher, options.token, repo, true),
        ])

        assertCount(repository.stargazers_count, `stars for ${repo}`)

        return {
          repo,
          url: `https://github.com/${repo}`,
          stars: repository.stargazers_count,
          submittedPrs,
          mergedPrs,
        }
      })
    ),
  ])

  return {
    generatedAt: (options.now?.() ?? new Date()).toISOString(),
    global: { submittedPrs, mergedPrs },
    featuredRepos: repoStats,
  }
}

export function getOpenSourceDisplaySignature(
  snapshot: OpenSourceStatsSnapshot
): string {
  return JSON.stringify({
    global: snapshot.global
      ? {
          submitted: formatPullRequestCount(snapshot.global.submittedPrs),
          merged: formatPullRequestCount(snapshot.global.mergedPrs),
        }
      : null,
    featuredRepos: snapshot.featuredRepos.map((repo) => ({
      repo: repo.repo,
      stars: formatStarCount(repo.stars),
      merged: formatPullRequestCount(repo.mergedPrs),
    })),
  })
}

export async function refreshOpenSourceStats(
  current: OpenSourceStatsSnapshot,
  loadLatest: () => Promise<OpenSourceStatsSnapshot>
): Promise<RefreshResult> {
  try {
    const latest = await loadLatest()
    const changed =
      getOpenSourceDisplaySignature(current) !==
      getOpenSourceDisplaySignature(latest)

    return {
      snapshot: changed ? latest : current,
      changed,
      usedFallback: false,
    }
  } catch (error) {
    return {
      snapshot: current,
      changed: false,
      usedFallback: true,
      error,
    }
  }
}

async function fetchPullRequestCount(
  fetcher: typeof fetch,
  token: string | undefined,
  repo?: string,
  merged = false
): Promise<number> {
  const query = [
    `author:${GITHUB_USERNAME}`,
    "is:pr",
    ...(repo ? [`repo:${repo}`] : []),
    ...(merged ? ["is:merged"] : []),
  ].join(" ")
  const params = new URLSearchParams({ q: query, per_page: "1" })
  const response = await fetchGitHubJson<GitHubSearchResponse>(
    `${GITHUB_API_BASE_URL}/search/issues?${params}`,
    fetcher,
    token
  )

  if (response.incomplete_results) {
    throw new Error(
      `GitHub returned incomplete PR search results for: ${query}`
    )
  }

  assertCount(response.total_count, `Pull Request count for: ${query}`)
  return response.total_count
}

async function fetchGitHubJson<T>(
  url: string,
  fetcher: typeof fetch,
  token?: string
): Promise<T> {
  const response = await fetcher(url, {
    headers: createHeaders(token),
    signal: AbortSignal.timeout(GITHUB_API_TIMEOUT_MS),
  })

  if ((response.status === 401 || response.status === 403) && token) {
    const publicResponse = await fetcher(url, {
      headers: createHeaders(),
      signal: AbortSignal.timeout(GITHUB_API_TIMEOUT_MS),
    })

    return readResponse<T>(publicResponse, url)
  }

  return readResponse<T>(response, url)
}

function createHeaders(token?: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "overme-home-open-source-stats",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function readResponse<T>(response: Response, url: string): Promise<T> {
  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status}): ${url}`)
  }

  return (await response.json()) as T
}

function assertCount(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`GitHub returned an invalid ${label}`)
  }
}
