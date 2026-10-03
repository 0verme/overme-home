import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { blogPath, formatDate, type Locale } from "@/lib/i18n"
import { getBlogPosts } from "@/features/doc/data/documents"

import { Panel, PanelHeader, PanelTitle } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

export function FeaturedPosts({ locale }: { locale: Locale }) {
  const posts = getBlogPosts(locale)
    .filter((post) => post.metadata.pinned)
    .slice(0, 2)

  if (posts.length === 0) return null

  return (
    <Panel id="blog">
      <PanelHeader>
        <PanelTitle>
          <a href="#blog">
            {locale === "zh" ? "精选文章" : "Selected writing"}
          </a>
          <PanelTitleCopy id="blog" locale={locale} />
        </PanelTitle>
      </PanelHeader>
      <ul className="grid sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-line sm:odd:border-r">
            <article className="relative flex h-full flex-col gap-3 p-4 transition-colors hover:bg-accent-muted">
              <time
                className="font-mono text-xs text-muted-foreground"
                dateTime={post.metadata.createdAt}
              >
                {formatDate(post.metadata.createdAt, locale)}
              </time>
              <h3 className="text-lg/snug font-medium text-balance">
                <Link href={blogPath(locale, post.slug)}>
                  <span className="absolute inset-0" aria-hidden />
                  {post.metadata.title}
                </Link>
              </h3>
              <p className="text-sm/relaxed text-pretty text-muted-foreground">
                {post.metadata.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm">
                {locale === "zh" ? "阅读全文" : "Read article"}
                <ArrowRightIcon className="size-3.5" aria-hidden />
              </span>
            </article>
          </li>
        ))}
      </ul>
      <div className="flex justify-center p-4">
        <Link
          className="inline-flex items-center gap-2 text-sm link-underline"
          href={blogPath(locale)}
        >
          {locale === "zh" ? "全部文章" : "All articles"}
          <ArrowRightIcon className="size-4" aria-hidden />
        </Link>
      </div>
    </Panel>
  )
}
