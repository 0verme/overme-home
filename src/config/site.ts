import type { Route } from "next"

import type { NavItem } from "@/types/nav"
import { SOCIAL } from "@/features/portfolio/data/social-links"

export const SITE_INFO = {
  name: "0verme",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://chanhdai.com",
  ogImage: "/og/simple?title=0verme&description=Open-source%20starter",
  description: "A customizable open-source starter with a component registry.",
  keywords: ["0verme", "open source", "UI components", "shadcn registry"],
}

export const LICENSE = {
  name: "MIT License",
  url: "https://github.com/0verme/overme-home/blob/main/LICENSE",
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "Components",
    href: "/components",
  },
  {
    title: "Blocks",
    href: "/blocks",
  },
  {
    title: "Blog",
    href: "/blog",
  },
]

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
  ...MAIN_NAV,
]

export const X_HANDLE = SOCIAL.x.handle || undefined
export const GITHUB_USERNAME = SOCIAL.github.handle
export const SOURCE_CODE_GITHUB_REPO = "0verme/overme-home"
export const SOURCE_CODE_GITHUB_URL = "https://github.com/0verme/overme-home"

export const SPONSORSHIP_URL = "https://github.com/sponsors/0verme"

export const UTM_PARAMS = {
  utm_source: "overme-home",
}
