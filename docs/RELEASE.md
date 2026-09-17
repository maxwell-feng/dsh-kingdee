# Release notes — v0.8.1

English | [Chinese](RELEASE.zh.md)

Release date: 2026-09-18

Twelfth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It closes the language boundary — runtime strings and every document are single-language — and adds the rule plus the checker that keep it that way. Harness and tenant compatibility are unchanged from v0.8.0 (DeepSeek Harness `0.1.6-alpha.2`, Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x).

## Changed

- **Runtime strings are English only**: the `kingdee_delete_draft` tool description, the settings-card user-name label, the `authMode: "app"` error message, and every source comment.
- **Two Chinese exceptions stay by design**: the login-word matcher in `src/kd-core/errors.ts`, which must recognize the Chinese error text the Kingdee WebAPI returns, and the Chinese product display name on the Plugins card. Both are registered in the checker's `SRC_CJK_ALLOW`.
- **Documentation normalized**: every document is single-language (`X.md` English, `X.zh.md` Chinese) with complete pairs and switcher lines, and both changelogs now cover the same 13 releases.

## Added

- `AGENTS.md` states the bilingual rule; `scripts/check-docs-language.mjs` enforces documents, source strings and pairs locally and in CI, which runs it before installing dependencies.

## Update notes

- **Update**: `dsh plugin update dsh-kingdee` (or `dsh plugin add dsh-kingdee@0.8.1`).
- **Requirements**: harness `^0.1.6-alpha.2`, Node ≥22.
- **No configuration or API changes** — this release touches strings, documents and tooling only. See [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.8.1/USAGE.md) / [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.8.1/USAGE.zh.md).

## Verification

- `pnpm run typecheck` clean, **15** unit tests passing (`pnpm test`), clean build, and `node scripts/check-docs-language.mjs` green.
