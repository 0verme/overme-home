# Phase 1 Content Migration Plan

> Phase 1A 盘点与规划文档。只读审计了源代码与线上公开 URL；没有复制文章、修改 UI、改 DNS、写 redirect、部署或修改生产站。

## 1. Executive Summary

已用仓库 remote、站点配置、生产页面 title/canonical 与线上路由交叉确认两个旧站的源码，不是按目录名称猜测：

- 旧黑色 HJJ 站：私有仓库 `0verme/hjj-horizon`，配置 `https://www.overme.cn`；线上主页 title/canonical 与源代码吻合。
- 旧博客：私有仓库 `0verme/Myblog`，repo homepage 与 Astro 配置均为 `https://blog.overme.cn/`；线上 RSS、sitemap 和文章 URL 与仓库内容吻合。
- 新站：`0verme/overme-home`，Phase 0 后的 Next.js Portfolio 外壳存在，但 Profile/About、tech stack、projects 等仍是中性占位或空数据。

当前范围内盘点到：旧 HJJ 站 7 个页面路由；旧博客 4 篇中文原文和 3 篇英文译文（7 个文章 URL）；博客 sitemap 有 39 个 `<loc>`，中文 RSS 有 4 篇、英文 RSS 有 3 篇。旧博客文章保持原 slug 时无 slug 冲突；新站尚未实现 `/notes` 路由。

高层决策建议：

1. 旧黑色 HJJ 视觉和产品叙事迁往未来 `product.overme.cn`；不要在个人首页复刻其完整产品介绍。
2. 旧博客 4 篇有效中文文章列为 `NOTES_MIGRATE`，原 slug 不变；3 篇英文译文保留为候选，但 `/en/notes/[slug]` 尚未在已确认 IA 中，需确认 locale 策略后才可下 301。
3. 旧 HJJ `/notes/` 内嵌的 3 篇文章并非 `blog.overme.cn` 内容，且有个人札记 / HJJ 产品观点混合，暂列 `REVIEW`，不与 Blog 内容混并。
4. `sql.sb` 是独立知识产品，只作为个人站 `Selected Work` 的短入口，维持独立域名；不迁入 `/notes`。
5. 任何实际 redirect 都必须逐 URL 配置。尤其 `overme.cn/` 未来是个人首页，不能把旧 HJJ 根页整站重定向到 `/`；HJJ 首页内容应先在产品域有去处。

GitHub `overme-home` 仓库的 Issues 功能已关闭，本轮不能创建 Issue；不会因此改用其他仓库。PR 在文档提交后单独创建，不自动合并。

## 2. Source Systems

### 2.1 源码身份与审计边界

