import { LOCALES } from "@/lib/i18n"
import {
  markdownResponse,
  renderBlogMarkdown,
} from "@/features/blog/lib/publishing"
import { getBlogPost, getBlogPosts } from "@/features/doc/data/documents"

export const dynamic = "force-static"
export const dynamicParams = false
export const generateStaticParams = () =>
  LOCALES.flatMap((locale) =>
    getBlogPosts(locale).map(({ slug }) => ({ locale, slug }))
  )

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> }
) {
  const { locale, slug } = await params
  if (locale !== "zh" && locale !== "en")
    return new Response("Not found", { status: 404 })
  const post = getBlogPost(slug, locale)
  return post
    ? markdownResponse(renderBlogMarkdown(post, locale))
    : new Response("Not found", { status: 404 })
}
