import { renderBlogRss } from "@/features/blog/lib/publishing"

export const dynamic = "force-static"
export function GET() {
  return new Response(renderBlogRss("zh"), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
