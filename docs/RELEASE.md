# Release notes — v0.22.0

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.zh.md)

Release date: 2026-11-24

`dsh-kingdee` 0.22.0 aligns with DeepSeek Harness 0.2.3-alpha.2 (released 2026-11-22). This is a dependency, Node.js-requirement and documentation release: no plugin API, configuration-field or normal tenant behavior change. Configuration validation now raises typed `kd/invalid-config` errors. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x.

## Changes

- Plugin version moves to 0.22.0.
- Every `@deepseek-ai/dsh-*` devDependency moves from `0.2.2-rc.5` to `0.2.3-alpha.2`, including the host-side tools/credentials packages and the settings, renderer, slots and plugin-manager packages used by the two halves.
- `@deepseek-ai/cordis` moves to `4.2.0-alpha.1` and `@deepseek-ai/schemastery` to `3.20.0-alpha.1`; the peer ranges add the 0.2.3 cordis/schemastery line while keeping the older ranges; `engines.dsh` still admits earlier 0.2.x hosts.
- `engines.node` now matches DSH 0.2.3: `^24.22.3 || >=26.13.1`. CI, release and publish jobs pin Node.js to 24.22.3.
- `engines.dsh` remains `>=0.1.7-alpha.2 <0.3.0`.
- The lockfile and workspace supply-chain exemptions are refreshed for the `0.2.3-alpha.2` package set.

## Documentation

- README, INSTALL, CONFIG, USAGE, UPDATE and the release notes now state plugin version 0.22.0, the 0.2.3-alpha.2 baseline and the Node.js floor where relevant.
- The Chinese and English tool tables follow the same order as the per-tool chapters in USAGE.
- The Plugin Manager title now uses the official Kingdee product name, and both locale descriptions state that credentials are resolved from environment-variable references.
- Replaced the claim that the bundled `kingdee-bos` skill loads automatically with instructions for adding it to the session skill catalog.
- Rewrote the uninstall guide: it removes the bundle directly instead of inserting a duplicate `kingdee` row, then cleans configuration, credentials and restarts once.
- Corrected the Node.js floor sentences, split PowerShell examples into `powershell` fences, described the literal-host filter without claiming DNS blocking, removed the unsupported settings-UI credential claim, split the invalid unaudit→unsubmit workflow chain, aligned `acctId` with the login key `acctID`, and normalized the Kingdee product name and the Chinese UI path.

## Verification

- `pnpm typecheck`: clean.
- `pnpm build`: clean, including the browser client bundle, against DSH 0.2.3-alpha.2.
- `pnpm test`: 15 tests pass.
- `node scripts/check-docs-language.ts`: clean.
- No live profile boot and no live Kingdee tenant verification were performed.

## Upgrade

```sh
dsh plugin --profile web add dsh-kingdee@0.22.0
```

The API, configuration keys and tenant behavior are unchanged. A 0.2.2 host on Node.js 24.9 can stay on 0.21.0; install 0.22.0 after moving to DSH 0.2.3-alpha.2 or to a host that meets the new Node.js floor.
