# Changelog

English | [中文](CHANGELOG.zh.md)

All notable changes to **dsh-kingdee** are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/); this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2026-09-16

### Added / 新增

- **Kingdee Cloud Starry Sky V9.1 Enterprise Edition conformance / 适配金蝶云·星空 V9.1 企业版**:
  - **Third-party app login (`AuthService.LoginByAppSecret`)**: `authMode: "app"` now performs a real `LoginByAppSecret` login — payload `acctID` / `username` / `appid` / `appsecret` / `lcid` — and requires `userNameRef` (the 集成用户) alongside `appId` / `appSecret`, establishing the same `kdservice-sessionid` session as `user` mode. This is the mode Kingdee requires on public-cloud tenants opened after 2022-11-29, where account/password login is refused. / **第三方应用登录（`AuthService.LoginByAppSecret`）**：`authMode: "app"` 现执行真实的 `LoginByAppSecret` 登录（载荷 `acctID` / `username` / `appid` / `appsecret` / `lcid`），除 `appId` / `appSecret` 外还必须提供 `userNameRef`（集成用户），并与 `user` 模式建立同一个 `kdservice-sessionid` 会话。金蝶对 2022-11-29 之后开通的公有云账套拒绝账号密码登录，此类账套必须使用该模式。
  - **`lcid` config key**: New optional locale id (number, default `2052` = zh-CN), sent to both login services. / **`lcid` 配置项**：新增可选区域 id（数字，默认 `2052`，即 zh-CN），同时发送给两个登录服务。
  - **New endpoint fields**: `serviceEndpoints` gained `loginByAppSecretService` (default `Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret`) and `stubSuffix` (default `.common.kdsvc`). / **新增端点字段**：`serviceEndpoints` 增加 `loginByAppSecretService`（默认 `Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret`）与 `stubSuffix`（默认 `.common.kdsvc`）。
  - **Session on both channels**: the session is attached as both a bare `kdservice-sessionid` request header and a `Cookie` (`kdservice-sessionid=…; kdsvc=…`). / **双通道会话**：会话同时以裸 `kdservice-sessionid` 请求头与 `Cookie`（`kdservice-sessionid=…; kdsvc=…`）发出。

### Changed / 变更

- **Breaking-ish / 近似破坏性变更**:
  - `app` mode no longer fabricates a `KDAuthentication` header; it authenticates through `LoginByAppSecret` and then reuses the session exactly like `user` mode. It also now requires the 集成用户名 (`userNameRef`). / `app` 模式不再伪造 `KDAuthentication` 请求头，改为经 `LoginByAppSecret` 认证后与 `user` 模式一样复用会话；并新增集成用户名（`userNameRef`）必填要求。
  - Every stub URL now ends with `.common.kdsvc`; the login stub is `AuthService.ValidateUser` and the logout stub `AuthService.LogOut` (previously documented through `LoginService.*`). / 所有 stub URL 统一以 `.common.kdsvc` 结尾；登录 stub 为 `AuthService.ValidateUser`、登出 stub 为 `AuthService.LogOut`（此前文档写的是 `LoginService.*`）。
  - `kingdee_invoke` / `KdInvokeParams.serviceName` now takes the custom-stub path `{namespace}.{class}.{method},{assembly}` (e.g. `GetCust.GetCust.ExecuteService,GetCust`), which **replaces** the dynamic-form URL segment; `.common.kdsvc` is appended automatically. / `kingdee_invoke` 的 `serviceName` 现取自定义 stub 路径 `{namespace}.{class}.{method},{assembly}`（如 `GetCust.GetCust.ExecuteService,GetCust`），该段**直接替换** dynamic-form URL 段，`.common.kdsvc` 自动追加。
  - `serviceEndpoints.servicePrefix` was removed, replaced by `loginByAppSecretService` + `stubSuffix`. / `serviceEndpoints.servicePrefix` 已移除，由 `loginByAppSecretService` + `stubSuffix` 取代。
  - DSH pinned to `0.1.6-alpha.1` (peer ranges, devDependencies, `engines.dsh`). / DSH 锁定至 `0.1.6-alpha.1`（peer 范围、devDependencies、`engines.dsh`）。
- **Refreshed all bilingual documentation** (`README`, `INSTALL`, `USAGE`, `CONFIG`, `UPDATE`, `UNINSTALL`, `CHANGELOG`, `docs/RELEASE`) for the V9.1 target and the `0.1.6-alpha.1` verification. / **全面刷新双语文档**（`README`、`INSTALL`、`USAGE`、`CONFIG`、`UPDATE`、`UNINSTALL`、`CHANGELOG`、`docs/RELEASE`），对齐 V9.1 目标与 `0.1.6-alpha.1` 验证。

