import type { Locale } from "@/lib/i18n"
import { getUser } from "@/features/portfolio/data/user"

import { FlipSentences } from "./flip-sentences"
import { HandwrittenArrow, HandwrittenNote } from "./handwritten-note"
import { NeutralIsometricPlaceholder } from "./neutral-isometric-placeholder"
import { PronounceMyName } from "./pronounce-my-name"

export function ProfileHeader({ locale = "zh" }: { locale?: Locale }) {
  const user = getUser(locale)
  return (
    <div className="screen-line-bottom grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x screen-line-bottom-border after:z-1">
      <figure className="relative col-span-2 grid min-h-48 place-items-center p-2 sm:col-span-1 sm:col-start-2 sm:p-4">
        <NeutralIsometricPlaceholder />

        <HandwrittenNote
          className="bottom-20 left-full hidden w-36 flex-col items-start pointer-fine:xl:flex"
          aria-hidden
        >
          <HandwrittenArrow className="-scale-y-100 -rotate-6" />
          <span className="ml-3 -rotate-6">
            {locale === "zh"
              ? "移动光标，探索结构"
              : "move the cursor, explore the structure"}
          </span>
        </HandwrittenNote>

        <figcaption className="pointer-events-none absolute right-2 bottom-2 text-sm/none tracking-wide text-[color-mix(in_oklab,var(--muted-foreground)_60%,var(--background))] tabular-nums select-none sm:right-4 sm:bottom-4">
          {locale === "zh"
            ? "图 1. 从数据到结构"
            : "Fig. 1. From data to structure"}
        </figcaption>
      </figure>

      <div className="flex flex-col sm:row-span-2 sm:row-start-1">
        <div className="screen-line-top mt-auto shrink-0 border-r border-line">
          <div className="mx-0.5 my-0.75 flex outline-none">
            <div className="relative size-30 rounded-full min-[24rem]:size-32 sm:size-40">
              <img
                className="block size-full rounded-[inherit] object-cover select-none dark:hidden"
                src={user.avatarSketch || user.avatar}
                alt={locale === "zh" ? "0verme 的头像" : "0verme's avatar"}
              />
              <img
                className="hidden size-full rounded-[inherit] object-cover select-none dark:block"
                src={user.avatar}
                alt={locale === "zh" ? "0verme 的头像" : "0verme's avatar"}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] inset-ring-1 inset-ring-foreground/30 dark:inset-ring-foreground/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="z-1 mt-auto border-t border-line">
          <div className="flex -translate-x-px items-center gap-2 pl-4">
            <h1 className="-translate-y-px text-[2rem]/none font-medium tracking-tight">
              {user.displayName}
            </h1>

            {user.namePronunciationUrl && (
              <PronounceMyName
                namePronunciationUrl={user.namePronunciationUrl}
              />
            )}
          </div>

          <p className="py-2 pl-4 text-sm text-muted-foreground">
            {locale === "zh"
              ? "见远而行 · Horizon Joins Journey"
              : "Horizon Joins Journey · 见远而行"}
          </p>
          <FlipSentences className="h-12.5 border-t border-line py-1 pl-4 sm:h-9">
            {user.flipSentences}
          </FlipSentences>
        </div>
      </div>
    </div>
  )
}
