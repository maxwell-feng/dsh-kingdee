# Release notes — v0.10.0

English | [Chinese](RELEASE.zh.md)

Release date: 2026-09-24

Fifteenth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. It aligns the plugin with DeepSeek Harness 0.1.7-rc.2 and changes no runtime code, no configuration and no tool surface, so the plugin behaves exactly as v0.9.1. Tenant compatibility is unchanged: Kingdee Cloud Starry Sky V9.1 Enterprise Edition, backward-compatible with V9.0 / V8.x, and **no live-tenant verification was performed**.

## Changed

- **Harness alignment.** Development dependencies move to DeepSeek Harness 0.1.7-rc.2, and this release is verified against it.
- **Peer ranges are unchanged.** They stay ^0.1.7-alpha.2, the release line that introduced volatile config, so the plugin still installs on every 0.1.7 prerelease from alpha.2 through rc.2. The harness engine range and the Node engine range are unchanged.
- **Seam audit.** Every interface this plugin uses is identical in the rc.1 and rc.2 sources: the configuration schema the Host reads, the per-entry settings form, tool registration, the credential resolver, the configuration form the browser half reads, and the locale and slot registries.
- **Source change.** None. The only changed file in the packages this plugin consumes adds two optional fields to a type this plugin does not use.
- **Supply-chain gate.** The workspace file now exempts the rc.2 packages from pnpm's minimum-release-age gate, which otherwise rejects DSH's continuously published prereleases.

## Fixed

- **The Chinese 0.3.0 changelog entry now covers that release at the same depth as English**, and the Chinese documentation list links CHANGELOG.zh.md rather than the English changelog. No runtime, configuration or tool-surface change.

## Update notes

- **Update**: run `dsh plugin update dsh-kingdee`, or `dsh plugin add dsh-kingdee@0.10.0` to pin the version.
- **Requirements**: harness ^0.1.7-alpha.2, Node 22 or newer.
- **No configuration, API or tool change.** The twelve configuration fields keep their names, values and defaults, and cordis.yml and cordis.patch.yml keep working unchanged. See USAGE.md and USAGE.zh.md.

## Verification

- Type check and build are clean, and all 15 unit tests pass against DeepSeek Harness 0.1.7-rc.2.
- A frozen-lockfile install passes pnpm's supply-chain gate.
- The declared peers pass the host's own compatibility check on rc.2, rc.1 and alpha.2: admitted, no exemption required.
- The shipped 0.10.0 tarball installs into a real 0.1.7-rc.2 profile and composes as a dsh-kingdee layer under the row id kingdee, with every schema default applied.