### Fixed / 修复

- **Login responses were parsed as the business envelope, so a successful login was reported as a failure / 登录响应被当成业务信封解析，导致登录成功却报失败**: the login services answer with their **own** shape (`{"LoginResultType": 1}`), not the `Result`/`IsSuccess` envelope every other operation returns. Running that through the business-envelope assertion meant `IsSuccess` was absent → treated as `false` → **authentication could never succeed against a real tenant**. Login is now classified separately by `parseLoginOutcome` (exported from the `kd-core` subpath): a numeric `LoginResultType` decides the outcome (`1` = success, anything else throws `kd/auth-failed`), and a response without `LoginResultType` falls back to the business envelope. The offline mock now answers the login stub with the real `{"LoginResultType": 1}` shape so this path stays covered. / 登录服务返回的是它**自己**的结构（`{"LoginResultType": 1}`），而不是其他所有操作返回的 `Result`/`IsSuccess` 业务信封。此前把登录响应送进业务信封断言，导致 `IsSuccess` 缺失 → 被判为 `false` → **在真实账套上认证永远无法成功**。现在登录结果由 `parseLoginOutcome`（从 `kd-core` 子路径导出）单独判定：存在数字型 `LoginResultType` 时以它为准（`1` 为成功，其余抛 `kd/auth-failed`）；没有 `LoginResultType` 时回退到业务信封。离线 mock 也改为用真实的 `{"LoginResultType": 1}` 结构应答登录 stub，确保该路径始终被覆盖。
- **Custom BOS stub URL**: the path was previously prefixed with `Kingdee.BOS.WebApi.ServicesStub.`, which no BOS custom service can resolve; a custom path now replaces that segment entirely. / **自定义 BOS stub URL**：此前会被拼上 `Kingdee.BOS.WebApi.ServicesStub.` 前缀，任何 BOS 自定义服务都无法解析；现由自定义路径整段替换。
- **Missing `lcid`**: the login payload now carries `lcid`, which was previously absent. / **补上缺失的 `lcid`**：登录载荷现携带此前缺失的 `lcid`。
- **Nonsensical `license: appId`** removed from the `user`-mode login payload. / 从 `user` 模式登录载荷中移除无意义的 `license: appId` 字段。

### Removed / 移除

- `buildAppAuthHeader` removed from the `kd-core` subpath API (replaced by `buildAppSecretLoginPayload`). / 从 `kd-core` 子路径 API 移除 `buildAppAuthHeader`（由 `buildAppSecretLoginPayload` 取代）。

## [0.6.1] - 2026-09-13

### Removed / 移除

- **Cleaned up dead code and unused legacy interfaces / 清理死代码与未使用的遗留接口**:
  - Removed unused legacy `KdToolResult` interface in `src/kd-core/types.ts` and its re-export from `src/kd-core/index.ts` (tool outputs are unified on the canonical open-value `JsonValue` schema). / 移除 `types.ts` 中废弃未被引用的 `KdToolResult` 接口定义及核心导出（工具输出全面统一为 `JsonValue` 开放值模型）。
  - Removed redundant utility function `parseEnvelopeFromText` in `src/kd-core/envelope.ts` and its isolated unit test (response parsing is safely handled at the transport seam). / 移除 `envelope.ts` 中无内部引用的辅助函数 `parseEnvelopeFromText` 及其单测（网络层已内联处理响应解析）。
  - Removed dead error code `kd/not-found` from `KdErrorCode` union type in `src/kd-core/errors.ts` (Kingdee WebAPI returns business errors or empty records rather than not-found). / 移除 `errors.ts` 中从未被触发抛出的死枚举联合 `'kd/not-found'`。
  - Pruned legacy multi-version exclusion rules in `pnpm-workspace.yaml`, pinning directly to `0.1.5-rc.2`. / 精简 `pnpm-workspace.yaml` 中的旧版本白名单声明，统一锁定至 `0.1.5-rc.2`。

## [0.6.0] - 2026-09-13

### Added / 新增

