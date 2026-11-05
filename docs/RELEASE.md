# Release notes — v0.18.0

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.zh.md)

Release date: 2026-11-05

A **harness-baseline release** of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. The build baseline moves from the `0.2.2-alpha.2` master preview to **`0.2.2-rc.1`** (the `next` dist-tag, published 2026-11-04), and the plugin is verified against both **`0.2.2-rc.1`** and **`0.2.1-rc.5`** — the newest release on the `latest` dist-tag, and the runtime the desktop app ships. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x. **Neither a live profile boot nor a live-tenant verification was performed.**

## Why this release exists

DeepSeek Harness keeps two dist-tags in flight: `latest` tracks the newest point release, while `next` tracks the release candidates for the coming line. On 2026-11-04 `next` advanced to `0.2.2-rc.1` — the release candidate for the line that `0.2.2-alpha.2` had previewed. A plugin built only against the alpha preview is one hop behind what `next` users actually install, so 0.18.0 moves the build baseline to rc.1 and re-runs the full check on that line, while keeping the rc.5 verification so a user on the desktop runtime is still covered.

## Changed

- **Build baseline moves to `0.2.2-rc.1`.** Every `@deepseek-ai/dsh-*` devDependency moves from `0.2.2-alpha.2` to `0.2.2-rc.1`, the lockfile is regenerated against rc.1, and `@deepseek-ai/cordis` moves to `~4.1.0` while `@deepseek-ai/schemastery` moves to `~3.19.0`.
- **The peer ranges needed no change, and that is a finding rather than an omission.** `@deepseek-ai/cordis` stays `^4.0.4 || ^4.0.6-alpha.1` and `@deepseek-ai/schemastery` stays `^3.18.4 || ~3.18.6-alpha.1`, because `^4.0.4` already covers cordis 4.1.0 and `^3.18.4` already covers schemastery 3.19.0. Neither line is excluded, so widening the ranges would only have implied a break that does not exist.
- **Supply-chain exemption refreshed.** The workspace list exempts the rc.1 package set from pnpm's minimum-release-age gate; it remains a single, lockfile-derived block.
- **Source change: none.** No file under `src/`, `test/`, `scripts/`, `locale/`, `skills/`, `docs/`, `.github/`, `cordis.patch.yml`, `tsconfig*.json` or `tsdown.config.ts` changed, and no configuration field moved: the plugin behaves exactly as 0.17.0. `git diff --stat` against 0.17.0 lists only `package.json`, `pnpm-lock.yaml` and `pnpm-workspace.yaml`.

## Checked against 0.2.2-rc.1 (all confirmed as no impact)

The comparison was made by describing what this package actually consumes, not by reading release prose:

- **Declarations are byte-identical.** The `dsh-tools`, `dsh-web` and `dsh-credentials` packages differ from their `0.2.2-alpha.2` counterparts only in `package.json`; every `.d.ts` declaration the plugin reads is unchanged. `DefineToolOptions`, `ToolDefinition`, `ToolsService.register`, `credentialRef` / `ctx.credentials.resolve`, `ctx.configForms.get()`, `slots` and `remote` therefore all keep their shape.
- **`dsh-util-values` was refactored internally.** Implementation only; the config-value helpers this plugin calls keep their declarations.
- **`dsh-llm` made `GenerateOptions.purpose` generic.** Not affected: this plugin builds no auxiliary LLM request, so it never constructs that option.
- **`dsh-client-ui-settings` added the optional `settings.section.icon` slot.** Pure addition; this plugin registers no settings-section slot, and its card compiles unchanged.
- **`dsh-client-ui-plugin-manager` added diagnostic fields to `InstallState`.** Pure addition; the plugin reads no `InstallState` field.
- **`cordis` 4.1.0 is declaration-identical to 4.0.6-alpha.2**, so `Schema.string().volatile()` and the whole `Config` object still type-check against `schemastery` 3.19.0 + `cordis` 4.1.0.
- **The announced rc.1 breaking changes do not reach this plugin.** Minimum Node.js rises to **24.9**; Cordis Core moves to **4.1.0** with Loader **1.1.0** and Include **1.1.0**; `web_fetch` no longer rejects private addresses. The first two concern the host runtime, and this package's own `engines.node` stays `>=22` — although running on such a host effectively requires Node.js 24.9 or newer. The third concerns the host's fetch provider, a tool this plugin never calls: it issues its own HTTP requests through `src/kd-core/transport.ts` and validates every host with `isPrivateOrLocalHost` in `src/kd-core/security.ts`, so its SSRF defense is unchanged.

## Update notes

- **Install**: `dsh plugin --profile web add dsh-kingdee@0.18.0` into a DSH profile, then enable the row.
- **Update**: run `dsh plugin --profile web update dsh-kingdee`, or `dsh plugin --profile web add dsh-kingdee@0.18.0` to pin the version.
- **Requirements**: harness `>=0.1.7-alpha.2 <0.3.0`, Node 22 or newer for the core library and the tests.
- **Not a mandatory upgrade**: the `engines.dsh` range is unchanged at `>=0.1.7-alpha.2 <0.3.0` and admits `0.2.2-rc.1` by range semantics, so `dsh-kingdee@0.17.0`, `0.16.0` and `0.15.1` are still admitted on both verified lines.

## Verification

- rc.1 line (pinned `0.2.2-rc.1` / `cordis` 4.1.0 / `schemastery` 3.19.0): `tsc -p tsconfig.json --noEmit` clean, `npm run build` clean, **15/15** unit tests pass.
- rc.5 line (pinned `0.2.1-rc.5` / `cordis` 4.0.5 / `schemastery` 3.18.5): `tsc -p tsconfig.json --noEmit` clean, `npm run build` clean, **15/15** unit tests pass.
- `node scripts/check-docs-language.ts` reports zero findings across all bilingual pairs; a manual pass over the same pairs found no table-column, heading-level, list-numbering, link-definition, duplicated-word or mixed-punctuation defect.
- `git diff --stat` against 0.17.0 lists only `package.json`, `pnpm-lock.yaml` and `pnpm-workspace.yaml`, so both lines verify the same code.
- Not verified: a live boot into a real rc.1 or rc.5 profile, the host's own plugin compatibility check (it needs a real profile), and — as always — no live Kingdee tenant.
