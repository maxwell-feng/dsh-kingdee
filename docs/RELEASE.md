# Release notes — v0.11.0

English | [Chinese](RELEASE.zh.md)

Release date: 2026-09-28

Sixteenth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It adapts the plugin to DeepSeek Harness 0.2.0-rc.1 by widening its `@deepseek-ai/dsh-credentials` and `@deepseek-ai/dsh-tools` peers to `>=0.1.7-alpha.2 <0.3.0`, because 0.2.0-rc.1 introduced a hard peer-compatibility gate that refuses a plugin row whose DSH peers do not match the single running runtime version. The previous 0.10.0 declared `^0.1.7-alpha.2`, which excludes 0.2.x, so it is refused on 0.2.0-rc.1 and must be upgraded. No runtime code, no configuration and no tool surface changed, so the plugin behaves exactly as v0.10.0. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x, and **no live-tenant verification was performed**.

## Changed

- **Harness alignment.** Development dependencies move to DeepSeek Harness 0.2.0-rc.1, and this release is verified against it; `@deepseek-ai/cordis` stays `^4.0.4` and `@deepseek-ai/schemastery` stays `^3.18.4`.
- **Peer ranges widen to `>=0.1.7-alpha.2 <0.3.0`.** DeepSeek Harness 0.2.0-rc.1 checks every `@deepseek-ai/dsh` / `@deepseek-ai/dsh-*` peer entry against the single running runtime version before a plugin row loads, with prereleases participating in range matching, and refuses an incompatible row (an incompatible bundle is skipped). The credential and tools peers now admit `0.1.7-alpha.2` through `0.2.x`, so the plugin loads on both release lines, and it is still refused on `0.1.6-alpha.2`. `engines.dsh` is not what the gate reads.
- **Supply-chain gate.** The workspace file now exempts the 0.2.0-rc.1 package set from pnpm's minimum-release-age gate, which otherwise rejects DSH's continuously published prereleases, and the lockfile was regenerated against 0.2.0-rc.1.
- **Source change.** None. No file under `src/`, `test/`, `scripts/`, `.github/`, `skills/`, `cordis.patch.yml` or the build configuration changed, and no configuration field moved.

## Fixed

- **0.10.0 was refused at load on DeepSeek Harness 0.2.0-rc.1.** Its declared `@deepseek-ai/dsh-*` peers excluded 0.2.x, so the new gate refused the row. Widening the ranges admits the plugin on 0.2.0-rc.1 with no exemption, so users on 0.2.0-rc.1 must upgrade to 0.11.0. `dsh plugin allow-version <package@version> --dsh-version <runtime> --accept-risk` (or the plugin manager) remains available only as an exact-version risk acknowledgement recorded in the profile's `compatibility.json`: it is not a compatibility fix, and neither a plugin upgrade nor a harness upgrade inherits the grant.

## Update notes

- **Install**: `dsh plugin add dsh-kingdee@0.11.0` into a DSH profile, then enable the row.
- **Update**: run `dsh plugin update dsh-kingdee`, or `dsh plugin add dsh-kingdee@0.11.0` to pin the version. On DeepSeek Harness 0.2.0-rc.1 you **must** move off 0.10.0: its `@deepseek-ai/dsh-*` peers exclude 0.2.x, so the harness refuses that row at load.
- **Requirements**: harness `>=0.1.7-alpha.2 <0.3.0`, Node 22 or newer.
- **No configuration, API or tool change.** The twelve configuration fields keep their names, values and defaults, and cordis.yml and cordis.patch.yml keep working unchanged. See USAGE.md and USAGE.zh.md.

## Verification

- Type check and build are clean (`pnpm run typecheck`, `pnpm run build` — `tsc -p tsconfig.build.json` plus the `tsdown` client bundle), and all **15** unit tests pass (`pnpm test`) against DeepSeek Harness 0.2.0-rc.1.
- `pnpm install` passes pnpm's supply-chain (minimum-release-age) gate.
- The harness's own published `evaluatePluginCompatibility` / `getDshRuntimeVersion` from `@deepseek-ai/dsh-app-boot@0.2.0-rc.1` reports runtime `0.2.0-rc.1`, admits `dsh-kingdee@0.11.0` on `0.2.0-rc.1`, `0.2.0`, `0.1.7-rc.2` and `0.1.7-alpha.2`, and refuses `dsh-kingdee@0.10.0` on `0.2.0-rc.1` with unsatisfied peers `@deepseek-ai/dsh-credentials` and `@deepseek-ai/dsh-tools` (`^0.1.7-alpha.2`). It also refuses 0.11.0 on `0.1.6-alpha.2`.
- The packed 0.11.0 tarball carries the built `lib/`, `cordis.patch.yml`, the `skills/kingdee-bos` skill and the bilingual guides, and its manifest is the one that gate admits above.
- Not verified: a live boot into a real 0.2.0-rc.1 profile (no `dsh` CLI exists on the verification machine), and no live Kingdee tenant.
