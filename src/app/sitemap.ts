import type { MetadataRoute } from "next"

import { blockCategories } from "@/config/registry"
import { SITE_INFO } from "@/config/site"
import { getAllBlockStaticParams } from "@/lib/blocks"
import { blogPath, LOCALES } from "@/lib/i18n"
import { getBlogPosts, getComponentDocs } from "@/features/doc/data/documents"

export const revalidate = false
export const dynamic = "force-static"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = LOCALES.flatMap((locale) =>
    getBlogPosts(locale).map((post) => ({
      url: `${SITE_INFO.url}${blogPath(locale, post.slug)}`,
      lastModified: new Date(post.metadata.updatedAt).toISOString(),
      alternates: {
        languages: {
          "zh-CN": `${SITE_INFO.url}${blogPath("zh", post.slug)}`,
          en: `${SITE_INFO.url}${blogPath("en", post.slug)}`,
        },
      },
    }))
  )

  const components = getComponentDocs().map((post) => ({
    url: `${SITE_INFO.url}/components/${post.slug}`,
    lastModified: new Date(post.metadata.updatedAt).toISOString(),
  }))

  const blockCategoryPages = blockCategories.map((category) => ({
    url: `${SITE_INFO.url}/blocks/${category.name}`,
    lastModified: new Date().toISOString(),
  }))

  const blocks = (await getAllBlockStaticParams()).map(
    ({ category, name }) => ({
      url: `${SITE_INFO.url}/blocks/${category}/${name}`,
      lastModified: new Date().toISOString(),
    })
  )

  const routes = [
    "",
    "/en",
    "/blog",
    "/en/blog",
    "/components",
    "/components/showcase",
    "/blocks",
  ].map((route) => ({
    url: `${SITE_INFO.url}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return [...routes, ...posts, ...components, ...blockCategoryPages, ...blocks]
}
