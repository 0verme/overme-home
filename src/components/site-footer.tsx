import { LICENSE, SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { cn } from "@/lib/utils"
import { GitHubIcon } from "@/components/icons"
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand"

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line group-has-data-[slot=layout-wide]/layout:container md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        <dl className="flex flex-col gap-4 py-8 font-mono [&_dd]:text-sm [&_dt]:text-right [&_dt]:text-sm [&_dt]:text-muted-foreground">
          <Item>
            <dt>Forked from</dt>
            <dd>
              <a
                className="link-underline"
                href="https://github.com/ncdai/chanhdai.com"
                target="_blank"
                rel="noopener"
              >
                ncdai/chanhdai.com
              </a>
            </dd>
          </Item>

          <Item>
            <dt>Source code</dt>
            <dd>
              <a
                className="link-underline"
                href={SOURCE_CODE_GITHUB_URL}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
            </dd>
          </Item>

          <Item>
            <dt>License</dt>
            <dd>
              <a
                className="link-underline"
                href={LICENSE.url}
                target="_blank"
                rel="noopener"
              >
                {LICENSE.name}
              </a>
            </dd>
          </Item>
        </dl>

        <div className="screen-line-top screen-line-bottom flex items-center px-4 py-3 text-muted-foreground">
          <a
            className="mr-auto flex items-center transition-[color] hover:text-foreground"
            href={SOURCE_CODE_GITHUB_URL}
            target="_blank"
            rel="noopener"
            aria-label="0verme Home source code on GitHub"
          >
            <GitHubIcon className="size-4" />
          </a>
        </div>
      </div>

      <SiteFooterInteractiveLogotype />

      <div className="h-(--fade-bottom-height)" />
      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  )
}

function Item({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-2 gap-4", className)} {...props} />
}
