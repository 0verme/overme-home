import { usageMetadata } from "@/features/ai-usage/metadata"
import { UsagePage } from "@/features/ai-usage/usage-page"

export const revalidate = 300
export const metadata = usageMetadata("en")

export default function Page() {
  return <UsagePage locale="en" />
}
