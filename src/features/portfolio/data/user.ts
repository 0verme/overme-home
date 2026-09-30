import { SITE_INFO } from "@/config/site"
import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "",
  lastName: "",
  displayName: "0verme",
  username: "0verme",
  gender: "unspecified",
  pronouns: "",
  bio: "为数据工程构建实用工具。",
  flipSentences: [
    "数据基础设施与产品",
    "构建实用的开源工具",
    "记录工程里的真实取舍",
  ],
  address: "Hangzhou, China",
  phoneNumberB64: "",
  emailB64: "aGVsbG9Ab3Zlcm1lLmNu",
  website: "https://overme.cn",
  jobTitle: "Data Product Builder",
  jobs: [],
  about: `关注数据基础设施、湖仓与数据工程，喜欢把工程里反复出现的问题，整理成更容易理解和使用的工具。\n\n也在做数据产品与开源工具，并探索 AI 如何进入真实的数据系统。这里记录作品，以及实践中的取舍。`,
  avatar: "/profile-placeholder-dark.svg",
  avatarSketch: "/profile-placeholder-light.svg",
  avatarVariants: {
    lightOff: "/profile-placeholder-light.svg",
    lightOn: "/profile-placeholder-light.svg",
    darkOff: "/profile-placeholder-dark.svg",
    darkOn: "/profile-placeholder-dark.svg",
  },
  ogImage: SITE_INFO.ogImage,
  namePronunciationUrl: "",
  timeZone: "Asia/Shanghai",
  keywords: [
    "0verme",
    "数据基础设施",
    "数据产品",
    "数据工程",
    "开源工具",
    "AI 与数据",
  ],
}