| 系统 | 已确认仓库 / remote | 默认分支快照 | 本次本地审计副本 | 框架 / 证据 |
| --- | --- | --- | --- | --- |
| 旧 `overme.cn`（HJJ） | [`0verme/hjj-horizon`](https://github.com/0verme/hjj-horizon)（private） | `main` @ `bc62c319ccb376647d05af6e64145cd36d4f6dd4` | `/tmp/phase1-content-audit-sources/hjj-horizon`（临时只读副本） | Astro `^6.4.4`；`astro.config.mjs` 的 `site` 是 `https://www.overme.cn`、`output: static`、`trailingSlash: always`。源 `/` title 为 `HJJ / 见远而行`，与线上一致；`/about/`、`/projects/`、`/lab/`、`/notes/`、`/vision/`、`/consulting/` 线上均返回 200。 |
| 旧 `blog.overme.cn` | [`0verme/Myblog`](https://github.com/0verme/Myblog)（private） | `main` @ `834cf3c4b348820089e1edba477a0440f7c8a8ef` | `/tmp/phase1-content-audit-sources/Myblog`（临时只读副本） | Astro `^7.0.3`，AstroPaper 6.1；repo homepage 与 `astro-paper.config.ts` 的 site URL 都是 `https://blog.overme.cn/`。线上有匹配的 `/rss.xml`、`/sitemap-index.xml`、文章和双语 RSS。 |
| 新 `overme-home` | [`0verme/overme-home`](https://github.com/0verme/overme-home)（public） | `main` @ `cfdcb6d43ac8887ac3b869056845d1e30947de22` | `/vol5/1000/ai-workspace/overme-home_base/worktrees/phase1-content-audit`（任务 worktree） | Next.js 16.3.5 App Router、React 19.3、TypeScript、Tailwind CSS 4、MDX、Vitest、pnpm。 |

运行环境未挂载用户给出的 Windows `E:\vbcoding` 路径；因此没有声称检查过 `E:\vbcoding` 上的文件。按请求的 GitHub 确认路径读取两个私有仓库并临时 clone 到 `/tmp`，副本不在任务 worktree，也没有改动或提交源仓库。

`hjj-horizon/README.md` 称原始 HTML 存在 `backup-static-*`，但当前 `main` tree 没有这些目录。当前线上可达的 7 个页面已按现行仓库核对；README 所称的历史静态备份若有额外、未上线内容，不在本次当前站盘点结论内，见 REVIEW。

### 2.2 新站现状

已检查 `src/app/(app)/page.tsx`、portfolio data/types/components、`src/features/doc/`、`src/config/site.ts`、`src/app/sitemap.ts`、RSS、robots、OG 与 JSON-LD：

- 首页目前由 `ProfileHeader`、`SocialLinks`、`Overview`、`GitHubContributions`、`Hello`、`TechStack`、`Projects` 组成；社交 / 技术 / 项目根据数据空值条件显示。Portfolio 视觉骨架已存在，不需要 Phase 1A 重写 UI。
- `USER` 当前显示名是 `0verme`，但 `bio`、`flipSentences`、`about` 仍是泛化占位；`avatar` / `avatarSketch` 是 neutral SVG；Hero illustration 是 `NeutralIsometricPlaceholder`。`SOCIAL` 只有 GitHub `0verme` 有实际链接；X 等为空。`TECH_STACK` 与 `PROJECTS` 为空。
- `Overview` 只在非空时显示 `bio`、工作项、地址、email、phone；本地时钟当前无条件显示，时区是 `Etc/UTC`。`address`、`emailB64`、`phoneNumberB64`、`jobs` 目前为空。
- 项目数据模型含 `id/title/period/link/skills/description`；技术栈模型含 `title/href/icon/categories`。技术栈可按 `Data / Build / AI / Infrastructure` 精选，不应列全量工具。
- 目标首页可按 4–6 个 `Selected Work` 摘要设计；现有 Projects 组件可复用，但不承载 GitHub 全量仓库或产品完整介绍。
- 站点配置仍有未完成占位：`SITE_INFO.url` 默认 `https://0verme.example`，site description/OG 仍描述开源 registry starter；根 `<html lang>` 是 `en`。本轮不改，正式发布前必须确认真实域名、中文 metadata 和语言标记。

### 2.3 新站 MDX、路由和 SEO 内容模型

- 内容位于 `src/features/doc/content/`，按一级子目录派生 category；当前 `blog/*.mdx` 是 category `blog`，`components/*.mdx` 是 `components`。读取器仅扫描这些一级 category 目录，不递归读取更深目录。
- slug 来自文件 basename；`title`、`description`、`createdAt`、`updatedAt` 是必需 metadata；可选 `image`、`pinned`、`new`、`updated`、`ads`。当前没有 tags 元数据字段；category 不能任意在 frontmatter 声明。
- 文章路由目前是 `/blog/[slug]`，博客列表 `/blog`；现有 RSS 实际路径是 `/blog/rss`；当前没有 `/notes` route。首页导航虽显示 `Notes`，`MAIN_NAV` 仍指向 `/blog`。
- 文章 canonical 当前从 `/blog/${slug}` 生成；`metadata.image` 优先作为 OG，未设置时使用 `/og/simple?title=...&description=...` 动态 1200×630 OG。`BlogPosting` JSON-LD、发布时间 / 修改时间和 X large card 已有代码。根 JSON-LD 当前是 `WebSite` + `Organization`，博客文章 author 也绑定 organization ID；个人站上线前应核对是否应表示为 `Person`。
- `src/app/sitemap.ts` 从 `SITE_INFO.url` 生成站点、组件、blocks、`/blog` 与文章 URL；它没有 `/notes`。文章 `lastModified` 取 `updatedAt`；部分静态页面使用构建时 `new Date()`。robots 允许全站抓取并指向 `${SITE_INFO.url}/sitemap.xml`。
- 新站将来须同时调整 route、metadata canonical、OG、JSON-LD、RSS、自发现 feed、robots 与 sitemap，不能只把 MDX 文件复制到新目录。
- 当前保留的上游通用文章有 `uptime-kuma` 和 `tips-for-creating-beautiful-image-borders` 两个 slug，与本次四篇旧博客 slug 不冲突；两者 OG 图仍来自 `assets.chanhdai.com`，属于既有上游内容，不要未经许可下载、复制或替换。

## 3. Target Architecture

以下为本轮推荐目标 IA，不是已建设路由：

```text
overme.cn
├── /
├── /notes
├── /notes/[slug]
├── /about        # 仅当 Hello 不足以容纳整理后的个人介绍时保留
└── → product.overme.cn

product.overme.cn
├── /
├── /products
├── /open-source
├── /lab
└── /principles
```

迁移语义：`overme.cn` 为 LIGHT / HUMAN / WRITING 的个人首页、札记、About 与 Selected Work；`product.overme.cn` 为 DARK / TECH / BUILD 的 HJJ / 见远而行、产品、开源、实验室与原则。`product.overme.cn` 在本轮只是迁移目的地，不创建仓库、不写 UI、不部署。

新 IA 未定义英文 locale；任何英文 Blog URL 迁移到 `/en/notes/[slug]` 都是本计划提出的候选，不是已确认路由。

## 4. Content Classification Rules

| 分类 | 本文应用规则 | 目标 |
| --- | --- | --- |
| `HOME_PROFILE` | 描述 0verme 本人、公开身份、个人简介、个人公开联系方式 / 账号；只保留公开且仍然准确的信息。 | `overme.cn` 首页 Hello / SocialLinks，必要时 `/about` |
| `HOME_SELECTED_WORK` | 个人主页代表作品的短摘要：名称、一句话、分类、状态、链接；不复制完整产品说明。 | `overme.cn` 首页 Selected Work |
| `PRODUCT_MOVE` | HJJ、产品体系、工程、实验室、Roadmap、产品原则。 | `product.overme.cn`（只记录目的地） |
| `NOTES_MIGRATE` | `blog.overme.cn` 上有效文章；优先原 slug，保留日期、译文关系、引用与内部链接。 | `overme.cn/notes/[slug]` |
| `DROP` | 未发布模板、纯路由壳、重复摘要、已无内容价值的上游模板；DROP 仅指不搬到新站，不删除源数据。 | 无公开内容目的地；必要时逐 URL 指向相应列表页 |
| `REVIEW` | 所有语义、时效、公开范围、语言路由或目的地不能由证据确定的内容。 | 暂不设置 redirect / 不发布，等 owner 决定 |

## 5. overme.cn Inventory

### 5.1 线上页面、内容和职责判断

现行 HJJ Astro 源代码有 7 个页面路由；默认 `trailingSlash: always`。这些页面都是一个黑色 HJJ 站点，不是 0verme 个人主页的不同内容栏目。

| 旧 URL（线上 canonical） | 页面 title / 主体内容 | 内容类型与归属判断 | 建议目标 / 备注 |
| --- | --- | --- | --- |
| `/` | `HJJ / 见远而行`；AI-Native Data Infrastructure Hero、7 个项目摘要、3 个内嵌札记摘要、3 个 Lab 摘要、远景 CTA | 主体是 HJJ 产品品牌；首页重复的项目 / Lab / 札记卡片是详细页摘要，不是额外文章。`PRODUCT_MOVE` | HJJ Hero 与品牌承接到 `product.overme.cn/`。`overme.cn/` 将成为个人首页，不能对 root 写 301。 |
| `/about/` | `关于 / About — HJJ 见远而行`；Data Infra Builder、自我定位、HJJ 名称解释、Now 状态、联系 | 明确混合个人简介与产品品牌。须拆分，不能整页复制。 | 个人简介进 `HOME_PROFILE`；HJJ 名称与产品原则进 `PRODUCT_MOVE`；精确坐标和当前状态 `REVIEW`。旧 `/about/` redirect 暂不批准。 |
| `/projects/` | `项目 / Projects — HJJ 见远而行`；7 个产品完整说明、阶段、功能、决策、若干指标与外链 | HJJ 产品目录。完整内容全部 `PRODUCT_MOVE`；首页最多挑选少数作品摘要。 | 建议 `product.overme.cn/products`，旧 anchor IDs 可作产品列表锚点候选。 |
| `/lab/` | `实验室 / Lab — HJJ 见远而行`；Lineage Roamer、Semantic Diff、Prompt Replay 三个可交互原型 | `PRODUCT_MOVE`。状态分别为 LIVE、WIP、WIP（源代码文案，非本轮独立验证）。 | `product.overme.cn/lab`；保留互动源代码和各自 anchor。 |
| `/vision/` | `远景 / Vision — HJJ 见远而行`；AI 时代数据基础设施宣言、4 条原则、3 个 horizon/roadmap | HJJ 产品原则，不是个人 About 长文。`PRODUCT_MOVE` | 建议 `product.overme.cn/principles`。 |
| `/notes/` | `札记 / Notes — HJJ 见远而行`；3 篇完整的内嵌短文：Prompt 基础设施（2026.04）、湖仓与语义（2026.03）、AI 数据契约（2026.02） | 文章确实存在，但内容嵌在 HJJ 产品站，不属于 `blog.overme.cn` 的四篇文章；归个人写作还是产品原则无充分证据。`REVIEW` | 与新站 `/notes` 命名冲突；不在本轮并入，也不自动 redirect。 |
| `/consulting/` | `咨询 / Consulting — HJJ 见远而行`；湖仓架构诊断、数据治理与指标体系、AI 门户 / 审计 MVP 三个咨询包、合作方式、预约邮箱 | HJJ 服务 / 商业 offering，不是个人 About；是否仍提供、目标 IA 没有 `/consulting`。`REVIEW` | 需确认服务是否有效，以及未来 `product.overme.cn` 是否增加咨询路由；不写 redirect。 |

当前线上页面 `<link rel="canonical">` 都为 `https://www.overme.cn/.../`；apex `https://overme.cn/` 会到 www 主机，主页线上 title 为 `HJJ / 见远而行`。源 SEO 组件为所有页面提供 `og:type=website`、title/description、canonical、X `summary` 与同一个 512×512 `favicon-d-512.png` OG 图；没有每页独立 OG 图或结构化数据。生产 `/robots.txt`、`/sitemap.xml`、`/sitemap-index.xml`、`/rss.xml` 当前均 404。

源码中 7 个页面的 SEO title / description：

| Route | `<title>` | `<meta name="description">` |
| --- | --- | --- |
| `/` | `HJJ / 见远而行` | `HJJ / 见远而行 — 一个面向 AI 时代的数据基础设施实验室。` |
| `/about/` | `关于 / About — HJJ 见远而行` | `关于 HJJ / 见远而行：聚焦 AI-Native 数据基础设施、语义层、治理与可观测性。` |
| `/consulting/` | `咨询 / Consulting — HJJ 见远而行` | `湖仓架构诊断、数据治理与指标体系、AI 数据门户原型建设。帮数据团队把数据平台升级为可信、可治理、可被 AI 使用的数据基础设施。` |
| `/lab/` | `实验室 / Lab — HJJ 见远而行` | `HJJ / 见远而行的实验室页面：通过可交互原型验证 Lineage、Semantic Diff 与 Prompt Replay。` |
| `/notes/` | `札记 / Notes — HJJ 见远而行` | `HJJ / 见远而行的札记页：围绕 Prompt、语义层、数据契约与 AI 基础设施的思考。` |
| `/projects/` | `项目 / Projects — HJJ 见远而行` | `HJJ / 见远而行的项目页：AI Data Portal、Prompt Observatory、Lakehouse Governance、代码审查平台 与 Semantic Layer。` |
| `/vision/` | `远景 / Vision — HJJ 见远而行` | `HJJ / 见远而行的远景页：为 AI 时代重写数据基础设施，强调可观测、语义、契约与治理。` |

源站导航为「项目、札记、实验室、远景、关于、咨询」，CTA `GET IN TOUCH` 指向 `/consulting/`；Footer 是 HJJ 品牌介绍、同一组导航、`hello@overme.cn`、GitHub 和 About 联系锚点。它是产品站 IA，未来应改为产品、开源、Lab、原则；个人资料、个人社交账号和个人直接联系方式应从产品品牌主叙事中剥离，产品联系方式是否仍用同一邮箱由 owner 决定。

### 5.2 HJJ 的 7 个产品目录条目

当前 `/projects/` 每项有完整产品说明；项目状态与 URL 是源站文案，未在本轮独立验证其线上功能或数字。

| 源 path / ID | 内容 | 当前标记 / 外链（源文案） | 分类与处理 |
| --- | --- | --- | --- |
| `/projects/#ai-data-portal` | AI Data Portal / 数据门户 | 在线；`data.overme.cn` | `PRODUCT_MOVE`；完整介绍只放产品站。`40+` 数据源、`120` 数据产品、`2周→1天` 指标需复核。 |
| `/projects/#lakehouse-ops-guide` | Lakehouse Ops Guide / 湖仓操作指南 | 在线；`docs.overme.cn` | `PRODUCT_MOVE`；`8` 模块、`120+` 章节、`V2.2` 需复核。 |
| `/projects/#prompt-observatory` | Prompt Observatory / 提示词可观测台 | 在线；`observer.overme.cn` | `PRODUCT_MOVE`。 |
| `/projects/#lakehouse-governance` | Lakehouse Governance / 湖仓治理 | 在建 | `PRODUCT_MOVE`；`100%` 血缘覆盖、`320` 规则需复核。 |
| `/projects/#code-review-platform` | Code Review Platform / 代码审查平台 | 在线；`audit.overme.cn` | `PRODUCT_MOVE`；“2 审查工作流”等具体状态需复核。 |
| `/projects/#semantic-layer` | Semantic Layer / 语义层 | 研究 | `PRODUCT_MOVE`。 |
| `/projects/#tool-admin-console` | Tool Admin Console / 工具管理台 | 在线；`wbadmin.overme.cn` | `PRODUCT_MOVE`。 |

### 5.3 个人、品牌与视觉区分

- Blog 的 `/about/` 公开称呼为 `jearhe` / `0verme`，写到杭州、数据基础设施、可信 AI、小而可维护产品；GitHub、X `@0verme8`、`hello@overme.cn` 均有公开出处。可以作为 `HOME_PROFILE` 素材，但无需照抄 About 页面。
- HJJ `/about/` 同时介绍 `Data Infra Builder`、Lakehouse / 语义层 / LLMOps、HJJ 的 `Horizon / Joins / Journey` 品牌释义，以及「正在做的事」。个人定位 / 公开联系可合并入新站；HJJ 名称与产品原则归产品站；Now 项目状态需要重新验证。
- HJJ 页面写有 `34.7°N · Remote`。不需要精确坐标；新站不应自动加入地图链接。博客 About 的「杭州」是公开城市级信息，但是否展示仍由 owner 决定。两个旧站都没有公开电话号码；新站 phone 留空。
- 深色网格 / 地平线 / HJJ 标识属于产品视觉资产，不要从个人主页里删除它的产品去处，也不要把整套暗色 HJJ UI 搬到 LIGHT / HUMAN 个人主页。
- README 声称的 `backup-static-*` 在当前仓库快照不存在；如需审计未上线的历史 HTML，先确认是否为本次迁移范围，不凭 README 推测内容。

## 6. blog.overme.cn Inventory

### 6.1 全部有效文章与字段

Loader 只加载 `src/content/posts/zh/` 和 `src/content/posts/_en/` 的 `.md/.mdx` 文件，并在 route / RSS 中排除 `draft`；当前 7 个加载记录都没有 `draft: true`，线上 sitemap 和 RSS 均能对应。唯一内容以中文版本计 4 篇，其中 3 篇有英文译文；译文通过 `translationKey` 绑定。

| ID | slug | 中文 title | Description（frontmatter 原文） | 发布 / 更新 | 中文 tags | Featured | 专属封面 / 本地文章图片 | 归属与说明 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B-01 | `ai-only-interprets-ledger-actions` | 在记账系统里，让 AI 负责理解，而不是决定 | LarkLedger 如何把自然语言理解与确定性账本逻辑分开，并为图片、语音和批量操作增加确认边界。 | 2026-08-08 / 无独立更新日期 | AI、FastAPI、系统设计 | 否 | 无 / 无 | `NOTES_MIGRATE`；外链 LarkLedger GitHub。 |
| B-02 | `building-lineage-viewer` | 把数据血缘查看器做成一个 Web Component | 从 lineage-viewer 的实现出发，聊聊零运行时依赖、确定性布局和可嵌入组件之间的取舍。 | 2026-08-12 / 无独立更新日期 | 数据工程、TypeScript、Web Components | 是 | 无 / 无 | `NOTES_MIGRATE`；外链 `lineage-viewer` GitHub 和 `lineage.overme.cn` demo。 |
| B-03 | `data-warehouse-dilemma` | 数仓困境：数据可以入仓，但责任、语义和经验不会自动入仓 | 从数据接入、业务口径和系统边界出发，记录大规模数仓建设中的责任、语义、治理与经验困境。 | 2026-08-21 / 无独立更新日期 | 数据仓库、数据治理、数据工程 | 否 | 无 / 无 | `NOTES_MIGRATE`；篇幅较长，含 180+ 系统、3800+ 表等公开叙述，重新发布前复核能否再次公开。 |
| B-04 | `hello-world` | 为什么写「见远而行」 | 关于这个名字、博客长期关注的三条内容线，以及我如何记录真实项目里的约束、取舍与可验证结果。 | 2026-08-11 / 2026-08-13 | 随笔、写作 | 是 | 无 / 无 | `NOTES_MIGRATE`；slug 看似模板但属于实际在发文章，必须保持 `hello-world`，不可改成更漂亮的 slug。 |

英文译文（源 title、日期和 `translationKey`）：

| ID | slug / route locale | English title | English description（frontmatter 原文） | 发布 / 更新 | English tags | Featured | 目标 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B-05 | `ai-only-interprets-ledger-actions` / `en` | In a Ledger, AI Should Interpret Rather Than Decide | How LarkLedger separates natural-language understanding from deterministic ledger logic and adds confirmation boundaries to risky inputs. | 2026-08-08 / 无 | AI、FastAPI、System Design | 否 | 候选 `https://overme.cn/en/notes/ai-only-interprets-ledger-actions`；目标 IA 尚未定英文 route。 |
| B-06 | `building-lineage-viewer` / `en` | Building a Data Lineage Viewer as a Web Component | Design trade-offs behind lineage-viewer: zero runtime dependencies, deterministic layout, and an embeddable component boundary. | 2026-08-12 / 无 | Data Engineering、TypeScript、Web Components | 是 | 候选 `https://overme.cn/en/notes/building-lineage-viewer`；同上。 |
| B-07 | `hello-world` / `en` | Why I Write ‘见远而行’ | The meaning behind this site, its three long-term themes, and the standards I use to document constraints, trade-offs, and verifiable results. | 2026-08-11 / 2026-08-13 | Notes、Writing | 是 | 候选 `https://overme.cn/en/notes/hello-world`；同上。 |

### 6.2 文章统计和路由事实

- 有效唯一文章：4 篇中文；带语言 variant 的文章记录 / 路由：7（4 zh + 3 en）。中文 `/rss.xml` 有 4 item，英文 `/en/rss.xml` 有 3 item。
- 专属文章封面：0/4 篇（0/7 locale records）。每篇当前 OG fallback 都是站点级 `public/social-card.png`（1200×630）；文章 frontmatter 均未设置 `ogImage`。这张站点分享图不是 4 篇文章的独立 cover。
- 有 tags：4/4 中文原文、7/7 locale records；中文 tag 共有 10 个、英文 tag 共有 8 个。Schema 没有 category 字段，显式分类数量为 0。
- 包含本地文章图片：0/7；包含绝对 `https://blog.overme.cn/...` 链接的文章：0/7。文章里的站内链接使用 root-relative 路径。
- 所有文章 slug 都是 ASCII kebab-case，无中文 slug。线上 canonical route 以 `/` 结尾：`/posts/<slug>/`、`/en/posts/<slug>/`。中文 `/tags/` 下有 percent-encoded 汉字 URL。
- 数据字段：`pubDatetime` 所有文章都有；只有 `hello-world` 有 `modDatetime`；文章都没有自定义 `canonicalURL`。布局根据 route 自动 canonical，并输出 BlogPosting JSON-LD、`article:published_time` / 可选 `article:modified_time`、hreflang 中英 alternates、Open Graph、Twitter `summary_large_image`。
- `hello-world` 正文里有两条文章链接（中文 `/posts/building-lineage-viewer/`、`/posts/ai-only-interprets-ledger-actions/`，英文对应 `/en/posts/...`），还有 `/tokens/` 和 `/about/`；这些站内链接必须按目标 IA 更新。其余正文的项目链接主要为 GitHub / `data.overme.cn` / `lineage.overme.cn` 外链。
- 线上 sitemap-index 指向 `sitemap-0.xml`，该 sitemap 有 39 个 `<loc>`：7 个文章 URL、18 个语言化 tag 页面、2 个 tag index、其余是首页 / About / archives / posts / search / tokens 等静态路由。39 是 sitemap URL 数，不等于 Search Console 已收录数量；实际索引情况需 Search Console 数据确认。
- 线上 `robots.txt` 允许所有爬虫并指向 `https://blog.overme.cn/sitemap-index.xml`。AstroPaper 的 RSS、自发现 feed、sitemap、默认 OG 均由源仓库生成。生产 HJJ 站没有同类 SEO 文件。

### 6.3 文章外链 / 内容边界

- `ai-only-interprets-ledger-actions`：`github.com/0verme/LarkLedger`。
- `building-lineage-viewer`：`github.com/0verme/lineage-viewer`、`lineage.overme.cn` demo。
- `data-warehouse-dilemma`：`data.overme.cn` 数据门户。
- `hello-world`：文章相互链接，以及 `/about/`、`/tokens/`。
- 博客导航、作者与 About 页面公开的 GitHub `0verme`、X `@0verme8`、`hello@overme.cn` 属于 `HOME_PROFILE`；RSS 内容不包括单独的 cover/image。

## 7. Migration Matrix

`Target` 是目的地建议，不代表页面已创建。`Redirect` 是未来实施建议，不代表当前已写 301。所有 `REVIEW` 项均不得自动迁移或重定向。

| ID | Source | Source URL/Path | Type | Title / 内容 | Classification | Target | Keep Slug | Redirect | Assets | Action | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H-01 | overme | `/` | CONTENT / IA | HJJ Hero、品牌定位与首页布局 | PRODUCT_MOVE | `https://product.overme.cn/` | N/A | **不 redirect**；overme root 保留给新个人首页 | HJJ logo、CSS / inline SVG | 在产品根页重建 HJJ 内容；个人主页不可沿用产品首页 | 首页项目、札记、Lab 卡片是其他行的摘要，不重复迁移。 |
| H-02 | overme | `/about/` 的 Intro / 定位 / 专业身份 | CONTENT | Data Infra Builder、Lakehouse / 语义层 / LLMOps、个人职业方向 | HOME_PROFILE | `https://overme.cn/` 的 Profile / Hello；长文确有额外内容时再加 `/about` | N/A | 旧页面混合，拆分确认前不 redirect | 无个人头像资产 | 汇总而非整页复制；只使用公开、仍有效的信息。 |
| H-03 | overme | `/about/` 的 H/J/J 名称释义 | CONTENT | Horizon / Joins / Journey 及 HJJ 品牌理念 | PRODUCT_MOVE | `https://product.overme.cn/principles` | N/A | 与 H-02 共用源路由，不能整页 301 | HJJ logo / dark identity | 拆分到产品原则或产品首页。 |
| H-04 | overme | `/about/` 的 `34.7°N · Remote` | CONTENT / PRIVACY | 近似坐标 | REVIEW | 未批准；默认不发布精确坐标 | N/A | 不 redirect | none | 不将地址变成 Google Maps 查询；新站精确地址不公开。 |
| H-05 | overme | `/about/` contact、Footer email / GitHub | CONTENT | `hello@overme.cn`、GitHub `0verme` | HOME_PROFILE | 新站 SocialLinks / 可选公开邮箱 | N/A | 旧 `/about/` 需与 H-02/H-03 拆分 | none | 邮箱 / GitHub 来源已公开；电话没有公开记录。 |
| H-06 | overme | `/about/` Now / 正在做的事 | CONTENT | AI Data Portal、Prompt Observatory、Agent 语义接口等当前进度 | REVIEW | 未定；确认后归个人 now 或产品 roadmap | N/A | 不 redirect | none | 时效信息不能按旧状态原样复发。 |
| H-07 | overme | `/projects/#ai-data-portal` | CONTENT | AI Data Portal 完整介绍 | PRODUCT_MOVE | `https://product.overme.cn/products#ai-data-portal`（候选） | anchor 候选 `ai-data-portal` | 页面路由候选 301 到 `/products`；anchor 单独测试 | HJJ topology SVG | 完整细节不放个人主页；量化指标复核。 |
| H-08 | overme | `/projects/#lakehouse-ops-guide` | CONTENT | Lakehouse Ops Guide 完整介绍 | PRODUCT_MOVE | `https://product.overme.cn/products#lakehouse-ops-guide`（候选） | anchor 候选 `lakehouse-ops-guide` | 同 `/projects/` 路由 | none | 复核 8 modules / 120+ chapters / V2.2。 |
| H-09 | overme | `/projects/#prompt-observatory` | CONTENT | Prompt Observatory 完整介绍 | PRODUCT_MOVE | `https://product.overme.cn/products#prompt-observatory`（候选） | anchor 候选 `prompt-observatory` | 同 `/projects/` 路由 | HJJ trace SVG | 旧外部产品域名须验证仍有效。 |
| H-10 | overme | `/projects/#lakehouse-governance` | CONTENT | Lakehouse Governance 完整介绍 | PRODUCT_MOVE | `https://product.overme.cn/products#lakehouse-governance`（候选） | anchor 候选 `lakehouse-governance` | 同 `/projects/` 路由 | none | 源状态在建；100% / 320 等指标复核。 |
| H-11 | overme | `/projects/#code-review-platform` | CONTENT | Code Review Platform 完整介绍 | PRODUCT_MOVE | `https://product.overme.cn/products#code-review-platform`（候选） | anchor 候选 `code-review-platform` | 同 `/projects/` 路由 | none | 源标在线；2 审查流程等数字需复核。 |
| H-12 | overme | `/projects/#semantic-layer` | CONTENT | Semantic Layer 完整介绍 | PRODUCT_MOVE | `https://product.overme.cn/products#semantic-layer`（候选） | anchor 候选 `semantic-layer` | 同 `/projects/` 路由 | none | 源标研究。 |
| H-13 | overme | `/projects/#tool-admin-console` | CONTENT | Tool Admin Console 完整介绍 | PRODUCT_MOVE | `https://product.overme.cn/products#tool-admin-console`（候选） | anchor 候选 `tool-admin-console` | 同 `/projects/` 路由 | none | 源标在线；保留产品详情而非个人首页大段介绍。 |
| H-14 | overme | `/lab/#lineage-roamer` | CONTENT / INTERACTIVE | Lineage Roamer 血缘漫游器 | PRODUCT_MOVE | `https://product.overme.cn/lab#lineage-roamer` | `lineage-roamer` | `/lab/` 到产品 `/lab` 候选；核对 fragment | `public/assets/lab.js`、inline SVG | 保留为产品原型，不迁入个人 Notes。 |
| H-15 | overme | `/lab/#semantic-diff` | CONTENT / INTERACTIVE | Semantic Diff | PRODUCT_MOVE | `https://product.overme.cn/lab#semantic-diff` | `semantic-diff` | 同 `/lab/` | `public/assets/lab.js` | 源标 WIP。 |
| H-16 | overme | `/lab/#prompt-replay` | CONTENT / INTERACTIVE | Prompt Replay | PRODUCT_MOVE | `https://product.overme.cn/lab#prompt-replay` | `prompt-replay` | 同 `/lab/` | `public/assets/lab.js` | 源标 WIP。 |
| H-17 | overme | `/vision/` | CONTENT | 4 原则、3 道 horizon、路线图 | PRODUCT_MOVE | `https://product.overme.cn/principles` | N/A | `/vision/` 到 `/principles` 候选 301 | CSS / inline graphics | 页面 title 和原则应保留产品上下文。 |
| H-18 | overme | `/notes/#prompts-as-infra` | CONTENT / ARTICLE | 把 Prompt 当作基础设施（2026.04） | REVIEW | 尚未确定；候选 HJJ Principles 或个人 `/notes` | `prompts-as-infra` anchor | 暂不 301；与目标 `/notes` 冲突 | none | 来源是 HJJ inline article，不是 `blog.overme.cn` 的 post。 |
| H-19 | overme | `/notes/#beyond-lakehouse` | CONTENT / ARTICLE | 湖仓不是终点，语义才是（2026.03） | REVIEW | 尚未确定 | `beyond-lakehouse` anchor | 暂不 301 | none | 需要 owner 判断是否个人写作还是产品原则。 |
| H-20 | overme | `/notes/#data-contracts` | CONTENT / ARTICLE | AI-Native 的数据契约（2026.02） | REVIEW | 尚未确定 | `data-contracts` anchor | 暂不 301 | none | 同上；不和 Blog slug 表混同。 |
| H-21 | overme | `/consulting/` | CONTENT / SERVICE | 三个咨询包、合作流程、咨询 CTA | REVIEW | 暂无已确认 IA 目的地；候选产品站独立服务页 | N/A | 暂不 301 | none | 先确认服务仍有效；不能假设 `/products` 承载咨询。 |
| H-22 | overme | shared Nav / Footer / page metadata | INFORMATION ARCHITECTURE / SEO_ASSET | 项目、札记、Lab、远景、关于、咨询、CTA；canonical、OG、favicon | PRODUCT_MOVE | 产品站新导航与每页 metadata | N/A | 逐路由迁移 | `site.css`、`tokens.css`、`site.js`、HJJ favicon variants | 产品站保留深色品牌；个人邮箱、个人 Bio 与个人社交从产品主叙事剥离。 |
| B-01 | blog | `src/content/posts/zh/ai-only-interprets-ledger-actions.md` | ARTICLE | 在记账系统里，让 AI 负责理解，而不是决定 | NOTES_MIGRATE | `https://overme.cn/notes/ai-only-interprets-ledger-actions` | YES | 301 exact URL | 无文章图；OG 重生成 | 保留发布时间、tags、外链 | 复核正文内容后迁移；不改变 slug。 |
| B-02 | blog | `src/content/posts/zh/building-lineage-viewer.md` | ARTICLE | 把数据血缘查看器做成一个 Web Component | NOTES_MIGRATE | `https://overme.cn/notes/building-lineage-viewer` | YES | 301 exact URL | 无文章图；OG 重生成 | 保留日期、tags、GitHub / demo 外链 | 不混同 HJJ 的 Lineage Roamer prototype。 |
| B-03 | blog | `src/content/posts/zh/data-warehouse-dilemma.md` | ARTICLE | 数仓困境：数据可以入仓，但责任、语义和经验不会自动入仓 | NOTES_MIGRATE | `https://overme.cn/notes/data-warehouse-dilemma` | YES | 301 exact URL | 无文章图；OG 重生成 | 保留日期、tags；站内引用 external portal | 复核文中系统数、表数和银行环境披露范围。 |
| B-04 | blog | `src/content/posts/zh/hello-world.md` | ARTICLE | 为什么写「见远而行」 | NOTES_MIGRATE | `https://overme.cn/notes/hello-world` | YES | 301 exact URL | 无文章图；OG 重生成 | 更新 2 条文章链接及 About / Tokens 链接 | 保留 `hello-world`，保留 2026-08-13 更新日期。 |
| B-05 | blog | `src/content/posts/_en/ai-only-interprets-ledger-actions.md` | ARTICLE / TRANSLATION | In a Ledger, AI Should Interpret Rather Than Decide | NOTES_MIGRATE | 候选 `https://overme.cn/en/notes/ai-only-interprets-ledger-actions` | YES | 新站英文 route 确认后逐 URL 301 | 无文章图；OG 重生成 | 更新翻译间 hreflang | `/en/notes` 未在已确认 IA 中；未确认前不 redirect 到中文正文。 |
| B-06 | blog | `src/content/posts/_en/building-lineage-viewer.md` | ARTICLE / TRANSLATION | Building a Data Lineage Viewer as a Web Component | NOTES_MIGRATE | 候选 `https://overme.cn/en/notes/building-lineage-viewer` | YES | 同上 | 无文章图；OG 重生成 | 更新翻译间 hreflang | 保留原 translationKey。 |
| B-07 | blog | `src/content/posts/_en/hello-world.md` | ARTICLE / TRANSLATION | Why I Write ‘见远而行’ | NOTES_MIGRATE | 候选 `https://overme.cn/en/notes/hello-world` | YES | 同上 | 无文章图；OG 重生成 | 更新两条文章链接及 About / Tokens 链接 | 保留原 translationKey 和 update date。 |
| B-08 | blog | `/about/`、`src/content/pages/about.md` | CONTENT | jearhe / 0verme、杭州、专业兴趣、个人原则、GitHub / X / 邮箱 | HOME_PROFILE | 首页 Hello；长文仅在需要时放 `/about` | N/A | 候选 301 到 `https://overme.cn/#hello`；确认目标锚后实施 | none | 整理重复内容，不复制整页；城市级位置是否展示由 owner 决定。 |
| B-09 | blog | `/tokens/`、`/en/tokens/` | CONTENT / PAGE | AI 足迹、聚合用量 widget | REVIEW | 未确认；新 IA 不含 tokens route | N/A | 暂不 301 | token.overme.cn iframe/widget 外链 | 确认公开数据、隐私及未来是否保留单独入口。 |
| B-10 | blog | `/`、`/en/`、`/posts/`、`/en/posts/` | INFORMATION ARCHITECTURE | 博客首页与文章索引 | DROP（旧页面壳） | 新列表 `https://overme.cn/notes`；英文列表需 locale 决定 | N/A | 中文路由候选 301 到 `/notes`；英文路由 REVIEW | none | 内容由文章条目承接；不是整站 wildcard redirect。 |
| B-11 | blog | `/archives/`、`/tags/`、`/search/` 及语言对应路由 | INFORMATION ARCHITECTURE | Archive / tags / search 导航与索引页面 | DROP（当前 IA 不需要复制） | 中文候选到 `/notes`；英文候选等 locale 决定 | N/A | 按每条 route 明确映射；不能将所有文章 URL 导到列表 | sitemap URL 清单需重建 | 线上 sitemap 含 10 个 zh tag、8 个 en tag URL；标签页是否保留由新 IA 决定。 |
| B-12 | blog | `src/content/posts/examples/`、`_releases/`、`_color-schemes/`、根目录 AstroPaper 教程样例 | LEGACY / TEMPLATE | 上游模板、草稿、示例内容 | DROP | 无；不作为 0verme 内容发布 | N/A | 无文章 301（确认从未发布；逐 URL 核对 analytics / GSC） | 含 AstroPaper demo images | 当前 content loader 不读取这些路径；只记录为源仓库 legacy，不删除源数据。 |
| S-01 | plan / public project info | `https://sql.sb/`（独立产品） | CONTENT / SELECTED WORK | sql.sb 数据仓库可视化知识产品入口 | HOME_SELECTED_WORK | `overme.cn` 首页 Selected Work 卡片，继续链接 `https://sql.sb/` | N/A | 不把独立域名改成本站 Notes URL | 保留外链 | 只放名称、一句话、分类 / 状态、链接；不复制完整知识产品内容。 |

## 8. Notes URL Mapping

以下是旧博客文章的逐 URL 方案。目标采用现有 Next 默认无尾斜线风格，但最终必须在 Phase 1B 固定 trailing-slash policy 后再生成 301。表内没有文章 slug 被改名。

| Old URL | New URL（建议） | Title / Locale | Keep slug | 301 / metadata flags | 处理备注 |
| --- | --- | --- | --- | --- | --- |
| `https://blog.overme.cn/posts/ai-only-interprets-ledger-actions/` | `https://overme.cn/notes/ai-only-interprets-ledger-actions` | 在记账系统里，让 AI 负责理解，而不是决定（zh） | YES | `301_REQUIRED` · `CANONICAL_UPDATE` · `RSS_UPDATE` · `SITEMAP_UPDATE` · `OG_REGENERATE` | 正文没有站内文章链接；保留 LarkLedger GitHub 外链。 |
| `https://blog.overme.cn/posts/building-lineage-viewer/` | `https://overme.cn/notes/building-lineage-viewer` | 把数据血缘查看器做成一个 Web Component（zh） | YES | 同上 | 无本地图片；保留 GitHub / demo 外链。 |
| `https://blog.overme.cn/posts/data-warehouse-dilemma/` | `https://overme.cn/notes/data-warehouse-dilemma` | 数仓困境：数据可以入仓，但责任、语义和经验不会自动入仓（zh） | YES | 同上 | 无本地图片；复核正文里的生产环境规模信息。 |
| `https://blog.overme.cn/posts/hello-world/` | `https://overme.cn/notes/hello-world` | 为什么写「见远而行」（zh） | YES | 同上 + `INTERNAL_LINK_UPDATE` | 保留 `modDatetime=2026-08-13`；改两条 `/posts/...`、`/about/`、`/tokens/` 链接。 |
| `https://blog.overme.cn/en/posts/ai-only-interprets-ledger-actions/` | 候选 `https://overme.cn/en/notes/ai-only-interprets-ledger-actions` | In a Ledger, AI Should Interpret Rather Than Decide（en） | YES | 英文 route 确认后 `301_REQUIRED` · `CANONICAL_UPDATE` · `hreflang_UPDATE` · `RSS_UPDATE` · `SITEMAP_UPDATE` · `OG_REGENERATE` | 新 IA 未列 `/en`；不得静默把英文流量送中文页。 |
| `https://blog.overme.cn/en/posts/building-lineage-viewer/` | 候选 `https://overme.cn/en/notes/building-lineage-viewer` | Building a Data Lineage Viewer as a Web Component（en） | YES | 同英文规则 | 原 slug 不改。 |
| `https://blog.overme.cn/en/posts/hello-world/` | 候选 `https://overme.cn/en/notes/hello-world` | Why I Write ‘见远而行’（en） | YES | 同英文规则 + `INTERNAL_LINK_UPDATE` | 更新英文章间链接和 `/en/about/`、`/en/tokens/`。 |

**计数：**4/4 中文文章保持同 slug；3/3 英文译文也保持同 slug（目标 route 待批准）；建议改 slug 0；文章 slug 冲突 0。当前 `overme-home` 已有两篇通用 Blog slug（`uptime-kuma`、`tips-for-creating-beautiful-image-borders`），与上述七个 slug 均不冲突。尚未实现的 `/notes` route 是 IA / route 工作，不是 slug 冲突。

非文章 route 必须另做逐 URL 映射：线上 sitemap 的 39 个 URL 包括 listings、静态页和 tag 页。建议 Blog 中文首页 / posts listing 指向 `/notes`，About 指向个人 Hello 或确认后的 `/about`；archives / tags / search 只有在新 IA 确认不保留后才逐路由 301 到 `/notes`。tokens、英文 static routes 要 REVIEW。`/rss.xml` 与 `/en/rss.xml` 应有新的 feed 和自发现链接；`sitemap-index.xml`、robots 与 feed 不可被当作文章 URL 规则处理。

## 9. Homepage Content Model

只规划数据，不重写首页文案 / UI：

### ProfileHeader

- `displayName`：当前新站 `0verme` 与 GitHub username 一致；旧 Blog 使用 `jearhe` / `0verme`，是否展示实名/其他名字没有必要由 Agent 决定。
- `tagline`：从公开 About / Blog 内容筛选一句个人定位；“把复杂系统做小，把 AI 放在可验证的边界里”可作 source candidate，不能当成已批准新文案。
- `avatarSketch` / `avatar`：当前是 placeholder SVG。只接收 owner 提供或批准的 portrait / sketch；本阶段不生成漫画头像。
- `hero illustration`：当前 neutral geometry 是临时占位。可先保留或换成 owner 核准的个人化视觉，不把 HJJ 深色 hero 图形复制到个人站。

### SocialLinks

- GitHub：`https://github.com/0verme`，明确公开，可保留。
- X：`https://x.com/0verme8` 有旧博客公开出处；核对账号仍有效后加入。
- Email：`hello@overme.cn` 在两个旧站公开；是否作为首页直达由 owner 决定。没有证据支持公开 phone。
- LinkedIn / Discord / YouTube 等当前无公开来源，不因为数据模型支持就添加。

### Overview

- Job：`blog About` 与 HJJ About 有自述专业方向，但没有可安全复制的雇主 / 职位记录；不虚构工作项。
- Location：可不显示；如果需要只考虑已公开的城市级 `杭州`，不要公开 `34.7°N` 坐标或精确地址。
- Email：公开邮箱可选，避免默认展示。
- Phone：保持空；Phone 默认不公开。
- Current local time：当前新站无条件显示 `Etc/UTC` 时间卡，需确认是否对个人站有价值；不因 upstream 有组件就强行保留。

### Hello / About

- 素材可从 Blog About 与 HJJ About 的个人部分整合：数据基础设施、可信 AI、小而可维护的工具、在真实工程约束中构建。
- HJJ acronym、产品宣言、Roadmap 和产品介绍进入产品站，不把个人简介写成产品首页。
- 新 About 是否单独 `/about`，取决于首页 `Hello` 是否足够；不机械复制旧 `/about`。

### TechStack

- 最多精简为 `Data / Build / AI / Infrastructure` 核心类别。
- 只展示目前真实使用且能代表方向的少数条目，不列“用过什么”的全量清单。当前数据源为空。

### Projects / Selected Work

- 首页目标 4–6 项；只显示项目名、一句话、分类、当前状态和链接。
- 候选如下，无排名，最终选择由 owner 决定：
  - Lakehouse Toolkit
  - SchemaSeed
  - Plan Detective
  - sql.sb（独立知识产品；链接留在 `sql.sb`）
  - lineage-viewer
  - LarkLedger
- HJJ 的七个产品介绍保留完整说明于未来产品站；如选为个人代表作，也只制作短摘要，不复制完整产品详情。

## 10. product.overme.cn Deferred Content

**旧黑色 `overme.cn` → future `product.overme.cn`。** Phase 1A 不删旧视觉、不建设产品站、不动线上域名。

| 旧内容 | 产品站建议去向 | 保留 / 变更建议 |
| --- | --- | --- |
| HJJ Hero、`Horizon / Joins / Journey` 名称与 HJJ brand mark | `/`、`/principles` | 保留黑色视觉和 HJJ 产品身份；不要覆盖个人 `overme.cn/` 根页。 |
| `/projects/` 里的 7 个产品全量说明 | `/products` | 保留产品内容与各自外部入口；状态和所有数字在发布前验证。 |
| `/lab/` 的 Lineage Roamer、Semantic Diff、Prompt Replay | `/lab` | 保留交互 prototype、anchor、JS / inline SVG；重新确认 LIVE/WIP。 |
| `/vision/` 的 4 条原则、3 段路线图 | `/principles` | 保留产品理念；过期 roadmap 不原样复发。 |
| `/about/` 中 HJJ 品牌解释、产品定位 | `/principles` 或产品首页 | 与个人 Bio 拆分。 |
| `/consulting/` 的服务包与预约入口 | 当前 IA 没有对应页 | `REVIEW`：确认是否仍销售、是否另加服务页；不自动塞进 `/products`。 |
| `/notes/` 的三篇 HJJ inline essays | 未定 | `REVIEW`：决定是产品原则文章还是个人 Notes。 |
| 旧 Nav/Footer | 新产品导航：`products / open-source / lab / principles` | 移除或改写个人站专属 About、博客路径和个人 CTA；具体产品联系入口待定。 |
| 产品相关个人联系方式、坐标、Now 状态 | 不默认迁入产品站 | 从 HJJ 主品牌内容剥离；邮箱若兼作产品客服需 owner 明确授权。 |

`open-source` 是目标 IA 中新增的栏目，当前 HJJ 7 项里混有产品、文档和实验室，并未提供一份完整开源项目目录；Phase 1B 前后需由 owner 指定哪些 GitHub repo 进入该区。

## 11. Asset Migration

### 11.1 旧站媒体与视觉资源

| Source asset | 用途 / 当前状态 | 分类 | 规划 |
| --- | --- | --- | --- |
| `hjj-horizon/public/brand/favicon-d.svg`、`favicon-d-16/32/48/180/512.png`、`favicon-d.ico`（7 项） | HJJ brand mark / product favicon / HJJ OG 512px 图 | `COPY_LOCAL` | 保留在未来产品站品牌包；不放个人头像，不生成新的 HJJ 图。 |
| HJJ `public/assets/site.css`、`tokens.css`、`site.js`、`lab.js`（4 项）及 `src/fragments/*.css` / inline SVG | 黑色产品站样式、交互和手绘图形 | `COPY_LOCAL` | 供未来产品站继续使用 / 分拆；不把页面整套复制到个人站。 |
| HJJ root `favicon.svg`、`public/favicon.svg` | 备用 / 重复 HJJ 图标；SeoHead 实际使用 `/brand/favicon-d.*` | `DROP`（从新站迁移范围） | 保留原 repo，确认没有其他部署消费者前不删除源文件。HJJ repo 无 LICENSE 文件，跨仓库转移前保留权属来源。 |
| Blog `public/social-card.png`（1200×630） | 当前全站 / 所有文章的 fallback OG 图 | `REGENERATE` | 为个人新品牌重做一张默认 OG；不要把旧 Blog 站图当成逐篇封面。 |
| Blog `public/favicon.svg` | AstroPaper favicon | `REVIEW_LICENSE` | 不直接作为 0verme 或 HJJ favicon；确认归属后重绘 / 更换。 |
| Blog `public/default-og.jpg`（2455×1381） | 文件存在但 config 实际使用 `social-card.png` | `REVIEW_LICENSE` | 不是当前文章实际 OG；核对来源后决定归档或丢弃，不默认复制。 |
| Blog `src/assets/images/AstroPaper-v3/v4/v5.png`、`astropaper-og.jpg`、`forrest-gump-quote.png`、`_color-schemes/assets/*`、`_releases/assets/*` | 上游主题宣传 / 样例配色 / release 文章资源，未被当前有效文章引用 | `DROP`（不迁移） / 必要时 `REVIEW_LICENSE` | 不是有效 0verme 文章图片；不复制第三方视觉素材。 |
| Blog 有效文章本地图片 | 全部 7 个 locale records 均无 Markdown / HTML 本地图片 | `DROP`（无 article image 要复制） | 仍需为新站生成新 OG；没有文章内图片迁移工作。 |
| Blog 正文项目链接：GitHub、`lineage.overme.cn`、`data.overme.cn` | 正文外链 | `KEEP_EXTERNAL` | 保持外部链接；Phase 1B 检查各外链仍有效，不下载外站图片。 |
| 新站现存 `uptime-kuma`、image-border tutorials 的 `assets.chanhdai.com` OG images | 上游保留文章的外部 OG | `KEEP_EXTERNAL` / `REVIEW_LICENSE` | 不是旧 Blog 资产；不得未经授权复制到新品牌文章。 |

HJJ 站没有 profile photo、独立 hero 图片或 article cover；主体视觉是 CSS 网格、文字和源码内 SVG。HJJ 有 9 个 image/icon 文件（7 个 `public/brand` 文件 + root 与 `public` 下两个 favicon.svg）和 4 个主要 public CSS / JS 文件。Blog 仓库共检出 39 个图片 / SVG 类文件（public 3、`src/assets` 28、主题 / 模板内容目录 8），其中 0 个被当前 7 个有效文章内嵌。该 39 项不是 39 个需迁移媒体。

### 11.2 不执行事项

不下载、复制或再托管许可未知的第三方资源；不生成头像；不复制媒体到 `public/`；不为迁移更改任何源仓库资源。

## 12. SEO Migration Checklist

### 上线前阻断项

- [ ] 固定 `overme.cn` / `www.overme.cn` canonical hostname。当前 HJJ canonical 是 `www.overme.cn`，Blog canonical 是 `blog.overme.cn`；最终规划使用 `overme.cn`，需明确 www alias 方向。
- [ ] 保持旧 Blog 和 HJJ 源快照可恢复；先建逐 path mapping。**禁止 `blog.overme.cn/* → /notes` 统一跳转**，禁止 302 / JS redirect / 将所有文章导首页。
- [ ] 对上表 4 个中文文章 canonical URL 逐条 301 到同 slug `/notes/<slug>`；英文 3 条必须先决定是否支持 `/en/notes/<slug>`。slash / non-slash alias 分别测试，target 只保留一个 canonical。
- [ ] 旧 `overme.cn/` 是新个人首页；不能 301 旧根页到自身或导致个人站无法访问。先让旧 HJJ 首页内容在产品站有完整、可访问的 destination，再安排未来域名切换（本轮不切）。
- [ ] 逐条处理旧 Blog 的 39 个 sitemap URL（7 article、18 locale-tag、2 tag index、其余静态页），不是把它们与 7 篇文章混为一谈。GSC 已收录 URL 需 Search Console 数据核对；sitemap 不代表实际收录。
- [ ] assets、favicon、OG、RSS、sitemap、robots 是独立 URL；redirect 规则不得让 `/social-card.png`、favicon、RSS、sitemap 被错误送到 `/notes`。

### Metadata / route / 内容

- [ ] 更新 Blog 文章 canonical、`og:url`、`og:image`、Twitter image、BlogPosting JSON-LD `@id/url/mainEntityOfPage`、publisher / author URL；不留指向 blog host 的 self-canonical。
- [ ] 保留中文 title、description、publish date、实际 update date、作者、tag 和 translationKey；把 `pubDatetime → createdAt`、`modDatetime → updatedAt`，没有更新日期时明确 fallback 到发布日。
- [ ] 新站 MDX schema 目前没有 tags 字段。先决定标签保留 / 归并 / 不迁移；不静默丢失现有标签。现有分类系统按目录派生，不把 tags 当 category。
- [ ] 更新 `hello-world` 的 2 个文章内链到新 slug；About、Tokens 等页面链接先有明确 destination；扫描 Markdown、HTML、代码块和生成后的 HTML，不只查 absolute URL。
- [ ] Blog 中没有 absolute `blog.overme.cn` 正文链接，但当前文章 URL 与 RSS 内部链接都由根路径生成，迁移时仍需更新。
- [ ] 旧 Blog 中文 slugs 都是 ASCII；tag 路径含汉字 percent-encoding。测试 UTF-8 编码只做一次、大小写、双重编码及反向 301。
- [ ] Blog live canonical 带尾斜线；Next 当前默认通常无尾斜线。明确一个规范并将旧带尾斜线路径逐项 301 到目标规范，不生成循环。
- [ ] 保留 zh/en `hreflang`、`x-default` 关系；English locale 暂无新 IA，未批准前不抹掉译文或让 EN canonical 指向中文。
- [ ] 新站 OG fallback 可用动态 `/og/simple` 生成 1200×630；Blog 旧站所有文章共用的 social card 应改成新站默认 OG，`ogImage` 中没有每篇独立图。
- [ ] 新建 / 更新 Notes RSS 和 HTML head RSS autodiscovery；当前新站 RSS endpoint 是 `/blog/rss`，旧站有 `/rss.xml` 与 `/en/rss.xml`。核对 item links、pubDate、语言和 feed redirect。
- [ ] 更新 sitemap，包含新 `/notes` index / detail 和真实 lastModified；移除旧博客已迁 route；robots Sitemap 指向新 sitemap。新站 `SITE_INFO.url` 目前仍是占位，不能发布。
- [ ] 源博客 robots 当前全 Allow；源 HJJ 生产 robots / sitemap / RSS 均 404。未来产品域需有自己的 sitemap、robots 与 metadata。
- [ ] Home metadata 的 `<html lang="en">`、`og:locale=en_US` 当前需在中文个人首页方案确定后修改；BlogPosting author 目前使用 organization ID，需核准 Person/Organization schema。
- [ ] 跑 link crawler / curl 检查目标 route、redirect chain、HTTP 200、canonical 单一、RSS、sitemap 和 OG 图；抽查 Google Search Console / Bing Webmaster 收录与外链后才可定 redirect 表。

## 13. DROP Items

DROP 仅表示不搬进新站，不删除旧源文件：

1. AstroPaper 的未发布示例、通用主题文章、release / color-scheme 配图：目前 content loader 不载入 `examples/`、`_releases/`、`_color-schemes/` 或根目录教程样例；不是 Blog 上的有效 0verme 文章。
2. 旧 Blog `/archives/`、`/tags/`、`/search/` 页面壳：目标 IA 暂无复制要求。它们的访问 URL 若被收录 / 有 inbound link，需逐条重定向或提供兼容页面后才可下线。
3. 旧 Blog `/` 与 `/posts/` listing shell：由新 `/notes` listing 承接；文章本身绝不 DROP。
4. unused AstroPaper 默认图片、主题宣传图及 generic favicon：不属于个人文章资产；保留源仓库但不直接带入品牌新站。
5. HJJ duplicate / unused `favicon.svg` variants：不迁移到个人站；源文件在产品源仓库保留，产品只选定实际使用的 HJJ brand set。
6. HJJ README 中提及但当前仓库快照不存在的 `backup-static-*` 不是已审计 / 可迁移的文件。本轮没有据此 DROP 任何无法查看的页面；需确认是否有额外 archive source。

## 14. REVIEW Items

以下事项必须 owner 决定，不由 Agent 拍板：

1. HJJ `/notes/` 三篇 inline essays 是产品原则文章还是个人 Notes；包括三篇标题、日期、对应首页摘要与所有锚点。
2. HJJ `/consulting/` 的三个咨询包是否仍在提供；未来产品 IA 是否需要 `/consulting` 或服务入口。
3. HJJ `/about/` 路由的拆分与 redirect；个人 Bio、HJJ acronym、Now 状态与 CTA 目前混在同一页。
4. `34.7°N · Remote` 不迁移，除非 owner 明确批准；无需向公众暴露精确坐标。
5. Blog `/tokens/` / `/en/tokens/` 是否继续公开 AI token 聚合 widget；新目标 IA 没有该路径，需检查数据范围和隐私。
6. Blog 英文译文是否继续托管；如果是，是否采用 `/en/notes/[slug]`、hreflang 和英文 RSS；不支持时不能把 EN URLs 批量丢弃或送到中文。
7. `data-warehouse-dilemma` 的 180+ source systems / 3800+ tables / 100+ systems 经验叙述，及 HJJ 产品页的 40+ / 120 / 2 周→1天 / 100% / 320 等数字，发布前复核公开范围与准确性。
8. Blog sitemap 的 18 个语言化 tag routes 是否全部放弃、保留部分 tags，还是仅保留文章 tags metadata；不要因目标 IA 简单就静默丢失搜索 / inbound URLs。
9. `hjj-horizon/README.md` 提及但当前 `main` 无对应文件的 `backup-static-*` 是否是过时说明，还是需额外从 Windows 本机 / 历史 commit 盘点未上线内容。
10. Profile 是否展示 `jearhe`、杭州、公开 email 与 X。公开来源已核实，但准确性、用户意愿与是否展示仍由 owner 决定。

## 15. Risks

### P0

- **逐文章 URL / redirect 风险：** Blog 有 7 个当前文章 URL。wildcard redirect、302、JS redirect、全文章到 `/notes` 或首页都会造成内容与 SEO 损失。必须逐 URL 301，slug 不冲突也不改名。
- **根域名内容冲突：** `overme.cn/` 当前是 HJJ，未来同一 URL 要成为个人主页；同一路径不可能同时保留两套首页。必须先准备 HJJ 产品站承接页，再由 owner 明确生产切换；本轮不做。
- **源内容完整性：** Blog 线上 sitemap/RSS 核对了当前发布内容；HJJ 当前 7 个线上页面可访问，但 `README` 声称的历史 `backup-static-*` 在当前 source tree 不存在。不要误报历史版本也已完整盘点。
- **可恢复性：** 迁移之前需要保留两个旧源的 commit / assets / feed / sitemap 快照；未完成目标站核对前保持生产旧站可访问。

### P1

- **canonical / hostname / slash 不一致：** HJJ 使用 `www.overme.cn` + 强制 trailing slash；Blog 使用 `blog.overme.cn` + 页面 trailing slash；目标文档计划使用 `overme.cn/notes/[slug]`，新站 Next 默认路由约定不同。
- **搜索引擎收录数据未知：** 线上 sitemap 的 39 URL 不是实际 index 记录。需 Search Console 导出、外链和 analytics 作为 redirect 覆盖依据。
- **标签 / 翻译丢失：** 新 MDX 没有 tags、翻译模型或 category frontmatter；三个 EN 翻译与中英 RSS / hreflang 需要明确承接。
- **文章关联链接断裂：** `hello-world` 有文章、About、Tokens 内链；新站暂时没有 Notes、独立 Tokens、确定版 About 路由。
- **默认 OG / 静态媒体：** Blog 原 OG 默认图片 URL 是旧主机；新站旧 Blog 路由上的 `/og/simple`、RSS、sitemap 都需更新，不能一并按文章规则 redirect。
- **公开披露：** 长篇数仓文章与 HJJ 项目页有规模 / 性能数字；在新品牌重复发布前核查准确性和许可。
- **当前站 metadata placeholder：** 新站 `SITE_INFO.url` 仍为 `0verme.example`，描述 / OG / `lang` 是 starter 状态；未经更新不能部署。

### P2

- HJJ 暗色产品文案与 LIGHT / HUMAN 个人站调性不同；内容应分流，不应逐字复制。
- Blog 中英文标签集合不同，标签词汇存在冗余；若展示需规范化，若不展示仍需处理旧 tag URL。
- HJJ inline essays、Blog 的 `hello-world` 与 About 有叙事重复，需去重，不更改 slug。
- 旧站有咨询、tokens、archive 等独立栏目；新 IA 可能有较少页面，不要求机械保留每一个导航名。

## 16. Proposed Phase 1B

不在 Phase 1A 执行。建议顺序：

1. 由 owner 对第 14 节 REVIEW 项作决定，特别是英文 URL、HJJ 三篇札记、咨询 / tokens、历史备份范围和公开数字。
2. owner 从 6 个未排名候选中定 4–6 个 Selected Work，并确认每个项目一句话、类别、状态与公开链接；HJJ 的 7 个完整产品介绍继续留给产品站。
3. 在 `overme-home` 实现 `/notes` 列表和 `/notes/[slug]`，先迁 4 篇中文 Markdown；按批准的 locale 策略处理 3 篇英文译文；保留 slug、日期、描述、tags 与 translationKey，并按需扩展 MDX metadata schema。
4. 实现文章 canonical、个人作者 JSON-LD、OG image、RSS（含自动发现）、sitemap / robots；核对中文 `lang`、绝对 URL 和 trailing-slash 规范。
5. 更新正文内链；生成新站 OG，不复制许可不明的 AstroPaper 配图；保留已确认的 GitHub / 产品外链。
6. 对 7 个文章 URL、39 个 sitemap URL、旧站支持页、资源、RSS 和 sitemap 分别做映射与 preview HTTP 检查；对任何 redirect 建立可撤销 / 监控计划。
7. Phase 1B 的代码、301 和生产切换需各自明确授权；DNS、部署、生产 301 与 `product.overme.cn` 实际建设都不属于本阶段，也没有在本次执行。
