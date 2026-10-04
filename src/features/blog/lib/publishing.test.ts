import { describe, expect, it } from "vitest"

import {
  BLOG_MIGRATION,
  blogRedirects,
  inheritedArticleRedirects,
  legacyTagRedirect,
} from "@/lib/blog-redirects"
import { alternatePath, blogPath } from "@/lib/i18n"
import { homeMetadata } from "@/lib/site-metadata"
import { getBlogPost, getBlogPosts } from "@/features/doc/data/documents"

import {
  renderBlogIndex,
  renderBlogMarkdown,
  renderBlogRss,
  renderLlmsIndex,
} from "./publishing"

describe("bilingual publishing and migration", () => {
  it("redirects legacy Unicode tags with safe headers and preserved filters", () => {
    const response = legacyTagRedirect(
      new Request("https://overme.cn/tags/数据仓库?q=SQL&year=2026"),
      "数据仓库",
      "zh"
    )
    expect(response.status).toBe(308)
    const location = response.headers.get("location")!
    expect(location).toMatch(/^[\x20-\x7E]+$/)
    const url = new URL(location, "https://overme.cn")
    expect(url.pathname).toBe("/blog")
    expect(url.searchParams.get("tag")).toBe("数据仓库")
    expect(url.searchParams.get("q")).toBe("SQL")
    expect(url.searchParams.get("year")).toBe("2026")
    expect(
      legacyTagRedirect(
        new Request("https://overme.cn/en/tags/missing"),
        "missing",
        "en"
      ).status
    ).toBe(404)
  })
  it.each(["zh", "en"] as const)(
    "publishes only %s articles in the feed and Markdown indexes",
    (locale) => {
      const rss = renderBlogRss(locale)
      const index = renderBlogIndex(locale)
      const llms = renderLlmsIndex(locale)
      expect(rss.match(/<item>/g)).toHaveLength(4)
      expect(rss).toContain(
        `<language>${locale === "zh" ? "zh-CN" : "en"}</language>`
      )
      for (const post of getBlogPosts(locale)) {
        expect(index).toContain(`${blogPath(locale, post.slug)}.md`)
        expect(rss).toContain(blogPath(locale, post.slug))
        expect(llms).toContain(`${blogPath(locale, post.slug)}.md`)
      }
      expect(rss).not.toContain(
        getBlogPost("hello-world", locale === "en" ? "zh" : "en")!.metadata
          .title
      )
      expect(rss).toContain("GMT</pubDate>")
      expect(rss).not.toContain("uptime-kuma")
    }
  )

  it("keeps Markdown body and translation provenance intact", () => {
    const en = getBlogPost("data-warehouse-dilemma", "en")!
    const zh = getBlogPost("data-warehouse-dilemma", "zh")!
    const translated = renderBlogMarkdown(en, "en")
    expect(translated).toContain(en.content.trim())
    expect(translated).toContain("Translated:")
    expect(translated).toContain("Original:")
    expect(translated).toContain("/blog/data-warehouse-dilemma")
    expect(renderBlogMarkdown(zh, "zh")).not.toContain("翻译于:")
  })

  it("covers the old 39-page sitemap and two feeds without self redirects", () => {
    expect(BLOG_MIGRATION).toHaveLength(41)
    expect(new Set(BLOG_MIGRATION.map((item) => item.source)).size).toBe(41)
    expect(blogRedirects).toHaveLength(37)
    expect(
      blogRedirects.some(({ source }) => /^(\/en)?\/tokens$/.test(source))
    ).toBe(false)
    for (const item of blogRedirects) {
      expect(item.destination).not.toBe(item.source)
      expect(item.permanent).toBe(true)
    }
    expect(
      blogRedirects.find((item) => item.source === "/en/posts/hello-world")
        ?.destination
    ).toBe("/en/blog/hello-world")
    expect(
      blogRedirects.find((item) => item.source === "/en/tags/data-engineering")
        ?.destination
    ).toBe("/en/blog?tag=Data%20Engineering")
    expect(
      blogRedirects.find(
        (item) => item.source === "/tags/%E6%95%B0%E6%8D%AE%E5%B7%A5%E7%A8%8B"
      )?.destination
    ).toBe("/blog?tag=%E6%95%B0%E6%8D%AE%E5%B7%A5%E7%A8%8B")
    expect(
      blogRedirects.find((item) => item.source === "/en/rss.xml")?.destination
    ).toBe("/en/blog/rss")
    expect(inheritedArticleRedirects).toHaveLength(2)
  })

  it("switches the same article and emits canonical language alternatives", () => {
    expect(alternatePath("/blog/hello-world", "zh")).toBe(
      "/en/blog/hello-world"
    )
    expect(alternatePath("/en/blog/hello-world", "en")).toBe(
      "/blog/hello-world"
    )
    expect(alternatePath("/", "zh")).toBe("/en")
    expect(alternatePath("/en", "en")).toBe("/")
    expect(homeMetadata("en").alternates?.canonical).toBe("/en")
    expect(homeMetadata("zh").alternates?.languages).toEqual({
      "zh-CN": "/",
      en: "/en",
      "x-default": "/",
    })
  })
})
