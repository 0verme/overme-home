import "@/styles/globals.css"

import Link from "next/link"

export const metadata = { title: "404 · 0verme", robots: { index: false } }

export default function GlobalNotFound() {
  return (
    <html lang="zh-CN">
      <body className="grid min-h-svh place-items-center bg-background text-foreground">
        <main className="space-y-6 p-8 text-center">
          <h1 className="font-mono text-6xl">404</h1>
          <p>页面不存在 · Page not found</p>
          <p className="flex justify-center gap-8">
            <Link className="underline" href="/">
              返回首页
            </Link>
            <a className="underline" href="/en" lang="en">
              English home
            </a>
          </p>
        </main>
      </body>
    </html>
  )
}
