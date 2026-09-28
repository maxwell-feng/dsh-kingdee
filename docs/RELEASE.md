# Release notes — v0.11.1

English | [Chinese](RELEASE.zh.md)

Release date: 2026-09-28

Seventeenth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It is a **documentation-only release**: the sources, the manifest peers and the configuration are identical to v0.11.0, so the plugin behaves exactly as before. It closes the defects a full bilingual proofread found, and it keeps the DeepSeek Harness 0.2.0-rc.1 alignment introduced in 0.11.0. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x, and **no live-tenant verification was performed**.

## Fixed

- **The English 0.7.0 changelog entry was thinner than the Chinese one.** Added the third-party `LoginByAppSecret` login (`app` mode), the removal of the fabricated `KDAuthentication` header together with the new `userNameRef` requirement, and the login-response fix (`parseLoginOutcome`) that had made authentication fail against a real tenant.
- **The Chinese 0.6.1 entry carried a category heading that did not match the English one, plus a vague item** with no English counterpart; the heading now matches the English `### Removed` and the filler item is gone.
- **One example, two placeholder hosts.** The configuration guide used `https://erp.mycompany.com/K3Cloud` where every other guide uses `https://erp.example.com/K3Cloud`; both languages now use `erp.example.com`.
- **The Chinese configuration guide stated the credential-seam contract as prose** where English lists two bullets; the Chinese side now carries the same two bullets.
- **The Chinese install guide omitted `172.16.0.0/12`** from the blocked private ranges listed in its prerequisites.
- **Chinese guide section numbers now match the English ones.** The install and uninstall guides numbered their top-level sections with Chinese numerals where English uses `1.`–`5.`; both languages now number them the same way, so every pair lines up section for section.

## Update notes

- **Install**: `dsh plugin add dsh-kingdee@0.11.1` into a DSH profile, then enable the row.
- **Update**: run `dsh plugin update dsh-kingdee`, or `dsh plugin add dsh-kingdee@0.11.1` to pin the version. No action is required beyond updating the package: nothing but documentation changed.
- **Requirements**: harness `>=0.1.7-alpha.2 <0.3.0`, Node 22 or newer. On DeepSeek Harness 0.2.0-rc.1 the older `0.10.0` is still refused at load, because its `@deepseek-ai/dsh-*` peers exclude 0.2.x.
- **No configuration, API or tool change.** The twelve configuration fields keep their names, values and defaults, and cordis.yml and cordis.patch.yml keep working unchanged. See USAGE.md and USAGE.zh.md.

## Verification

- `pnpm run typecheck` clean, `pnpm run build` clean (`tsc -p tsconfig.build.json` plus the `tsdown` client bundle), and all **15** unit tests pass (`pnpm test`) against DeepSeek Harness 0.2.0-rc.1.
- `node scripts/check-docs-language.ts` green, plus two mechanical proofreading passes across every bilingual pair: structure and code-fence parity, a mojibake and control-character scan, newest-first changelog ordering with complete link references, and per-section bullet correspondence.
- The harness's own published `evaluatePluginCompatibility` / `getDshRuntimeVersion` from `@deepseek-ai/dsh-app-boot@0.2.0-rc.1` reports runtime `0.2.0-rc.1` and admits `dsh-kingdee@0.11.1` on `0.2.0-rc.1`, `0.2.0`, `0.1.7-rc.2` and `0.1.7-alpha.2`; it refuses `dsh-kingdee@0.10.0` on `0.2.0-rc.1` and `dsh-kingdee@0.11.1` on `0.1.6-alpha.2`.
- The packed 0.11.1 tarball carries the built `lib/`, `cordis.patch.yml`, the `skills/kingdee-bos` skill and the bilingual guides, and its manifest is the one that gate admits above.
- Not verified: a live boot into a real 0.2.0-rc.1 profile (no `dsh` CLI exists on the verification machine), and no live Kingdee tenant.
