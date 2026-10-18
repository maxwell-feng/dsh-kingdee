# Release notes — v0.15.0

English | [Chinese](RELEASE.zh.md)

Release date: 2026-10-18

A **DeepSeek Harness 0.2.1-rc.2 alignment release** of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness: every `@deepseek-ai/dsh-*` development dependency moves to 0.2.1-rc.2, the lockfile and the pnpm supply-chain exemption are regenerated against that release, and `@deepseek-ai/cordis` / `@deepseek-ai/schemastery` move to `^4.0.5` / `^3.18.5`. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x, and **no live-tenant verification was performed**.

## Changed

- **Harness alignment.** Upgraded all `@deepseek-ai/dsh-*` development dependencies from DeepSeek Harness 0.2.1-alpha.4 to 0.2.1-rc.2, and regenerated the lockfile against 0.2.1-rc.2. `@deepseek-ai/cordis` moves to `^4.0.5` and `@deepseek-ai/schemastery` to `^3.18.5`. No seam this plugin consumes changed across 0.2.1-alpha.4 and 0.2.1-rc.2: the `ctx.configForms.get()` contract behind the settings card, plus the `slots`, `locale`, `remote` and `connection` contracts the card injects, are declaration-identical for this plugin's usage.
- **Supply-chain exemption rebuilt.** The workspace file exempts the 0.2.1-rc.2 package set from pnpm's minimum-release-age gate, which otherwise rejects DSH's continuously published prereleases. The list stays a single lockfile-derived block.
- **Source change: none.** No file under `src/`, `test/`, `scripts/`, `.github/`, `skills/`, `cordis.patch.yml` or the build configuration changed, and no configuration field moved: the plugin behaves exactly as 0.14.0.

## Fixed

- **The compatibility notes described the admission gate incorrectly in both languages.** `README.md`, `README.zh.md`, `INSTALL.md`, `INSTALL.zh.md`, `UPDATE.md` and `UPDATE.zh.md` stated that the gate reads only the `@deepseek-ai/dsh*` `peerDependencies` and that "`engines.dsh` is **not** what the gate reads". Since DeepSeek Harness 0.2.1-alpha.4 an own `engines.dsh` range decides admission alone and the peers are ignored for that check. The notes now say so, and the admission conclusion is unchanged: the plugin declares `engines.dsh: ">=0.1.7-alpha.2 <0.3.0"`, which admits it on 0.2.1-rc.2 without an exemption.
- **The Chinese opening verification notes named the wrong runtime version.** `INSTALL.zh.md`, `USAGE.zh.md`, `CONFIG.zh.md`, `UPDATE.zh.md` and `UNINSTALL.zh.md` said the harness's own compatibility check admitted the plugin on runtime `0.2.1-alpha.2` while the surrounding sentence named `0.2.1-alpha.4`; they now name the version the release was actually verified on.

## Update notes

- **Install**: `dsh plugin --profile web add dsh-kingdee@0.15.0` into a DSH profile, then enable the row.
- **Update**: run `dsh plugin --profile web update dsh-kingdee`, or `dsh plugin --profile web add dsh-kingdee@0.15.0` to pin the version.
- **Requirements**: harness `>=0.1.7-alpha.2 <0.3.0`, Node 22 or newer.
- **Not a mandatory upgrade**: the `engines.dsh` range is unchanged at `>=0.1.7-alpha.2 <0.3.0`, so `dsh-kingdee@0.14.0` is still admitted on DeepSeek Harness 0.2.1-rc.2.

## Verification

- `pnpm run typecheck` clean, `pnpm run build` clean (`tsc -p tsconfig.build.json` plus the `tsdown` client bundle), and all **15** unit tests pass (`pnpm test`) against DeepSeek Harness 0.2.1-rc.2.
- `node scripts/check-docs-language.ts` passing clean with zero findings.
- Not verified: a live boot into a real 0.2.1-rc.2 profile, and — as always — no live Kingdee tenant.
