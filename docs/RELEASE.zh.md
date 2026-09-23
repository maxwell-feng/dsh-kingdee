# 发行说明 — v0.9.0

[英文](RELEASE.md) | 中文

发布日期：2026-09-23

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.9.0：本版把插件迁移到 DeepSeek Harness 0.1.7 的配置模型，并将宿主基线抬升至 `0.1.7-alpha.2`，已在 `0.1.7-rc.1`（最新发行版）上完成验证。账套兼容性保持不变（金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x）。

## 变更

- **宿主对齐**：开发依赖锁定至 DeepSeek Harness `0.1.7-rc.1`，并已针对该版本完成验证。`@deepseek-ai/dsh-*` peer 区间为 `^0.1.7-alpha.2`——即引入易变配置的那条发布线——因此插件在 `0.1.7-alpha.2` 与 `0.1.7-rc.1` 上均可安装；对本插件消费的全部包而言，这两个版本的源码完全一致。`engines.dsh` 为 `^0.1.7-alpha.2`，`@deepseek-ai/cordis` 升至 `4.0.4`，`@deepseek-ai/schemastery` 升至 `3.18.4`。
- **配置迁移至 0.1.7 的易变 schema**：每个可编辑字段都声明为 `.volatile()`，`apply` 因此收到逐字段的活引用。插件不再注册设置节：`ctx.settings.installSection` 调用、`ctx.inject(['settings'])` 与 `@deepseek-ai/dsh-settings` 依赖均已移除。Host 自行读取导出的 `Config` schema（`entry.fiber.runtime.Config`），并以 profile 行 id `kingdee` 为键渲染该条目的表单。
- **每次操作一次配置快照**：`captureConfig` 在操作开始时一次性读取全部引用，因此单次操作绝不会混用「保存前读到的 `baseUrl`」与「保存后读到的凭据引用」。凭据仍逐次操作解析，轮换后的密钥同样对下一次调用生效。
- **`pnpm-workspace.yaml`**：为 `0.1.7-rc.1` 的确切包集合显式豁免 pnpm 的最小发布年龄闸门——否则 DSH 持续发布的预发行版会被该闸门拦下。
- 构建产物不再纳入版本库：`lib/` 已加入忽略列表，由 `pnpm build`（以及 npm 的 `prepublishOnly` 钩子）在打包前生成。

## 新增

- **补充宿主兼容性闸门说明**：DeepSeek Harness 0.1.7-rc.1 会在加载前用运行时版本校验插件的 `@deepseek-ai/dsh*` peer 依赖，不兼容的行会被直接拒绝。本发行版声明的 peer 均实际满足，无需豁免；README 与升级文档均写明了该拒绝行为及 `dsh plugin allow-version` 豁免方式。
- 客户端设置卡片已写明：它是 Plugins 页所拥有的同一个逐条目 `ConfigForm` 的浏览器半端。

## 修复

- **补齐客户端半端的 `dsh.client.inject` 声明**：该卡片注册到 `plugins.row.config` / `plugins.bundle.config`（由 `@deepseek-ai/dsh-client-ui-plugin-manager` 提供），并读取 `ctx.remote` 与 `ctx.connection`，但此前只声明了 `@deepseek-ai/dsh-client-locale` 与 `@deepseek-ai/dsh-client-ui-settings`。现补齐 `@deepseek-ai/dsh-client-ui-plugin-manager`、`@deepseek-ai/dsh-api-remotes` 与 `@deepseek-ai/dsh-client-connection`，与使用同一批服务的官方客户端卡片保持一致。无论是否修复，Host 依据 schema 渲染的表单都不受影响——自定义卡片只是在它之上叠加自己的界面。

## 更新说明

- **升级命令**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.9.0`）。
- **环境要求**：harness `^0.1.7-alpha.2`，Node ≥22。
- **配置无破坏性变更**——十二个字段的名称、取值与默认值完全一致，`cordis.yml` 与 `cordis.patch.yml` 原样继续可用。在 `0.1.6` 宿主上插件会在加载阶段被拒绝；请先升级宿主，或授予确切版本豁免。详见 [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.9.0/USAGE.zh.md) / [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.9.0/USAGE.md)。

## 验证

- `pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`）、构建干净（`tsc` + `tsdown`），且 `node scripts/check-docs-language.mjs` 全绿。
- `pnpm install --frozen-lockfile` 通过 pnpm 的供应链策略校验。
- 声明的 DSH peer 依赖经 DeepSeek Harness 自带的 `evaluatePluginCompatibility`（`dsh-v0.1.7-rc.1`）对运行时 `0.1.7-rc.1` 校验：准入通过，无需豁免。
