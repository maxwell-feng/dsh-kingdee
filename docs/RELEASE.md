# Release notes — v0.22.0

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.zh.md)

Release date: 2026-11-24

`dsh-kingdee` 0.22.0 aligns with DeepSeek Harness 0.2.3-alpha.2 (released 2026-11-22). This release updates dependencies, the Node.js requirement and documentation; plugin API, configuration fields and normal tenant behavior are unchanged, and configuration validation now raises typed `kd/invalid-config` errors. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0/V8.x.

## Changes

- Plugin version moves to 0.22.0.
- Every `@deepseek-ai/dsh-*` devDependency moves from `0.2.2-rc.5` to `0.2.3-alpha.2`, including host-side tools/credentials and the client settings, renderer, slots and plugin-manager packages.
- `@deepseek-ai/cordis` moves to `4.2.0-alpha.1` and `@deepseek-ai/schemastery` to `3.20.0-alpha.1`; the peer ranges add the 0.2.3 line and keep the older ranges; `engines.dsh` still admits earlier 0.2.x hosts.
- `engines.node` matches DSH 0.2.3: `^24.22.3 || >=26.13.1`. CI, release and publish pin Node.js 24.22.3.
- `engines.dsh` remains `>=0.1.7-alpha.2 <0.3.0`.
- The lockfile and workspace supply-chain exemptions are refreshed for the `0.2.3-alpha.2` package set.

## Documentation

- Docs state plugin version 0.22.0, baseline 0.2.3-alpha.2 and the Node.js floor.
- Tool tables follow USAGE chapter order in both languages.
- Plugin Manager uses the official Kingdee name; both locales state credentials resolve from environment-variable references.
- Replaced automatic `kingdee-bos` loading with catalog-install steps.
- Uninstall guide removes the bundle directly, cleans config/credentials, restarts once.
- Corrected Node.js/PowerShell wording, described the literal-host filter without DNS claims, removed the settings-UI credential claim, split the invalid unaudit→unsubmit chain, aligned `acctId` with `acctID`, and normalized product name and Chinese UI path.

## Verification

- `pnpm typecheck`: clean.
- `pnpm build`: clean, including the browser bundle, against DSH 0.2.3-alpha.2.
- `pnpm test`: 15 tests pass.
- `node scripts/check-docs-language.ts`: clean.
- No live profile boot and no live Kingdee tenant verification were performed.

## Upgrade

```sh
dsh plugin --profile web add dsh-kingdee@0.22.0
```

API, configuration keys and tenant behavior are unchanged. A DSH 0.2.2 host on Node.js 24.9 can stay on 0.21.0; move to DSH 0.2.3-alpha.2 or meet the new Node.js floor before installing 0.22.0.
