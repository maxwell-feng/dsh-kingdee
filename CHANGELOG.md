# Changelog

All notable changes to **dsh-kingdee** are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/); this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-09-10

### Changed / 变更

- **Adapted to deepseek-harness `0.1.5-rc.1` per the official plugin development docs.** Upgraded all `@deepseek-ai/dsh-*` devDependencies to `0.1.5-rc.1` and the `@deepseek-ai/dsh-credentials` / `@deepseek-ai/dsh-tools` peer ranges to `^0.1.5-rc.1`. Verified each consumed contract still exists in `rc.1` (`credentialRef`, `defineTool`, `ctx.tools.register`, `ctx.credentials.resolve`, `ctx.settings.installSection`, the `dsh-client-locale` / `dsh-client-ui-settings` client injects, `JsonValue`); the `alpha.1→rc.1` diff for these packages is version-bumps only, so the tool set and credentials flow are behaviorally identical. / **按官方插件开发规范全面适配 deepseek-harness `0.1.5-rc.1`**。将所有 `@deepseek-ai/dsh-*` 开发依赖更新至 `0.1.5-rc.1`，并将 `@deepseek-ai/dsh-credentials` / `@deepseek-ai/dsh-tools` peer 范围升至 `^0.1.5-rc.1`。逐项核验本插件消费的契约在 `rc.1` 中依然存在（`credentialRef`、`defineTool`、`ctx.tools.register`、`ctx.credentials.resolve`、`ctx.settings.installSection`、客户端 `dsh-client-locale` / `dsh-client-ui-settings` 注入、`JsonValue`）；这些包的 `alpha.1→rc.1` 差异仅为版本号，工具集与凭据解析行为完全一致。
- **Refreshed bilingual documentation** (`README.md`, `README.zh.md`, `INSTALL.md`, `INSTALL.zh.md`, `UPDATE.md`, `UPDATE.zh.md`, `UNINSTALL.md`, `UNINSTALL.zh.md`) to mark verification against DeepSeek Harness `0.1.5-rc.1`, added the `English | 中文` switcher line under each H1, and cross-linked the new usage guide. / **全面刷新双语文档**，明确标注针对 DeepSeek Harness `0.1.5-rc.1` 的验证，在每个一级标题下补齐 `English | 中文` 切换行，并互链新增的使用说明。

### Added / 新增

- **Added standalone bilingual usage documentation (`USAGE.md` / `USAGE.zh.md`)** documenting all 14 `kingdee_*` tools with parameters (required / type / description) and examples, cross-checked against `src/tools.ts`. Included `USAGE.md` and `USAGE.zh.md` in published package distribution files. / **新增独立双语使用说明文档（`USAGE.md` / `USAGE.zh.md`）**，列出全部 14 个 `kingdee_*` 工具的入参（是否必填 / 类型 / 说明）与示例，并与 `src/tools.ts` 逐项核对。在发布包 `files` 清单中包含该文档。

## [0.3.0] - 2026-09-09

### Changed / 变更

- **Adapted to deepseek-harness `0.1.5-alpha.1` per the official plugin development docs.** Upgraded all `@deepseek-ai/dsh-*` devDependencies to `0.1.5-alpha.1`. The runtime seams (`defineTool`, `ctx.tools.register`, `ctx.credentials.resolve`, `ctx.settings.installSection`) continue to work seamlessly. / **按官方插件开发规范全面适配 deepseek-harness `0.1.5-alpha.1`**。将所有 `@deepseek-ai/dsh-*` 开发依赖版本更新至 `0.1.5-alpha.1`。各核心运行时缝接口（`defineTool`、`ctx.tools.register`、`ctx.credentials.resolve`、`ctx.settings.installSection`）无缝兼容。
- **Refreshed bilingual documentation** (`README.md`, `README.zh.md`, `INSTALL.md`, `INSTALL.zh.md`, `UPDATE.md`, `UPDATE.zh.md`, `UNINSTALL.md`, `UNINSTALL.zh.md`) to mark verification against DeepSeek Harness `0.1.5-alpha.1`. / **全面刷新双语文档**，明确标注针对 DeepSeek Harness `0.1.5-alpha.1` 的验证。

### Added / 新增

- **Added standalone bilingual configuration documentation (`CONFIG.md` / `CONFIG.zh.md`)** detailing all configuration keys, authentication modes, credential-safe resolution, service endpoint overrides, profile definitions, and Web UI settings cards. Included `CONFIG.md` and `CONFIG.zh.md` in published package distribution files. / **新增独立双语配置说明文档（`CONFIG.md` / `CONFIG.zh.md`）**，详细列出全部配置项、两种认证模式（`user`/`app`）、凭据安全解析机制、服务端点自定义覆盖、静态 Profile 声明与 Web 界面配置。在发布包 `files` 清单中包含该文档。

## [0.2.4] - 2026-09-03

### Changed / 变更

