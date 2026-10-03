import {
  markdownResponse,
  renderBlogIndex,
} from "@/features/blog/lib/publishing"

export const dynamic = "force-static"
export function GET() {
  return markdownResponse(renderBlogIndex("en"))
}
