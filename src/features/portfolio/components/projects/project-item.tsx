import { ArrowUpRightIcon, BoxIcon, ChevronDownIcon } from "lucide-react"

import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { IconTile } from "@/components/ui/icon-tile"
import { Tag } from "@/components/ui/tag"
import { Markdown } from "@/components/markdown"

import type { Project } from "../../types/projects"

export function ProjectItem({
  className,
  project,
  locale = "zh",
}: {
  className?: string
  project: Project
  locale?: Locale
}) {
  const links = [
    ...(project.demoUrl
      ? [
          {
            href: project.demoUrl,
            title: locale === "zh" ? "体验项目" : "Visit project",
          },
        ]
      : []),
    ...(project.repositoryUrl
      ? [
          {
            href: project.repositoryUrl,
            title: locale === "zh" ? "查看源码" : "Source code",
          },
        ]
      : []),
  ]

  if (links.length === 0) {
    links.push({
      href: project.link,
      title: locale === "zh" ? "查看项目" : "View project",
    })
  }

  return (
    <Collapsible
      id={`projects-${project.id}`}
      className={cn("scroll-mt-24", className)}
      defaultOpen={project.isExpanded}
    >
      <div className="flex items-start">
        <IconTile className="mx-4 mt-4">{project.icon ?? <BoxIcon />}</IconTile>
        <div className="min-w-0 flex-1 space-y-3 border-l border-dashed border-line p-4">
          <h3 className="font-medium text-balance">{project.title}</h3>

          {project.summary && (
            <p className="text-sm/relaxed text-pretty text-muted-foreground">
              {project.summary}
            </p>
          )}

          {project.period && (
            <p className="text-sm text-muted-foreground">
              {project.period.start}
              {project.period.end !== project.period.start && (
                <>
                  {" "}
                  —{" "}
                  {project.period.end ?? (locale === "zh" ? "至今" : "Present")}
                </>
              )}
            </p>
          )}

          {project.skills.length > 0 && (
            <ul
              className="flex flex-wrap gap-1.5"
              aria-label={locale === "zh" ? "技术标签" : "Technologies"}
            >
              {project.skills.map((skill) => (
                <li key={skill}>
                  <Tag>{skill}</Tag>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {links.map((link) => (
              <a
                key={link.href}
                className="inline-flex items-center gap-1 link-underline"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.title}: ${project.title}`}
              >
                {link.title}
                <ArrowUpRightIcon className="size-3.5" aria-hidden />
              </a>
            ))}
            {project.description && (
              <CollapsibleTrigger
                className="group/details inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                aria-label={`${locale === "zh" ? "切换项目详情" : "Toggle project details"}: ${project.title}`}
              >
                {locale === "zh" ? "项目详情" : "Details"}
                <ChevronDownIcon
                  className="size-3.5 transition-transform group-data-open/details:rotate-180"
                  aria-hidden
                />
              </CollapsibleTrigger>
            )}
          </div>
        </div>
      </div>
      {project.description && (
        <CollapsibleContent className="overflow-hidden">
          <div className="typeset typeset-description border-t border-dashed border-line p-4">
            <Markdown>{project.description}</Markdown>
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}
