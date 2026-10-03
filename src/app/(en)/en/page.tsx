import { homeMetadata } from "@/lib/site-metadata"
import { LocalizedHome } from "@/features/portfolio/components/localized-home"

export const metadata = homeMetadata("en")
export default function Page() {
  return <LocalizedHome locale="en" />
}
