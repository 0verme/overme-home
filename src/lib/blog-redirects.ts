const slugs = [
  "hello-world",
  "building-lineage-viewer",
  "ai-only-interprets-ledger-actions",
  "data-warehouse-dilemma",
]
const tags = {
  zh: {
    ai: "AI",
    fastapi: "FastAPI",
    typescript: "TypeScript",
    "web-components": "Web Components",
    数据仓库: "数据仓库",
    数据工程: "数据工程",
    数据治理: "数据治理",
    系统设计: "系统设计",
    随笔: "随笔",
    写作: "写作",
  },
  en: {
    ai: "AI",
    fastapi: "FastAPI",
    typescript: "TypeScript",
    "web-components": "Web Components",
    "data-engineering": "Data Engineering",
    "system-design": "System Design",
    notes: "Notes",
    writing: "Writing",
  },
}

/** Snapshot of the old blog's 39 sitemap pages and two RSS feeds. */
export const BLOG_MIGRATION = (["zh", "en"] as const).flatMap((locale) => {
  const prefix = locale === "en" ? "/en" : ""
  const home = prefix || "/"
  const blog = `${prefix}/blog`
  return [
    { source: `${prefix}/`, destination: home },
    { source: `${prefix}/about/`, destination: `${home}#hello` },
    ...["posts", "archives", "search", "tags"].map((page) => ({
      source: `${prefix}/${page}/`,
      destination: blog,
    })),
    { source: `${prefix}/tokens/`, destination: "https://token.overme.cn/" },
    { source: `${prefix}/rss.xml`, destination: `${blog}/rss` },
    ...slugs
      .filter((slug) => locale === "zh" || slug !== "data-warehouse-dilemma")
      .map((slug) => ({
        source: `${prefix}/posts/${slug}/`,
        destination: `${blog}/${slug}`,
      })),
    ...Object.entries(tags[locale]).map(([slug, tag]) => ({
      source: `${prefix}/tags/${encodeURIComponent(slug)}/`,
      destination: `${blog}?tag=${encodeURIComponent(tag)}`,
    })),
  ]
})

export const blogRedirects = BLOG_MIGRATION.filter(
  ({ source }) => source !== "/" && source !== "/en/"
).map(({ source, destination }) => ({
  source: source.replace(/\/$/, ""),
  destination,
  permanent: true,
}))

export const inheritedArticleRedirects = [
  "uptime-kuma",
  "tips-for-creating-beautiful-image-borders",
].map((slug) => ({
  source: `/blog/${slug}`,
  destination: `https://chanhdai.com/blog/${slug}`,
  permanent: true,
}))

export function legacyTagRedirect(
  request: Request,
  slug: string,
  locale: "zh" | "en"
) {
  const tag = (tags[locale] as Record<string, string>)[slug]
  if (!tag) return new Response("Not found", { status: 404 })
  const destination = new URL(
    locale === "en" ? "/en/blog" : "/blog",
    request.url
  )
  destination.search = new URL(request.url).search
  destination.searchParams.set("tag", tag)
  return new Response(null, {
    status: 308,
    headers: { Location: destination.pathname + destination.search },
  })
}
