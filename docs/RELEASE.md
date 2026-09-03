# Release notes — v0.2.4

Release date: 2026-09-03

Fifth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. Adapted to **deepseek-harness `0.1.2-rc.1`** (latest `master`) per the official plugin development docs.

## Compatibility

- **Harness `0.1.2-rc.1`**: no DSH seam changes affecting this plugin since `0.1.2-alpha.5` — `defineTool` / `ctx.credentials` / `ctx.settings` and the WebAPI transport remain stable, so no behavioral migration is required.
- **中文兼容性**：已在 `0.1.2-rc.1` 最新 `master` 上验证，自 `0.1.2-alpha.5` 以来无影响本插件的缝变更，行为无需迁移。

## Update notes / 更新说明

- **Update**: `dsh plugin update dsh-kingdee` (or `dsh plugin add dsh-kingdee@0.2.4`). **升级**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.2.4`）。
- **Requirements**: harness `0.1.2-rc.1`; Node ≥22. **环境要求**：harness `0.1.2-rc.1`；Node ≥22。
- **Install**: `dsh plugin add dsh-kingdee` — the bundle patch self-registers the `kingdee` loader row. **安装**：`dsh plugin add dsh-kingdee` —— bundle 补丁自动注册 `kingdee` loader 行。
- **Uninstall**: `dsh plugin remove dsh-kingdee`. **卸载**：`dsh plugin remove dsh-kingdee`。
- **Usage**: configure the connection in the **Plugins → kingdee** settings card, set the credential env vars, then call the `kingdee_*` tools from a session. **使用**：在 **Plugins → kingdee** 设置卡片配置连接，设置凭据环境变量，然后在会话中调用 `kingdee_*` 工具。
- **Config**: `baseUrl`, `acctId`, `authMode` (`user` | `app`), `appId`, credential refs (`appSecretRef` / `userNameRef` / `passwordRef`), `organization`, `timeoutMs`, `mock`, optional `serviceEndpoints`. **配置**：`baseUrl`、`acctId`、`authMode`（`user` | `app`）、`appId`、凭据引用（`appSecretRef` / `userNameRef` / `passwordRef`）、`organization`、`timeoutMs`、`mock`、可选 `serviceEndpoints`。

## Highlights

- **Aligned with the official plugin docs** — real published peer types replace the ambient `any` declarations: `typecheck` goes from 43 implicit-`any` errors to 0; `apply` no longer compiles against `Context = any`.
- **Tool outputs use the canonical `type: 'json'` schema** — `execute` returns `Promise<JsonValue>`, matching the `defineTool` contract used by `cordis_inspect_list` and `tool-workflow`.
- **The settings-card browser half now builds and loads** — new `dsh.client` manifest (`platform: web`), `./client` export, and a self-contained `tsdown.config.ts` producing the lazy-CJS factory artifact (`lib/client.js`). The card binds `ctx.settingsScope` under the `kingdee` namespace, registers into `settings.plugin.item`, ships its own `settings.kingdee` locale dictionary, and renders its own chrome (bundle-purity gate clean).
- **`installSection` hooks corrected** — `setSource` receives a thunk per the settings-seam contract; configuration edits reach the next tool call.
- **Tests** — `kd-core` unit tests (7/7) pass on Node ≥22; build emits both halves (`lib/` node via tsc, browser via tsdown).

## 亮点（中文）

- **对齐官方插件文档** —— 以 npm 上真实的 `0.1.2-rc.1` peer 包替换 ambient `any` 声明：`typecheck` 从 43 个隐式 `any` 错误清零。
- **工具输出采用规范 `type: 'json'` schema** —— `execute` 返回 `Promise<JsonValue>`，与 `cordis_inspect_list`、`tool-workflow` 的官方写法一致。
- **设置卡片浏览器半侧可构建、可加载** —— 新增 `dsh.client` 清单、`./client` 导出与自包含 `tsdown.config.ts`，产出 lazy-CJS factory 产物（`lib/client.js`）。
- **修正 `installSection` 钩子用法** —— `setSource` 接收 thunk，配置修改即刻生效。

## Known limitations

- The **platform-plugin layer** (server-side C# form/list plugins, UI layout, background events) is **not** exposed — it is outside the WebAPI's reach and is documented as a boundary.
- The `./client` bundle follows the documented factory format; the shared `clientBundle` tsdown preset lives inside the harness repository and is not published, so this package reproduces the artifact itself.

## Installation

See [INSTALL.md](../INSTALL.md). Upgrade and removal are in [UPDATE.md](../UPDATE.md) and [UNINSTALL.md](../UNINSTALL.md).

## Links

- Home: https://github.com/maxwell-feng/dsh-kingdee
- Changelog: [CHANGELOG.md](../CHANGELOG.md)
