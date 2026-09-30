import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import { Hello } from "@/features/portfolio/components/hello"
import { Overview } from "@/features/portfolio/components/overview"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { Projects } from "@/features/portfolio/components/projects"
import { SocialLinks } from "@/features/portfolio/components/social-links"
import { TechStack } from "@/features/portfolio/components/tech-stack"
import { PROJECTS } from "@/features/portfolio/data/projects"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { TECH_STACK } from "@/features/portfolio/data/tech-stack"

export const metadata: Metadata = {
  title: { absolute: "0verme — 数据产品与数据工程" },
  description: "为数据工程构建实用工具，关注数据基础设施、数据产品与开源项目。",
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return (
    <div className="[--separator-height:--spacing(8)] **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
      <div className="mx-auto md:max-w-3xl">
        <ProfileHeader />
        <Separator />

        {SOCIAL_LINKS.length > 0 && <SocialLinks />}
        <Overview />
        <GitHubContributions />
        <Separator />

        <Hello />
        {TECH_STACK.length > 0 && (
          <>
            <TechStack />
            <Separator />
          </>
        )}
        {PROJECTS.length > 0 ? (
          <>
            <Projects />
            <Separator />
          </>
        ) : (
          <span id="projects" className="block scroll-mt-24" aria-hidden />
        )}
      </div>
    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "stripe-divider h-(--separator-height) w-full border-x",
        className
      )}
    />
  )
}
