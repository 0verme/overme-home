import type { AvatarLightsVariants } from "@/features/portfolio/components/avatar-lights"

export type User = {
  firstName: string
  lastName: string
  /** Preferred public-facing name */
  displayName: string
  /** Handle/username used in links or mentions */
  username: string
  gender: "male" | "female" | "non-binary" | "unspecified"
  /** e.g. "he/him", "she/her", "they/them" */
  pronouns: string
  bio: string
  /** Short phrases rotated in UI (e.g., homepage flip effect) */
  flipSentences: string[]
  /** General location for display */
  address: string
  /** E.164 format, base64 encoded */
  phoneNumberB64: string
  /** Base64 encoded */
  emailB64: string
  /** Personal/homepage URL */
  website: string
  /** Primary/current role shown on profile */
  jobTitle: string
  /** Work history entries */
  jobs: {
    title: string
    company: string
    website: string
    experienceId?: string
  }[]
  /** Rich about section; supports Markdown */
  about: string
  /** Public URL to avatar image */
  avatar: string
  avatarSketch?: string
  /** Different avatar variants based on theme and lighting */
  avatarVariants: AvatarLightsVariants
  /** Open Graph image URL for social sharing */
  ogImage: string
  /** Audio URL for name pronunciation */
  namePronunciationUrl: string
  /** SEO keywords list for metadata */
  keywords: string[]
  /** Time zone in IANA format (e.g., "Etc/UTC") */
  timeZone: string
}
