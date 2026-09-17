# Changelog

English | [Chinese](CHANGELOG.zh.md)

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/).

## [0.8.1] - 2026-09-18

### Changed

- **Language boundary completed.** Runtime strings are English only: the `kingdee_delete_draft` tool description, the settings-card user-name label, the `authMode: "app"` error message, and every source comment. Two exceptions stay Chinese by design — the login-word matcher in `src/kd-core/errors.ts`, which must recognize the Chinese error text the Kingdee WebAPI returns, and the Chinese product display name on the Plugins card.
- **Documentation normalized.** Every document is single-language — `X.md` English, `X.zh.md` Chinese — with complete pairs and switcher lines, and both changelogs now cover the same 13 releases.

### Added

- `AGENTS.md` states the bilingual rule; `scripts/check-docs-language.mjs` enforces documents, source strings and pairs locally and in CI, which runs it before installing dependencies.

## [0.8.0] - 2026-09-18

### Changed

- **DeepSeek Harness 0.1.6-alpha.2 Alignment**:
 - **Client configuration slot migration**: DeepSeek Harness `0.1.6-alpha.2` migrated plugin settings surfaces from the deprecated `settings.plugin.item` slot to the dedicated Plugins Manager page (`ui-plugin-manager`). `dsh-kingdee` now registers into `plugins.row.config` (keyed by `dsh-kingdee#kingdee`) and `plugins.bundle.config` (keyed by `dsh-kingdee`).
 - **Dual-view rendering (`summary` & `page`)**: Conforming to the new `PluginConfigViewProps` contract, the card now renders the concise summary description in `view: 'summary'` (used under titles on card heads and detail headers) and mounts the full interactive revision-fenced configuration form in `view: 'page'`.
 - **Dependency and engine bounds**: All `@deepseek-ai/dsh-*` peerDependencies updated to `^0.1.6-alpha.2`, devDependencies pinned to `0.1.6-alpha.2`, and `engines.dsh` updated to `^0.1.6-alpha.2`. Added `@deepseek-ai/dsh-client-ui-plugin-manager` to devDependencies.
 - **Refreshed all bilingual documentation** (`README`, `INSTALL`, `USAGE`, `CONFIG`, `UPDATE`, `UNINSTALL`, `CHANGELOG`, `docs/RELEASE`) for the `0.1.6-alpha.2` release.

## [0.7.0] - 2026-09-16

### Added

- **Kingdee Cloud Starry Sky V9.1 Enterprise Edition conformance**:
 - **`lcid` config key**: New optional locale id (number, default `2052` = zh-CN), sent to both login services.
 - **New endpoint fields**: `serviceEndpoints` gained `loginByAppSecretService` (default `Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret`) and `stubSuffix` (default `.common.kdsvc`).
 - **Session on both channels**: the session is attached as both a bare `kdservice-sessionid` request header and a `Cookie` (`kdservice-sessionid=…; kdsvc=…`).

### Changed

- **Breaking-ish**:
 - Every stub URL now ends with `.common.kdsvc`; the login stub is `AuthService.ValidateUser` and the logout stub `AuthService.LogOut` (previously documented through `LoginService.*`).
 - `kingdee_invoke` / `KdInvokeParams.serviceName` now takes the custom-stub path `{namespace}.{class}.{method},{assembly}` (e.g. `GetCust.GetCust.ExecuteService,GetCust`), which **replaces** the dynamic-form URL segment; `.common.kdsvc` is appended automatically.
 - `serviceEndpoints.servicePrefix` was removed, replaced by `loginByAppSecretService` + `stubSuffix`.
 - DSH pinned to `0.1.6-alpha.1` (peer ranges, devDependencies, `engines.dsh`).
- **Refreshed all bilingual documentation** (`README`, `INSTALL`, `USAGE`, `CONFIG`, `UPDATE`, `UNINSTALL`, `CHANGELOG`, `docs/RELEASE`) for the V9.1 target and the `0.1.6-alpha.1` verification.

### Fixed

- **Custom BOS stub URL**: the path was previously prefixed with `Kingdee.BOS.WebApi.ServicesStub.`, which no BOS custom service can resolve; a custom path now replaces that segment entirely.
- **Missing `lcid`**: the login payload now carries `lcid`, which was previously absent.
- **Nonsensical `license: appId`** removed from the `user`-mode login payload.

### Removed

- `buildAppAuthHeader` removed from the `kd-core` subpath API (replaced by `buildAppSecretLoginPayload`).

