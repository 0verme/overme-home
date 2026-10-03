"use client"

import { useSyncExternalStore } from "react"

import type { Locale } from "@/lib/i18n"
import { InlineScript } from "@/components/inline-script"
import { PanelTitle } from "@/features/portfolio/components/panel"

const ID = "hello"
export function HelloTitle({ locale = "zh" }: { locale?: Locale }) {
  // Server renders "Hello"; the client snapshot resolves the viewer's local
  // greeting, which also covers client-side navigation (no inline script).
  const greeting = useSyncExternalStore(
    () => () => {},
    () => getGreeting(locale),
    () => (locale === "zh" ? "你好" : "Hello")
  )

  return (
    <>
      <PanelTitle
        as="div"
        id={`${ID}-greeting`}
        className="font-handwritten leading-none"
        aria-hidden
        suppressHydrationWarning
      >
        {greeting}
      </PanelTitle>

      <InlineScript html={getInlineScript(`${ID}-greeting`, locale)} />
    </>
  )
}

// Self-contained (globals only) so it can be serialized via `.toString()` into
// the pre-hydration script as well as used as the client snapshot.
function getGreeting(locale: Locale) {
  const hour = new Date().getHours()
  if (locale === "zh") {
    if (hour < 12) return "上午好"
    if (hour < 17) return "下午好"
    return "晚上好"
  }
  if (hour >= 0 && hour < 12) return "Good morning"
  if (hour >= 12 && hour < 17) return "Good afternoon"
  return "Good evening"
}

function runGreetingScript(
  elementId: string,
  locale: Locale,
  compute: typeof getGreeting
) {
  try {
    const el = document.getElementById(elementId)
    if (el) el.textContent = compute(locale)
  } catch {}
}

// Blocking inline script that paints the greeting before hydration on the
// initial document load (Next.js "prevent flash before hydration").
function getInlineScript(elementId: string, locale: Locale) {
  return `(${runGreetingScript.toString()})(${JSON.stringify(elementId)},${JSON.stringify(locale)},${getGreeting.toString()})`
}
