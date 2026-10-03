"use client"

import type { FormEvent } from "react"
import type { Route } from "next"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpRightIcon, SearchIcon } from "lucide-react"

import { blogPath, formatDate, type Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

import { filterPosts, type BlogPreview } from "../lib/filter-posts"

const labels = {
  zh: {
    search: "搜索标题与摘要",
    searchButton: "搜索",
    tag: "标签",
    allTags: "全部标签",
    year: "年份",
    allYears: "全部年份",
    clear: "清除筛选",
    empty: "没有找到符合条件的文章。试试其他关键词或清除筛选。",
    date: "发布日期",
    read: "阅读全文",
    results: (count: number) => `${count} 篇文章`,
  },
  en: {
    search: "Search titles and summaries",
    searchButton: "Search",
    tag: "Tag",
    allTags: "All tags",
    year: "Year",
    allYears: "All years",
    clear: "Clear filters",
    empty: "No matching articles. Try another search or clear the filters.",
    date: "Published on",
    read: "Read article",
    results: (count: number) =>
      `${count} ${count === 1 ? "article" : "articles"}`,
  },
}

export function BlogList({
  posts,
  locale,
}: {
  posts: BlogPreview[]
  locale: Locale
}) {
  const t = labels[locale]

  return (
    <div>
      <p
        className="px-4 py-3 font-mono text-xs text-muted-foreground"
        role="status"
      >
        {t.results(posts.length)}
      </p>
      <ul className="divide-y border-y">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="group relative p-4 transition-colors hover:bg-accent-muted sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <time dateTime={post.metadata.createdAt} aria-label={t.date}>
                  {formatDate(post.metadata.createdAt, locale)}
                </time>
                <span aria-hidden="true">/</span>
                <span>{post.metadata.author ?? "0verme"}</span>
              </div>
              <h2 className="text-xl/snug font-medium tracking-tight sm:text-2xl">
                <Link href={blogPath(locale, post.slug) as Route}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  {post.metadata.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-2xl text-sm/7 text-muted-foreground">
                {post.metadata.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-2" aria-label={t.tag}>
                  {post.metadata.tags?.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <span
                  className="flex items-center gap-1 text-xs"
                  aria-hidden="true"
                >
                  {t.read}
                  <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </article>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="p-6 text-sm text-muted-foreground">{t.empty}</li>
        )}
      </ul>
    </div>
  )
}

function FilterForm({
  posts,
  locale,
  q = "",
  tag = "",
  year = "",
  onSubmit,
}: {
  posts: BlogPreview[]
  locale: Locale
  q?: string
  tag?: string
  year?: string
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}) {
  const t = labels[locale]
  const tags = [
    ...new Set(posts.flatMap((post) => post.metadata.tags ?? [])),
  ].sort((a, b) => a.localeCompare(b, locale))
  const years = [
    ...new Set(posts.map((post) => post.metadata.createdAt.slice(0, 4))),
  ]
    .sort()
    .reverse()
  const fieldClass =
    "h-10 min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <form
      action={blogPath(locale)}
      method="get"
      role="search"
      onSubmit={onSubmit}
      className="border-y p-4"
    >
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="blog-query">
          {t.search}
        </label>
        <input
          id="blog-query"
          type="search"
          name="q"
          defaultValue={q}
          placeholder={t.search}
          className={`${fieldClass} flex-1`}
        />
        <Button type="submit" variant="secondary" className="h-10">
          <SearchIcon className="size-4" aria-hidden="true" />
          {t.searchButton}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="blog-tag">
          {t.tag}
        </label>
        <select
          id="blog-tag"
          name="tag"
          defaultValue={tag}
          className={fieldClass}
          onChange={
            onSubmit
              ? (event) => event.currentTarget.form?.requestSubmit()
              : undefined
          }
        >
          <option value="">{t.allTags}</option>
          {tag && !tags.includes(tag) && <option value={tag}>{tag}</option>}
          {tags.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="blog-year">
          {t.year}
        </label>
        <select
          id="blog-year"
          name="year"
          defaultValue={year}
          className={fieldClass}
          onChange={
            onSubmit
              ? (event) => event.currentTarget.form?.requestSubmit()
              : undefined
          }
        >
          <option value="">{t.allYears}</option>
          {year && !years.includes(year) && (
            <option value={year}>{year}</option>
          )}
          {years.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {(q || tag || year) && (
          <Link
            className="px-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            href={blogPath(locale) as Route}
          >
            {t.clear}
          </Link>
        )}
      </div>
    </form>
  )
}

export function BlogFilterFallback(props: {
  posts: BlogPreview[]
  locale: Locale
}) {
  return (
    <>
      <FilterForm {...props} />
      <BlogList {...props} />
    </>
  )
}

export function BlogFilters({
  posts,
  locale,
}: {
  posts: BlogPreview[]
  locale: Locale
}) {
  const params = useSearchParams()
  const router = useRouter()
  const filters = {
    q: params.get("q") ?? "",
    tag: params.get("tag") ?? "",
    year: params.get("year") ?? "",
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next = new URLSearchParams()
    for (const key of ["q", "tag", "year"]) {
      const value = String(data.get(key) ?? "").trim()
      if (value) next.set(key, value)
    }
    const query = next.toString()
    router.replace(`${blogPath(locale)}${query ? `?${query}` : ""}` as Route, {
      scroll: false,
    })
  }

  return (
    <>
      <FilterForm
        key={params.toString()}
        posts={posts}
        locale={locale}
        {...filters}
        onSubmit={submit}
      />
      <BlogList posts={filterPosts(posts, filters)} locale={locale} />
    </>
  )
}
