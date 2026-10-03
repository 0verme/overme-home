"use client"

import { usePathname } from "next/navigation"
import { useRouter } from "@bprogress/next/app"
import { useHotkeys } from "react-hotkeys-hook"

import { trackEvent } from "@/lib/events"

export function KeyboardShortcuts() {
  const router = useRouter()
  const prefix = usePathname().match(/^\/en(?:\/|$)/) ? "/en" : ""

  const navigate = (path: string, keys: string) => {
    trackEvent({
      name: "keyboard_shortcut_navigate",
      properties: { path, keys },
    })
    router.push(path)
  }

  useHotkeys("g>h", () => navigate(prefix || "/", "g>h"))
  useHotkeys("g>c", () => navigate("/components", "g>c"))
  useHotkeys("g>b", () => navigate("/blocks", "g>b"))
  useHotkeys("g>r", () => navigate("/craft", "g>r"))
  useHotkeys("g>l", () => navigate(`${prefix}/blog`, "g>l"))
  useHotkeys("g>s", () => navigate("/sponsors", "g>s"))
  useHotkeys("g>m", () => navigate("/bookmarks", "g>m"))
  useHotkeys("g>i", () => navigate("/insights", "g>i"))
  useHotkeys("g>t", () => navigate("/testimonials", "g>t"))

  return null
}
