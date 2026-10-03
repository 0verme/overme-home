import type { Locale } from "@/lib/i18n"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { getProjects } from "@/features/portfolio/data/projects"

import { ProjectItem } from "./project-item"

const ID = "projects"

export function Projects({ locale = "zh" }: { locale?: Locale }) {
  const PROJECTS = getProjects(locale)
  if (PROJECTS.length === 0) return null

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>
            {locale === "zh" ? "精选项目" : "Selected work"}
          </a>
          <PanelTitleSup>({PROJECTS.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} locale={locale} />
        </PanelTitle>
      </PanelHeader>

      <ul>
        {PROJECTS.map((project) => (
          <li key={project.id} className="border-b border-line last:border-b-0">
            <ProjectItem project={project} locale={locale} />
          </li>
        ))}
      </ul>
      <div className="border-t p-4 text-center text-sm">
        <a
          href="https://github.com/0verme?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          {locale === "zh" ? "更多 GitHub 项目" : "More projects on GitHub"}
        </a>
      </div>
    </Panel>
  )
}
