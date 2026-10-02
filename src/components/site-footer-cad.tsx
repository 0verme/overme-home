import Link from "next/link"

import { MAIN_NAV, SITE_INFO } from "@/config/site"
import { cn } from "@/lib/utils"
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand"
import { SOCIAL } from "@/features/portfolio/data/social-links"

/** Footer keeps the site's line-grid language while pointing to personal work. */
export function SiteFooterCad() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x group-has-data-[slot=layout-wide]/layout:container md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom screen-line-top-border before:z-1">
          <div className="stripe-divider h-12" />
        </div>

        <div className="relative">
          <div className="screen-line-bottom flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 font-mono text-sm">
            <span className="font-medium">0verme</span>
            <span className="font-sans text-muted-foreground">
              {SITE_INFO.description}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-line font-mono sm:grid-cols-3">
            {MAIN_NAV.map(({ href, title }) => (
              <Field key={title} label={title}>
                <Link className="link-underline" href={href}>
                  {title}
                </Link>
              </Field>
            ))}

            {[SOCIAL.github, SOCIAL.x].map((profile) => (
              <Field key={profile.title} label={profile.title}>
                <a
                  className="link-underline"
                  href={profile.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  {profile.handle}
                </a>
              </Field>
            ))}

            <Field label="Email">
              <a className="link-underline" href="mailto:hello@overme.cn">
                hello@overme.cn
              </a>
            </Field>
          </dl>
        </div>

        <div className="screen-line-top h-4" />
      </div>

      <SiteFooterInteractiveLogotype />

      <div className="h-(--fade-bottom-height)" />
      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  )
}

function Field({
  className,
  label,
  children,
}: {
  className?: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 bg-background px-4 py-3",
        className
      )}
    >
      <dt className="text-[0.625rem]/4 font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}
