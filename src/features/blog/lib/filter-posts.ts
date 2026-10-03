import type { Doc } from "@/features/doc/types/document"

export type BlogPreview = Pick<Doc, "slug" | "metadata">

export function filterPosts(
  posts: BlogPreview[],
  filters: { q?: string; tag?: string; year?: string }
) {
  const query = filters.q?.trim().normalize("NFKC").toLowerCase() ?? ""

  return posts.filter(({ metadata }) => {
    const text = `${metadata.title} ${metadata.description}`
      .normalize("NFKC")
      .toLowerCase()

    return (
      (!query || text.includes(query)) &&
      (!filters.tag || metadata.tags?.includes(filters.tag)) &&
      (!filters.year || metadata.createdAt.slice(0, 4) === filters.year)
    )
  })
}
