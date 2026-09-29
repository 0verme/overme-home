# 0verme Home

A customizable open-source starter with a reusable component registry, blocks, and documentation shell.

> **Fork attribution:** This repository is a fork of [ncdai/chanhdai.com](https://github.com/ncdai/chanhdai.com). The upstream MIT license, copyright notice, and trademark policy are retained.

## About this fork

Phase 0 replaces the public profile with neutral placeholders while keeping reusable UI, registry, documentation, and build infrastructure. It does not deploy the site, migrate content, or change the existing production domain.

## Preserved capabilities

- Next.js App Router application with light and dark themes
- shadcn/ui component and block registry with previews and install instructions
- MDX documentation, blog, RSS, sitemap, and `llms.txt` endpoints
- PWA manifest, SEO metadata, and JSON-LD structured data
- Command menu, responsive navigation, and shared UI primitives

Portfolio, social, bookmark, craft, sponsor, and recognition data starts empty. Add only information and media you intend to publish.

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
- `src/features/portfolio/data/` — optional profile data, initially cleared
- `src/config/` — site, registry, and structured-data configuration
- `docs/PHASE0_AUDIT.md` — retained scope and baseline verification notes

The registry namespace and URL are configured in `src/config/registry.ts` and environment variables. The upstream production registry URL remains unchanged until a separately approved domain migration.

## License and attribution

The upstream [MIT License](./LICENSE) and original copyright notice are preserved. See [TRADEMARK.md](./TRADEMARK.md) for the upstream trademark policy. This fork's source is available at [0verme/overme-home](https://github.com/0verme/overme-home).
