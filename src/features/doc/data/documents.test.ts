import fs from "node:fs"
import path from "node:path"
import { serialize } from "next-mdx-remote/serialize"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import { describe, expect, it } from "vitest"

import {
  findNeighbour,
  getAllDocs,
  getBlogPost,
  getBlogPosts,
  getComponentDoc,
  getComponentDocs,
  getDocBySlug,
  getDocsByCategory,
} from "./documents"

const slugs = [
  "ai-only-interprets-ledger-actions",
  "building-lineage-viewer",
  "data-warehouse-dilemma",
  "hello-world",
]

describe("localized document content", () => {
  it.each(["zh", "en"] as const)(
    "reads the complete %s blog without template or component documents",
    (locale) => {
      const posts = getBlogPosts(locale)

      expect(posts.map((post) => post.slug).sort()).toEqual(slugs)
      for (const post of posts) {
        expect(post.metadata.category).toBe("blog")
        expect(post.metadata.locale).toBe(locale)
        expect(post.metadata.translationKey).toBe(post.slug)
        expect(post.metadata.author).toBe("jearhe")
        expect(post.metadata.tags?.length).toBeGreaterThan(0)
        expect(post.metadata.sourcePath).toBe(
          `src/features/doc/content/blog/${locale}/${post.slug}.mdx`
        )
        expect(
          fs.existsSync(path.join(process.cwd(), post.metadata.sourcePath!))
        ).toBe(true)
      }
    }
  )

  it("looks up each language explicitly and never crosses document categories", () => {
    expect(getBlogPost("hello-world", "zh")?.metadata.title).toBe(
      "为什么写「见远而行」"
    )
    expect(getBlogPost("hello-world", "en")?.metadata.title).toBe(
      "Why I Write ‘见远而行’"
    )
    expect(getBlogPost("react-wheel-picker", "en")).toBeUndefined()
    expect(getComponentDoc("hello-world")).toBeUndefined()
    expect(getBlogPost("missing-post", "zh")).toBeUndefined()
    expect(getDocBySlug("missing-post")).toBeUndefined()
  })

  it("keeps legacy consumers on the Chinese blog and unchanged component collection", () => {
    const components = getComponentDocs()
    const all = getAllDocs()

    expect(getBlogPosts()).toEqual(getBlogPosts("zh"))
    expect(getDocBySlug("hello-world")).toEqual(
      getBlogPost("hello-world", "zh")
    )
    expect(getDocBySlug("react-wheel-picker")).toEqual(
      getComponentDoc("react-wheel-picker")
    )
    expect(getComponentDoc("react-wheel-picker")?.metadata.category).toBe(
      "components"
    )
    expect(components.length).toBeGreaterThan(0)
    expect(all).toHaveLength(components.length + getBlogPosts("zh").length)
    expect(all.some((doc) => doc.metadata.locale === "en")).toBe(false)
    expect(getDocsByCategory("blog")).toEqual(getBlogPosts("zh"))
    expect(getDocsByCategory("components")).toEqual(components)
    expect(getDocBySlug("uptime-kuma")).toBeUndefined()
    expect(
      getDocBySlug("tips-for-creating-beautiful-image-borders")
    ).toBeUndefined()
  })

  it("preserves publication and update dates without redating the new translation", () => {
    for (const locale of ["zh", "en"] as const) {
      const hello = getBlogPost("hello-world", locale)!
      expect(hello.metadata.createdAt).toBe("2026-08-11T08:00:00+08:00")
      expect(hello.metadata.updatedAt).toBe("2026-08-13T09:30:00+08:00")
      expect(hello.metadata.translatedAt).toBeUndefined()
    }

    const translated = getBlogPost("data-warehouse-dilemma", "en")!
    expect(translated.metadata.createdAt).toBe("2026-08-21T09:00:00+08:00")
    expect(translated.metadata.updatedAt).toBe("2026-08-21T09:00:00+08:00")
    expect(translated.metadata.translatedAt).toBe("2026-10-03")
    expect(translated.metadata.translationOf).toBe(
      "/blog/data-warehouse-dilemma"
    )
  })

  it("keeps the full long-form translation aligned with every source block", () => {
    const original = getBlogPost("data-warehouse-dilemma", "zh")!.content
    const translated = getBlogPost("data-warehouse-dilemma", "en")!.content
    const processor = remark().use(remarkGfm)
    const originalBlocks = processor.parse(original).children
    const translatedBlocks = processor.parse(translated).children
    const structure = (blocks: typeof originalBlocks) =>
      blocks.map((block) =>
        block.type === "heading" ? `heading:${block.depth}` : block.type
      )

    expect(structure(translatedBlocks)).toEqual(structure(originalBlocks))
    expect(
      translatedBlocks.filter((block) => block.type === "heading")
    ).toHaveLength(22)
    expect(translated).toContain("more than 3,800 tables from over 180")
    expect(translated).toContain("more than 100 business systems")
    expect(translated).toContain("80%")
    expect(translated).toContain("https://data.overme.cn/")
    expect(translated).toContain(
      "**Data can enter the warehouse, but responsibility, meaning, and experience do not arrive automatically.**"
    )
  })

  it("updates article, about, and usage links to their new destinations", () => {
    for (const locale of ["zh", "en"] as const) {
      const prefix = locale === "en" ? "/en" : ""
      const content = getBlogPost("hello-world", locale)!.content

      expect(content).toContain(`](${prefix}/blog/building-lineage-viewer)`)
      expect(content).toContain(
        `](${prefix}/blog/ai-only-interprets-ledger-actions)`
      )
      expect(content).toContain(locale === "en" ? "](/en#hello)" : "](/#hello)")
      expect(content).toContain("](https://token.overme.cn/)")
      expect(content).not.toMatch(/\]\(\/(en\/)?(posts|about|tokens)\//)
    }
  })

  it("keeps neighbouring posts within the selected language", () => {
    const posts = getBlogPosts("en")
    const { previous, next } = findNeighbour(posts, posts[1].slug)

    expect(previous).toEqual(posts[0])
    expect(next).toEqual(posts[2])
    expect(previous?.metadata.locale).toBe("en")
    expect(next?.metadata.locale).toBe("en")
    expect(findNeighbour(posts, "missing-post")).toEqual({
      previous: null,
      next: null,
    })
  })

  it.each(
    (["zh", "en"] as const).flatMap((locale) =>
      slugs.map((slug) => ({ locale, slug }))
    )
  )("compiles $locale/$slug as MDX", async ({ locale, slug }) => {
    const post = getBlogPost(slug, locale)!
    const result = await serialize(post.content, {
      mdxOptions: { remarkPlugins: [remarkGfm] },
    })

    expect(result.compiledSource.length).toBeGreaterThan(0)
  })
})
