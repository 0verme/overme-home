import { SITE_INFO, SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { getBlogPosts, getComponentDocs } from "@/features/doc/data/documents"

const allComponents = getComponentDocs()
const allPosts = getBlogPosts()

const content = `# ${SITE_INFO.name}

> A personal home for 0verme: data infrastructure, data products, open source, and practical engineering tools.

- [About](${SITE_INFO.url}/about.md): profile and site scope.
- [Notes](${SITE_INFO.url}/blog): the current blog route; Notes migration is deferred.
- [Selected Work](${SITE_INFO.url}/#projects): a small selection of public projects.
- [Components](${SITE_INFO.url}/components.md): retained component registry and development assets.
- [Blocks](${SITE_INFO.url}/blocks.md): retained block registry and development assets.
- [Source code](${SOURCE_CODE_GITHUB_URL}): GitHub repository.

## Components

${allComponents.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/components/${item.slug}.md): ${item.metadata.description}`).join("\n")}

## Blog

${allPosts.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/blog/${item.slug}.md): ${item.metadata.description}`).join("\n")}
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
