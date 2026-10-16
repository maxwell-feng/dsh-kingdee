# Release notes — v0.14.0

English | [Chinese](RELEASE.zh.md)

Release date: 2026-10-16

Twentieth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It is a **DeepSeek Harness 0.2.1-alpha.4 alignment and license-statement correction release**: every `@deepseek-ai/dsh-*` development dependency moves to 0.2.1-alpha.4, the lockfile and the pnpm supply-chain exemption are regenerated against that release, and the two README files no longer claim a proprietary license that the `LICENSE` file has not carried since 0.5.0. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x, and **no live-tenant verification was performed**.

## Changed

- **Harness alignment.** Upgraded all `@deepseek-ai/dsh-*` development dependencies from DeepSeek Harness 0.2.1-alpha.2 to 0.2.1-alpha.4, and regenerated the lockfile against 0.2.1-alpha.4. `@deepseek-ai/cordis` remains `^4.0.4` and `@deepseek-ai/schemastery` remains `^3.18.4`. No seam this plugin consumes changed across 0.2.1-alpha.3 and 0.2.1-alpha.4: `@deepseek-ai/dsh-web`, `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-credentials` and the `ctx.configForms.get()` contract behind the settings card are all source-identical for this plugin's usage.
- **Supply-chain exemption rebuilt.** The workspace file exempts the 0.2.1-alpha.4 package set from pnpm's minimum-release-age gate, which otherwise rejects DSH's continuously published prereleases. The previous list also carried a second `minimumReleaseAgeExclude` key whose stale `0.2.0-rc.2` entries made pnpm reject the regenerated lockfile; the list is now a single lockfile-derived block.
- **Source change: none.** No file under `src/`, `test/`, `scripts/`, `.github/`, `skills/`, `cordis.patch.yml` or the build configuration changed, and no configuration field moved: the plugin behaves exactly as 0.13.0.

## Fixed

- **The README license section contradicted the LICENSE file in both languages.** `README.md` and `README.zh.md` described this repository as under a "proprietary license (all rights reserved)", while `LICENSE` and `package.json.license` have carried the MIT License since 0.5.0; GitHub and npm both report `MIT` for the published package. Both README files now state MIT and link the LICENSE file.
- **The changelog never recorded the license revert.** The 0.2.0 entry still described the proprietary grant as current. It now marks that grant as reversed, and the 0.5.0 entry records the MIT restoration, so the version history matches the shipped artifacts.

## Update notes

- **Install**: `dsh plugin --profile web add dsh-kingdee@0.14.0` into a DSH profile, then enable the row.
- **Update**: run `dsh plugin --profile web update dsh-kingdee`, or `dsh plugin --profile web add dsh-kingdee@0.14.0` to pin the version.
- **Requirements**: harness `>=0.1.7-alpha.2 <0.3.0`, Node 22 or newer.
- **Not a mandatory upgrade**: the peer ranges are unchanged at `>=0.1.7-alpha.2 <0.3.0`, so `dsh-kingdee@0.13.0` is still admitted on DeepSeek Harness 0.2.1-alpha.4.

## Verification

- `pnpm run typecheck` clean, `pnpm run build` clean (`tsc -p tsconfig.build.json` plus the `tsdown` client bundle), and all **15** unit tests pass (`pnpm test`) against DeepSeek Harness 0.2.1-alpha.4.
- `node scripts/check-docs-language.ts` passing clean with zero findings.
- Not verified: a live boot into a real 0.2.1-alpha.4 profile, and — as always — no live Kingdee tenant.
