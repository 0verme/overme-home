import type { Locale } from "@/lib/i18n"

import { FeaturedPosts } from "./featured-posts"
import { Hello } from "./hello"
import { OpenSource } from "./open-source"
import { Overview } from "./overview"
import { ProfileHeader } from "./profile-header"
import { Projects } from "./projects"
import { SocialLinks } from "./social-links"

export function LocalizedHome({ locale }: { locale: Locale }) {
  return (
    <div className="[--separator-height:--spacing(8)] **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
      <div className="mx-auto md:max-w-3xl">
        <ProfileHeader locale={locale} />
        <Separator />
        <SocialLinks locale={locale} />
        <Overview locale={locale} />
        <Separator />
        <Hello locale={locale} />
        <Separator />
        <Projects locale={locale} />
        <Separator />
        <FeaturedPosts locale={locale} />
        <Separator />
        <OpenSource locale={locale} />
      </div>
    </div>
  )
}

function Separator() {
  return (
    <div
      className="stripe-divider h-(--separator-height) w-full border-x"
      aria-hidden
    />
  )
}
