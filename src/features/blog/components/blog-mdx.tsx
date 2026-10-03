import type { ComponentProps } from "react"
import { remarkHeading } from "fumadocs-core/mdx-plugins/remark-heading"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeExternalLinks from "rehype-external-links"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import type { Locale } from "@/lib/i18n"
import {
  rehypeCodeRawString,
  rehypeHighlightCode,
  rehypeHighlightCodeRawString,
} from "@/lib/rehype-code-block"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Code } from "@/components/ui/typography"
import { CodeBlockCaption } from "@/components/mdx-code-block"

import { BlogCodeCopy } from "./blog-actions"

export function BlogMDX({ code, locale }: { code: string; locale: Locale }) {
  return (
    <MDXRemote
      source={code}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkHeading],
          rehypePlugins: [
            [
              rehypeExternalLinks,
              { target: "_blank", rel: "noopener noreferrer" },
            ],
            rehypeSlug,
            rehypeCodeRawString,
            rehypeHighlightCode,
            rehypeHighlightCodeRawString,
          ],
        },
      }}
      components={{
        table: Table,
        thead: TableHeader,
        tbody: TableBody,
        tr: TableRow,
        th: TableHead,
        td: TableCell,
        code: Code,
        figure: ({ className, ...props }: ComponentProps<"figure">) => (
          <figure className={cn("not-prose", className)} {...props} />
        ),
        figcaption: CodeBlockCaption,
        pre: ({
          __rawString__,
          __withMeta__,
          ...props
        }: ComponentProps<"pre"> & {
          __rawString__?: string
          __withMeta__?: boolean
        }) => (
          <div
            className="group/pre relative rounded-[9px] border bg-code [--code-padding-right:4rem]"
            data-has-title={__withMeta__ || undefined}
          >
            <pre {...props} />
            {__rawString__ && (
              <BlogCodeCopy code={__rawString__} locale={locale} />
            )}
          </div>
        ),
      }}
    />
  )
}
