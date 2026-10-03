import { describe, expect, it } from "vitest"

import { filterPosts, type BlogPreview } from "./filter-posts"

const posts: BlogPreview[] = [
  {
    slug: "lineage",
    metadata: {
      title: "SQL 血缘",
      description: "从元数据到可交互图",
      tags: ["数据工程"],
      createdAt: "2026-08-12",
      updatedAt: "2026-08-12",
    },
  },
  {
    slug: "ai",
    metadata: {
      title: "AI boundaries",
      description: "Reviewing SQL changes",
      tags: ["AI"],
      createdAt: "2025-10-12",
      updatedAt: "2025-10-12",
    },
  },
  {
    slug: "notes",
    metadata: {
      title: "Notes",
      description: "Writing",
      createdAt: "2026-08-11",
      updatedAt: "2026-08-11",
    },
  },
]

describe("blog filters", () => {
  it("searches both title and summary regardless of case, width, or surrounding spaces", () => {
    expect(
      filterPosts(posts, { q: "  ｓｑｌ  " }).map((post) => post.slug)
    ).toEqual(["lineage", "ai"])
    expect(
      filterPosts(posts, { q: "元数据" }).map((post) => post.slug)
    ).toEqual(["lineage"])
  })

  it("combines tag and year with the query and preserves source order", () => {
    expect(
      filterPosts(posts, { q: "sql", tag: "数据工程", year: "2026" }).map(
        (post) => post.slug
      )
    ).toEqual(["lineage"])
    expect(
      filterPosts(posts, { year: "2026" }).map((post) => post.slug)
    ).toEqual(["lineage", "notes"])
  })

  it("returns an honest empty result for unknown filters and all posts when cleared", () => {
    expect(filterPosts(posts, { tag: "unknown" })).toEqual([])
    expect(filterPosts(posts, { year: "1999" })).toEqual([])
    expect(filterPosts(posts, { q: "", tag: "", year: "" })).toEqual(posts)
  })
})
