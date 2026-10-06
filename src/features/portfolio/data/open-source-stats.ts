export type OpenSourceSummary = {
  qualifiedRepoCount: number
  mergedPrs: number
}

export type FeaturedRepoStats = {
  repo: string
  url: string
  stars: number
  mergedPrs: number
}

export type OpenSourceStatsSnapshot = {
  generatedAt: string | null
  summary: OpenSourceSummary | null
  featuredRepos: FeaturedRepoStats[]
}

export type OpenSourceRepoCandidate = FeaturedRepoStats & {
  ownerLogin: string
}

type RefreshResult = {
  snapshot: OpenSourceStatsSnapshot
  changed: boolean
  usedFallback: boolean
  error?: unknown
}

type GitHubPullRequestSearchItem = {
  id: number
  number: number
  repository_url: string
}

type GitHubSearchResponse = {
  total_count: number
  incomplete_results?: boolean
  items: GitHubPullRequestSearchItem[]
}

type GitHubRepositoryResponse = {
  owner: { login: string }
  stargazers_count: number
}

const GITHUB_API_BASE_URL = "https://api.github.com"
const GITHUB_API_TIMEOUT_MS = 10_000
const GITHUB_USERNAME = "0verme"
const GITHUB_SEARCH_PAGE_SIZE = 100
const GITHUB_SEARCH_RESULT_LIMIT = 1_000
const GITHUB_SEARCH_START_DATE = "2008-01-01"
const REPOSITORY_REQUEST_BATCH_SIZE = 10
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1_000

