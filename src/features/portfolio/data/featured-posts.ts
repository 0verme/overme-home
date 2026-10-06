import type { Doc } from "@/features/doc/types/document"

export function selectFeaturedPosts(posts: Doc[]): Doc[] {
  return posts.filter((post) => post.metadata.pinned === true).slice(0, 2)
}
