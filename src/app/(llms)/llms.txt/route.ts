import { SITE_INFO, SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { getBlogPosts, getComponentDocs } from "@/features/doc/data/documents"

const allComponents = getComponentDocs()
const allPosts = getBlogPosts()

const content = `# ${SITE_INFO.name}

> A customizable open-source starter with a reusable component registry and blocks.

- [About](${SITE_INFO.url}/about.md): Project scope and fork attribution.
- [Components](${SITE_INFO.url}/components.md): Registry components and installation instructions.
- [Blocks](${SITE_INFO.url}/blocks.md): Registry blocks grouped by category.
- [Blog](${SITE_INFO.url}/blog.md): Project documentation and articles.
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
