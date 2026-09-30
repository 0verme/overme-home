export type Project = {
  /** Stable unique identifier (used as list key/anchor). */
  id: string
  title: string
  /** One or two concise sentences describing the problem it addresses. */
  description: string
  category: string
  status: string
  /** Public URL (site, repository, or demo). */
  link: string
  /** A small set of core technologies or topics. */
  skills: string[]
  /** Inline SVG icon, framed in a tile; defaults to a box icon. */
  icon?: React.ReactElement
}
