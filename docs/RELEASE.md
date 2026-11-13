# Release notes — v0.20.0

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.zh.md)

Release date: 2026-11-13

`dsh-kingdee` 0.20.0 aligns with DeepSeek Harness 0.2.2-rc.3 (released 2026-11-13). This is a dependency-only release: no API, configuration or behavior change. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x. No live profile boot and no live Kingdee tenant verification were performed.

## Changes

- Plugin version moves to 0.20.0.
- Every `@deepseek-ai/dsh-*` devDependency moves from `0.2.2-rc.2` to `0.2.2-rc.3`.
- The lockfile is regenerated and the workspace supply-chain exemption is refreshed for the 0.2.2-rc.3 package set.
- `engines.dsh` stays `>=0.1.7-alpha.2 <0.3.0`. DSH 0.2.2-rc.3 has no plugin-facing breaking changes.

## Verification

- `pnpm typecheck` clean.
- `pnpm build` clean.
- `pnpm test`: 15 tests passing.
- All three checks run against DSH 0.2.2-rc.3.
- No live profile boot and no live Kingdee tenant verification were performed.

## Upgrade

Optional. Run `dsh plugin --profile web add dsh-kingdee@0.20.0` or update the profile. The `engines.dsh` range still admits the whole `0.2.x` line, so the upgrade is optional.
