import { describe, expect, it } from "vitest"

import { getBlogPosts } from "@/features/doc/data/documents"

import { selectFeaturedPosts } from "./featured-posts"

describe("featured blog posts", () => {
  it.each(["zh", "en"] as const)(
    "selects only pinned %s posts in publication order",
    (locale) => {
      const posts = selectFeaturedPosts(getBlogPosts(locale))

      expect(posts.map((post) => post.slug)).toEqual([
        "building-lineage-viewer",
        "hello-world",
      ])
      expect(posts.every((post) => post.metadata.pinned === true)).toBe(true)
      expect(posts[0].metadata.createdAt > posts[1].metadata.createdAt).toBe(
        true
      )
    }
  )
})