- **Adapted to deepseek-harness `0.1.2-rc.1` per the official plugin development docs** (`docs/user/develop/basic/config|tool|publish`, `docs/cookbook/adding-a-settings-card`). The DSH seams this plugin uses — `defineTool`, `ctx.tools.register`, `ctx.credentials.resolve`, `ctx.settings.installSection` — are unchanged since `0.1.2-alpha.5`, so the tool set and credentials flow are behaviorally identical. / **按官方插件开发文档适配 deepseek-harness `0.1.2-rc.1`**（`docs/user/develop/basic/config|tool|publish`、`docs/cookbook/adding-a-settings-card`）。本插件使用的各缝接口 —— `defineTool`、`ctx.tools.register`、`ctx.credentials.resolve`、`ctx.settings.installSection` —— 自 `0.1.2-alpha.5` 以来未变，工具集与凭据解析行为完全一致。

### Fixed / 修复

- **Replaced the ambient `any` peer declarations (`src/types/peers.d.ts`) with the real published peer packages** at `0.1.2-rc.1` (`@deepseek-ai/dsh-tools`, `dsh-settings`, `dsh-credentials`, `cordis`, `schemastery`). `npm run typecheck` now passes with 0 errors (previously 43 implicit-`any` errors); `apply` no longer compiles against `Context = any`. Credential refs now flow through the branded `credentialRef()` helper exactly as the credential-seam doc prescribes. / **删除 ambient `any` peer 声明（`src/types/peers.d.ts`），改用 npm 上真实的 `0.1.2-rc.1` peer 包**（`@deepseek-ai/dsh-tools`、`dsh-settings`、`dsh-credentials`、`cordis`、`schemastery`）。`npm run typecheck` 由 43 个隐式 `any` 错误清零；`apply` 不再基于 `Context = any` 编译。凭据引用改按凭据缝文档使用带品牌的 `credentialRef()` 辅助函数。
- **Tool outputs now declare the canonical open-value schema (`type: 'json'`)** matching `defineTool`'s contract: `execute` returns `Promise<JsonValue>` and `render` receives the validated value (pattern from `cordis_inspect_list` / `tool-workflow`). Previously the hand-written `{ type: 'object', additionalProperties: true }` specs never type-checked against the `unknown` returns. / **工具输出统一声明规范开放值 schema（`type: 'json'`）**，`execute` 返回 `Promise<JsonValue>`、`render` 接收校验后的值（对齐 `cordis_inspect_list` / `tool-workflow` 的官方写法）。此前手写的 `{ type: 'object', additionalProperties: true }` 无法通过类型检查。
- **The settings-card browser half is now actually built and served.** Added the `dsh.client` manifest (`platform: web`, injecting the locale and client-settings packages), the `./client` export, and a self-contained `tsdown.config.ts` that reproduces the client module system's lazy-CJS factory artifact (`window.__ModuleLoader__.load(...)`, `lib/client.js`). The card binds `ctx.settingsScope` (namespace `kingdee`), registers into the `settings.plugin.item` slot, registers its own `settings.kingdee` locale dictionary, and renders its own chrome (no cross-plugin value imports — the bundle-purity gate). / **设置卡片的浏览器半侧现已被真正构建并可加载**：新增 `dsh.client` 清单（`platform: web`，注入 locale 与 client-settings 包）、`./client` 导出，以及自包含的 `tsdown.config.ts`，按客户端模块系统的 lazy-CJS factory 产物格式输出（`window.__ModuleLoader__.load(...)`，`lib/client.js`）。卡片绑定 `ctx.settingsScope`（命名空间 `kingdee`）、注册进 `settings.plugin.item` slot、注册自有 `settings.kingdee` 词典，并自绘卡片外观（无跨插件值导入 —— 通过 bundle 纯净门禁）。
- **`installSection` hook usage corrected**: `setSource` receives a thunk returning the authoritative config (`() => Config`), per the settings seam contract; the plugin now re-reads through the thunk so a settings edit (or provider detach) reaches the next tool call. Tests 7/7 pass; build emits `lib/` (Node half via tsc, browser half via tsdown). / **修正 `installSection` 钩子用法**：按设置缝契约，`setSource` 接收返回当前权威配置的 thunk（`() => Config`）；插件改为经 thunk 读取，设置页保存（或 provider 卸载）即刻影响下一次工具调用。测试 7/7 通过；构建同时产出 Node 半侧（tsc）与浏览器半侧（tsdown）。

## [0.2.3] - 2026-09-02

### Changed / 变更

- **Verified against deepseek-harness `0.1.2-alpha.5` (latest `master`).** No DSH seam changes affecting this plugin since `0.1.2-alpha.4` — `defineTool` / `ctx.credentials` / `ctx.settings` contracts and the WebAPI transport remain stable, so no code changes required. Bumped package to `0.2.3` and refreshed bilingual docs (Release / Changelog / Install / Uninstall / Usage / Config). / **已在 deepseek-harness `0.1.2-alpha.5` 最新 `master` 上验证。** 自 `0.1.2-alpha.4` 以来无影响本插件的 DSH 缝变更 —— `defineTool` / `ctx.credentials` / `ctx.settings` 契约及 WebAPI 传输保持稳定，无需代码改动。版本升至 `0.2.3`，并刷新双语文档（发行版 / 更新说明 / 安装 / 卸载 / 使用 / 配置）。

