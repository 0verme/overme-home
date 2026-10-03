"use client"

import { useEffect, useState } from "react"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { CheckIcon, CodeIcon, CopyIcon, Share2Icon } from "lucide-react"

import { blogPath, type Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { GitHubIcon } from "@/components/icons"

export function BlogActions({
  locale,
  slug,
  title,
  sourcePath,
}: {
  locale: Locale
  slug: string
  title: string
  sourcePath?: string
}) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const t =
    locale === "zh"
      ? {
          copy: "复制 Markdown",
          view: "Markdown",
          source: "查看源文件",
          share: "分享",
          copied: "已复制文章 Markdown",
          shared: "分享已完成",
          link: "已复制文章链接",
          error: "操作未完成，请重试，或打开 Markdown 页面手动复制。",
        }
      : {
          copy: "Copy Markdown",
          view: "Markdown",
          source: "View source",
          share: "Share",
          copied: "Article Markdown copied",
          shared: "Article shared",
          link: "Article link copied",
          error:
            "Could not complete the action. Try again, or open the Markdown page to copy it manually.",
        }
  const path = blogPath(locale, slug)
  const markdownUrl = `${path}.md`

  async function copyMarkdown() {
    if (busy) return
    setBusy(true)
    setMessage("")
    try {
      const response = await fetch(markdownUrl)
      if (!response.ok) throw new Error("Markdown request failed")
      const text = await response.text()
      await navigator.clipboard.writeText(text)
      setMessage(t.copied)
    } catch {
      setMessage(t.error)
    } finally {
      setBusy(false)
    }
  }

  async function share() {
    const url = new URL(path, window.location.origin).toString()
    setMessage("")
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        setMessage(t.shared)
      } else {
        await navigator.clipboard.writeText(url)
        setMessage(t.link)
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return
      setMessage(t.error)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={busy}
          aria-busy={busy}
          onClick={copyMarkdown}
        >
          <CopyIcon aria-hidden="true" />
          {t.copy}
        </Button>
        <Button size="sm" variant="ghost" onClick={share}>
          <Share2Icon aria-hidden="true" />
          {t.share}
        </Button>
        <a
          href={markdownUrl}
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <CodeIcon className="size-3.5" aria-hidden="true" />
          {t.view}
        </a>
        {sourcePath && (
          <a
            href={`https://github.com/0verme/overme-home/blob/main/${sourcePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <GitHubIcon className="size-3.5" aria-hidden="true" />
            {t.source}
          </a>
        )}
      </div>
      <p className="mt-2 min-h-4 text-xs text-muted-foreground" role="status">
        {message}
      </p>
    </div>
  )
}

export function BlogKeyboardShortcuts({
  previous,
  next,
}: {
  previous?: string
  next?: string
}) {
  const router = useRouter()

  useEffect(() => {
    function navigate(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      )
        return
      const target = event.target
      if (
        target instanceof Element &&
        target.closest(
          "input, textarea, select, button, a, [contenteditable]:not([contenteditable='false']), [role='textbox'], [role='slider'], [role='combobox'], [role='dialog']"
        )
      )
        return
      if (window.getSelection()?.toString()) return
      const href =
        event.key === "ArrowLeft"
          ? previous
          : event.key === "ArrowRight"
            ? next
            : undefined
      if (!href) return
      event.preventDefault()
      router.push(href as Route)
    }
    window.addEventListener("keydown", navigate)
    return () => window.removeEventListener("keydown", navigate)
  }, [previous, next, router])

  return null
}

export function BlogCodeCopy({
  code,
  locale,
}: {
  code: string
  locale: Locale
}) {
  const [state, setState] = useState<"idle" | "done" | "error">("idle")
  const label =
    locale === "zh"
      ? state === "done"
        ? "已复制"
        : state === "error"
          ? "复制失败，请重试"
          : "复制代码"
      : state === "done"
        ? "Copied"
        : state === "error"
          ? "Copy failed; try again"
          : "Copy code"

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code)
          setState("done")
        } catch {
          setState("error")
        }
      }}
    >
      {state === "done" ? (
        <CheckIcon className="size-4" aria-hidden="true" />
      ) : (
        <CopyIcon className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only" role="status">
        {state === "idle" ? "" : label}
      </span>
    </button>
  )
}
