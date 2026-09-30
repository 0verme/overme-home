import { addQueryParams } from "@/utils/url"
import { BoxIcon, LinkIcon } from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { IconTile } from "@/components/ui/icon-tile"
import { Tag } from "@/components/ui/tag"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleChevronsUpDownIcon,
} from "@/components/collapsible-animated"

import type { Project } from "../../types/projects"

export function ProjectItem({
  className,
  project,
}: {
  className?: string
  project: Project
}) {
  return (
    <Collapsible className={className}>
      <div className="relative flex items-start hover:bg-accent-muted">
        <IconTile className="mx-4 mt-4">{project.icon ?? <BoxIcon />}</IconTile>

        <div className="flex min-w-0 flex-1 items-start gap-2 border-l border-dashed border-line p-4">
          <div className="min-w-0 flex-1">
            <h3 className="leading-snug font-medium text-balance">
              <CollapsibleTrigger className="text-left">
                <span className="absolute inset-0" aria-hidden />
                {project.title}
              </CollapsibleTrigger>
            </h3>

            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            <ul className="mt-2 flex flex-wrap gap-1.5 text-xs">
              <li>
                <Tag>{project.category}</Tag>
              </li>
              <li>
                <Tag>{project.status}</Tag>
              </li>
            </ul>
          </div>

          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  className="relative z-1 flex size-6 shrink-0 items-center justify-center text-muted-foreground after:absolute after:-inset-2 hover:text-foreground"
                  href={addQueryParams(project.link, UTM_PARAMS)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Open ${project.title}`}
                >
                  <LinkIcon className="pointer-events-none size-4" />
                </a>
              }
            />
            <TooltipContent>
              <p>Open {project.title}</p>
            </TooltipContent>
          </Tooltip>

          <div className="relative z-1 shrink-0 text-muted-foreground [&_svg]:size-4">
            <CollapsibleChevronsUpDownIcon duration={0.15} />
          </div>
        </div>
      </div>

      <CollapsibleContent className="overflow-hidden">
        {project.skills.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 border-t border-line p-4">
            {project.skills.map((skill) => (
              <li key={skill} className="flex">
                <Tag>{skill}</Tag>
              </li>
            ))}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