- **Kingdee Cloud Starry Sky V9.0 Enterprise Edition Adaptation / 适配金蝶云·星空 V9.0 企业版**:
  - **Standard Session Cookie (`kdservice-sessionid`)**: Supported extracting and forwarding Kingdee Cloud Starry Sky V9.0 official standard session cookie `kdservice-sessionid` alongside backward-compatible `kdsvc`. / 支持金蝶云·星空 V9.0 企业版官方标准响应头 `kdservice-sessionid` 的提取与双向回传，并保持对旧版 `kdsvc` 的双向兼容。
  - **Query Pagination & Sorting (`orderString`, `limit`, `startRow`)**: Added `OrderString`, `Limit`, and `StartRow` to `ExecuteBillQuery` and `QueryBusinessData` to comply with Kingdee V9.0 anti-table-scan best practices and guarantee stable cursor pagination. / 为 `ExecuteBillQuery` 与 `QueryBusinessData` 补全 `OrderString`（排序）、`Limit`（分页大小）与 `StartRow`（分页偏移），对齐金蝶星空 V9.0 企业版防大表全量扫表规范并保障稳定游标分页。
  - **Bill Number Direct Operations (`numbers`)**: Exposed `numbers` array parameter for `kingdee_audit`, `kingdee_unaudit`, `kingdee_delete`, `kingdee_unsubmit`, and `kingdee_delete_draft`, enabling AI agents to act directly using document numbers (e.g., `SO-20260901`) without pre-resolving internal surrogate `FID`s. / 为审批、反审、删除、反提交、暂存删除等工具暴露 `numbers` 参数，支持 AI 代理直接按单据编号（如 `SO-20260901`）驱动业务流程，无需提前查询底层内部自增 `FID`。
  - **View by Bill Number**: Enhanced `kingdee_view` to accept `number` parameter as an alternative to `id`. / 增强 `kingdee_view`，支持直接传入单据编号 `number` 查单。
  - **Save with Auto-Submit & Audit (`isAutoSubmitAndAudit`)**: Added `isAutoSubmitAndAudit` parameter to `kingdee_save` and `kingdee_batch_save` matching Kingdee V9.0 one-step save-submit-audit capability. / 在单据保存与批量保存中支持 `isAutoSubmitAndAudit` 参数，实现一键保存并自动提审。

### Security / 安全

- **SSRF Defenses and Strict Host Validation / SSRF 防御与严格主机校验**:
  - Implemented zero-dependency protocol and host safety assertions in `src/kd-core/security.ts`. / 在 `src/kd-core/security.ts` 中实现了纯 TypeScript 零依赖的协议与主机安全断言。
  - **Protocol Whitelist**: Only `http:` and `https:` protocols are permitted; all other protocols (`file:`, `ftp:`, `gopher:`, etc.) are strictly rejected. / 协议强制白名单：仅允许 `http:` 与 `https:`，严禁 `file:`、`ftp:`、`gopher:` 等危险协议。
  - **Network Boundary Checks**: Automatically blocks requests targeting `localhost`, loopback addresses (`127.0.0.0/8`, `::1`), RFC1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), link-local (`169.254.0.0/16`), CGNAT (`100.64.0.0/10`), IPv6 Link-Local (`fe80::/10`), and Unique Local Addresses (`fc00::/7`). / 自动拦截并拒绝指向 `localhost`、环回地址、RFC1918 私网网段、链路本地网段、运营商 NAT 网段及 IPv6 唯一本地地址的请求，防止内网横向探测与 SSRF 风险。
  - Integrated pre-flight validation in both configuration verification (`validateConfig`) and outbound HTTP dispatch (`HttpTransport.request`). / 在配置校验与网络实际发起层分别强制执行前置拦截。

## [0.5.0] - 2026-09-11

### Changed / 变更

- **Adapted to DeepSeek Harness `0.1.5-rc.2` and manifest specification modernization / 适配 DeepSeek Harness 0.1.5-rc.2 与插件清单规范现代化**:
  - Added `manifestVersion: 1` under `package.json.dsh` conforming to `@deepseek-ai/dsh-package-manifest`.
  - Added explicit host engine compatibility in `package.json.engines`: `"dsh": "^0.1.5-rc.2"`.
  - Upgraded `@deepseek-ai/dsh-*` peerDependencies and devDependencies to `0.1.5-rc.2`.
  - Refreshed all bilingual documentation (`README.md`, `README.zh.md`, `INSTALL.md`, `INSTALL.zh.md`, `UPDATE.md`, `UPDATE.zh.md`, `USAGE.md`, `USAGE.zh.md`, `CONFIG.md`, `CONFIG.zh.md`, `UNINSTALL.md`, `UNINSTALL.zh.md`) for `0.1.5-rc.2` verification.

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

- Added cross-platform secrets documentation to `INSTALL.md` / `INSTALL.zh.md` and `README.md` / `README.zh.md` — Linux/macOS `export`, Windows PowerShell `$env:`, Windows CMD `set` / `setx`, and the DSH credential store.
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
