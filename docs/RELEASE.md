# Release notes — v0.10.0

English | [Chinese](RELEASE.zh.md)

Release date: 2026-09-24

Fifteenth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It aligns the plugin with DeepSeek Harness `0.1.7-rc.2` — the current release of the plugin-development documentation this plugin follows — and changes no runtime code, no configuration and no tool surface, so the plugin behaves exactly as v0.9.1. Tenant compatibility is unchanged (Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x; **no live-tenant verification was performed**).

## Changed

- **Harness alignment.** `devDependencies` are pinned to DeepSeek Harness `0.1.7-rc.2` and the plugin is verified against it. The `@deepseek-ai/dsh-*` peer ranges stay `^0.1.7-alpha.2` — the release line that introduced volatile config — so the plugin remains installable on every `0.1.7` prerelease from `0.1.7-alpha.2` through `0.1.7-rc.2`. `engines.dsh` stays `^0.1.7-alpha.2` and `engines.node` stays `>=22`.
- **Seam audit against the 0.1.7-rc.2 plugin-development documentation.** Every seam this plugin consumes is source-identical between `0.1.7-rc.1` and `0.1.7-rc.2`: the Host-side `Config` schema the Host discovers as `entry.fiber.runtime.Config` with its `.volatile()` fields and its per-entry form keyed by `entry.options.id`; `ctx.tools.register` with `defineTool`; `ctx.credentials.resolve` with `credentialRef`; and the browser half's contracts — `ctx.configForms.get(entryId)` returning `ConfigForm` (`getSnapshot` / `subscribe` / `set`), `PluginConfigViewProps` for the `plugins.row.config` and `plugins.bundle.config` slots, `ctx.locale`, and `ctx.slots`. The one changed file under the packages this plugin consumes, `@deepseek-ai/dsh-client-ui-settings`' `contract/slots.ts`, only adds two optional fields to `SettingsLauncherOwnerProps`, a type this plugin does not use. No plugin source changed.
- **`pnpm-workspace.yaml`** now exempts the exact `0.1.7-rc.2` package set from pnpm's minimum-release-age gate, which otherwise rejects DSH's continuously published prereleases.

## Fixed

- **The Chinese 0.3.0 changelog entry now covers that release at the same depth as English**, and the Chinese documentation list links `CHANGELOG.zh.md` rather than the English changelog. No runtime, configuration or tool-surface change.

## Update notes

- **Update**: `dsh plugin update dsh-kingdee` (or `dsh plugin add dsh-kingdee@0.10.0`).
- **Requirements**: harness `^0.1.7-alpha.2`, Node ≥22.
- **No configuration, API or tool change** — the twelve configuration fields keep their names, values and defaults, and `cordis.yml` / `cordis.patch.yml` keep working unchanged. See [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.10.0/USAGE.md) / [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.10.0/USAGE.zh.md).

## Verification

- `pnpm run typecheck` clean, clean build (`tsc` + `tsdown`), and **15** unit tests passing (`pnpm test`) against DeepSeek Harness `0.1.7-rc.2`.
- `pnpm install --frozen-lockfile` passes pnpm's supply-chain gate.
- The declared DSH peers pass DeepSeek Harness's own `evaluatePluginCompatibility` (`dsh-v0.1.7-rc.2`) against runtimes `0.1.7-rc.2`, `0.1.7-rc.1` and `0.1.7-alpha.2`: admitted, no exemption required.
- The shipped `dsh-kingdee-0.10.0.tgz` installs into a real `0.1.7-rc.2` profile (`dsh plugin --profile <name> add ./dsh-kingdee-0.10.0.tgz`) and composes as a `# == dsh-kingdee` layer under the row id `kingdee`; `dsh --profile <name> --dump-config` shows every schema default applied.
