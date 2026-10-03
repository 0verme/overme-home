import { escapeXml } from "@/utils/string"

import { SITE_INFO } from "@/config/site"
import {
  blogPath,
  dictionaries,
  formatDate,
  homePath,
  type Locale,
} from "@/lib/i18n"
import { getBlogPosts } from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"

export function renderBlogMarkdown(post: Doc, locale: Locale) {
  const t =
    locale === "zh"
      ? {
          author: "作者",
          published: "发布于",
          updated: "更新于",
          translated: "翻译于",
          original: "原文",
        }
      : {
          author: "Author",
          published: "Published",
          updated: "Updated",
          translated: "Translated",
          original: "Original",
        }
  const translation = post.metadata.translatedAt
    ? `\n${t.translated}: ${formatDate(post.metadata.translatedAt, locale)}\n${t.original}: ${new URL(post.metadata.translationOf || blogPath("zh", post.slug), SITE_INFO.url)}\n`
    : ""
  return `# ${post.metadata.title}\n\n${post.metadata.description}\n\n${t.author}: ${post.metadata.author || "0verme"}\n${t.published}: ${post.metadata.createdAt}\n${t.updated}: ${post.metadata.updatedAt}\n${translation}\n${post.content.trim()}\n`
}

export function renderBlogIndex(locale: Locale) {
  return `# ${dictionaries[locale].blog}\n\n${getBlogPosts(locale)
    .map(
      (post) =>
        `- [${post.metadata.title}](${SITE_INFO.url}${blogPath(locale, post.slug)}.md): ${post.metadata.description}`
    )
    .join("\n")}\n`
}

export function renderLlmsIndex(locale: Locale) {
  const t = dictionaries[locale]
  return `# 0verme · ${locale === "zh" ? "见远而行" : "Horizon Joins Journey"}\n\n${t.description}\n\n- [${t.home}](${SITE_INFO.url}${homePath(locale)})\n- [${t.about}](${SITE_INFO.url}${locale === "en" ? "/en" : ""}/about.md)\n- [${t.work}](${SITE_INFO.url}${locale === "en" ? "/en" : ""}/projects.md)\n- [${t.blog}](${SITE_INFO.url}${locale === "en" ? "/en" : ""}/blog.md)\n- [${t.subscribe}](${SITE_INFO.url}${blogPath(locale)}/rss)\n- [Components](${SITE_INFO.url}/components.md)\n- [Blocks](${SITE_INFO.url}/blocks.md)\n\n${renderBlogIndex(locale)}\n\nSite source: https://github.com/0verme/overme-home\nBased on https://github.com/ncdai/chanhdai.com (MIT).\n`
}

export function renderBlogRss(locale: Locale) {
  const items = [...getBlogPosts(locale)]
    .sort(
      (a, b) =>
        Date.parse(b.metadata.createdAt) - Date.parse(a.metadata.createdAt)
    )
    .map((post) => {
      const url = `${SITE_INFO.url}${blogPath(locale, post.slug)}`
      return `<item><title>${escapeXml(post.metadata.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(post.metadata.description)}</description><pubDate>${new Date(post.metadata.createdAt).toUTCString()}</pubDate>${(post.metadata.tags || []).map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}</item>`
    })
    .join("\n")
  const feed = `${SITE_INFO.url}${blogPath(locale)}/rss`
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(dictionaries[locale].blog)} · 0verme</title><link>${SITE_INFO.url}${blogPath(locale)}</link><description>${escapeXml(dictionaries[locale].description)}</description><language>${locale === "zh" ? "zh-CN" : "en"}</language><atom:link href="${escapeXml(feed)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`
}

export function markdownResponse(content: string) {
  return new Response(content, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
