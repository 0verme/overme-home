import {
  blogPath,
  dictionaries,
  homePath,
  tokensPath,
  type Locale,
} from "@/lib/i18n"
import {
  PersonalNavigation,
  type SearchEntry,
} from "@/components/personal-navigation"
import { SiteFooterCad } from "@/components/site-footer-cad"
import { getBlogPosts } from "@/features/doc/data/documents"
import { getProjects } from "@/features/portfolio/data/projects"

export function PersonalShell({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const t = dictionaries[locale]
  const entries: SearchEntry[] = [
    { title: t.home, href: homePath(locale) },
    { title: t.blog, href: blogPath(locale) },
    { title: t.aiUsage, href: tokensPath(locale) },
    { title: t.work, href: `${homePath(locale)}#projects` },
    { title: t.about, href: `${homePath(locale)}#hello` },
    ...getBlogPosts(locale).map((post) => ({
      title: post.metadata.title,
      description: post.metadata.description,
      href: blogPath(locale, post.slug),
    })),
    ...getProjects(locale).map((project) => ({
      title: project.title,
      description: project.summary,
      href: `${homePath(locale)}#projects-${project.id}`,
    })),
  ]
  return (
    <div className="group/layout relative isolate">
      <a
        href="#main-content"
        className="fixed top-2 left-2 z-100 -translate-y-20 rounded bg-foreground p-3 text-background focus:translate-y-0"
      >
        {t.skip}
      </a>
      <PersonalNavigation locale={locale} entries={entries} />
      <main id="main-content" className="max-w-screen overflow-x-clip px-2">
        {children}
      </main>
      <SiteFooterCad locale={locale} />
    </div>
  )
}
