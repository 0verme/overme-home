import {
  BlogArticle,
  getBlogMetadata,
} from "@/features/blog/components/localized-blog"
import { getBlogPosts } from "@/features/doc/data/documents"

export const dynamicParams = false
export const generateStaticParams = () =>
  getBlogPosts("en").map(({ slug }) => ({ slug }))
export async function generateMetadata({
  params,
}: PageProps<"/en/blog/[slug]">) {
  return getBlogMetadata("en", (await params).slug)
}
export default async function Page({ params }: PageProps<"/en/blog/[slug]">) {
  return <BlogArticle locale="en" slug={(await params).slug} />
}
