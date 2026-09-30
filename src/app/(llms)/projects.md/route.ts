import { PROJECTS } from "@/features/portfolio/data/projects"

const content = `# Selected Work

${PROJECTS.map((item) => {
  const skills = `\n\nCore tags: ${item.skills.join(", ")}`
  return `## ${item.title}\n\n${item.description}\n\nCategory: ${item.category}\n\nStatus: ${item.status}\n\nProject URL: ${item.link}${skills}`
}).join("\n\n")}
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
