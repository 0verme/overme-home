import { SITE_INFO } from "@/config/site"

export default function Page() {
  return (
    <div className="max-w-screen overflow-x-clip">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="font-heading text-5xl font-semibold tracking-tight">
          {SITE_INFO.name}
        </h1>
        <p className="max-w-xl text-muted-foreground">
          {SITE_INFO.description}
        </p>
      </div>
    </div>
  )
}
