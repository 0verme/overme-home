import type { Metadata } from "next"

import { SITE_INFO } from "@/config/site"
import { dictionaries, homePath, type Locale } from "@/lib/i18n"

export function siteMetadata(locale: Locale): Metadata {
  const description = dictionaries[locale].description
  const image = `/og/simple?title=0verme&description=${encodeURIComponent(description)}`
  return {
    metadataBase: new URL(SITE_INFO.url),
    title: { template: "%s – 0verme", default: "0verme · 见远而行" },
    description,
    keywords: SITE_INFO.keywords,
    authors: [{ name: "0verme", url: SITE_INFO.url }],
    creator: "0verme",
    openGraph: {
      siteName: "0verme · 见远而行",
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? "en_US" : "zh_CN",
      images: [
        { url: image, width: 1200, height: 630, alt: "0verme · 见远而行" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@0verme8",
      images: [image],
    },
    icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  }
}

export function homeMetadata(locale: Locale): Metadata {
  const metadata = siteMetadata(locale)
  const title =
    locale === "zh" ? "0verme · 见远而行" : "0verme · Horizon Joins Journey"
  return {
    ...metadata,
    title: { absolute: title },
    openGraph: {
      ...metadata.openGraph,
      title,
      description: dictionaries[locale].description,
      url: homePath(locale),
    },
    twitter: {
      ...metadata.twitter,
      title,
      description: dictionaries[locale].description,
    },
    alternates: {
      canonical: homePath(locale),
      languages: { "zh-CN": "/", en: "/en", "x-default": "/" },
    },
  }
}
