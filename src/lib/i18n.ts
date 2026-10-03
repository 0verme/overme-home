import type { Route } from "next"

export type Locale = "zh" | "en"

export const LOCALES: Locale[] = ["zh", "en"]

export function homePath(locale: Locale) {
  return locale === "en" ? "/en" : "/"
}

export function blogPath(locale: Locale, slug?: string) {
  return `${locale === "en" ? "/en" : ""}/blog${slug ? `/${slug}` : ""}` as Route
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value))
}

export function alternatePath(pathname: string, locale: Locale) {
  const unprefixed = pathname.replace(/^\/en(?=\/|$)/, "") || "/"
  return locale === "zh"
    ? `/en${unprefixed === "/" ? "" : unprefixed}`
    : unprefixed
}

export const dictionaries = {
  zh: {
    home: "首页",
    blog: "文章",
    work: "作品",
    about: "关于",
    search: "搜索",
    searchPlaceholder: "搜索文章、项目或页面…",
    empty: "未找到匹配内容",
    close: "关闭",
    toggleTheme: "切换明暗主题",
    skip: "跳到正文",
    source: "源码",
    subscribe: "RSS 订阅",
    description:
      "数据工程、AI 工具与独立开发。记录真实项目里的约束、取舍和可运行的成果。",
    footer: "把复杂系统做小，把 AI 放在可验证的边界里。",
    attribution: "基于",
    license: "许可",
    resources: "开发资源",
    components: "组件",
    blocks: "区块",
    aiUsage: "AI 足迹",
  },
  en: {
    home: "Home",
    blog: "Writing",
    work: "Work",
    about: "About",
    search: "Search",
    searchPlaceholder: "Search writing, projects or pages…",
    empty: "No results found",
    close: "Close",
    toggleTheme: "Toggle theme",
    skip: "Skip to content",
    source: "Source",
    subscribe: "RSS feed",
    description:
      "Data engineering, AI tools and independent software. Notes on real constraints, trade-offs and working implementations.",
    footer:
      "Make complex systems smaller. Keep AI within verifiable boundaries.",
    attribution: "Built on",
    license: "License",
    resources: "Developer resources",
    components: "Components",
    blocks: "Blocks",
    aiUsage: "AI usage",
  },
} as const
