# dsh-kingdee

English | [Chinese](README.zh.md)

> Kingdee Cloud Starry Sky secondary-development plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH).

`dsh-kingdee` gives the DSH agent a first-class, credential-safe way to act on a Kingdee Cloud Starry Sky tenant through its **WebAPI**: typed tools for querying, saving, submitting, auditing, un-auditing, viewing and deleting bills/base data, and for invoking BOS custom services. A companion domain skill (`kingdee-bos`) teaches the field/enum/status conventions and the boundary between the data layer and the platform-plugin layer.

- **credential-safe** — secrets are environment-variable references resolved through the DSH credential seam, never literal config.
- **Kingdee V9.1 Enterprise Edition ready** — fully adapted for Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x, supporting the official `kdservice-sessionid` session (sent as both a request header and a cookie), stable cursor pagination (`orderString`, `limit`, `startRow`), direct bill number (`numbers`) workflow actions, and auto-submit/audit (`isAutoSubmitAndAudit`).
- **two real login paths** — an account-set username/password against `AuthService.ValidateUser`, or a third-party application against `AuthService.LoginByAppSecret` (the mode Kingdee requires on public-cloud tenants opened after 2022-11-29). Both attach the same `kdservice-sessionid` session; no fabricated auth header is used, and the login responses are classified by their own `LoginResultType` shape rather than the business envelope.
- **SSRF network defense** — strict protocol whitelist (http/https only) and host boundary verification blocking localhost, loopback, private subnets, and reserved network segments.
- **typed tools** — query, save, submit, audit, un-audit, view, delete and invoke BOS custom services through the `kingdee_*` tools. Each one is listed below in the Tools table.
- **full state machine** — create/update → submit → audit → un-audit flow, off the shelf.
- **offline mock** — a `mock: true` flag swaps in a local transport so you can demo and test the pipeline without a reachable tenant.
- **bilingual docs** — English and Simplified Chinese.

