# Release notes — v0.19.0

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.zh.md)

Release date: 2026-11-12

A **harness-baseline release** of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. The build baseline moves from **`0.2.2-rc.1`** to **`0.2.2-rc.2`** (the `next` dist-tag, published 2026-11-11), and the plugin is verified against both **`0.2.2-rc.2`** and **`0.2.2-rc.1`** — the newest release on the `latest` dist-tag. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x. **Neither a live profile boot nor a live-tenant verification was performed.**

## Why this release exists

DeepSeek Harness keeps two dist-tags in flight: `latest` tracks the newest point release, while `next` tracks the release candidates for the coming line. On 2026-11-11 `next` advanced to `0.2.2-rc.2` — the next release candidate for the line `0.2.2-rc.1` belongs to. A plugin whose build pins rc.1 is one hop behind what `next` users actually install, so 0.19.0 moves the build baseline to rc.2 and re-runs the full check on that line, while keeping the rc.1 verification so a user on that tag is still covered.

## Changed

- **Build baseline moves to `0.2.2-rc.2`.** Every `@deepseek-ai/dsh-*` devDependency moves from `0.2.2-rc.1` to `0.2.2-rc.2`, the lockfile is regenerated against rc.2, and `@deepseek-ai/cordis` stays `~4.1.0` while `@deepseek-ai/schemastery` stays `~3.19.0`.
- **The peer ranges needed no change, and that is a finding rather than an omission.** `@deepseek-ai/cordis` stays `^4.0.4 || ^4.0.6-alpha.1` and `@deepseek-ai/schemastery` stays `^3.18.4 || ~3.18.6-alpha.1`, which already cover both the rc.5 pair (4.0.5 / 3.18.5) and the 4.1.0 / 3.19.0 pair. Neither line is excluded, so widening the ranges would only have implied a break that does not exist.
- **Supply-chain exemption refreshed.** The workspace list exempts the rc.2 package set from pnpm's minimum-release-age gate; it remains a single, lockfile-derived block.
- **Source change: none.** No file under `src/`, `test/`, `scripts/`, `locale/`, `skills/`, `docs/`, `.github/`, `cordis.patch.yml`, `tsconfig*.json` or `tsdown.config.ts` changed, and no configuration field moved: the plugin behaves exactly as 0.18.0. `git diff --stat` against 0.18.0 lists only `package.json`, `pnpm-lock.yaml` and `pnpm-workspace.yaml`.

## Checked against 0.2.2-rc.2 (all confirmed as no impact)

The comparison was made by describing what this package actually consumes, not by reading release prose:

- **`dsh-credentials` adds an optional `masked` preview.** The credential view gains `masked?: string` and a note that the full credential never rides in it. Pure addition; the plugin reads only `value`, so no migration.
- **`dsh-tools` adds structured error identity.** `ToolContextUnavailableError` and an optional `ToolErrorInfo` on denial results are additive; `defineTool`, `ToolDefinition` and `ctx.tools.register` are unchanged, so the `kingdee_*` tools compile as before.
- **`dsh-client-ui-settings` widens `openSettings`.** It now takes an optional `sectionId`; backward compatible, and the card never calls it.
- **`dsh-client-ui-slots` adds an `hoc` slot kind.** `SlotKind` gains `'hoc'` with `HocRenderOpts` and renderer notes; additive, and the card still registers its `keyed` `plugins.row.config` / `plugins.bundle.config` slots.
- **`dsh-api-remotes` re-exports more remote type modules.** The additions (agent-team, mcp-manager, web, deepseek-account, office-kit) are type-only re-exports; the credential-domain `remote` merge the card uses is unchanged.
- **Declaration-identical packages.** `dsh-client-locale`, `dsh-client-ui-renderer`, `dsh-client-ui-plugin-manager` and `dsh-util-values` carry no declaration change between 0.2.2-rc.1 and 0.2.2-rc.2.
- **The announced rc.2 breaking changes do not reach this plugin.** Web search defaults to the DeepSeek Search API, AgentTeam moves to named subagents, plugins gain per-language code-block renderers and dynamic MCP registration, tool failures gain structured error types and codes, sessions support batch appends, Office uses native tools, PTC gains call budgets, and the host minimum Node.js stays **24.9** — this package's own `engines.node` stays `>=22`, but running on such a host effectively requires Node.js 24.9 or newer. None of these touches a tool, credential, settings-card or locale seam this plugin consumes. Its own HTTP layer in `src/kd-core/transport.ts` and the SSRF check in `src/kd-core/security.ts` are unchanged.

## Verification

- `node scripts/check-docs-language.ts` passing with zero language or switcher violations across all document pairs.
- `0.2.2-rc.2` line (`cordis` 4.1.0 / `schemastery` 3.19.0): `tsc -p tsconfig.json --noEmit` clean, `npm run build` clean, `npm test` 15/15 pass.
- `0.2.2-rc.1` line (`cordis` 4.1.0 / `schemastery` 3.19.0): the same three checks clean, 15/15 pass.
- The document pairs were additionally audited for table column mismatches, heading-level jumps, broken list numbering, undefined link references, mixed Chinese/English punctuation, duplicated words and structural drift between the two languages of a pair: zero findings.
- Not verified: a live boot into a real 0.2.2-rc.2 or 0.2.2-rc.1 profile, the host's own plugin compatibility check (it needs a real profile), and — as always — no live Kingdee tenant.

## Upgrade

Run `dsh plugin --profile web add dsh-kingdee@0.19.0`, or let the profile track the latest release. Nothing else to do: configuration fields, values and defaults are untouched, and the upgrade is optional — 0.18.0 already loads on `0.2.2-rc.2`, because `engines.dsh` admits the whole `0.2.x` line.
