import type { Locale } from "@/lib/i18n"
import type { User } from "@/features/portfolio/types/user"

const sharedUser = {
  firstName: "",
  lastName: "",
  displayName: "0verme",
  username: "0verme",
  gender: "unspecified",
  pronouns: "",
  address: "杭州，中国",
  phoneNumberB64: "",
  emailB64: "aGVsbG9Ab3Zlcm1lLmNu",
  website: "https://overme.cn/",
  jobTitle: "",
  jobs: [],
  avatar: "/0verme-avatar.png",
  avatarSketch: "/0verme-avatar.png",
  avatarVariants: {
    lightOff: "/0verme-avatar.png",
    lightOn: "/0verme-avatar.png",
    darkOff: "/0verme-avatar.png",
    darkOn: "/0verme-avatar.png",
  },
  ogImage:
    "/og/simple?title=0verme&description=Data%20engineering%20and%20open%20source",
  namePronunciationUrl: "",
  timeZone: "Asia/Shanghai",
  keywords: ["0verme", "数据工程", "SQL", "开源", "AI"],
} satisfies Omit<User, "bio" | "flipSentences" | "about">

export const USERS: Record<Locale, User> = {
  zh: {
    ...sharedUser,
    bio: "数据工程 · AI 工具 · 独立开发",
    flipSentences: ["把数据问题做成可用的工具。", "记录实践，分享代码。"],
    about:
      "你好，我是 0verme，生活在杭州，长期从事数据平台、湖仓与数据工程。\n\n我把反复遇到的问题做成轻量工具，也用交互实验分享工程经验。最近在探索 AI 如何参与日常开发，同时把校验、权限与状态变更留在可验证的边界里。\n\n喜欢轻量、自托管、可审计的软件。这里记录真实项目里的约束、取舍和可运行的成果。欢迎通过 [GitHub](https://github.com/0verme)、[X](https://x.com/0verme8) 或 [邮件](mailto:hello@overme.cn) 交流。",
  },
  en: {
    ...sharedUser,
    address: "Hangzhou, China",
    keywords: ["0verme", "data engineering", "SQL", "open source", "AI"],
    bio: "Data engineering · AI tools · Independent software",
    flipSentences: [
      "Turning data problems into useful tools.",
      "Learning in public. Sharing the code.",
    ],
    about:
      "Hi, I'm 0verme, based in Hangzhou, China. My work focuses on data platforms, lakehouses, and data engineering.\n\nI turn recurring problems into lightweight tools and share engineering lessons through interactive experiments. I am also exploring AI-assisted development, while keeping validation, permissions, and state changes within verifiable boundaries.\n\nI value lightweight, self-hosted, auditable software. Here I share real constraints, trade-offs, and working implementations. Find me on [GitHub](https://github.com/0verme), [X](https://x.com/0verme8), or [email](mailto:hello@overme.cn).",
  },
}

export function getUser(locale: Locale = "zh") {
  return USERS[locale]
}

export const USER = USERS.zh
