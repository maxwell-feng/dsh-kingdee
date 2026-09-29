# Release notes — v0.12.0

English | [Chinese](RELEASE.zh.md)

Release date: 2026-09-29

Eighteenth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It is a **DeepSeek Harness 0.2.0-rc.2 alignment release**: every `@deepseek-ai/dsh-*` devDependency moves to `0.2.0-rc.2`, the lockfile is regenerated against that release, and the workspace supply-chain exemption is refreshed to the 0.2.0-rc.2 package set. The runtime sources, the configuration fields and the tool interface are untouched, so the plugin behaves exactly as v0.11.1. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x, and **no live-tenant verification was performed**.

## Changed

- **Harness alignment.** Every `@deepseek-ai/dsh-*` devDependency moves from `0.2.0-rc.1` to `0.2.0-rc.2`, and the lockfile is regenerated against 0.2.0-rc.2. `@deepseek-ai/cordis` stays `^4.0.4` and `@deepseek-ai/schemastery` stays `^3.18.4`.
- **Peer ranges are unchanged.** The `@deepseek-ai/dsh-credentials` and `@deepseek-ai/dsh-tools` peers stay `>=0.1.7-alpha.2 <0.3.0` — the widened range 0.11.0 introduced — so `dsh-kingdee@0.11.1` is admitted on DeepSeek Harness 0.2.0-rc.2 as well, and **this release is not a mandatory upgrade**. It is the version verified against 0.2.0-rc.2 and aligned with that release's development dependencies.
- **Supply-chain gate.** The workspace file now exempts the 0.2.0-rc.2 package set from pnpm's minimum-release-age gate, which otherwise rejects DSH's continuously published prereleases.
- **Source change.** None. No file under `src/`, `test/`, `scripts/`, `.github/`, `skills/`, `cordis.patch.yml` or the build configuration changed, and no configuration field moved: the plugin behaves exactly as 0.11.1.

## Update notes

- **Install**: `dsh plugin add dsh-kingdee@0.12.0` into a DSH profile, then enable the row.
- **Update**: run `dsh plugin update dsh-kingdee`, or `dsh plugin add dsh-kingdee@0.12.0` to pin the version. Since 0.11.1 keeps loading on 0.2.0-rc.2, updating the package is all this release asks for, and it can wait.
- **Requirements**: harness `>=0.1.7-alpha.2 <0.3.0`, Node 22 or newer. On DeepSeek Harness 0.2.0-rc.2 the older `0.10.0` is still refused at load, because its `@deepseek-ai/dsh-*` peers (`^0.1.7-alpha.2`) exclude 0.2.x.
- **No configuration, API or tool change.** The twelve configuration fields keep their names, values and defaults, and `cordis.yml` and `cordis.patch.yml` keep working unchanged. See USAGE.md and USAGE.zh.md.

## Verification

- `pnpm run typecheck` clean, `pnpm run build` clean (`tsc -p tsconfig.build.json` plus the `tsdown` client bundle), and all **15** unit tests pass (`pnpm test`) against DeepSeek Harness 0.2.0-rc.2.
- The harness's own published `evaluatePluginCompatibility` / `getDshRuntimeVersion` from `@deepseek-ai/dsh-app-boot@0.2.0-rc.2` report runtime `0.2.0-rc.2` and admit `dsh-kingdee@0.12.0` on `0.2.0-rc.2`, `0.2.0-rc.1`, `0.2.0`, `0.1.7-rc.2` and `0.1.7-alpha.2`; they refuse `dsh-kingdee@0.12.0` on `0.1.6-alpha.2`, and the earlier `dsh-kingdee@0.10.0` (`^0.1.7-alpha.2`) is still refused on `0.2.0-rc.2`.
- Not verified: a live boot into a real 0.2.0-rc.2 profile (no `dsh` CLI exists on the verification machine), and no live Kingdee tenant.
