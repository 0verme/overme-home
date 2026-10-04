import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import { clampParam } from "../params"

const geistSemiBold = readFileSync(
  join(process.cwd(), "src/assets/fonts/Geist-SemiBold.ttf")
)

const geistMonoRegular = readFileSync(
  join(process.cwd(), "src/assets/fonts/GeistMono-Regular.ttf")
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = clampParam(searchParams.get("title"), 160)
  const description = clampParam(searchParams.get("description"), 320)

  return new ImageResponse(
    <div tw="flex h-full w-full bg-white text-zinc-950">
      <div tw="absolute inset-y-0 left-12 flex w-px border border-zinc-200" />
      <div tw="absolute inset-y-0 right-12 flex w-px border border-zinc-200" />
      <div tw="absolute inset-x-0 top-12 flex h-px border border-zinc-200" />
      <div tw="absolute inset-x-0 bottom-12 flex h-px border border-zinc-200" />

      <div tw="absolute top-18 left-18 flex font-mono text-xl tracking-widest text-zinc-500">
        0verme / PERSONAL HOME
      </div>

      <div tw="absolute inset-x-0 top-40 bottom-24 flex flex-col justify-end border-t-2 border-zinc-200">
        <div
          tw="border-t-2 border-b-2 border-zinc-200 px-18"
          style={{
            fontFamily: "GeistSans",
            fontWeight: 600,
            fontSize: 64,
            lineHeight: 1,
            textWrap: "balance",
            letterSpacing: "-0.025em",
          }}
        >
          {title}
        </div>

        {description && (
          <div tw="flex flex-col">
            <div
              tw="border-b-2 border-zinc-200 px-18 py-8 text-zinc-600"
              style={{
                fontFamily: "GeistMono",
                fontWeight: 400,
                fontSize: 32,
                lineHeight: 1.25,
                textWrap: "balance",
              }}
            >
              {description}
            </div>
          </div>
        )}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "GeistSans",
          data: geistSemiBold,
          weight: 600,
        },
        {
          name: "GeistMono",
          data: geistMonoRegular,
          weight: 400,
        },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=31536000, immutable",
      },
    }
  )
}
