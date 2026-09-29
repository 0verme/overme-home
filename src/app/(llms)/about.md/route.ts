import { SOURCE_CODE_GITHUB_URL } from "@/config/site"

const content = `# 0verme Home

A customizable open-source starter that preserves a reusable component registry, blocks, and documentation shell.

## Explore

- [Components](/components)
- [Blocks](/blocks)
- [Blog](/blog)
- [Source code](${SOURCE_CODE_GITHUB_URL})

## Fork attribution

This repository is a fork of [ncdai/chanhdai.com](https://github.com/ncdai/chanhdai.com). The original MIT license and copyright notice are retained.
`

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
