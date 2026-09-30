import type { Person } from "schema-dts"

import { SITE_INFO } from "@/config/site"
import { SOCIAL } from "@/features/portfolio/data/social-links"

/** Stable IDs let crawlers associate structured data with the site URL. */
export const JSON_LD_ID = {
  website: `${SITE_INFO.url}/#website`,
  person: `${SITE_INFO.url}/#person`,
} as const

export const personJsonLd: Person = {
  "@type": "Person",
  "@id": JSON_LD_ID.person,
  name: SITE_INFO.name,
  url: SITE_INFO.url,
  jobTitle: "Data Product Builder",
  sameAs: [SOCIAL.github.href, SOCIAL.x.href],
  knowsAbout: [
    "Data infrastructure",
    "Data products",
    "Data engineering",
    "Open source",
  ],
}
