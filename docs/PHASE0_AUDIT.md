# Phase 0 audit

## Baseline

- Fork: `0verme/overme-home`
- Upstream: `ncdai/chanhdai.com`
- Starting commit: `1951e213749f58787fc2211cb1cfdc4f386de033`
- Working branch: `chore/phase0-overme-baseline`

The upstream baseline is a working Next.js portfolio and shadcn registry. Phase 0 turns the visible site into a neutral 0verme placeholder while keeping the reusable registry and its tooling intact.

## Keep

- Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, theming, responsive shell, search/command menu, SEO, sitemap, RSS and LLM-readable document endpoints.
- The component/block registry, their documentation, examples, previews, existing generated registry artifacts, and the registry build/validation workflow.
- Reusable MDX, code-highlighting, Open Graph and content-loading infrastructure.
- The original `LICENSE` text and upstream `TRADEMARK.md`; neither is to be rewritten as part of rebranding.

Registry components and documentation can contain original package names, author attribution, third-party examples, and references to upstream-hosted assets. These are inherited project content, not the 0verme site identity; do not blanket-replace them or commit regenerated `public/r` artifacts during Phase 0.

## Reset or remove from the public shell

- Site identity, page metadata, header/footer branding, local-development hostname, package/repository metadata, sponsorship/reviewer ownership and PWA metadata.
- The upstream owner's private/contact/profile data and personal portfolio datasets (social profiles, jobs, education, projects, awards, testimonials, timeline, craft, bookmarks and sponsor data). Keep reusable schemas and rendering code where practical, with empty or explicit starter data.
- Autobiographical/identity-specific blog posts and the root portfolio composition. Keep generic technical articles and the blog/document system.

## Phase 0 result

- The root page, metadata, navigation, footer, logos, PWA assets, package/repository metadata, and local development hostname now use neutral 0verme branding.
- Profile/contact and portfolio datasets start empty; social links include only the 0verme GitHub profile. The vCard endpoint returns 404 until contact details are configured.
- Removed 12 autobiographical or identity-specific blog posts; kept the generic Uptime Kuma and image-border tutorials and the MDX blog/document system.
- Navigation and sitemap focus on the reusable components, blocks, and blog. Personal-only portfolio pages remain available as reusable modules but are not linked from the public shell.
- Upstream attribution is explicit in the README, development guide, LLM about endpoint, and footer. `LICENSE` and `TRADEMARK.md` are unchanged.
- The production site and registry URL remain unchanged. The registry namespace and future build metadata use `@0verme` / `0verme`; generated `public/r` and registry outputs were restored after build verification.

## Explicit non-goals

- No DNS, production-domain, deployment, hosting, or upstream repository changes.
- No commit to `main`.
- No package/dependency or lockfile changes merely to repair local tooling.
- No bulk rewriting or build-generated churn in `public/r` / registry outputs.

## Baseline validation

- `pnpm lint`: passed with 6 upstream warnings and 0 errors.
- `pnpm test:run`: passed; 15 files and 107 tests.
- `pnpm check-types`: passed (exit code 0).
- `pnpm format:check`: failed on the untouched upstream baseline (650 files reported).
- `pnpm build`: compilation and TypeScript passed; static prerender failed when the external GitHub Contributions API reset the connection (`ECONNRESET`). A second build with a temporary localhost response returning an empty contribution list completed successfully. The mock server and environment override were temporary and are not part of the repository.

## Phase 0 validation

- `pnpm lint`: passed with 6 warnings and 0 errors.
- `pnpm test:run`: passed; 15 files and 107 tests.
- `pnpm check-types`: passed.
- `pnpm build`: passed, including TypeScript and 216 static pages, using a temporary localhost mock for the unavailable GitHub Contributions API. The mock and environment override were removed; generated registry outputs were restored.
- The full formatting check retains the upstream baseline issue (650 files reported before changes). New and fully rewritten files received targeted Prettier checks; the upstream tree was not mass-formatted.

The baseline formatting result and Pi Lens auxiliary module-resolution findings are recorded as upstream/tooling issues, not changes introduced by Phase 0. Primary LSP checks, `pnpm check-types`, and the production build succeeded.
