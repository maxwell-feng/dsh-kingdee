# Release notes — v0.9.1

English | [Chinese](RELEASE.zh.md)

Release date: 2026-09-23

Fourteenth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It is a documentation and repository-tooling release: no runtime code, configuration or tool surface changes, so the plugin behaves exactly as v0.9.0. Harness and tenant compatibility are unchanged (DeepSeek Harness `0.1.7-rc.1`, Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x).

## Changed

- **The repository now holds TypeScript sources only.** The bilingual-documents gate moved from `scripts/check-docs-language.mjs` to `scripts/check-docs-language.ts`. Node ≥22.19 strips the types, so the gate still runs with no dependencies installed and still gates CI before the install step. `scripts/**/*.ts` joined the `tsconfig.json` include list, so `pnpm run typecheck` covers the gate as well, and `.gitattributes` no longer carries JavaScript line-ending rules.

## Fixed

- **Changelog bodies had been lost.** The 0.4.0, 0.3.0, 0.2.3 and 0.2.2 entries in the English changelog carried category headings with no content, and the 0.1.0 `Documentation` bullet was truncated mid-sentence. All are restored, and the Chinese 0.1.0 entry now covers that release at the same depth as English.
- **Section numbering in the configuration guide.** The guide had two `## 3.` sections and two subsections (`2.1` / `2.2`) hanging off the wrong parent; the sections are now numbered 1–6 with 3.1 / 3.2, and the "section 5" cross-reference points at the renumbered V9.1 conformance section.
- **Listing order.** The README Tools table now follows the same order as the per-tool reference in USAGE, and the Documentation list includes the configuration guide it had omitted.
- **Duplicated rules and heading levels.** Six duplicated `---` rules were removed from the Chinese changelog; both sides now use the same heading levels release for release, and both gained the link-reference block they lacked.

## Update notes

- **Update**: `dsh plugin update dsh-kingdee` (or `dsh plugin add dsh-kingdee@0.9.1`).
- **Requirements**: harness `^0.1.7-alpha.2`, Node ≥22.
- **No configuration or API change** — the twelve configuration fields keep their names, values and defaults, and `cordis.yml` / `cordis.patch.yml` keep working unchanged. See [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.9.1/USAGE.md) / [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.9.1/USAGE.zh.md).

## Verification

- `pnpm run typecheck` clean (now including `scripts/`), clean build (`tsc` + `tsdown`), and **15** unit tests passing (`pnpm test`).
- `node scripts/check-docs-language.ts` green, and the docs audit that found these defects reports no remaining findings.
- The declared DSH peers still pass DeepSeek Harness's own `evaluatePluginCompatibility` (`dsh-v0.1.7-rc.1`) against runtime `0.1.7-rc.1`: admitted, no exemption required.
