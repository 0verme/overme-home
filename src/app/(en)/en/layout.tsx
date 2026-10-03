import { siteMetadata } from "@/lib/site-metadata"
import { PersonalShell } from "@/components/personal-shell"
import { RootDocument } from "@/components/root-document"

export { viewport } from "@/components/root-document"
export const metadata = siteMetadata("en")

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootDocument locale="en">
      <PersonalShell locale="en">{children}</PersonalShell>
    </RootDocument>
  )
}
