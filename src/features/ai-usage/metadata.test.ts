import { describe, expect, it } from "vitest"

import { BLOG_MIGRATION, blogRedirects } from "@/lib/blog-redirects"
import { alternatePath, tokensPath } from "@/lib/i18n"

import { usageMetadata } from "./metadata"

describe("AI usage bilingual routing", () => {
  it.each(["zh", "en"] as const)(
    "keeps %s canonicals and language alternatives on the new pages",
    (locale) => {
      const path = tokensPath(locale)
      const metadata = usageMetadata(locale)
      expect(metadata.alternates?.canonical).toBe(path)
      expect(metadata.alternates?.languages).toEqual({
        "zh-CN": "/tokens",
        en: "/en/tokens",
        "x-default": "/tokens",
      })
      expect(metadata.openGraph?.url).toBe(path)
      expect(metadata.description).toBeTruthy()
      expect(metadata.twitter?.title).toBe(metadata.title)
      expect(alternatePath(path, locale)).toBe(
        tokensPath(locale === "zh" ? "en" : "zh")
      )
      expect(
        BLOG_MIGRATION.find((route) => route.source === `${path}/`)?.destination
      ).toBe(path)
      expect(blogRedirects.some((route) => route.source === path)).toBe(false)
    }
  )
})
