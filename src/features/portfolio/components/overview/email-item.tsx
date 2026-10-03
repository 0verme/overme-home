"use client"

import { useId } from "react"
import { copyToClipboardWithEvent } from "@/utils/copy"
import { decodeEmail } from "@/utils/string"
import { useTiks } from "@rexa-developer/tiks/react"
import { MailIcon } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"

import { trackEvent } from "@/lib/events"
import type { Locale } from "@/lib/i18n"
import { useIsClient } from "@/hooks/use-is-client"
import { toast } from "@/components/ui/toast"
import { CopyButton } from "@/components/copy-button"

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"
import { RevealEncodedTextScript } from "./reveal-encoded-text"

type EmailItemProps = {
  emailB64: string
  locale?: Locale
}

export function EmailItem({ emailB64, locale = "zh" }: EmailItemProps) {
  const id = useId()
  const isClient = useIsClient()
  const emailDecoded = decodeEmail(emailB64)

  const { success } = useTiks()

  useHotkeys("shift+e", () => {
    copyToClipboardWithEvent(emailDecoded, {
      name: "copy_email",
      properties: {
        method: "keyboard",
        key: "shift+e",
      },
    })
    success()
    toast.add({
      type: "success",
      title: locale === "zh" ? "邮箱已复制" : "Email copied",
    })
  })

  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <MailIcon />
      </IntroItemIcon>

      <IntroItemContent className="flex">
        <IntroItemLink
          id={id}
          href={isClient ? `mailto:${emailDecoded}` : ""}
          suppressHydrationWarning
        >
          {isClient ? emailDecoded : ""}
        </IntroItemLink>
      </IntroItemContent>

      <div className="-translate-x-3 translate-y-0.5 opacity-0 transition-opacity ease-out group-hover:opacity-100 group-has-focus-visible:opacity-100 pointer-coarse:opacity-100">
        <CopyButton
          className="rounded-md border-none text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
          variant="ghost"
          size="icon-xs"
          aria-label={locale === "zh" ? "复制邮箱地址" : "Copy email address"}
          text={() => emailDecoded}
          onCopySuccess={() => {
            trackEvent({
              name: "copy_email",
              properties: {
                method: "button",
              },
            })
          }}
        />
      </div>

      <RevealEncodedTextScript id={id} textB64={emailB64} />
    </IntroItem>
  )
}