export const EMPTY_OPEN_SOURCE_STATS: OpenSourceStatsSnapshot = {
  generatedAt: null,
  summary: null,
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

export function filterQualifiedOpenSourceRepos(
  candidates: readonly OpenSourceRepoCandidate[],
  excludedRepos: readonly string[] = []
): FeaturedRepoStats[] {
  const excluded = new Set(excludedRepos.map(normalizeRepoName))

  return candidates
    .filter((candidate) => {
      const [repoOwner] = candidate.repo.split("/")

      return (
        candidate.ownerLogin.toLowerCase() !== GITHUB_USERNAME.toLowerCase() &&
        repoOwner?.toLowerCase() !== GITHUB_USERNAME.toLowerCase() &&
        !excluded.has(normalizeRepoName(candidate.repo)) &&
        candidate.stars >= 1_000 &&
        candidate.mergedPrs >= 1
      )
    })
    .map(({ repo, url, stars, mergedPrs }) => ({
      repo,
      url,
      stars,
      mergedPrs,
    }))
    .sort((left, right) => {
      if (left.mergedPrs !== right.mergedPrs) {
        return right.mergedPrs - left.mergedPrs
      }
      if (left.stars !== right.stars) return right.stars - left.stars
      if (left.repo < right.repo) return -1
      if (left.repo > right.repo) return 1
      return 0
    })
}

export async function fetchOpenSourceStats(
  options: {
    fetcher?: typeof fetch
    token?: string
    now?: () => Date
    excludedRepos?: readonly string[]
  } = {}
): Promise<OpenSourceStatsSnapshot> {
  const fetcher = options.fetcher ?? fetch
  const generatedAt = options.now?.() ?? new Date()
  const excludedRepos = new Set(
    (options.excludedRepos ?? []).map(normalizeRepoName)
  )
  const pullRequests = await fetchAllMergedPullRequests(
    fetcher,
    options.token,
    generatedAt
  )
  const mergedPrCounts = new Map<string, { repo: string; mergedPrs: number }>()

  for (const pullRequest of pullRequests) {
    const repo = getRepositoryFullName(pullRequest.repository_url)
    const [repoOwner] = repo.split("/")
    const normalizedRepo = normalizeRepoName(repo)

    if (
      repoOwner?.toLowerCase() === GITHUB_USERNAME.toLowerCase() ||
      excludedRepos.has(normalizedRepo)
    ) {
      continue
    }

    const current = mergedPrCounts.get(normalizedRepo)
    if (current) {
      current.mergedPrs += 1
    } else {
      mergedPrCounts.set(normalizedRepo, { repo, mergedPrs: 1 })
    }
  }

  const repositories = [...mergedPrCounts.values()]
  const candidates: OpenSourceRepoCandidate[] = []

  for (
    let offset = 0;
    offset < repositories.length;
    offset += REPOSITORY_REQUEST_BATCH_SIZE
  ) {
    const batch = repositories.slice(
      offset,
      offset + REPOSITORY_REQUEST_BATCH_SIZE
    )
    const batchCandidates = await Promise.all(
      batch.map(async ({ repo, mergedPrs }) => {
        const repository = await fetchGitHubJson<GitHubRepositoryResponse>(
          `${GITHUB_API_BASE_URL}/repos/${repo
            .split("/")
            .map(encodeURIComponent)
            .join("/")}`,
          fetcher,
          options.token
        )

        if (!repository.owner || typeof repository.owner.login !== "string") {
          throw new Error(`GitHub returned an invalid owner for ${repo}`)
        }
        assertCount(repository.stargazers_count, `stars for ${repo}`)

        return {
          repo,
          url: `https://github.com/${repo}`,
          ownerLogin: repository.owner.login,
          stars: repository.stargazers_count,
          mergedPrs,
        }
      })
    )

    candidates.push(...batchCandidates)
  }

  const featuredRepos = filterQualifiedOpenSourceRepos(
    candidates,
    options.excludedRepos
  )

  return {
    generatedAt: generatedAt.toISOString(),
    summary: {
      qualifiedRepoCount: featuredRepos.length,
      mergedPrs: featuredRepos.reduce(
        (total, repo) => total + repo.mergedPrs,
        0
      ),
    },
    featuredRepos,
  }
}

export function getOpenSourceDisplaySignature(
  snapshot: OpenSourceStatsSnapshot
): string {
  return JSON.stringify({
    summary: snapshot.summary
      ? {
          qualifiedRepoCount: snapshot.summary.qualifiedRepoCount,
          mergedPrs: formatPullRequestCount(snapshot.summary.mergedPrs),
        }
      : null,
    featuredRepos: snapshot.featuredRepos.map((repo) => ({
      repo: repo.repo,
      stars: formatStarCount(repo.stars),
      mergedPrs: formatPullRequestCount(repo.mergedPrs),
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

async function fetchAllMergedPullRequests(
  fetcher: typeof fetch,
  token: string | undefined,
  now: Date
): Promise<GitHubPullRequestSearchItem[]> {
  const query = `author:${GITHUB_USERNAME} is:pr is:merged`
  const firstPage = await fetchGitHubSearchPage(query, 1, fetcher, token)
  const totalCount = getSearchTotalCount(firstPage)

  if (totalCount < GITHUB_SEARCH_RESULT_LIMIT) {
    return collectSearchPages(query, firstPage, totalCount, fetcher, token)
  }

  // Treat a saturated count as untrusted and partition before reading results.
  const endDate = now.toISOString().slice(0, 10)
  const rangedResults = await collectDateRange(
    query,
    GITHUB_SEARCH_START_DATE,
    endDate,
    fetcher,
    token
  )

  if (
    totalCount > GITHUB_SEARCH_RESULT_LIMIT &&
    rangedResults.length !== totalCount
  ) {
    throw new Error(
      `GitHub PR search returned ${rangedResults.length} ranged results for ${totalCount} matches`
    )
  }

  assertUniquePullRequests(rangedResults)
  return rangedResults
}

async function collectDateRange(
  baseQuery: string,
  startDate: string,
  endDate: string,
  fetcher: typeof fetch,
  token: string | undefined
): Promise<GitHubPullRequestSearchItem[]> {
  const query = `${baseQuery} created:${startDate}..${endDate}`
  const firstPage = await fetchGitHubSearchPage(query, 1, fetcher, token)
  const totalCount = getSearchTotalCount(firstPage)

  if (totalCount < GITHUB_SEARCH_RESULT_LIMIT) {
    return collectSearchPages(query, firstPage, totalCount, fetcher, token)
  }

  if (startDate === endDate) {
    throw new Error(
      `GitHub PR search still reaches the ${GITHUB_SEARCH_RESULT_LIMIT}-result boundary on ${startDate}`
    )
  }

  const [leftEndDate, rightStartDate] = splitDateRange(startDate, endDate)
  const leftResults = await collectDateRange(
    baseQuery,
    startDate,
    leftEndDate,
    fetcher,
    token
  )
  const rightResults = await collectDateRange(
    baseQuery,
    rightStartDate,
    endDate,
    fetcher,
    token
  )

  return [...leftResults, ...rightResults]
}

async function collectSearchPages(
  query: string,
  firstPage: GitHubSearchResponse,
  totalCount: number,
  fetcher: typeof fetch,
  token: string | undefined
): Promise<GitHubPullRequestSearchItem[]> {
  const pageCount = Math.ceil(totalCount / GITHUB_SEARCH_PAGE_SIZE)
  const results: GitHubPullRequestSearchItem[] = []

  for (let page = 1; page <= pageCount; page += 1) {
    const response =
      page === 1
        ? firstPage
        : await fetchGitHubSearchPage(query, page, fetcher, token)

    assertSearchPage(response, totalCount, page)
    results.push(...response.items)
  }

  if (results.length !== totalCount) {
    throw new Error(
      `GitHub PR search returned ${results.length} results for ${totalCount} matches`
    )
  }
  assertUniquePullRequests(results)

  return results
}

async function fetchGitHubSearchPage(
  query: string,
  page: number,
  fetcher: typeof fetch,
  token: string | undefined
): Promise<GitHubSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    per_page: String(GITHUB_SEARCH_PAGE_SIZE),
    page: String(page),
    sort: "created",
    order: "asc",
  })

  return fetchGitHubJson<GitHubSearchResponse>(
    `${GITHUB_API_BASE_URL}/search/issues?${params}`,
    fetcher,
    token
  )
}

function assertSearchPage(
  response: GitHubSearchResponse,
  expectedTotal: number,
  page: number
): void {
  if (response.incomplete_results) {
    throw new Error("GitHub returned incomplete merged PR search results")
  }
  assertCount(response.total_count, "merged PR search result count")

  if (
    response.total_count !== expectedTotal ||
    !Array.isArray(response.items)
  ) {
    throw new Error("GitHub merged PR search changed while paging")
  }

  const expectedPageSize = Math.min(
    GITHUB_SEARCH_PAGE_SIZE,
    Math.max(0, expectedTotal - (page - 1) * GITHUB_SEARCH_PAGE_SIZE)
  )
  if (response.items.length !== expectedPageSize) {
    throw new Error("GitHub returned an incomplete merged PR search page")
  }

  for (const item of response.items) {
    if (
      !Number.isSafeInteger(item.id) ||
      item.id < 1 ||
      !Number.isSafeInteger(item.number) ||
      item.number < 1 ||
      typeof item.repository_url !== "string"
    ) {
      throw new Error("GitHub returned an invalid merged PR search result")
    }
  }
}

function assertUniquePullRequests(
  pullRequests: readonly GitHubPullRequestSearchItem[]
): void {
  const ids = new Set<number>()

  for (const pullRequest of pullRequests) {
    if (ids.has(pullRequest.id)) {
      throw new Error(
        "GitHub returned duplicate PRs while paging search results"
      )
    }
    ids.add(pullRequest.id)
  }
}

function getSearchTotalCount(response: GitHubSearchResponse): number {
  if (response.incomplete_results) {
    throw new Error("GitHub returned incomplete merged PR search results")
  }
  assertCount(response.total_count, "merged PR search result count")
  assertSearchPage(response, response.total_count, 1)
  return response.total_count
}

function splitDateRange(startDate: string, endDate: string): [string, string] {
  const start = Date.parse(`${startDate}T00:00:00.000Z`)
  const end = Date.parse(`${endDate}T00:00:00.000Z`)

  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) {
    throw new Error(
      `Unable to split GitHub PR search date range ${startDate}..${endDate}`
    )
  }

  const midpoint =
    start +
    Math.floor((end - start) / (2 * DAY_IN_MILLISECONDS)) * DAY_IN_MILLISECONDS
  const leftEndDate = new Date(midpoint).toISOString().slice(0, 10)
  const rightStartDate = new Date(midpoint + DAY_IN_MILLISECONDS)
    .toISOString()
    .slice(0, 10)

  return [leftEndDate, rightStartDate]
}

function getRepositoryFullName(repositoryUrl: string): string {
  let parsedUrl: URL
  try {
    parsedUrl = new URL(repositoryUrl)
  } catch {
    throw new Error(
      `GitHub returned an invalid repository URL: ${repositoryUrl}`
    )
  }

  const match = parsedUrl.pathname.match(/^\/repos\/([^/]+)\/([^/]+)$/)
  if (parsedUrl.origin !== GITHUB_API_BASE_URL || !match) {
    throw new Error(
      `GitHub returned an invalid repository URL: ${repositoryUrl}`
    )
  }

  return `${decodeURIComponent(match[1]!)}/${decodeURIComponent(match[2]!)}`
}

function normalizeRepoName(repo: string): string {
  return repo.toLowerCase()
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
