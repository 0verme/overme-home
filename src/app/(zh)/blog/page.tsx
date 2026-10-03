import {
  BlogIndex,
  getBlogMetadata,
} from "@/features/blog/components/localized-blog"

export const generateMetadata = () => getBlogMetadata("zh")
export default function Page() {
  return <BlogIndex locale="zh" />
}
