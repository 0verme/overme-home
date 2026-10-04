import { usageMetadata } from "@/features/ai-usage/metadata"
import { UsagePage } from "@/features/ai-usage/usage-page"

export const revalidate = 300
export const metadata = usageMetadata("zh")

export default function Page() {
  return <UsagePage locale="zh" />
}
