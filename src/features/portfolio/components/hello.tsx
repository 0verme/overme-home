import type { Locale } from "@/lib/i18n"
import { Markdown } from "@/components/markdown"
import { HelloTitle } from "@/features/portfolio/components/hello-title"
import {
  Panel,
  PanelContent,
  PanelHeader,
} from "@/features/portfolio/components/panel"
import { getUser } from "@/features/portfolio/data/user"

const ID = "hello"

export function Hello({ locale = "zh" }: { locale?: Locale }) {
  return (
    <Panel id={ID} className="screen-line-bottom-none">
      <PanelHeader>
        <h2 className="sr-only">{locale === "zh" ? "关于我" : "About"}</h2>
        <HelloTitle locale={locale} />
      </PanelHeader>

      <PanelContent>
        <div className="typeset typeset-description [&_li]:ps-0.5 [&_ul]:ps-3.5">
          <Markdown>{getUser(locale).about}</Markdown>
        </div>
      </PanelContent>

      <div className="screen-line-bottom h-px" />
      <div className="h-4" />
      <div className="screen-line-bottom h-px screen-line-bottom-border" />
    </Panel>
  )
}
