# Release notes — v0.13.0

English | [Chinese](RELEASE.zh.md)

Release date: 2026-10-11

Nineteenth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It is a **DeepSeek Harness 0.2.1-alpha.2 alignment and display metadata release**: includes native `icon.svg` vector artwork, bilingual display manifest resources (`locale/en.json`, `locale/zh.json`), self-contained prepare scripts, strict 100% pure TypeScript architecture, and updated `--profile <name>` CLI option placement. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x, and **no live-tenant verification was performed**.

## Added

- **Display metadata and icon.** Bundled native `icon.svg` vector artwork and bilingual manifest resources (`locale/en.json`, `locale/zh.json`) conforming to DSH 0.2.1-alpha.2 display conventions for Plugin Manager. `package.json` exports `./locale/*.json`, `./icon` and declares top-level `"icon": "./icon.svg"`.
- **Self-contained prepare script.** Configured `"prepare": "tsc -p tsconfig.build.json && tsdown"` in `package.json` to enable direct git installs without requiring a global `pnpm` binary.

## Changed

- **Harness alignment.** Upgraded all development dependencies to DeepSeek Harness 0.2.1-alpha.2. `@deepseek-ai/cordis` remains `^4.0.4` and `@deepseek-ai/schemastery` remains `^3.18.4`.
- **Peer ranges compatibility.** Maintained peer dependencies range `>=0.1.7-alpha.2 <0.3.0`, so `dsh-kingdee@0.12.0` and `dsh-kingdee@0.11.1` remain admitted on DeepSeek Harness 0.2.1-alpha.2 as well without requiring manual exemptions.
- **Pure TypeScript architecture.** Strengthened schema export typing in `src/config.ts` (`export const Config: Schema<Config>`) to eliminate TS2742 non-portable type warnings under pnpm virtual store layouts while ensuring strict 100% pure TypeScript compliance.
- **CLI syntax documentation.** Updated all guides to place `--profile <name>` before forwarded subcommands such as `add`, `remove`, and `update`.

## Update notes

- **Install**: `dsh plugin --profile web add dsh-kingdee@0.13.0` into a DSH profile, then enable the row.
- **Update**: run `dsh plugin --profile web update dsh-kingdee`, or `dsh plugin --profile web add dsh-kingdee@0.13.0` to pin the version.
- **Requirements**: harness `>=0.1.7-alpha.2 <0.3.0`, Node 22 or newer.

## Verification

- `pnpm run typecheck` clean, `pnpm run build` clean (`tsc -p tsconfig.build.json` plus the `tsdown` client bundle), and all **15** unit tests pass (`pnpm test`) against DeepSeek Harness 0.2.1-alpha.2.
- `node scripts/check-docs-language.ts` passing clean with zero findings.
