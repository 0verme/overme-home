import fs from "fs"
import path from "path"
import { cache } from "react"
import matter from "gray-matter"

import type { Locale } from "@/lib/i18n"
import type { Doc, DocMetadata } from "@/features/doc/types/document"

export const BLOG_CATEGORY = "blog"
export const COMPONENTS_CATEGORY = "components"

const CONTENT_PATH = "src/features/doc/content"

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent)

  return {
    metadata: file.data as DocMetadata,
    content: file.content,
  }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8")
  return parseFrontmatter(rawContent)
}

function readCategory(category: string, locale?: Locale): Doc[] {
  const relativePath = locale
    ? `${CONTENT_PATH}/${category}/${locale}`
    : `${CONTENT_PATH}/${category}`
  const directory = locale
    ? path.join(process.cwd(), "src/features/doc/content", category, locale)
    : path.join(process.cwd(), "src/features/doc/content", category)

  return getMDXFiles(directory).map((file) => {
    const { metadata, content } = readMDXFile(path.join(directory, file))

    return {
      metadata: {
        ...metadata,
        category,
        ...(locale ? { locale } : {}),
        sourcePath: `${relativePath}/${file}`,
      },
      slug: path.basename(file, path.extname(file)),
      content,
    }
  })
}

function sortDocs(docs: Doc[]): Doc[] {
  return docs.sort((a, b) => {
    if (a.metadata.pinned && !b.metadata.pinned) return -1
    if (!a.metadata.pinned && b.metadata.pinned) return 1

    return (
      new Date(b.metadata.createdAt).getTime() -
      new Date(a.metadata.createdAt).getTime()
    )
  })
}

/** Blog slugs are unique within a locale, rather than across every document. */
export const getBlogPosts = cache((locale: Locale = "zh") => {
  return sortDocs(readCategory(BLOG_CATEGORY, locale))
})

export function getBlogPost(slug: string, locale: Locale = "zh") {
  return getBlogPosts(locale).find((doc) => doc.slug === slug)
}

export const getComponentDocs = cache(() => {
  return sortDocs(readCategory(COMPONENTS_CATEGORY))
})

export function getComponentDoc(slug: string) {
  return getComponentDocs().find((doc) => doc.slug === slug)
}

/** Legacy consumers receive the default-language blog and component docs. */
export const getAllDocs = cache(() => {
  return sortDocs([...getBlogPosts("zh"), ...getComponentDocs()])
})

export function getDocBySlug(slug: string) {
  return getBlogPost(slug, "zh") ?? getComponentDoc(slug)
}

export function getDocsByCategory(category: string) {
  return getAllDocs().filter((doc) => doc.metadata.category === category)
}

export function findNeighbour(docs: Doc[], slug: string) {
  const len = docs.length

  for (let i = 0; i < len; ++i) {
    if (docs[i].slug === slug) {
      return {
        previous: i > 0 ? docs[i - 1] : null,
        next: i < len - 1 ? docs[i + 1] : null,
      }
    }
  }

  return { previous: null, next: null }
}
