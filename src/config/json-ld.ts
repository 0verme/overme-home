import type { Organization, Person } from "schema-dts"

import { SITE_INFO, SOURCE_CODE_GITHUB_URL } from "@/config/site"

/** Stable IDs let crawlers associate structured data with the site URL. */
export const JSON_LD_ID = {
  website: `${SITE_INFO.url}/#website`,
  organization: `${SITE_INFO.url}/#organization`,
  person: `${SITE_INFO.url}/#person`,
} as const

export const organizationJsonLd: Organization = {
  "@type": "Organization",
  "@id": JSON_LD_ID.organization,
  name: SITE_INFO.name,
  url: SITE_INFO.url,
  sameAs: [SOURCE_CODE_GITHUB_URL],
}

export const personJsonLd = {
  "@type": "Person",
  "@id": JSON_LD_ID.person,
  name: "0verme",
  alternateName: "jearhe",
  url: SITE_INFO.url,
  image: `${SITE_INFO.url}/0verme-avatar.png`,
  sameAs: ["https://github.com/0verme", "https://x.com/0verme8"],
} satisfies Person
