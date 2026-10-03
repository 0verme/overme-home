import { markdownResponse } from "@/features/blog/lib/publishing"
import { getUser } from "@/features/portfolio/data/user"

export const dynamic = "force-static"
export function GET() {
  const user = getUser("zh")
  return markdownResponse(`# 0verme · 见远而行

${user.about}

Source: https://github.com/0verme/overme-home
Based on https://github.com/ncdai/chanhdai.com (MIT).
`)
}
