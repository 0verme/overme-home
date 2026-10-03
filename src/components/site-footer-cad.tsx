import { LICENSE, SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { blogPath, dictionaries, type Locale } from "@/lib/i18n"
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand"

export function SiteFooterCad({ locale = "en" }: { locale?: Locale }) {
  const t = dictionaries[locale]
  return (
    <footer className="max-w-screen overflow-x-clip px-2 pb-20 sm:pb-4">
      <div className="mx-auto border-x md:max-w-3xl">
        <div className="stripe-divider h-10 border-y" />
        <div className="screen-line-bottom flex flex-wrap items-baseline justify-between gap-2 p-4">
          <span className="font-mono text-sm font-medium">
            0verme · 见远而行
          </span>
          <p className="max-w-sm text-sm text-muted-foreground">{t.footer}</p>
        </div>
        <dl className="grid grid-cols-2 text-sm sm:grid-cols-4">
          {[
            {
              label: t.source,
              links: [{ title: "GitHub", href: SOURCE_CODE_GITHUB_URL }],
            },
            {
              label: t.subscribe,
              links: [
                {
                  title: locale === "zh" ? "中文文章" : "English writing",
                  href: `${blogPath(locale)}/rss`,
                },
              ],
            },
            {
              label: t.resources,
              links: [
                { title: t.components, href: "/components" },
                { title: t.blocks, href: "/blocks" },
              ],
            },
            {
              label: t.license,
              links: [
                { title: "MIT", href: LICENSE.url },
                {
                  title: "llms.txt",
                  href: locale === "zh" ? "/llms.txt" : "/en/llms.txt",
                },
              ],
            },
          ].map((field) => (
            <div
              key={field.label}
              className="border-r border-b p-4 last:border-r-0"
            >
              <dt className="mb-2 font-mono text-xs text-muted-foreground">
                {field.label}
              </dt>
              <dd className="flex flex-wrap gap-3">
                {field.links.map((link) => (
                  <a
                    key={link.href}
                    className="link-underline"
                    href={link.href}
                  >
                    {link.title}
                  </a>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <p className="border-b px-4 py-3 text-xs text-muted-foreground">
          {t.attribution}{" "}
          <a
            className="link-underline"
            href="https://github.com/ncdai/chanhdai.com"
          >
            ncdai/chanhdai.com
          </a>{" "}
          ·{" "}
          {locale === "zh"
            ? "保留原作者版权与 MIT 许可"
            : "Original copyright and MIT license retained"}
        </p>
        <SiteFooterInteractiveLogotype />
      </div>
    </footer>
  )
}
