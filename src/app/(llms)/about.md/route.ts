import { SITE_INFO } from "@/config/site"
import { SOCIAL } from "@/features/portfolio/data/social-links"

const content = `# 0verme

${SITE_INFO.description}

0verme builds practical tools for data engineering and is interested in data infrastructure, data products, open source, and AI in data systems. This site collects a short profile and selected work. Its component and block registry remains available as a development asset.

## Home sections

- [Notes](/blog): the existing blog route; Notes migration is deferred.
- [Selected Work](/#projects)
- [About](/#hello)
- [GitHub](${SOCIAL.github.href})
- [X](${SOCIAL.x.href})
`

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
