import { Suspense } from "react"
import type { Metadata, Route } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowLeftIcon, ArrowRightIcon, RssIcon } from "lucide-react"
import type { Blog, BlogPosting, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { SITE_INFO, X_HANDLE } from "@/config/site"
import { blogPath, formatDate, homePath, type Locale } from "@/lib/i18n"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { Prose } from "@/components/ui/typography"
import { TOCInline } from "@/components/toc-inline"
import {
  DocContainer,
  DocContentCol,
  DocGrid,
  DocLeftCol,
  DocRightCol,
} from "@/features/doc/components/doc-layout"
import { DocPageRoot } from "@/features/doc/components/doc-page-root"
import {
  findNeighbour,
  getBlogPost,
  getBlogPosts,
} from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"

import { BlogActions, BlogKeyboardShortcuts } from "./blog-actions"
import { BlogFilterFallback, BlogFilters } from "./blog-filters"
import { BlogMDX } from "./blog-mdx"

const copy = {
  zh: {
    home: "首页",
    title: "写作",
    subtitle: "记录问题、取舍，以及走过的路。",
    description:
      "关于数据工程、可信的 AI 应用与独立开发，记录真实项目中的问题、约束和工程取舍。",
    rss: "订阅 RSS",
    published: "发布于",
    updated: "更新于",
    author: "作者",
    toc: "本文目录",
    back: "全部文章",
    previous: "上一篇",
    next: "下一篇",
    navigation: "文章导航",
    translation: "这是一篇译稿。",
    translatedAt: "翻译日期：",
    original: "阅读原文",
    tags: "文章标签",
  },
  en: {
    home: "Home",
    title: "Writing",
    subtitle: "Problems, trade-offs, and the work along the way.",
    description:
      "Notes on data engineering, trustworthy AI applications, and independent software: real problems, constraints, and engineering decisions.",
    rss: "Subscribe via RSS",
    published: "Published",
    updated: "Updated",
    author: "Author",
    toc: "On this page",
    back: "All articles",
    previous: "Previous article",
    next: "Next article",
    navigation: "Article navigation",
    translation:
      "This is an English translation of the original Chinese article.",
    translatedAt: "Translated: ",
    original: "Read the original",
    tags: "Article tags",
  },
}

function absolute(path: string) {
  return new URL(path, SITE_INFO.url).toString()
}

function translatedPost(doc: Doc, locale: Locale) {
  const other: Locale = locale === "zh" ? "en" : "zh"
  const post = getBlogPosts(other).find((candidate) =>
    doc.metadata.translationKey
      ? candidate.metadata.translationKey === doc.metadata.translationKey
      : candidate.slug === doc.slug
  )
  return post ? { locale: other, post } : undefined
}

function imageFor(doc?: Doc, locale: Locale = "zh") {
  if (doc?.metadata.image) return absolute(doc.metadata.image)
  const params = new URLSearchParams({
    title: doc?.metadata.title ?? copy[locale].title,
    description: doc?.metadata.description ?? copy[locale].description,
  })
  return absolute(`/og/simple?${params}`)
}

export function getBlogMetadata(locale: Locale, slug?: string): Metadata {
  const doc = slug ? getBlogPost(slug, locale) : undefined
  if (slug && !doc) notFound()
  const title = doc?.metadata.title ?? copy[locale].title
  const description = doc?.metadata.description ?? copy[locale].description
  const canonical = absolute(blogPath(locale, slug))
  const languages: Record<string, string> = {
    [locale === "zh" ? "zh-CN" : "en"]: canonical,
  }
  if (doc) {
    const counterpart = translatedPost(doc, locale)
    if (counterpart)
      languages[counterpart.locale === "zh" ? "zh-CN" : "en"] = absolute(
        blogPath(counterpart.locale, counterpart.post.slug)
      )
  } else {
    languages[locale === "zh" ? "en" : "zh-CN"] = absolute(
      blogPath(locale === "zh" ? "en" : "zh")
    )
  }
  if (languages["zh-CN"]) languages["x-default"] = languages["zh-CN"]
  const images = [
    { url: imageFor(doc, locale), width: 1200, height: 630, alt: title },
  ]

  return {
    title,
    description,
    authors: [
      {
        name: doc?.metadata.author ?? SITE_INFO.name,
        url: absolute(homePath(locale)),
      },
    ],
    alternates: {
      canonical,
      languages,
      types: { "application/rss+xml": absolute(`${blogPath(locale)}/rss`) },
    },
    openGraph: {
      title,
      description,
      siteName: SITE_INFO.name,
      url: canonical,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: Object.keys(languages)
        .filter(
          (key) =>
            key !== "x-default" && key !== (locale === "zh" ? "zh-CN" : "en")
        )
        .map((key) => (key === "zh-CN" ? "zh_CN" : "en_US")),
      images,
      ...(doc
        ? {
            type: "article",
            publishedTime: new Date(doc.metadata.createdAt).toISOString(),
            modifiedTime: new Date(doc.metadata.updatedAt).toISOString(),
            authors: [absolute(homePath(locale))],
            tags: doc.metadata.tags,
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: X_HANDLE,
      creator: X_HANDLE,
      images,
    },
  }
}

export function BlogIndex({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const posts = getBlogPosts(locale).map(({ slug, metadata }) => ({
    slug,
    metadata,
  }))
  const data: WithContext<Blog> = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": absolute(blogPath(locale)),
    name: t.title,
    description: t.description,
    url: absolute(blogPath(locale)),
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    isPartOf: { "@id": JSON_LD_ID.website },
    author: { "@type": "Person", "@id": JSON_LD_ID.person },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": absolute(blogPath(locale, post.slug)),
      headline: post.metadata.title,
      url: absolute(blogPath(locale, post.slug)),
      datePublished: new Date(post.metadata.createdAt).toISOString(),
      author: {
        "@type": "Person",
        "@id": JSON_LD_ID.person,
        name: post.metadata.author ?? SITE_INFO.name,
      },
    })),
  }

  return (
    <div
      lang={locale === "zh" ? "zh-CN" : "en"}
      className="mx-auto min-h-svh border-x md:max-w-3xl"
    >
      <JsonLdScript data={data} />
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: t.home, href: homePath(locale) },
          { name: t.title, href: blogPath(locale) },
        ])}
      />
      <header className="px-4 pt-12 pb-8 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-medium tracking-tight">{t.title}</h1>
          <a
            href={`${blogPath(locale)}/rss`}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RssIcon className="size-3.5" aria-hidden="true" />
            {t.rss}
          </a>
        </div>
        <p className="mt-4 text-lg/8 text-balance">{t.subtitle}</p>
        <p className="mt-2 max-w-2xl text-sm/7 text-muted-foreground">
          {t.description}
        </p>
      </header>
      <Suspense fallback={<BlogFilterFallback posts={posts} locale={locale} />}>
        <BlogFilters posts={posts} locale={locale} />
      </Suspense>
      <div className="h-12" />
    </div>
  )
}

