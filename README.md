# dsh-kingdee

> Kingdee Cloud Starry Sky (金蝶云星空) secondary-development plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH).

`dsh-kingdee` gives the DSH agent a first-class, credential-safe way to act on a Kingdee Cloud Starry Sky tenant through its **WebAPI**: typed tools for querying, saving, submitting, auditing, un-auditing, viewing and deleting bills/base data, and for invoking BOS custom services. A companion domain skill (`kingdee-bos`) teaches the field/enum/status conventions and the boundary between the data layer and the platform-plugin layer.

- **credential-safe** — secrets are environment-variable references resolved through the DSH credential seam, never literal config.
- **typed tools** — `kingdee_query`, `kingdee_save`, `kingdee_submit`, `kingdee_audit`, `kingdee_unaudit`, `kingdee_view`, `kingdee_delete`, `kingdee_invoke`.
- **full state machine** — create/update → submit → audit → un-audit flow, off the shelf.
- **offline mock** — a `mock: true` flag swaps in a local transport so you can demo and test the pipeline without a reachable tenant.
- **bilingual docs** — English and 简体中文.

> 🧩 **Scope.** This plugin covers the **data/service layer** of Kingdee Cloud secondary development. The **platform-plugin layer** (server-side C# form/list plugins, UI layout, background events) uses the BOS 集成开发环境 and is **not** reachable through the WebAPI. The `kingdee-bos` skill documents that boundary.

## Install

```sh
# Add the bundle to a DSH profile and enable it
dsh plugin add dsh-kingdee
```

See [INSTALL.md](./INSTALL.md) for the full setup, and [UPDATE.md](./UPDATE.md) / [UNINSTALL.md](./UNINSTALL.md) for upgrades and removal. Release history is in [CHANGELOG.md](./CHANGELOG.md).

## Quick start

1. Register the plugin and set connection details in the **Plugins → kingdee** settings card (or in `cordis.yml`): WebAPI base URL, `acctId`, and the authentication mode.
2. Put the secrets in the environment (or in the credentials store) under the references you configured. The same reference names work on every OS — only the way you set them differs:

   ```sh
   # Linux / macOS (sh)
   export DSH_KINGDEE_USER=your_username
   export DSH_KINGDEE_PASSWORD=your_password
   # or, for app mode:
   export DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   ```powershell
   # Windows — PowerShell (current session)
   $env:DSH_KINGDEE_USER = "your_username"
   $env:DSH_KINGDEE_PASSWORD = "your_password"
   $env:DSH_KINGDEE_APP_SECRET = "your_app_secret"   # app mode
   ```

   ```bat
   REM Windows — Command Prompt (current session)
   set DSH_KINGDEE_USER=your_username
   set DSH_KINGDEE_PASSWORD=your_password
   set DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   Or, on any OS, use the DSH credential store (recommended):

   ```sh
   dsh credentials set DSH_KINGDEE_USER your_username
   dsh credentials set DSH_KINGDEE_PASSWORD your_password
   dsh credentials set DSH_KINGDEE_APP_SECRET your_app_secret
   ```

   See [INSTALL.md](./INSTALL.md) for the per-OS details (including persistent `setx` / `[Environment]::SetEnvironmentVariable`).

3. Ask the agent to query something:

   ```
   Query 销售订单 number SO-20260701 on Kingdee Cloud.
   ```

   The agent loads the `kingdee-bos` skill and calls `kingdee_query` with `formId=SAL_SaleOrder`.

To try it without a real tenant, set `mock: true` in the plugin config — the tools then return canned Kingdee envelopes.

```sh
export DSH_KINGDEE_MOCK=true
```

## Tools

| Tool | Description | Key parameters |
|---|---|---|
| `kingdee_query` | `ExecuteBillQuery` — query bills / base data | `formId`, `fieldKeys[]`, `filter?`, `topCount?`, `organization?` |
| `kingdee_save` | Save (create/update) a bill or base record | `formId`, `data`, `interaction?` |
| `kingdee_submit` | Submit one or more records | `formId`, `ids[]`, `numbers?` |
| `kingdee_audit` | Audit records | `formId`, `ids[]` |
| `kingdee_unaudit` | Un-audit records | `formId`, `ids[]` |
| `kingdee_view` | View a single record by id | `formId`, `id` |
| `kingdee_delete` | Delete records by id | `formId`, `ids[]` |
| `kingdee_invoke` | Invoke a BOS custom service | `serviceName`, `payload?`, `formId?` |

Every tool returns a normalized canonical value; a Kingdee `IsSuccess=false` message becomes a typed error (`kd/business-error`, `kd/auth-failed`, …) instead of prose for the model to parse.

## Architecture

```
src/
├─ kd-core/          framework-free Kingdee WebAPI client (pure logic)
│  ├─ auth.ts        user / app authentication
│  ├─ client.ts      the eight operations + session management
│  ├─ envelope.ts    envelope parsing & normalization
│  ├─ errors.ts      typed error mapping
│  ├─ transport.ts   transport seam (real HTTP via fetch)
│  └─ mock.ts        offline mock transport
├─ index.ts          DSH host plugin: registers tools + settings namespace
├─ tools.ts          typed tool wrappers (defineTool)
├─ config.ts         plugin config schema + credential resolution
└─ client/
   └─ settings-card.ts  browser settings card (scaffold)
skills/
└─ kingdee-bos/      domain skill: field/enum/status conventions + boundary
```

`kd-core` is published as `dsh-kingdee/kd-core` and has **no DSH dependency**, so the same logic can be wrapped later by a thin MCP server.

## Build & test

The framework-free core is verified by unit tests that run with the Node built-in test runner (Node ≥ 22, TS type-stripping). No DSH install is needed for the core:

```sh
pnpm test        # node --test "test/**/*.test.ts"
```

The DSH host/plugin half (`src/index.ts`, `tools.ts`, `config.ts`, `client/`) imports `@deepseek-ai/*` peer packages and is compiled **inside a DSH profile**, where those peers resolve. Build and typecheck therefore use the DSH toolchain:

```sh
pnpm install && pnpm run typecheck   # requires the deepseek-harness monorepo (or a DSH profile) for peers
```

## Documentation

- [INSTALL.md](./INSTALL.md) — installation and configuration
- [UPDATE.md](./UPDATE.md) — upgrading
- [UNINSTALL.md](./UNINSTALL.md) — removal
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [docs/RELEASE.md](./docs/RELEASE.md) — release notes for the current version

## License

[MIT](./LICENSE)
