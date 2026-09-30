import { GitHubIcon } from "@/components/icons"
import { SOCIAL } from "@/features/portfolio/data/social-links"

export function NavItemGitHub() {
  return (
    <a
      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      href={SOCIAL.github.href}
      target="_blank"
      rel="me noopener noreferrer"
      aria-label="GitHub profile: 0verme"
      title="GitHub"
    >
      <GitHubIcon className="size-4" />
    </a>
  )
}
