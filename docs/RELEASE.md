# Release notes — v0.17.0

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.zh.md)

Release date: 2026-11-02

A **dual-line compatibility release** of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It keeps the build on `0.2.2-alpha.2` — the master preview line it has been aligned to — and additionally verifies the plugin against **0.2.1-rc.5**, the `latest` dist-tag, the newest published release, and the runtime the desktop app ships. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x, and **no live-tenant verification was performed**.

## Why this release exists

DeepSeek Harness publishes two lines at once: the `latest` tag tracks the newest point release, while `alpha` tracks master. At the time of writing `latest` is `0.2.1-rc.5` (published 2026-10-29) and `alpha` is `0.2.2-alpha.2` (published 2026-10-27). A user who installs DSH from the desktop app or from `latest` runs **rc.5**; the 0.16.0 release only ever exercised **alpha.2**. 0.17.0 closes that gap with an explicit verification matrix instead of assuming that one line implies the other.

## Changed

- **Two verified lines, one source tree.** The rc.5 line was verified in a separate environment pinned to `@deepseek-ai/dsh-*@0.2.1-rc.5`, `@deepseek-ai/cordis@4.0.5` and `@deepseek-ai/schemastery@3.18.5`. Its `src/`, `test/`, `scripts/`, `locale/`, `skills/`, `docs/`, `.github/`, `cordis.patch.yml`, `tsconfig*.json` and `tsdown.config.ts` are **byte-identical** to this tree (verified by per-file hash), so the result describes this package and not a variant of it.
- **No dependency change; the peers already covered both lines.** `cordis` 4.0.5 falls inside the existing `^4.0.4` range and `schemastery` 3.18.5 inside `^3.18.4`, so the widening done in 0.16.0 (`^4.0.4 || ^4.0.6-alpha.1`, `^3.18.4 || ~3.18.6-alpha.1`) admits the rc.5 pair unchanged. `devDependencies` stay pinned to `0.2.2-alpha.2`, because the manifest can name only one build baseline.
- **Source change: none.** No file under `src/`, `test/`, `scripts/`, `.github/`, `skills/`, `cordis.patch.yml` or the build configuration changed, and no configuration field moved: the plugin behaves exactly as 0.16.0.
- **Supply-chain exemption untouched.** The workspace list already exempts the pinned alpha.2 set; no rc.5 entry was needed because the exemption list is derived from the lockfile, which did not move.

## Checked against the 0.2.1-rc.5 line (all confirmed as no impact)

The run from the previously-aligned baseline (`0.2.1-rc.2`) to `0.2.1-rc.5` adds 19 commits, of which exactly **two** are plugin-facing upgrade guides. Both were read in full:

- **Blank-Session reuse** (`v0.2.1-rc.2/new-session-blank-reuse`) — New Session in Web and Desktop reuses the first unstarted blank Session in the Workspace instead of creating a fresh Agent per call. This is Web/Desktop Session-lifecycle behavior; it reads no tool, credential, settings-card or locale seam.
- **Reasoning body slots** (`v0.2.1-rc.4/reasoning-body-props`) — contributions to `conversation.chat.reasoning.body` now receive the original model output in `rawText`, with `text` carrying Chat's prepared display text. This plugin registers no reasoning renderer and no Chat slot contribution, so neither field reaches it.

Beyond the guides, the seam-by-seam comparison was done by building against rc.5 rather than by reading release prose:

- **Tool registration.** `defineTool({ … })` plus `ctx.tools.register(definition)` in `src/tools.ts` compiles unchanged against `dsh-tools@0.2.1-rc.5`; `DefineToolOptions` and `ToolDefinition` keep the mandatory `output.schema` / `render` projections.
- **Credential seam.** `credentialRef()` and `ctx.credentials.resolve()` are used exactly as before; the resolved `{ value }` shape is unchanged.
- **Volatile config schema.** `Schema.string().volatile()` and the whole `Config` object still type-check under `schemastery@3.18.5` + `cordis@4.0.5`, so the per-operation `captureConfig` contract holds on this line too.
- **Settings card and locale.** `ctx.configForms.get()`, `slots` and `remote` compile against `dsh-client-ui-settings@0.2.1-rc.5`, and the card's single `{ en, zh }` `LocaleRuntime.register()` call compiles against `dsh-client-locale@0.2.1-rc.5`.
- **`dsh.client.inject` manifest.** All five referenced packages (`dsh-client-locale`, `dsh-client-ui-settings`, `dsh-client-ui-plugin-manager`, `dsh-api-remotes`, `dsh-client-connection`) publish at `0.2.1-rc.5` with a web client bundle, so no entry had to be removed.

## Update notes

- **Install**: `dsh plugin --profile web add dsh-kingdee@0.17.0` into a DSH profile, then enable the row.
- **Update**: run `dsh plugin --profile web update dsh-kingdee`, or `dsh plugin --profile web add dsh-kingdee@0.17.0` to pin the version.
- **Requirements**: harness `>=0.1.7-alpha.2 <0.3.0`, Node 22 or newer.
- **Not a mandatory upgrade**: the `engines.dsh` range is unchanged at `>=0.1.7-alpha.2 <0.3.0`, so `dsh-kingdee@0.16.0` and `0.15.1` are still admitted on both lines.

## Verification

- rc.5 line (pinned `0.2.1-rc.5` / `cordis` 4.0.5 / `schemastery` 3.18.5): `npx tsc -p tsconfig.json --noEmit` clean, `npm run build` clean, **15/15** unit tests pass.
- alpha.2 line (pinned `0.2.2-alpha.2` / `cordis` 4.0.6-alpha.1 / `schemastery` 3.18.6-alpha.1): `npx tsc -p tsconfig.json --noEmit` clean, `npm run build` clean, **15/15** unit tests pass.
- `node scripts/check-docs-language.ts` and the structural/typography document linter both report zero findings across all bilingual pairs.
- The rc.5 environment's `src/` tree hashes match this repository file by file, so both results describe the same code.
- Not verified: a live boot into a real rc.5 or alpha.2 profile, and — as always — no live Kingdee tenant.
