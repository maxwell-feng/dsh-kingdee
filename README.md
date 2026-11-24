# dsh-kingdee

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/README.zh.md)

Kingdee Cloud Starry Sky secondary-development plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH), exposing typed `kingdee_*` tools over the classic Kingdee WebAPI: query, save, submit, audit, un-audit, view, delete and BOS custom services. The companion `kingdee-bos` skill documents fields, enums and status conventions.

- Plugin version: 0.22.0. DSH baseline: 0.2.3-alpha.2 (released 2026-11-22).
- Target: Kingdee Cloud Starry Sky V9.1 Enterprise Edition (patch PT-163015 → 9.1.0.20250807), compatible with V9.0/V8.x. Classic WebAPI only; OpenAPI gateway unsupported.
- Credentials are environment-variable references resolved through the DSH credential seam; config holds no literals.
- `user` mode logs in via `AuthService.ValidateUser`; `app` mode via `AuthService.LoginByAppSecret`, with `appId`, `appSecretRef` and `userNameRef` (the integration user).
- The host filter allows only `http:` / `https:` and rejects literal localhost, loopback, RFC1918, link-local, CGNAT, IPv6 ULA and multicast/reserved hosts. It does not resolve DNS, so a public hostname resolving to a private address is not blocked; use a trusted hostname and egress controls.

## Install

```sh
# Add the bundle to a DSH profile and enable it
dsh plugin --profile web add dsh-kingdee
```

`--profile <name>` must precede `add`, `remove` or `update`; after the subcommand pnpm receives it and fails.

The package's `engines.dsh` is `>=0.1.7-alpha.2 <0.3.0`; its `engines.node` matches DSH 0.2.3: `^24.22.3 || >=26.13.1` (Node 24.22.3+ on 24.x, or 26.13.1+).

## Quick start

1. Open **Plugins → kingdee** and set the WebAPI base URL, `acctId` and `authMode`; these fields also work in `cordis.yml` (see [CONFIG.md](./CONFIG.md)).
2. Put secrets in the environment or credential store under the configured reference names:

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

   For the DSH credential store, add each value under `refs:` in `$DSH_HOME/.credentials.yaml`; config keeps only the reference name.

3. Ask the agent to query something:

   ```
   Query sales order SO-20260701 on Kingdee Cloud.
   ```

   If the `kingdee-bos` skill is installed (see [Companion skill](#companion-skill)), the agent can load it and call `kingdee_query` with `formId=SAL_SaleOrder`.

For a tenant-free demo, set `mock: true`; the settings card does not expose it.

```yaml
config:
  mock: true
```

## Companion skill

The package ships `skills/kingdee-bos/SKILL.md` but does not register it. Copy `skills/kingdee-bos` to `$DSH_HOME/skills/kingdee-bos`, or add the package's `skills` directory to `customSkillDirs` in `@deepseek-ai/dsh-skill-filesystem`. Without this, tools work but the guidance is absent from the catalog.

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

The table matches the per-tool order in [USAGE.md](./USAGE.md).

Every tool returns a normalized value as JSON. `IsSuccess=false` becomes `kd/business-error` (or `kd/auth-failed` for a login refusal); client-side failures use `kd/invalid-config`, `kd/network`, `kd/timeout` or `kd/unknown`, not prose.

## Kingdee V9.1

`dsh-kingdee` targets Kingdee Cloud Starry Sky V9.1 Enterprise Edition (patch PT-163015 → `9.1.0.20250807`) and remains compatible with V9.0/V8.x. V9.1 has no breaking WebAPI changes: no renamed/removed operation, cookie rename, URL change or new required header.

Practical changes:

- `Delete` returns a correct `FNumber`; `SuccessEntitys[].Number` can be trusted from `9.1.0.20250807` on.
- Multi-file attachment fields may be assigned by file ID alone.
- The server logs WebAPI request bodies; prefer `app` mode over account/password.
- Permissions are tighter: a missing query permission can look like an empty result. Probe each `FormId` before trusting an empty set.
- Put the plugin host's egress IP on the WebAPI rate-limit whitelist.

Login keys (`acctID`, `username`, `appid`, `appsecret`, `lcid`), the `Limit` cap (~2000) and the `listDataCenterService` default are community-reported, not published by Kingdee; confirm them per tenant under Common Settings → Dynamic Service Definition → WebAPI.

## Build and test

```sh
pnpm install && pnpm run typecheck
pnpm run build
pnpm test        # 15 tests, Node built-in test runner
node scripts/check-docs-language.ts
```

Tests (15), typecheck and build pass against DSH 0.2.3-alpha.2. No live profile boot or Kingdee tenant verification was performed.

## Known limitations

- **OpenAPI gateway not implemented.** The plugin uses only the classic `kdsvc` session protocol. A tenant exposing only the OpenAPI gateway (`https://api.kingdee.com/galaxyapi/`) cannot be used: login-gated operations fail at login, and `kingdee_list_datacenters` still finds no classic service.
- **Platform-plugin layer out of reach.** Server-side C# form/list plugins, UI layout and background events belong to the BOS integration environment and are not reachable through the WebAPI.
- **No live-tenant verification.** Behaviour is covered by typecheck, build and unit tests, not a running Kingdee tenant.

## Documentation

- [INSTALL.md](./INSTALL.md) — installation and first connection
- [CONFIG.md](./CONFIG.md) — configuration fields, auth modes, credentials, host filter
- [USAGE.md](./USAGE.md) — tool reference
- [UPDATE.md](./UPDATE.md) — upgrading
- [UNINSTALL.md](./UNINSTALL.md) — removal
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [docs/RELEASE.md](./docs/RELEASE.md) — release notes for the current version

## License

MIT — see [LICENSE](./LICENSE).
