# dsh-kingdee

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/README.zh.md)

Kingdee Cloud Starry Sky secondary-development plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH). It gives the agent typed `kingdee_*` tools over the classic Kingdee WebAPI: query, save, submit, audit, un-audit, view, delete, and invoke BOS custom services. A companion skill (`kingdee-bos`) documents the field, enum and status conventions.

- Plugin version: 0.20.0. DSH baseline: 0.2.2-rc.3 (released 2026-11-13).
- Target: Kingdee Cloud Starry Sky V9.1 Enterprise Edition (patch PT-163015 → 9.1.0.20250807), backward-compatible with V9.0 / V8.x. Classic WebAPI only; the OpenAPI gateway is not supported.
- Credentials are environment-variable references resolved through the DSH credential seam, never literal config values.
- `user` mode uses `AuthService.ValidateUser`. `app` mode uses `AuthService.LoginByAppSecret` and requires `appId`, `appSecretRef` and `userNameRef` (the integration user).
- SSRF protection allows `http:` / `https:` only and blocks localhost, loopback, RFC1918, link-local, CGNAT, IPv6 ULA, and multicast/reserved addresses.

## Install

```sh
# Add the bundle to a DSH profile and enable it
dsh plugin --profile web add dsh-kingdee
```

`--profile <name>` must come before `add`, `remove` or `update`. Putting it after the subcommand forwards it to pnpm and fails.

The package declares `engines.dsh` `>=0.1.7-alpha.2 <0.3.0`. DSH 0.2.2 hosts require Node.js 24.9 or newer; this package's own `engines.node` is `>=22`.

## Quick start

1. Open **Plugins → kingdee** in DSH and set the WebAPI base URL, `acctId` and `authMode`. The same fields can be set in `cordis.yml`; see [CONFIG.md](./CONFIG.md).
2. Put the secrets in the environment or the credential store under the reference names you configured:

   ```sh
   # Linux / macOS (sh)
   export DSH_KINGDEE_USER=your_username
   export DSH_KINGDEE_PASSWORD=your_password
   # app mode: DSH_KINGDEE_USER holds the integration user
   export DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   ```powershell
   # Windows — PowerShell (current session)
   $env:DSH_KINGDEE_USER = "your_username"
   $env:DSH_KINGDEE_PASSWORD = "your_password"
   $env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
   ```

   ```bat
   REM Windows — Command Prompt (current session)
   set DSH_KINGDEE_USER=your_username
   set DSH_KINGDEE_PASSWORD=your_password
   set DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   To use the DSH credential store instead, set each value once in the settings UI (values are write-only) or edit `$DSH_HOME/.credentials.yaml`. The config carries only the reference name.

3. Ask the agent to query something:

   ```
   Query sales order SO-20260701 on Kingdee Cloud.
   ```

   The agent loads the `kingdee-bos` skill and calls `kingdee_query` with `formId=SAL_SaleOrder`.

For a demo without a tenant, set `mock: true` in the plugin config. The settings card does not expose `mock`.

```yaml
config:
  mock: true
```

## Tools

| Tool | Description | Key parameters |
|---|---|---|
| `kingdee_query` | `ExecuteBillQuery` — query bills / base data | `formId`, `fieldKeys[]`, `filter?`, `orderString?`, `topCount?`, `limit?`, `startRow?`, `organization?` |
| `kingdee_query_business_data` | Structured query (`QueryBusinessData`) | `formId`, `fieldKeys[]`, `filter?`, `orderString?`, `topCount?`, `limit?`, `startRow?`, `organization?` |
| `kingdee_save` | Save (create/update) a bill or base record | `formId`, `data`, `interaction?`, `isAutoSubmitAndAudit?` |
| `kingdee_batch_save` | Batch-save several records in one call | `formId`, `records[]`, `interaction?`, `isAutoSubmitAndAudit?` |
| `kingdee_submit` | Submit one or more records | `formId`, `ids[]` / `numbers[]` |
| `kingdee_unsubmit` | Un-submit records | `formId`, `ids[]` / `numbers[]` |
| `kingdee_audit` | Audit records | `formId`, `ids[]` / `numbers[]` |
| `kingdee_unaudit` | Un-audit records | `formId`, `ids[]` / `numbers[]` |
| `kingdee_view` | View a single record by id or number | `formId`, `id` / `number` |
| `kingdee_delete` | Delete records | `formId`, `ids[]` / `numbers[]` |
| `kingdee_delete_draft` | Delete draft records | `formId`, `ids[]` / `numbers[]` |
| `kingdee_invoke` | Invoke a BOS custom service | `serviceName`, `payload?`, `formId?` |
| `kingdee_logout` | Log out of the current session | — |
| `kingdee_list_datacenters` | List data centers / tenants at the base URL | — |

The table follows the same order as the per-tool reference in [USAGE.md](./USAGE.md).

Every tool returns a normalized canonical value. A Kingdee `IsSuccess=false` message becomes a typed error (`kd/business-error`, `kd/auth-failed`, `kd/invalid-config`, `kd/network`, `kd/timeout`, `kd/unknown`) instead of prose.

## Kingdee V9.1

`dsh-kingdee` targets Kingdee Cloud Starry Sky V9.1 Enterprise Edition (patch PT-163015 → `9.1.0.20250807`) and stays backward-compatible with V9.0 / V8.x. V9.1 has no breaking WebAPI changes: no renamed or removed operation, no cookie rename, no URL-convention change, no new required header.

Interface changes that matter in practice:

- `Delete` returns a correct `FNumber`; `SuccessEntitys[].Number` can be trusted from `9.1.0.20250807` on.
- Multi-file attachment fields may be assigned by file ID alone.
- The server now logs WebAPI request bodies. Prefer `app` mode over account/password where possible.
- Permissions were tightened, so a missing query permission can surface as an empty result rather than an error. Run a probe query per `FormId` before trusting an empty row set.
- Put the plugin host's egress IP on the WebAPI rate-limit whitelist.

The login request keys (`acctID`, `username`, `appid`, `appsecret`, `lcid`), the `Limit` row cap (~2000) and the `listDataCenterService` default name are community-reported, not published by Kingdee. Confirm them per tenant under Common Settings → Dynamic Service Definition → WebAPI.

## Build and test

```sh
pnpm install && pnpm run typecheck
pnpm run build
pnpm test        # 15 tests, Node built-in test runner
node scripts/check-docs-language.ts
```

`pnpm test` passes 15 tests, `pnpm typecheck` is clean, and `pnpm build` is clean against DSH 0.2.2-rc.3. No live profile boot and no live Kingdee tenant verification were performed.

## Known limitations

- **OpenAPI gateway not implemented.** The plugin speaks the classic `kdsvc` session protocol only. A tenant that only exposes the OpenAPI gateway (`https://api.kingdee.com/galaxyapi/`) cannot be used: every operation fails at login.
- **Platform-plugin layer out of reach.** Server-side C# form/list plugins, UI layout and background events belong to the BOS integration development environment and are not accessible through the WebAPI.
- **No live-tenant verification.** Behaviour is covered by the type checker, the build and the unit tests, not by a running Kingdee tenant.

## Documentation

- [INSTALL.md](./INSTALL.md) — installation and first connection
- [CONFIG.md](./CONFIG.md) — configuration fields, auth modes, credentials, SSRF baseline
- [USAGE.md](./USAGE.md) — tool reference
- [UPDATE.md](./UPDATE.md) — upgrading
- [UNINSTALL.md](./UNINSTALL.md) — removal
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [docs/RELEASE.md](./docs/RELEASE.md) — release notes for the current version

## License

MIT — see [LICENSE](./LICENSE).
