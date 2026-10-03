import {
  markdownResponse,
  renderLlmsIndex,
} from "@/features/blog/lib/publishing"

export const dynamic = "force-static"
export function GET() {
  return markdownResponse(renderLlmsIndex("en"))
}
