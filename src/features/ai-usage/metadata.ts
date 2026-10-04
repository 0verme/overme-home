import type { Metadata } from "next"

import { tokensPath, type Locale } from "@/lib/i18n"
import { siteMetadata } from "@/lib/site-metadata"

import { usageCopy } from "./copy"

export function usageMetadata(locale: Locale): Metadata {
  const base = siteMetadata(locale)
  const { title, description } = usageCopy[locale]
  const image = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
  return {
    ...base,
    title,
    description,
    alternates: {
      canonical: tokensPath(locale),
      languages: {
        "zh-CN": "/tokens",
        en: "/en/tokens",
        "x-default": "/tokens",
      },
    },
    openGraph: {
      ...base.openGraph,
      title,
      description,
      url: tokensPath(locale),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { ...base.twitter, title, description, images: [image] },
  }
}
