import { legacyTagRedirect } from "@/lib/blog-redirects"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  return legacyTagRedirect(request, (await params).tag, "en")
}
