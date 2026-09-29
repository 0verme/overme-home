import type { SocialProfile } from "@/features/portfolio/types/social-links"

/**
 * Profiles are left blank until the site owner configures them. GitHub points
 * to the repository owner; remove any links that should not be published.
 */
export const SOCIAL = {
  x: { title: "X", handle: "", href: "", sameAs: false },
  github: {
    title: "GitHub",
    handle: "0verme",
    href: "https://github.com/0verme",
    sameAs: true,
  },
  linkedin: { title: "LinkedIn", handle: "", href: "", sameAs: false },
  discord: { title: "Discord", handle: "", href: "", sameAs: false },
  youtube: { title: "YouTube", handle: "", href: "", sameAs: false },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
)
  .filter(([, profile]) => Boolean(profile.handle && profile.href))
  .map(([name, profile]) => ({ name, ...profile }))
