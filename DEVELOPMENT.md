# Development

This guide explains how to set up and work on 0verme Home locally.

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later
- [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)
- [Portless](https://port1355.dev/) if you want the configured local hostname

## Setup

### 1. Clone the fork

```bash
git clone https://github.com/0verme/overme-home.git
cd overme-home
```

### 2. Install dependencies and configure the environment

```bash
pnpm install
cp .env.example .env.local
```

Edit `.env.local` for your own development environment. Keep credentials out of Git.

### 3. Run the development server

```bash
pnpm dev
```

With Portless, the configured local URL is `https://overme-home.localhost`.

## Validation

```bash
pnpm lint
pnpm check-types
pnpm test:run
pnpm registry:validate
pnpm build
```

`pnpm build` runs `pnpm registry:build` first. Registry generation updates files under `public/r/` and other generated outputs; review and restore unrelated generated changes before committing.

## Registry

The project uses the [shadcn registry](https://ui.shadcn.com/docs/registry). Source definitions live in `src/registry/`; build the registry with:

```bash
pnpm registry:build
```

The registry namespace and URL pattern are configurable in `src/config/registry.ts` and `.env.local`. The upstream production registry URL is intentionally unchanged in Phase 0.

## Optional profile features

Portfolio and related feature modules remain available for reuse, but their data starts empty. Add profile details, social links, bookmarks, craft entries, or sponsor data only when you intend to publish them. Review image and media rights before adding assets.

## Fork attribution

This repository is a fork of [ncdai/chanhdai.com](https://github.com/ncdai/chanhdai.com). The upstream MIT license, copyright notice, and trademark policy are retained. Phase 0 does not deploy the site or migrate its production domain.
