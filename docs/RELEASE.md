# Release notes — v0.21.0

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.zh.md)

Release date: 2026-11-20

`dsh-kingdee` 0.21.0 aligns with DeepSeek Harness 0.2.2-rc.5 (released 2026-11-18). This is a dependency and documentation release: no API, configuration or behavior change. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x. No live profile boot and no live Kingdee tenant verification were performed.

## Changes

- Plugin version moves to 0.21.0.
- Every `@deepseek-ai/dsh-*` devDependency moves from `0.2.2-rc.3` to `0.2.2-rc.5`.
- The lockfile is regenerated and the workspace supply-chain exemption is refreshed for the 0.2.2-rc.5 package set.
- `engines.dsh` stays `>=0.1.7-alpha.2 <0.3.0`. DSH 0.2.2-rc.4 and 0.2.2-rc.5 have no plugin-facing breaking changes for this package.
- DSH 0.2.2-rc.4 fixed unexpected model responses and LiveShare creation in the desktop app. DSH 0.2.2-rc.5 changed the default web search provider per model route; this plugin's tools do not use that seam, so nothing changes here.

## Documentation

- README, INSTALL, CONFIG, USAGE and UPDATE now state the 0.2.2-rc.5 baseline and plugin version 0.21.0; the 2026-11-18 harness release date is in the README and release notes.
- The bilingual text was proofread and corrected where wording or ordering was unclear. The `FDocumentStatus` mapping, the `organization` config note, the settings-page field coverage and the `UnSubmit` override note were corrected.

## Verification

- `pnpm typecheck` clean.
- `pnpm build` clean.
- `pnpm test`: 15 tests passing.
- All three checks run against DSH 0.2.2-rc.5.
- No live profile boot and no live Kingdee tenant verification were performed.

## Upgrade

Optional. Run `dsh plugin --profile web add dsh-kingdee@0.21.0` or update the profile. The `engines.dsh` range still admits the whole `0.2.x` line, so the upgrade is optional.
