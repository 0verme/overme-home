import { describe, expect, it } from "vitest"

import { PROJECTS } from "./projects"
import { SOCIAL_LINKS } from "./social-links"
import { TECH_STACK } from "./tech-stack"
import { USER } from "./user"

describe("personal home content", () => {
  it("publishes only confirmed profile and social details", () => {
    expect(USER.displayName).toBe("0verme")
    expect(USER.username).toBe("0verme")
    expect(USER.phoneNumberB64).toBe("")
    expect(USER.address).toBe("Hangzhou, China")
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

  it("lists the six unranked, evidence-backed work candidates", () => {
    expect(PROJECTS.map(({ title }) => title)).toEqual([
      "Lakehouse Toolkit",
      "SchemaSeed",
      "Plan Detective",
      "sql.sb",
      "lineage-viewer",
      "LarkLedger",
    ])
    expect(
      PROJECTS.every(({ category, description, link, status }) =>
        Boolean(category && description && link && status)
      )
    ).toBe(true)
    expect(PROJECTS.find(({ title }) => title === "sql.sb")?.link).toBe(
      "https://sql.sb"
    )
  })
})