## [0.2.2] - 2026-09-02

### Changed / 变更

- **Verified against deepseek-harness `0.1.2-alpha.4` (latest `master`).** No DSH seam changes affecting this plugin since `0.1.2-alpha.3` — `defineTool` / `ctx.credentials` / `ctx.settings` contracts and the WebAPI transport remain stable, so no code changes required. Bumped package to `0.2.2` and refreshed bilingual docs (Release / Changelog / Install / Uninstall / Usage / Config). / **已在 deepseek-harness `0.1.2-alpha.4` 最新 `master` 上验证。** 自 `0.1.2-alpha.3` 以来无影响本插件的 DSH 缝变更 —— `defineTool` / `ctx.credentials` / `ctx.settings` 契约及 WebAPI 传输保持稳定，无需代码改动。版本升至 `0.2.2`，并刷新双语文档（发行版 / 更新说明 / 安装 / 卸载 / 使用 / 配置）。

## [0.2.1] - 2026-09-01

### Fixed

- Reworked the README feature bullet (EN + zh-CN) so the `kingdee_*` tool list reads correctly when rendered on npm (avoids the long comma-separated inline-code span). The full list is in the Tools table.

## [0.2.0] - 2026-09-01

### Added

- **New data/service-layer operations** in `kd-core` and matching DSH tools:
  - `kingdee_logout` — `LoginService.LogOut`, clears the stored session cookie.
  - `kingdee_list_datacenters` — list the data centers / tenants reachable at the base URL.
  - `kingdee_query_business_data` — the newer structured `QueryBusinessData` query.
  - `kingdee_unsubmit` — un-submit a form (reverses a submit).
  - `kingdee_delete_draft` — delete draft (暂存/created) records.
  - `kingdee_batch_save` — batch-save several records in one call.
- **Overridable service endpoints** (`KdConfig.endpoints` / `serviceEndpoints` config) so WebAPI service names can be matched to a specific Kingdee version.
- Unit tests covering the new operations (7/7 passing).

### Changed

- Added cross-platform secrets documentation to `INSTALL.md` / `INSTALL.zh.md` and `README.md` / `README.zh.md` — Linux/macOS `export`, Windows PowerShell `$env:`, Windows CMD `set` / `setx`, and the DSH credential store (`dsh credentials set`).
- License changed from MIT to a **proprietary (all rights reserved)** license. The repository is read/evaluation-only: copying, forking, re-hosting, re-publishing, modifying, or creating derivative works is prohibited without prior written permission.

## [0.1.0] - 2026-09-01

Initial release.

### Added

- **kd-core** — a framework-free Kingdee Cloud Starry Sky WebAPI client:
  - Two authentication modes: `user` (账号 username/password, via `LoginService.ValidateUser` with the `kdsvc` session cookie) and `app` (appId/appSecret).
  - Typed operations: `executeBillQuery`, `save`, `submit`, `audit`, `unaudit`, `view`, `delete`, `invokeService`.
  - Envelope parsing/normalization and typed error mapping (`kd/business-error`, `kd/auth-failed`, `kd/not-found`, `kd/invalid-config`, `kd/network`, `kd/timeout`, `kd/unknown`).
  - Transport seam with a real `HttpTransport` (global `fetch`) and an offline `MockTransport`.
- **DSH plugin** — typed tools registered via `defineTool`:
  - `kingdee_query`, `kingdee_save`, `kingdee_submit`, `kingdee_audit`, `kingdee_unaudit`, `kingdee_view`, `kingdee_delete`, `kingdee_invoke`.
  - Credential-safe configuration: secrets resolved per operation through the DSH credential seam (`ctx.credentials.resolve`).
  - A `kingdee` settings namespace (Host half) with a browser settings card scaffold (Client half, `dsh.client`).
- **Companion skill** — `kingdee-bos`: field/enum/status conventions, the bill state machine, tool usage, and the data-layer vs platform-plugin-layer boundary.
- **Documentation** — bilingual (English / 简体中文): README, INSTALL, UPDATE, UNINSTALL, CHANGELOG, and release notes.
- **Tests** — unit tests for the core (envelope parsing, config validation, auth headers, the full mock flow, and error mapping) using the Node built-in test runner.

### Security

- No secret values are stored in configuration; they are resolved from environment-variable references per operation.

### Notes

- The platform-plugin layer (server-side C# form/list plugins, UI layout) is **not** reachable through the WebAPI and is documented as an explicit boundary in the `kingdee-bos` skill.
- The DSH host/plugin half is compiled inside a DSH profile (its `@deepseek-ai/*` peers resolve there); only `kd-core` is built and tested standalone.
