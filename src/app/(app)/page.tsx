import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { Button } from "@/components/ui/button"
import { GitHubIcon } from "@/components/icons"

export const metadata: Metadata = {
  title: "Home",
  description:
    "A customizable open-source starter with reusable components and blocks.",
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-3xl flex-col justify-center gap-8 px-4 py-20">
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        0verme / starter
      </p>

      <div className="space-y-4">
        <h1 className="font-heading text-4xl font-medium tracking-tight sm:text-6xl">
          Make this space yours.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Personal profile content has been cleared. This shell keeps the
          reusable component and block registry ready for your next idea.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          className="gap-2"
          nativeButton={false}
          render={<Link href="/components" />}
        >
          Explore components
          <ArrowRightIcon />
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          nativeButton={false}
          render={<Link href="/blocks" />}
        >
          Browse blocks
          <ArrowRightIcon />
        </Button>
      </div>

      <p className="border-t pt-6 text-sm text-muted-foreground">
        Forked from{" "}
        <a
          className="text-foreground link-underline"
          href="https://github.com/ncdai/chanhdai.com"
          target="_blank"
          rel="noreferrer"
        >
          ncdai/chanhdai.com
        </a>
        . Original MIT copyright and trademark notices are retained.
      </p>

      <a
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        href={SOURCE_CODE_GITHUB_URL}
        target="_blank"
        rel="noreferrer"
      >
        <GitHubIcon className="size-4" />
        View 0verme/overme-home source
      </a>
    </section>
  )
}