## [0.6.1] - 2026-09-13

### Removed

- **Cleaned up dead code and unused legacy interfaces**:
 - Removed unused legacy `KdToolResult` interface in `src/kd-core/types.ts` and its re-export from `src/kd-core/index.ts` (tool outputs are unified on the canonical open-value `JsonValue` schema).
 - Removed redundant utility function `parseEnvelopeFromText` in `src/kd-core/envelope.ts` and its isolated unit test (response parsing is safely handled at the transport seam).
 - Removed dead error code `kd/not-found` from `KdErrorCode` union type in `src/kd-core/errors.ts` (Kingdee WebAPI returns business errors or empty records rather than not-found).
 - Pruned legacy multi-version exclusion rules in `pnpm-workspace.yaml`, pinning directly to `0.1.5-rc.2`.

## [0.6.0] - 2026-09-13

### Added

- **Kingdee Cloud Starry Sky V9.0 Enterprise Edition Adaptation**:
 - **Standard Session Cookie (`kdservice-sessionid`)**: Supported extracting and forwarding Kingdee Cloud Starry Sky V9.0 official standard session cookie `kdservice-sessionid` alongside backward-compatible `kdsvc`.
 - **Query Pagination & Sorting (`orderString`, `limit`, `startRow`)**: Added `OrderString`, `Limit`, and `StartRow` to `ExecuteBillQuery` and `QueryBusinessData` to comply with Kingdee V9.0 anti-table-scan best practices and guarantee stable cursor pagination.
 - **Bill Number Direct Operations (`numbers`)**: Exposed `numbers` array parameter for `kingdee_audit`, `kingdee_unaudit`, `kingdee_delete`, `kingdee_unsubmit`, and `kingdee_delete_draft`, enabling AI agents to act directly using document numbers (e.g., `SO-20260901`) without pre-resolving internal surrogate `FID`s.
 - **View by Bill Number**: Enhanced `kingdee_view` to accept `number` parameter as an alternative to `id`.
 - **Save with Auto-Submit & Audit (`isAutoSubmitAndAudit`)**: Added `isAutoSubmitAndAudit` parameter to `kingdee_save` and `kingdee_batch_save` matching Kingdee V9.0 one-step save-submit-audit capability.

### Security

- **SSRF Defenses and Strict Host Validation**:
 - Implemented zero-dependency protocol and host safety assertions in `src/kd-core/security.ts`.
 - **Protocol Whitelist**: Only `http:` and `https:` protocols are permitted; all other protocols (`file:`, `ftp:`, `gopher:`, etc.) are strictly rejected.
 - **Network Boundary Checks**: Automatically blocks requests targeting `localhost`, loopback addresses (`127.0.0.0/8`, `::1`), RFC1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), link-local (`169.254.0.0/16`), CGNAT (`100.64.0.0/10`), IPv6 Link-Local (`fe80::/10`), and Unique Local Addresses (`fc00::/7`).
 - Integrated pre-flight validation in both configuration verification (`validateConfig`) and outbound HTTP dispatch (`HttpTransport.request`).

## [0.5.0] - 2026-09-11

### Changed

- **Adapted to DeepSeek Harness `0.1.5-rc.2` and manifest specification modernization**:
  - Added `manifestVersion: 1` under `package.json.dsh` conforming to `@deepseek-ai/dsh-package-manifest`.
  - Added explicit host engine compatibility in `package.json.engines`: `"dsh": "^0.1.5-rc.2"`.
  - Upgraded `@deepseek-ai/dsh-*` peerDependencies and devDependencies to `0.1.5-rc.2`.
  - Refreshed all bilingual documentation (`README.md`, `README.zh.md`, `INSTALL.md`, `INSTALL.zh.md`, `UPDATE.md`, `UPDATE.zh.md`, `USAGE.md`, `USAGE.zh.md`, `CONFIG.md`, `CONFIG.zh.md`, `UNINSTALL.md`, `UNINSTALL.zh.md`) for `0.1.5-rc.2` verification.

## [0.4.0] - 2026-09-10

### Changed

### Added

## [0.3.0] - 2026-09-09

### Changed

