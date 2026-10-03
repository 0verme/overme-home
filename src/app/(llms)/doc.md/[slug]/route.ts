import { notFound } from "next/navigation"

import {
  getComponentDoc,
  getComponentDocs,
} from "@/features/doc/data/documents"
import { getLLMText } from "@/features/doc/lib/get-llm-text"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  const docs = getComponentDocs()

  return docs.map((doc) => ({
    slug: doc.slug,
  }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const post = getComponentDoc(slug)

  if (!post) {
    notFound()
  }

  return new Response(await getLLMText(post), {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
