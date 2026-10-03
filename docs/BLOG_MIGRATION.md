# 博客迁移说明

## 内容与来源

源仓库为 Myblog，内容基线为 834cf3c4b348820089e1edba477a0440f7c8a8ef。2026-10-03 的线上 sitemap 与本地已发布清单一致：4 篇中文、3 篇英文。迁移后的博客两种语言各 4 篇；数仓困境英文稿为本轮新增完整译稿，正文中标注翻译日期和原文入口，保留原文发布日期。

文章维护目录为 src/features/doc/content/blog/{zh,en}。同篇译文共享 translationKey；新文章必须明确语言，保留作者、日期与标签。组件文档保持原有英文路径。新增译文经检查后才添加对应 hreflang，不用空页面替代。

## 本地兼容与上线边界

新站目标主域名为 https://overme.cn；开发和验收时将 NEXT_PUBLIC_APP_URL 设置为 https://overme-home.localhost。本次验收使用进程环境覆盖本机残留的模板地址，没有修改本地环境文件。中文首页与博客为 /、/blog，英文为 /en、/en/blog。不同语言根布局间使用完整页面导航，主题存储沿用同一 localStorage。

本次只在新站实现旧路径兼容，未改变旧博客、旧个人站、DNS、托管或部署。下表是未来旧博客域名应配置的 308 重定向清单，不代表已经上线。机器可读版本见 [blog-redirects.json](./blog-redirects.json)。它覆盖原 sitemap 的 39 个页面和两个 RSS，根路径的跨域跳转仅适用于 blog.overme.cn，不能把它作为新站自身路径的跳转规则。

旧标签进入相应语言的列表筛选；归档和搜索合并入博客列表（支持 q、tag、year）；AI 足迹保留到 token.overme.cn 的外链。两篇继承教程的旧 /blog 路径转向 chanhdai.com 原文，避免归属错误。

后续切换旧域名时，应先部署并验收新站，再在旧域名托管层启用下表规则；保留来源查询参数，检查 308、Location、最终 200 及无循环。若新站异常，先撤销旧域名跳转，恢复旧站，文章源仓库不需要修改。当前旧博客仍正常提供内容，不应提前宣称迁移已上线。

## 验收记录（2026-10-04）

- 130 项测试通过；lint 无错误，保留原有 6 条组件样式提示；生产构建生成 235 个静态页面。部分原有组件文档首次生成超时，自动重试后构建成功。
- 7 篇原稿与 Myblog 逐篇比较 Markdown 语法树、代码块、发布日期、更新日期、标签和精选标记，仅替换约定的内部链接。新增英文译稿与中文原文的全部正文块及 22 个章节层级一一对应。
- 在 https://overme-home.localhost 的生产模式检查桌面、手机、明暗主题、键盘跳转与搜索、减少动态效果、长标题、目录锚点、代码复制、文章 Markdown 复制、原生分享及链接复制、同篇语言切换和刷新。
- 全部 8 个 Markdown 地址及 Accept 内容协商一致；39 条站内兼容跳转返回 308，覆盖中文标签与两个 RSS。根路径的两条跨域规则仅交付清单。中文标签使用路由处理器编码响应头，避免当前 Next.js 配置式跳转产生无效 Location。
- canonical、hreflang、HTML lang、Person/BlogPosting、中文 OG 图、双语 RSS 与 sitemap 均已检查；组件文档、blocks、preview、registry JSON 和原有组件 Markdown 接口回归通过。浏览器无页面错误。
- 构建生成的 registry 文件、本地验收脚本、证书及环境文件不纳入提交。本轮未推送、部署或切换域名。

## URL 映射