> 🧩 **Scope.** This plugin covers the **data/service layer** of Kingdee Cloud secondary development. The **platform-plugin layer** (server-side C# form/list plugins, UI layout, background events) uses the BOS integration development environment and is **not** reachable through the WebAPI. The `kingdee-bos` skill documents that boundary.

## Install

```sh
# Add the bundle to a DSH profile and enable it
dsh plugin add dsh-kingdee
```

> **Previous releases must be upgraded for DeepSeek Harness 0.2.0-rc.1.** 0.11.1 adapts the plugin to DeepSeek Harness 0.2.0-rc.1. The previous `0.10.0` is **refused at load** on 0.2.0-rc.1: it declared its `@deepseek-ai/dsh-credentials` and `@deepseek-ai/dsh-tools` peers as `^0.1.7-alpha.2`, which excludes 0.2.x, and 0.2.0-rc.1 checks every `@deepseek-ai/dsh` / `@deepseek-ai/dsh-*` peer entry against the single running runtime version before a plugin row loads, with prereleases participating in range matching (`engines.dsh` is **not** what the gate reads). An incompatible row is refused and an incompatible bundle is skipped. 0.11.1 widens both peers to `>=0.1.7-alpha.2 <0.3.0`, so it is admitted on `0.1.7-alpha.2` through `0.2.x` — and still refused on `0.1.6-alpha.2`. On 0.2.0-rc.1, upgrade with `dsh plugin add dsh-kingdee@0.11.1`.
>
> The remedy the harness prints for a refusal is `dsh plugin allow-version <package@version> --dsh-version <runtime> --accept-risk` (or the plugin manager), which records an **exact-version exemption** in the profile's `compatibility.json`. That is a risk acknowledgement, not a compatibility fix, and it grants one exact plugin version on one exact runtime: a plugin upgrade or a harness upgrade does not inherit the grant.

> Verified against deepseek-harness **0.2.0-rc.1** with plugin **0.11.1**: `pnpm run typecheck` clean, `pnpm run build` clean, **15** unit tests passing (`pnpm test`), `pnpm install` passing pnpm's supply-chain gate, and the harness's own compatibility check admitting `dsh-kingdee@0.11.1` on runtime `0.2.0-rc.1`. **No live-tenant verification was performed.**

See [CONFIG.md](./CONFIG.md) for full configuration, [INSTALL.md](./INSTALL.md) for setup, [USAGE.md](./USAGE.md) for the tool reference, and [UPDATE.md](./UPDATE.md) / [UNINSTALL.md](./UNINSTALL.md) for upgrades and removal. Release history is in [CHANGELOG.md](./CHANGELOG.md) / [CHANGELOG.zh.md](./CHANGELOG.zh.md).

## Quick start

1. Register the plugin and set connection details in the **Plugins → kingdee** settings card (or in `cordis.yml`): WebAPI base URL, `acctId`, and the authentication mode.
2. Put the secrets in the environment (or in the credentials store) under the references you configured. The same reference names work on every OS — only the way you set them differs:

   ```sh
   # Linux / macOS (sh)
   export DSH_KINGDEE_USER=your_username
   export DSH_KINGDEE_PASSWORD=your_password
   # app mode: DSH_KINGDEE_USER holds the integration user, and is required
   export DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   ```powershell
   # Windows — PowerShell (current session)
   $env:DSH_KINGDEE_USER = "your_username"
   $env:DSH_KINGDEE_PASSWORD = "your_password"
   $env:DSH_KINGDEE_APP_SECRET = "your_app_secret"   # app mode (USER = integration user)
   ```

   ```bat
   REM Windows — Command Prompt (current session)
   set DSH_KINGDEE_USER=your_username
   set DSH_KINGDEE_PASSWORD=your_password
   set DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   Or store the value in the DSH credential store instead of the shell environment: set it once in the DSH settings UI (credential values are write-only — the page only ever sees a redacted descriptor), or edit `$DSH_HOME/.credentials.yaml` directly. The reference name is what the plugin config carries; the value never enters a config file.

   See [INSTALL.md](./INSTALL.md) for the per-OS details (including persistent `setx` / `[Environment]::SetEnvironmentVariable`).

3. Ask the agent to query something:

   ```
   Query sales order number SO-20260701 on Kingdee Cloud.
   ```

   The agent loads the `kingdee-bos` skill and calls `kingdee_query` with `formId=SAL_SaleOrder`.

To try it without a real tenant, set `mock: true` in the plugin config — the tools then return canned Kingdee envelopes. The settings card exposes the non-secret connection fields but not `mock`, so this one is set in configuration:

```yaml
config:
  mock: true
```

See [INSTALL.md](./INSTALL.md#optional-offline-mock) for the full snippet.

## Tools

| Tool | Description | Key parameters |
|---|---|---|
| `kingdee_query` | `ExecuteBillQuery` — query bills / base data | `formId`, `fieldKeys[]`, `filter?`, `topCount?`, `organization?` |
| `kingdee_query_business_data` | Structured query (`QueryBusinessData`) | `formId`, `fieldKeys[]`, `filter?`, `topCount?`, `organization?` |
| `kingdee_save` | Save (create/update) a bill or base record | `formId`, `data`, `interaction?` |
| `kingdee_batch_save` | Batch-save several records in one call | `formId`, `records[]`, `interaction?` |
| `kingdee_submit` | Submit one or more records | `formId`, `ids[]`, `numbers?` |
| `kingdee_unsubmit` | Un-submit records | `formId`, `ids[]` |
| `kingdee_audit` | Audit records | `formId`, `ids[]` |
| `kingdee_unaudit` | Un-audit records | `formId`, `ids[]` |
| `kingdee_view` | View a single record by id | `formId`, `id` |
| `kingdee_delete` | Delete records by id | `formId`, `ids[]` |
| `kingdee_delete_draft` | Delete draft records | `formId`, `ids[]` |
| `kingdee_invoke` | Invoke a BOS custom service | `serviceName`, `payload?`, `formId?` |
| `kingdee_logout` | Log out of the current session | — |
| `kingdee_list_datacenters` | List data centers / tenants at the base URL | — |

The table follows the same order as the per-tool reference in [USAGE.md](./USAGE.md).

Every tool returns a normalized canonical value; a Kingdee `IsSuccess=false` message becomes a typed error (`kd/business-error`, `kd/auth-failed`, …) instead of prose for the model to parse.

## Kingdee V9.1 conformance

`dsh-kingdee` targets **Kingdee Cloud Starry Sky V9.1 Enterprise Edition** (patch PT-163015 → product version `9.1.0.20250807`) and stays backward-compatible with V9.0 / V8.x.

**V9.1 has no breaking WebAPI changes.** No renamed or removed operation, no cookie rename, no URL-convention change, and no new required header. The classic `{baseUrl}/{stub path}.common.kdsvc` + `kdservice-sessionid` session protocol this plugin speaks is unchanged.

What V9.1 did change at the interface layer:

- `Delete` now returns a correct `FNumber` — `SuccessEntitys[].Number` can be trusted as-is from `9.1.0.20250807` on.
- Multi-file attachment fields may be assigned by file ID alone.
- WebAPI request-body logging was added server-side.
- The online documentation gained idempotency guidance.
- WebAPI rate limiting gained a whitelist.
- Report stubs and custom API endpoints were security-hardened.
- External-user access control was tightened.

Operational consequences:

- Because the server now logs request bodies, prefer the `app` (third-party) mode over account/password where possible.
- Because permissions were tightened, a missing query permission can surface as an **empty result rather than an error** — validate a probe query per `FormId` instead of trusting an empty row set.
- Put the plugin host's egress IP on the WebAPI rate-limit whitelist.

**Evidence honesty.** The login services' named request keys (`acctID` / `username` / `appid` / `appsecret` / `lcid`), the `Limit` row cap (~2000) and the `listDataCenterService` default name are **community-attested, not officially published** by Kingdee. The authoritative per-tenant source is the product itself: sign in as an administrator, then open Common Settings → Dynamic Service Definition → WebAPI, pick the business object and operation, and read that operation's parameter list and sample call.

## Architecture

```
src/
├─ kd-core/          framework-free Kingdee WebAPI client (pure logic)
│  ├─ auth.ts        user / app authentication
│  ├─ client.ts      the operations set + session management
│  ├─ envelope.ts    envelope parsing & normalization
│  ├─ errors.ts      typed error mapping
│  ├─ transport.ts   transport seam (real HTTP via fetch)
│  └─ mock.ts        offline mock transport
├─ index.ts          DSH host plugin: registers the kingdee_* tools + exports the Config schema
├─ tools.ts          typed tool wrappers (defineTool)
├─ config.ts         plugin config schema + credential resolution
└─ client/
   └─ settings-card.ts  browser settings card (scaffold)
skills/
└─ kingdee-bos/      domain skill: field/enum/status conventions + boundary
```

`kd-core` is published as `dsh-kingdee/kd-core` and has **no DSH dependency**, so the same logic can be wrapped later by a thin MCP server.

## Build & test

The framework-free core is verified by **15** unit tests that run with the Node built-in test runner (Node ≥ 22, TS type-stripping). No DSH install is needed for the core:

```sh
pnpm test        # node --test "test/**/*.test.ts"
```

The DSH host/plugin half (`src/index.ts`, `tools.ts`, `config.ts`, `client/`) imports `@deepseek-ai/*` peer packages and is compiled **inside a DSH profile**, where those peers resolve. Build and typecheck therefore use the DSH toolchain:

```sh
pnpm install && pnpm run typecheck   # requires the deepseek-harness monorepo (or a DSH profile) for peers
```

The repository is TypeScript throughout; there is no JavaScript source to keep in
sync. The bilingual-documents gate is
[`scripts/check-docs-language.ts`](./scripts/check-docs-language.ts), which CI runs
with bare Node (no dependencies installed) before the install step:

```sh
node scripts/check-docs-language.ts
```

## Known Limitations

- **Public-cloud OpenAPI gateway not implemented.** An increasing number of Kingdee public-cloud tenants require the OpenAPI gateway (`https://api.kingdee.com/galaxyapi/`) with API-signature authentication (`LoginByApiSignHeaders`). This plugin does **not** implement that path — it speaks the classic `kdsvc` session protocol only. On such a tenant a classic session cannot be established at all, so every operation fails at login; a tenant/gateway that still exposes the classic WebAPI is required.
- **The platform-plugin layer is out of reach.** Server-side C# form/list plugins, UI layout and background events belong to the BOS integration development environment and are **not** accessible through the WebAPI (see the scope note above).
- **The `./client` bundle reproduces its artifact.** The shared `clientBundle` tsdown preset lives inside the harness repository and is not published, so this package emits the documented factory format itself.
- **No live-tenant verification.** Everything documented here is verified against the type checker, the build, the unit-test suite and the harness's own plugin compatibility check — not against a running Kingdee tenant.

## Documentation

- [INSTALL.md](./INSTALL.md) — installation and configuration
- [CONFIG.md](./CONFIG.md) — configuration reference: fields, auth modes, credentials, SSRF baseline
- [USAGE.md](./USAGE.md) — tool reference with parameters and examples
- [UPDATE.md](./UPDATE.md) — upgrading
- [UNINSTALL.md](./UNINSTALL.md) — removal
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [docs/RELEASE.md](./docs/RELEASE.md) — release notes for the current version

## License

This repository is under a **proprietary license** (all rights reserved). It is available for **read/evaluation**. Copying, forking, re-hosting, re-publishing, modifying, or creating derivative works — in whole or in part — is **prohibited** without prior written permission from the owner. See [LICENSE](./LICENSE).
