import { siteMetadata } from "@/lib/site-metadata"
import { PersonalShell } from "@/components/personal-shell"
import { RootDocument } from "@/components/root-document"

export { viewport } from "@/components/root-document"
export const metadata = siteMetadata("zh")

export default function ChineseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootDocument locale="zh">
      <PersonalShell locale="zh">{children}</PersonalShell>
    </RootDocument>
  )
}