| 旧 URL                                                             | 新 URL                                                          |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| https://blog.overme.cn/                                            | https://overme.cn/                                              |
| https://blog.overme.cn/about/                                      | https://overme.cn/#hello                                        |
| https://blog.overme.cn/posts/                                      | https://overme.cn/blog                                          |
| https://blog.overme.cn/archives/                                   | https://overme.cn/blog                                          |
| https://blog.overme.cn/search/                                     | https://overme.cn/blog                                          |
| https://blog.overme.cn/tags/                                       | https://overme.cn/blog                                          |
| https://blog.overme.cn/tokens/                                     | https://token.overme.cn/                                        |
| https://blog.overme.cn/rss.xml                                     | https://overme.cn/blog/rss                                      |
| https://blog.overme.cn/posts/hello-world/                          | https://overme.cn/blog/hello-world                              |
| https://blog.overme.cn/posts/building-lineage-viewer/              | https://overme.cn/blog/building-lineage-viewer                  |
| https://blog.overme.cn/posts/ai-only-interprets-ledger-actions/    | https://overme.cn/blog/ai-only-interprets-ledger-actions        |
| https://blog.overme.cn/posts/data-warehouse-dilemma/               | https://overme.cn/blog/data-warehouse-dilemma                   |
| https://blog.overme.cn/tags/ai/                                    | https://overme.cn/blog?tag=AI                                   |
| https://blog.overme.cn/tags/fastapi/                               | https://overme.cn/blog?tag=FastAPI                              |
| https://blog.overme.cn/tags/typescript/                            | https://overme.cn/blog?tag=TypeScript                           |
| https://blog.overme.cn/tags/web-components/                        | https://overme.cn/blog?tag=Web%20Components                     |
| https://blog.overme.cn/tags/%E6%95%B0%E6%8D%AE%E4%BB%93%E5%BA%93/  | https://overme.cn/blog?tag=%E6%95%B0%E6%8D%AE%E4%BB%93%E5%BA%93 |
| https://blog.overme.cn/tags/%E6%95%B0%E6%8D%AE%E5%B7%A5%E7%A8%8B/  | https://overme.cn/blog?tag=%E6%95%B0%E6%8D%AE%E5%B7%A5%E7%A8%8B |
| https://blog.overme.cn/tags/%E6%95%B0%E6%8D%AE%E6%B2%BB%E7%90%86/  | https://overme.cn/blog?tag=%E6%95%B0%E6%8D%AE%E6%B2%BB%E7%90%86 |
| https://blog.overme.cn/tags/%E7%B3%BB%E7%BB%9F%E8%AE%BE%E8%AE%A1/  | https://overme.cn/blog?tag=%E7%B3%BB%E7%BB%9F%E8%AE%BE%E8%AE%A1 |
| https://blog.overme.cn/tags/%E9%9A%8F%E7%AC%94/                    | https://overme.cn/blog?tag=%E9%9A%8F%E7%AC%94                   |
| https://blog.overme.cn/tags/%E5%86%99%E4%BD%9C/                    | https://overme.cn/blog?tag=%E5%86%99%E4%BD%9C                   |
| https://blog.overme.cn/en/                                         | https://overme.cn/en                                            |
| https://blog.overme.cn/en/about/                                   | https://overme.cn/en#hello                                      |
| https://blog.overme.cn/en/posts/                                   | https://overme.cn/en/blog                                       |
| https://blog.overme.cn/en/archives/                                | https://overme.cn/en/blog                                       |
| https://blog.overme.cn/en/search/                                  | https://overme.cn/en/blog                                       |
| https://blog.overme.cn/en/tags/                                    | https://overme.cn/en/blog                                       |
| https://blog.overme.cn/en/tokens/                                  | https://token.overme.cn/                                        |
| https://blog.overme.cn/en/rss.xml                                  | https://overme.cn/en/blog/rss                                   |
| https://blog.overme.cn/en/posts/hello-world/                       | https://overme.cn/en/blog/hello-world                           |
| https://blog.overme.cn/en/posts/building-lineage-viewer/           | https://overme.cn/en/blog/building-lineage-viewer               |
| https://blog.overme.cn/en/posts/ai-only-interprets-ledger-actions/ | https://overme.cn/en/blog/ai-only-interprets-ledger-actions     |
| https://blog.overme.cn/en/tags/ai/                                 | https://overme.cn/en/blog?tag=AI                                |
| https://blog.overme.cn/en/tags/fastapi/                            | https://overme.cn/en/blog?tag=FastAPI                           |
| https://blog.overme.cn/en/tags/typescript/                         | https://overme.cn/en/blog?tag=TypeScript                        |
| https://blog.overme.cn/en/tags/web-components/                     | https://overme.cn/en/blog?tag=Web%20Components                  |
| https://blog.overme.cn/en/tags/data-engineering/                   | https://overme.cn/en/blog?tag=Data%20Engineering                |
| https://blog.overme.cn/en/tags/system-design/                      | https://overme.cn/en/blog?tag=System%20Design                   |
| https://blog.overme.cn/en/tags/notes/                              | https://overme.cn/en/blog?tag=Notes                             |
| https://blog.overme.cn/en/tags/writing/                            | https://overme.cn/en/blog?tag=Writing                           |
