# Release notes — v0.16.0

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.zh.md)

Release date: 2026-10-28

A **DeepSeek Harness 0.2.2-alpha.2 alignment release** of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness: every `@deepseek-ai/dsh-*` development dependency moves to 0.2.2-alpha.2, the lockfile and the pnpm supply-chain exemption are regenerated against that release, and `@deepseek-ai/cordis` / `@deepseek-ai/schemastery` move to `~4.0.6-alpha.1` / `~3.18.6-alpha.1`. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x, and **no live-tenant verification was performed**.

## Changed

- **Harness alignment.** Upgraded all `@deepseek-ai/dsh-*` development dependencies from DeepSeek Harness 0.2.1-rc.2 to 0.2.2-alpha.2, and regenerated the lockfile against 0.2.2-alpha.2. `@deepseek-ai/cordis` moves to `~4.0.6-alpha.1` and `@deepseek-ai/schemastery` to `~3.18.6-alpha.1`.
- **Peer ranges widened.** `@deepseek-ai/cordis` becomes `^4.0.4 || ^4.0.6-alpha.1` and `@deepseek-ai/schemastery` becomes `^3.18.4 || ~3.18.6-alpha.1`, so the plugin keeps accepting the 4.0.4 / 4.0.5 / 3.18.4 / 3.18.5 releases it was previously verified against while also accepting the new prereleases it is now built and tested against.
- **Supply-chain exemption rebuilt.** The workspace file exempts the 0.2.2-alpha.2 package set from pnpm's minimum-release-age gate, which otherwise rejects DSH's continuously published prereleases. The list stays a single lockfile-derived block.
- **Source change: none.** No file under `src/`, `test/`, `scripts/`, `.github/`, `skills/`, `cordis.patch.yml` or the build configuration changed, and no configuration field moved: the plugin behaves exactly as 0.15.1.

## Checked against 0.2.2-alpha.2 (all confirmed as no impact)

DeepSeek Harness 0.2.2-alpha.2 announced three breaking changes that could reach a plugin. Each was checked against this repository rather than assumed harmless:

- **Cordis Timer synchronized with upstream, changing return values.** The plugin's only timer use is `src/kd-core/transport.ts`, which schedules its per-request deadline with the global `setTimeout` and clears it with `clearTimeout`. It never calls `ctx.timer.timeout()` / `interval()` / `throttle()` / `debounce()`, so the changed return values never reach it. Verified by grepping `src/` for timer usage.
- **`dsh-tools` split its declarations into `Contracts` / `ToolExecutor` / pipeline modules.** `src/tools.ts` uses `defineTool({ … })` plus `ctx.tools.register(definition)`, and that call still type-checks. `DefineToolOptions` and `ToolDefinition` — including the mandatory `output.schema` and `render` projection — are declaration-identical between the 0.2.1-rc.2 and 0.2.2-alpha.2 `lib/types/schema.d.ts` / `contracts.d.ts`. The only change on the registration surface is additive: `ToolsService.register` gained an optional second parameter (`ToolRegistrationOptions`, for step-time activation), so the existing single-argument call remains valid.
- **`dsh.client` manifest (`platform` / `inject`) semantics.** Every package named in `dsh.client.inject` — `dsh-client-locale`, `dsh-client-ui-settings`, `dsh-client-ui-plugin-manager`, `dsh-api-remotes`, `dsh-client-connection` — still publishes at 0.2.2-alpha.2, still declares `dsh.client.platform: "web"`, and still exports a `./client` bundle, so no entry had to be removed. The bundle's only external module request, `react`, is unchanged.

Beyond the three announced changes, the settings-card seams were re-read as well: `ctx.configForms.get()`, `slots` and `remote` are declaration-identical between the two releases. The locale service changed once, by widening rather than breaking: `LocaleRuntime.register()`'s typed overload now also accepts extra-locale dictionaries (rc2 required exactly `Record<BuiltInLocaleId, LocaleDictOf<N>>`; alpha2 takes that intersected with `Record<LocaleId, LocaleDictOf<N>>`). The card registers `{ en, zh }` in one call, which still satisfies the widened signature — confirmed by `npx tsc -p tsconfig.json --noEmit`.

## Update notes

- **Install**: `dsh plugin --profile web add dsh-kingdee@0.16.0` into a DSH profile, then enable the row.
- **Update**: run `dsh plugin --profile web update dsh-kingdee`, or `dsh plugin --profile web add dsh-kingdee@0.16.0` to pin the version.
- **Requirements**: harness `>=0.1.7-alpha.2 <0.3.0`, Node 22 or newer.
- **Not a mandatory upgrade**: the `engines.dsh` range is unchanged at `>=0.1.7-alpha.2 <0.3.0`, so `dsh-kingdee@0.15.1` is still admitted on DeepSeek Harness 0.2.2-alpha.2.

## Verification

- `node scripts/check-docs-language.ts` passing clean with zero findings.
- `npx tsc -p tsconfig.json --noEmit` clean.
- `npm run build` clean (`tsc -p tsconfig.build.json` plus the `tsdown` client bundle).
- All **15** unit tests pass (`npm test`) against DeepSeek Harness 0.2.2-alpha.2.
- Not verified: a live boot into a real 0.2.2-alpha.2 profile, and — as always — no live Kingdee tenant.
