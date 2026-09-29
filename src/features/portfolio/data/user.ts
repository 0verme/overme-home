import type { User } from "@/features/portfolio/types/user"

/** Replace these neutral values with information you intend to publish. */
export const USER: User = {
  firstName: "",
  lastName: "",
  displayName: "0verme",
  username: "0verme",
  gender: "unspecified",
  pronouns: "",
  bio: "A customizable starter for your own site.",
  flipSentences: [
    "A customizable starter for your own site.",
    "Explore reusable components.",
    "Build something new.",
  ],
  address: "",
  phoneNumberB64: "",
  emailB64: "",
  website: "",
  jobTitle: "Open-source starter",
  jobs: [],
  about:
    "This is a neutral placeholder profile. Add only the personal information you choose to publish.",
  avatar: "/icon.svg",
  avatarVariants: {
    lightOff: "/icon.svg",
    lightOn: "/icon.svg",
    darkOff: "/icon.svg",
    darkOn: "/icon.svg",
  },
  ogImage: "/og/simple?title=0verme&description=Open-source%20starter",
  namePronunciationUrl: "",
  timeZone: "Etc/UTC",
  keywords: ["0verme", "open source", "UI components", "shadcn registry"],
}
