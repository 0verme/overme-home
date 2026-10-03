import { homeMetadata } from "@/lib/site-metadata"
import { LocalizedHome } from "@/features/portfolio/components/localized-home"

export const metadata = homeMetadata("zh")
export default function Page() {
  return <LocalizedHome locale="zh" />
}
