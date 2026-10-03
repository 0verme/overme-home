import {
  BlogArticle,
  getBlogMetadata,
} from "@/features/blog/components/localized-blog"
import { getBlogPosts } from "@/features/doc/data/documents"

export const dynamicParams = false
export const generateStaticParams = () =>
  getBlogPosts("zh").map(({ slug }) => ({ slug }))
export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  return getBlogMetadata("zh", (await params).slug)
}
export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  return <BlogArticle locale="zh" slug={(await params).slug} />
}
