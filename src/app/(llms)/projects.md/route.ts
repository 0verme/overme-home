import { markdownResponse } from "@/features/blog/lib/publishing"
import { getProjects } from "@/features/portfolio/data/projects"

export const dynamic = "force-static"
export function GET() {
  return markdownResponse(
    "# 精选项目\n\n" +
      getProjects("zh")
        .map(
          (p) =>
            `## ${p.title}\n\n${p.summary}\n\n${p.description || ""}\n\nGitHub: ${p.repositoryUrl}\n${p.demoUrl ? "Demo: " + p.demoUrl : ""}`
        )
        .join("\n\n")
  )
}
