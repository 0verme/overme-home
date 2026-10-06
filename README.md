# 0verme Home

0verme · 见远而行。A bilingual personal home for data engineering, AI tools, writing, and open source.

> **Fork attribution:** This repository is a fork of [ncdai/chanhdai.com](https://github.com/ncdai/chanhdai.com). The upstream MIT license, copyright notice, and trademark policy are retained.

## About this fork

The homepage presents a verified public profile, four selected projects, writing, and upstream contributions. Chinese lives at `/` and `/blog`; English lives at `/en` and `/en/blog`. Shared components retain the original Portfolio layout, light and dark themes, and interactive geometry.

The blog contains four articles in each language, migrated from Myblog. The English data warehouse essay is a new translation with an explicit translation date and original link. See [the migration guide](./docs/BLOG_MIGRATION.md) and [41 legacy URL mappings](./docs/blog-redirects.json). These changes do not deploy the site or switch production domains.

## Preserved capabilities

- Next.js App Router application with light and dark themes
- shadcn/ui component and block registry with previews and install instructions
- MDX documentation, blog, RSS, sitemap, and `llms.txt` endpoints
- PWA manifest, SEO metadata, and JSON-LD structured data
- Command menu, responsive navigation, and shared UI primitives

Portfolio and social information is limited to verified public sources. Other optional personal datasets remain empty. Registry and component documentation retain their original URLs and English content.

## Getting started

Requirements: Node.js 22 or later and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

If using Portless, the local host is `https://overme-home.localhost`. Configure `.env.local` for your local setup; do not add credentials to the repository.

## Useful commands

```bash
pnpm lint
pnpm check-types
pnpm test:run
pnpm registry:build
pnpm registry:validate
pnpm build
```

`pnpm registry:build` regenerates registry outputs. Review its generated-file changes carefully and do not include unrelated build artifacts in a commit.

## Project structure

- `src/registry/` — reusable components, hooks, blocks, examples, and styles
- `src/features/doc/content/` — MDX blog and component documentation
- `src/features/portfolio/data/` — localized public profile, selected projects, and open-source stats
- `src/features/doc/content/blog/{zh,en}/` — articles paired by `translationKey`
- [`docs/OPEN_SOURCE_STATS.md`](./docs/OPEN_SOURCE_STATS.md) — featured repos and automatic stats refresh
- `src/config/` — site, registry, and structured-data configuration
- `docs/PHASE0_AUDIT.md` — retained scope and baseline verification notes

The registry namespace and URL are configured in `src/config/registry.ts` and environment variables. The upstream production registry URL remains unchanged until a separately approved domain migration.

The site defaults to `https://overme.cn`; use `NEXT_PUBLIC_APP_URL` for local or preview builds. Personal pages use separate Chinese and English root layouts so their server-rendered `html lang` is correct. Language switches perform full navigation; the theme preference persists. The component registry has its own shared English root layout.

## License and attribution

The upstream [MIT License](./LICENSE) and original copyright notice are preserved. See [TRADEMARK.md](./TRADEMARK.md) for the upstream trademark policy. This fork's source is available at [0verme/overme-home](https://github.com/0verme/overme-home).
