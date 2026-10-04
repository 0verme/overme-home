# CI 构建产物

CI 在 PR 提交到 `main`、推送到 `main` 或 `staging` 时运行，也可以在 GitHub Actions 页面手动运行。成功合并 PR 到 `main` 会触发一次正式分支构建。连续更新同一个分支时，旧的未完成构建会被取消，仅保留最新构建。

工作流在 Ubuntu 22.04 x64、Node.js 22 环境下运行，匹配 `soul` 当前的系统和 Node 主版本。pnpm 版本来自 `package.json`，Bun 用于 Registry 构建。工作流完成静态检查、格式检查、测试、构建、类型检查、Registry 校验，以及独立运行部署包的冒烟检查后，才上传产物。

格式检查保留为非阻断提示：当前仓库的 `docs/CONTENT_MIGRATION_PLAN.md` 和 `src/registry/components/work-experience/work-experience.tsx` 已有格式问题，本次不扩展为全仓格式修复。其余检查失败时不会上传产物。

## 下载

在仓库的 **Actions → CI → 成功的运行 → Artifacts** 中下载 `overme-home-linux-x64-<commit>`。GitHub 下载文件是 ZIP，里面包含：

- `overme-home-<commit>-linux-x64.tar.gz`：可供后续服务器部署的运行包。
- 同名 `.sha256` 文件：校验压缩包完整性。

产物保存 14 天。PR 的 commit 标识是该次运行的合并结果标识；正式部署应选取 `main` 推送触发的产物。

## 运行包内容

运行包包含 `server.js`、裁剪后的运行依赖、Next.js 构建产物、静态资源、Registry JSON 和 `src`。保留源码是因为 MDX、组件源码查看器和分享图字体仍会读取这些文件。产物不会携带 `.env*` 文件。

`BUILD_STANDALONE=1` 只在此 CI 中启用 standalone 输出，其他构建保留默认行为。公开站点地址与 Registry 地址在构建时设置为 `https://overme.cn`；修改这些公开变量后需要重新构建。

后续在 Linux 上解压并进入目录，可以使用以下方式运行，无需重新安装依赖或构建：

```sh
sha256sum -c overme-home-<commit>-linux-x64.tar.gz.sha256
mkdir release
tar -xzf overme-home-<commit>-linux-x64.tar.gz -C release
cd release
HOSTNAME=127.0.0.1 PORT=3000 NODE_ENV=production node server.js
```

运行环境应使用 Node.js 22。文档反馈所需的 `DISCORD_FEEDBACK_WEBHOOK_URL` 和其他私密变量由未来的服务器运行配置提供；此 CI 无需服务器 SSH 密钥。这里的运行命令是后续部署参考，当前工作流只生成产物，不上传到服务器或重启服务。
