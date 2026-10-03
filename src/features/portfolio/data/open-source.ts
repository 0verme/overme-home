import type { Locale } from "@/lib/i18n"

export const OPEN_SOURCE_CONTRIBUTIONS: {
  number: number
  url: string
  title: Record<Locale, string>
}[] = [
  {
    number: 10323,
    url: "https://github.com/t8y2/dbx/pull/10323",
    title: {
      zh: "插件卸载失败时保持状态一致",
      en: "Keep state consistent when plugin removal fails",
    },
  },
  {
    number: 10319,
    url: "https://github.com/t8y2/dbx/pull/10319",
    title: {
      zh: "插件变更后刷新前端状态",
      en: "Refresh the frontend after plugin changes",
    },
  },
  {
    number: 10244,
    url: "https://github.com/t8y2/dbx/pull/10244",
    title: {
      zh: "从右键菜单打开对应插件的 Workbench",
      en: "Open the matching plugin Workbench from the context menu",
    },
  },
]
