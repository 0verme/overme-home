import { LICENSE, SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { blogPath, dictionaries, type Locale } from "@/lib/i18n"

export function SiteFooterCad({ locale = "en" }: { locale?: Locale }) {
  const t = dictionaries[locale]
  return (
    <footer className="max-w-screen overflow-x-clip px-2 pb-20 sm:pb-4">
      <div className="mx-auto border-x md:max-w-3xl">
        <div className="stripe-divider h-6 border-y" />
        <div className="screen-line-bottom flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono font-medium">
            {locale === "zh" ? "0verme · 见远而行" : "0verme"}
          </span>
          <nav
            aria-label={locale === "zh" ? "页脚链接" : "Footer links"}
            className="flex flex-wrap items-center gap-x-4 text-muted-foreground"
          >
            <a className="py-2 link-underline" href={SOURCE_CODE_GITHUB_URL}>
              GitHub
            </a>
            <a className="py-2 link-underline" href={`${blogPath(locale)}/rss`}>
              {t.subscribe}
            </a>
            <a className="py-2 link-underline" href={LICENSE.url}>
              MIT
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
