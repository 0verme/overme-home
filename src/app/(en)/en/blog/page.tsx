import {
  BlogIndex,
  getBlogMetadata,
} from "@/features/blog/components/localized-blog"

export const generateMetadata = () => getBlogMetadata("en")
export default function Page() {
  return <BlogIndex locale="en" />
}
