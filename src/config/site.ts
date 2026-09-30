import type { Route } from "next"

import type { NavItem } from "@/types/nav"
import { SOCIAL } from "@/features/portfolio/data/social-links"

export const SITE_INFO = {
  name: "0verme",
  url: "https://overme.cn",
  ogImage: `/og/simple?title=0verme&description=${encodeURIComponent("数据基础设施与数据产品")}`,
  description: "为数据工程构建实用工具，关注数据基础设施、数据产品与开源项目。",
  keywords: [
    "0verme",
    "数据基础设施",
    "数据产品",
    "数据工程",
    "开源工具",
    "AI 与数据",
  ],
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
    title: "Notes",
    href: "/blog",
  },
  {
    title: "Work",
    href: "/#projects",
  },
  {
    title: "About",
    href: "/#hello",
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
