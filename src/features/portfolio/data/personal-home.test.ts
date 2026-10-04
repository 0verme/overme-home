import { describe, expect, it } from "vitest"

import { getProjects, PROJECTS } from "./projects"
import { SOCIAL_LINKS } from "./social-links"
import { TECH_STACK } from "./tech-stack"
import { getUser, USER } from "./user"

describe("personal home content", () => {
  it("publishes only confirmed profile and social details", () => {
    expect(USER.displayName).toBe("0verme")
    expect(USER.username).toBe("0verme")
    expect(USER.phoneNumberB64).toBe("")
    expect(USER.address).toBe("杭州，中国")
    expect(getUser("en").address).toBe("Hangzhou, China")
    expect(USER.timeZone).toBe("Asia/Shanghai")
    expect(atob(USER.emailB64)).toBe("hello@overme.cn")
    expect(SOCIAL_LINKS.map(({ href }) => href)).toEqual([
      "https://x.com/0verme8",
      "https://github.com/0verme",
    ])
  })

  it("keeps the stack curated across the four intended categories", () => {
    expect(TECH_STACK.length).toBeLessThanOrEqual(16)
    expect(new Set(TECH_STACK.flatMap(({ categories }) => categories))).toEqual(
      new Set(["Data", "Build", "AI", "Infrastructure"])
    )
  })

  it("lists the four selected projects consistently in both languages", () => {
    expect(PROJECTS.map(({ id }) => id)).toEqual([
      "data-warehouse-visualized",
      "data-asset-portal",
      "lineage-viewer",
      "pi-agent-pulse",
    ])
    expect(getProjects("en").map(({ id }) => id)).toEqual(
      PROJECTS.map(({ id }) => id)
    )
    expect(
      PROJECTS.every(({ summary, description, link, repositoryUrl }) =>
        Boolean(summary && description && link && repositoryUrl)
      )
    ).toBe(true)
    expect(
      PROJECTS.find(({ id }) => id === "data-warehouse-visualized")?.demoUrl
    ).toBe("https://sql.sb/")
  })
})
