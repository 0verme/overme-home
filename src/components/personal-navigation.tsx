"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { SearchIcon, XIcon } from "lucide-react"

import {
  alternatePath,
  blogPath,
  dictionaries,
  homePath,
  type Locale,
} from "@/lib/i18n"
import { ThemeToggle } from "@/components/theme-toggle"

export type SearchEntry = { title: string; description?: string; href: string }

export function PersonalNavigation({
  locale,
  entries,
}: {
  locale: Locale
  entries: SearchEntry[]
}) {
  const t = dictionaries[locale]
  const pathname = usePathname()
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [query, setQuery] = useState("")
  const [hash, setHash] = useState("")
  useEffect(() => {
    const update = () => setHash(window.location.hash)
    update()
    window.addEventListener("hashchange", update)
    const keydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        if (dialog.current?.open) dialog.current.close()
        else dialog.current?.showModal()
      }
    }
    window.addEventListener("keydown", keydown)
    return () => {
      window.removeEventListener("hashchange", update)
      window.removeEventListener("keydown", keydown)
    }
  }, [pathname])
  const links = [
    { title: t.blog, href: blogPath(locale) },
    { title: t.work, href: `${homePath(locale)}#projects` },
    { title: t.about, href: `${homePath(locale)}#hello` },
  ]
  const results = entries.filter((entry) =>
    `${entry.title} ${entry.description || ""}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase())
  )
  return (
    <>
      <header className="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2">
        <div className="screen-line-bottom mx-auto flex h-(--header-height) items-center gap-2 border-x px-4 md:max-w-3xl">
          <a
            className="font-heading text-sm font-semibold"
            href={homePath(locale)}
            aria-label={`0verme · ${t.home}`}
          >
            0verme
          </a>
          <nav
            className="ml-auto hidden items-center gap-5 text-sm text-muted-foreground sm:flex"
            aria-label={t.home}
          >
            {links.map((link) => (
              <a
                key={link.href}
                className="hover:text-foreground"
                href={link.href}
              >
                {link.title}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:ml-4">
            <button
              ref={trigger}
              className="rounded p-2 hover:bg-accent"
              onClick={() => dialog.current?.showModal()}
              aria-label={`${t.search} (Ctrl+K)`}
            >
              <SearchIcon className="size-4" />
            </button>
            <a
              className="rounded px-2 py-1 font-mono text-xs hover:bg-accent"
              href={`${alternatePath(pathname, locale)}${hash}`}
              hrefLang={locale === "zh" ? "en" : "zh-CN"}
              lang={locale === "zh" ? "en" : "zh-CN"}
              aria-label={locale === "zh" ? "Switch to English" : "切换为中文"}
            >
              {locale === "zh" ? "EN" : "中文"}
            </a>
            <ThemeToggle label={t.toggleTheme} />
          </div>
        </div>
      </header>
      <nav
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-xl border bg-background/95 p-1 shadow-md backdrop-blur sm:hidden"
        aria-label={t.home}
      >
        {[{ title: t.home, href: homePath(locale) }, ...links].map((link) => (
          <a
            key={link.href}
            className="rounded-lg px-3 py-2 text-sm whitespace-nowrap hover:bg-accent"
            href={link.href}
          >
            {link.title}
          </a>
        ))}
      </nav>
      <dialog
        ref={dialog}
        aria-label={t.search}
        className="fixed inset-0 m-auto max-h-[80svh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl border bg-background p-0 text-foreground shadow-xl backdrop:bg-black/50"
        onClose={() => trigger.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault()
            dialog.current?.close()
          }
        }}
      >
        <div className="flex items-center gap-2 border-b p-4">
          <label className="sr-only" htmlFor="site-search">
            {t.search}
          </label>
          <input
            id="site-search"
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent py-2 outline-none"
          />
          <button
            className="rounded p-2 hover:bg-accent"
            aria-label={t.close}
            onClick={() => dialog.current?.close()}
          >
            <XIcon className="size-4" />
          </button>
        </div>
        <ul className="space-y-1 p-2" aria-label={t.search}>
          {results.map((entry) => (
            <li key={entry.href}>
              <a
                className="block rounded-lg p-3 hover:bg-accent focus-visible:bg-accent"
                href={entry.href}
                onClick={() => dialog.current?.close()}
              >
                <span className="font-medium">{entry.title}</span>
                {entry.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
        {results.length === 0 && (
          <p className="p-6 text-muted-foreground" role="status">
            {t.empty}
          </p>
        )}
      </dialog>
    </>
  )
}