- **Adapted to deepseek-harness `0.1.5-alpha.1` per the official plugin development docs.** Upgraded all `@deepseek-ai/dsh-*` devDependencies to `0.1.5-alpha.1`. The runtime seams (`defineTool`, `ctx.tools.register`, `ctx.credentials.resolve`, `ctx.settings.installSection`) continue to work seamlessly.
- **Refreshed bilingual documentation** (`README.md`, `README.zh.md`, `INSTALL.md`, `INSTALL.zh.md`, `UPDATE.md`, `UPDATE.zh.md`, `UNINSTALL.md`, `UNINSTALL.zh.md`) to mark verification against DeepSeek Harness `0.1.5-alpha.1`.

### Added

## [0.2.4] - 2026-09-03

### Changed

- **Adapted to deepseek-harness `0.1.2-rc.1` per the official plugin development docs** (`docs/user/develop/basic/config|tool|publish`, `docs/cookbook/adding-a-settings-card`). The DSH seams this plugin uses — `defineTool`, `ctx.tools.register`, `ctx.credentials.resolve`, `ctx.settings.installSection` — are unchanged since `0.1.2-alpha.5`, so the tool set and credentials flow are behaviorally identical.

### Fixed

- **Replaced the ambient `any` peer declarations (`src/types/peers.d.ts`) with the real published peer packages** at `0.1.2-rc.1` (`@deepseek-ai/dsh-tools`, `dsh-settings`, `dsh-credentials`, `cordis`, `schemastery`). `npm run typecheck` now passes with 0 errors (previously 43 implicit-`any` errors); `apply` no longer compiles against `Context = any`. Credential refs now flow through the branded `credentialRef()` helper exactly as the credential-seam doc prescribes.
- **The settings-card browser half is now actually built and served.** Added the `dsh.client` manifest (`platform: web`, injecting the locale and client-settings packages), the `./client` export, and a self-contained `tsdown.config.ts` that reproduces the client module system's lazy-CJS factory artifact (`window.__ModuleLoader__.load(...)`, `lib/client.js`). The card binds `ctx.settingsScope` (namespace `kingdee`), registers into the `settings.plugin.item` slot, registers its own `settings.kingdee` locale dictionary, and renders its own chrome (no cross-plugin value imports — the bundle-purity gate).
- **`installSection` hook usage corrected**: `setSource` receives a thunk returning the authoritative config (`() => Config`), per the settings seam contract; the plugin now re-reads through the thunk so a settings edit (or provider detach) reaches the next tool call. Tests 7/7 pass; build emits `lib/` (Node half via tsc, browser half via tsdown).

## [0.2.3] - 2026-09-02

### Changed

## [0.2.2] - 2026-09-02

### Changed

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
  - `kingdee_delete_draft` — delete records in the draft / created state.
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
  - Two authentication modes: `user` (account username/password, via `LoginService.ValidateUser` with the `kdsvc` session cookie) and `app` (appId/appSecret).
  - Typed operations: `executeBillQuery`, `save`, `submit`, `audit`, `unaudit`, `view`, `delete`, `invokeService`.
  - Envelope parsing/normalization and typed error mapping (`kd/business-error`, `kd/auth-failed`, `kd/not-found`, `kd/invalid-config`, `kd/network`, `kd/timeout`, `kd/unknown`).
  - Transport seam with a real `HttpTransport` (global `fetch`) and an offline `MockTransport`.
- **DSH plugin** — typed tools registered via `defineTool`:
  - `kingdee_query`, `kingdee_save`, `kingdee_submit`, `kingdee_audit`, `kingdee_unaudit`, `kingdee_view`, `kingdee_delete`, `kingdee_invoke`.
  - Credential-safe configuration: secrets resolved per operation through the DSH credential seam (`ctx.credentials.resolve`).
  - A `kingdee` settings namespace (Host half) with a browser settings card scaffold (Client half, `dsh.client`).
- **Companion skill** — `kingdee-bos`: field/enum/status conventions, the bill state machine, tool usage, and the data-layer vs platform-plugin-layer boundary.
- **Documentation** — bilingual (English
- **Tests** — unit tests for the core (envelope parsing, config validation, auth headers, the full mock flow, and error mapping) using the Node built-in test runner.

### Security

- No secret values are stored in configuration; they are resolved from environment-variable references per operation.

### Notes

- The platform-plugin layer (server-side C# form/list plugins, UI layout) is **not** reachable through the WebAPI and is documented as an explicit boundary in the `kingdee-bos` skill.
- The DSH host/plugin half is compiled inside a DSH profile (its `@deepseek-ai/*` peers resolve there); only `kd-core` is built and tested standalone.
