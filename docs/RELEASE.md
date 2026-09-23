# Release notes — v0.9.0

English | [Chinese](RELEASE.zh.md)

Release date: 2026-09-23

Thirteenth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It migrates the plugin to the DeepSeek Harness 0.1.7 configuration model and raises the harness floor to `0.1.7-alpha.2`, verified on `0.1.7-rc.1` (the latest release). Tenant compatibility is unchanged (Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x).

## Changed

- **Harness alignment.** `devDependencies` are pinned to DeepSeek Harness `0.1.7-rc.1` and the plugin is verified against it. The `@deepseek-ai/dsh-*` peer ranges are `^0.1.7-alpha.2` — the release line that introduced volatile config — so the plugin stays installable on both `0.1.7-alpha.2` and `0.1.7-rc.1`; the two are source-identical for every package this plugin consumes. `engines.dsh` is `^0.1.7-alpha.2`, `@deepseek-ai/cordis` moves to `4.0.4`, and `@deepseek-ai/schemastery` moves to `3.18.4`.
- **Configuration migrated to the 0.1.7 volatile schema.** Every editable field is declared `.volatile()`, so `apply` receives one live reference per field. The plugin no longer registers a settings section: the `ctx.settings.installSection` call, `ctx.inject(['settings'])`, and the `@deepseek-ai/dsh-settings` dependency are gone. The Host discovers the exported `Config` schema itself (`entry.fiber.runtime.Config`) and renders this entry's form, keyed by the profile row id `kingdee`.
- **One config snapshot per operation.** `captureConfig` reads every reference once at the start of an operation, so one operation can never mix a `baseUrl` read from before a committed edit with a credential reference read from after it. Credentials still re-resolve per operation, so a rotated secret reaches the next call.
- **`pnpm-workspace.yaml`** now exempts the exact `0.1.7-rc.1` package set from pnpm's minimum-release-age gate, which otherwise rejects DSH's continuously published prereleases.
- The build output is no longer tracked: `lib/` is git-ignored and emitted by `pnpm build` (and by npm's `prepublishOnly` hook) before packing.

## Added

- **Harness compatibility gate documented.** DeepSeek Harness 0.1.7-rc.1 verifies a plugin's `@deepseek-ai/dsh*` peers against the running runtime and refuses an incompatible row at load. This release declares peers it satisfies, so no exemption is needed; the README and the upgrade guide document the refusal and its `dsh plugin allow-version` remedy.
- The client settings card is documented as the browser half of the same per-entry `ConfigForm` the Plugins page owns.

## Fixed

- **The client half's `dsh.client.inject` list was incomplete.** The card registers into `plugins.row.config` / `plugins.bundle.config` (owned by `@deepseek-ai/dsh-client-ui-plugin-manager`) and reads `ctx.remote` and `ctx.connection`, but only `@deepseek-ai/dsh-client-locale` and `@deepseek-ai/dsh-client-ui-settings` were declared. It now also declares `@deepseek-ai/dsh-client-ui-plugin-manager`, `@deepseek-ai/dsh-api-remotes`, and `@deepseek-ai/dsh-client-connection`, matching the official client cards that use the same services. The Host-rendered schema form is unaffected either way — the custom card only adds its own chrome on top of it.

## Update notes

- **Update**: `dsh plugin update dsh-kingdee` (or `dsh plugin add dsh-kingdee@0.9.0`).
- **Requirements**: harness `^0.1.7-alpha.2`, Node ≥22.
- **No breaking configuration change** — the same twelve fields, values and defaults; `cordis.yml` and `cordis.patch.yml` keep working unchanged. On a `0.1.6` host the plugin is now refused at load; upgrade the harness first, or grant the exact-version exemption. See [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.9.0/USAGE.md) / [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.9.0/USAGE.zh.md).

## Verification

- `pnpm run typecheck` clean, **15** unit tests passing (`pnpm test`), clean build (`tsc` + `tsdown`), and `node scripts/check-docs-language.mjs` green.
- `pnpm install --frozen-lockfile` passes pnpm's supply-chain gate.
- The declared DSH peers were checked with DeepSeek Harness's own `evaluatePluginCompatibility` (`dsh-v0.1.7-rc.1`) against runtime `0.1.7-rc.1`: admitted, no exemption required.
