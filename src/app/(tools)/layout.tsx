import { siteMetadata } from "@/lib/site-metadata"
import { RootDocument } from "@/components/root-document"

export { viewport } from "@/components/root-document"
export const metadata = siteMetadata("en")

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootDocument locale="en">{children}</RootDocument>
}
