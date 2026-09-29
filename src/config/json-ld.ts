import type { Organization } from "schema-dts"

import { SITE_INFO, SOURCE_CODE_GITHUB_URL } from "@/config/site"

/** Stable IDs let crawlers associate structured data with the site URL. */
export const JSON_LD_ID = {
  website: `${SITE_INFO.url}/#website`,
  organization: `${SITE_INFO.url}/#organization`,
} as const

export const organizationJsonLd: Organization = {
  "@type": "Organization",
  "@id": JSON_LD_ID.organization,
  name: SITE_INFO.name,
  url: SITE_INFO.url,
  sameAs: [SOURCE_CODE_GITHUB_URL],
}