export async function BlogArticle({
  locale,
  slug,
}: {
  locale: Locale
  slug: string
}) {
  const doc = getBlogPost(slug, locale)
  if (!doc) notFound()
  const t = copy[locale]
  const toc = getTableOfContents(doc.content)
  const { previous, next } = findNeighbour(getBlogPosts(locale), slug)
  const path = blogPath(locale, slug)
  const counterpart = translatedPost(doc, locale)
  const data: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absolute(path),
    headline: doc.metadata.title,
    description: doc.metadata.description,
    image: imageFor(doc, locale),
    url: absolute(path),
    mainEntityOfPage: absolute(path),
    datePublished: new Date(doc.metadata.createdAt).toISOString(),
    dateModified: new Date(doc.metadata.updatedAt).toISOString(),
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    author: {
      "@type": "Person",
      "@id": JSON_LD_ID.person,
      name: doc.metadata.author ?? SITE_INFO.name,
    },
    isPartOf: {
      "@type": "Blog",
      "@id": absolute(blogPath(locale)),
      name: t.title,
      url: absolute(blogPath(locale)),
    },
    ...(doc.metadata.translationOf && counterpart
      ? {
          translationOfWork: {
            "@id": absolute(
              blogPath(counterpart.locale, counterpart.post.slug)
            ),
          },
        }
      : {}),
  }

  return (
    <>
      <JsonLdScript data={data} />
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: t.home, href: homePath(locale) },
          { name: t.title, href: blogPath(locale) },
          { name: doc.metadata.title, href: path },
        ])}
      />
      <BlogKeyboardShortcuts
        previous={previous ? blogPath(locale, previous.slug) : undefined}
        next={next ? blogPath(locale, next.slug) : undefined}
      />
      <DocPageRoot lang={locale === "zh" ? "zh-CN" : "en"}>
        <DocContainer>
          <div className="border-b px-4 py-3">
            <Link
              href={blogPath(locale) as Route}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              {t.back}
            </Link>
          </div>
          <header className="px-4 pt-8 pb-6 sm:px-6">
            <h1
              data-slot="doc-title"
              className="text-3xl/relaxed font-medium tracking-tight text-balance sm:text-4xl/normal"
            >
              {doc.metadata.title}
            </h1>
            <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs/6 text-muted-foreground">
              <div className="flex gap-1.5">
                <dt>{t.author}</dt>
                <dd>{doc.metadata.author ?? SITE_INFO.name}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>{t.published}</dt>
                <dd>
                  <time dateTime={doc.metadata.createdAt}>
                    {formatDate(doc.metadata.createdAt, locale)}
                  </time>
                </dd>
              </div>
              {doc.metadata.updatedAt !== doc.metadata.createdAt && (
                <div className="flex gap-1.5">
                  <dt>{t.updated}</dt>
                  <dd>
                    <time dateTime={doc.metadata.updatedAt}>
                      {formatDate(doc.metadata.updatedAt, locale)}
                    </time>
                  </dd>
                </div>
              )}
            </dl>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={t.tags}>
              {doc.metadata.tags?.map((tag) => (
                <li key={tag}>
                  <Link
                    href={
                      `${blogPath(locale)}?${new URLSearchParams({ tag })}` as Route
                    }
                    className="inline-block rounded-md border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
            {doc.metadata.translationOf && (
              <p className="mt-5 rounded-lg border bg-muted/40 p-3 text-xs/6 text-muted-foreground">
                {t.translation}{" "}
                {doc.metadata.translatedAt && (
                  <>
                    {t.translatedAt}
                    <time dateTime={doc.metadata.translatedAt}>
                      {formatDate(doc.metadata.translatedAt, locale)}
                    </time>
                    .{" "}
                  </>
                )}
                {counterpart && (
                  <Link
                    href={
                      blogPath(
                        counterpart.locale,
                        counterpart.post.slug
                      ) as Route
                    }
                    hrefLang={counterpart.locale === "zh" ? "zh-CN" : "en"}
                    className="underline underline-offset-4"
                  >
                    {t.original}
                  </Link>
                )}
              </p>
            )}
            <div className="mt-5">
              <BlogActions
                locale={locale}
                slug={slug}
                title={doc.metadata.title}
                sourcePath={doc.metadata.sourcePath}
              />
            </div>
          </header>
        </DocContainer>
        <DocGrid>
          <DocLeftCol />
          <DocContentCol>
            <article>
              <Prose className="px-4 pt-2 pb-8 sm:px-6">
                <p className="text-lg/8 text-muted-foreground">
                  {doc.metadata.description}
                </p>
                <TOCInline className="my-6 lg:hidden" items={toc}>
                  {t.toc}
                </TOCInline>
                <BlogMDX code={doc.content} locale={locale} />
              </Prose>
            </article>
            <nav
              aria-label={t.navigation}
              className="grid grid-cols-1 gap-4 border-t p-4 sm:grid-cols-2 sm:p-6"
            >
              {previous ? (
                <Link
                  href={blogPath(locale, previous.slug) as Route}
                  className="rounded-lg border p-4 transition-colors hover:bg-accent-muted"
                >
                  <span className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
                    {t.previous}
                  </span>
                  <span className="text-sm/6">{previous.metadata.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  href={blogPath(locale, next.slug) as Route}
                  className="rounded-lg border p-4 transition-colors hover:bg-accent-muted"
                >
                  <span className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    {t.next}
                    <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-sm/6">{next.metadata.title}</span>
                </Link>
              )}
            </nav>
          </DocContentCol>
          <DocRightCol>
            {toc.length > 0 && (
              <nav
                aria-label={t.toc}
                className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto px-5 py-4"
              >
                <p className="mb-3 text-xs font-medium">{t.toc}</p>
                <ul className="space-y-3">
                  {toc.map((item) => (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        data-depth={item.depth}
                        className="block text-xs/5 text-muted-foreground hover:text-foreground data-[depth=3]:pl-3 data-[depth=4]:pl-6"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </DocRightCol>
        </DocGrid>
      </DocPageRoot>
    </>
  )
}
