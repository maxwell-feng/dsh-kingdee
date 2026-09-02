# Release notes — v0.2.3

Release date: 2026-09-02

Fourth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. Verified against **deepseek-harness `0.1.2-alpha.5`** (latest `master`).

## Compatibility

- **Harness `0.1.2-alpha.5`**: no DSH seam changes affecting this plugin since `0.1.2-alpha.4` — `defineTool` / `ctx.credentials` / `ctx.settings` and the WebAPI transport remain stable, so no code migration is required.
- **中文兼容性**：已在 `0.1.2-alpha.5` 最新 `master` 上验证，自 `0.1.2-alpha.4` 以来无影响本插件的缝变更，无需代码迁移。

## Highlights

- **No code changes** — the `kd-core` WebAPI client and the `kingdee_*` tools remain unchanged from `0.2.2`.
- **Docs refresh** — README / INSTALL / UPDATE / UNINSTALL now note the verified harness version `0.1.2-alpha.5`.
- **Tests** — `kd-core` unit tests (7/7) pass on Node ≥22.

## Known limitations

- The **platform-plugin layer** (server-side C# form/list plugins, UI layout, background events) is **not** exposed — it is outside the WebAPI's reach and is documented as a boundary.
- The DSH host/plugin half is compiled inside a DSH profile; only `kd-core` is built and tested standalone.

## Installation

See [INSTALL.md](../INSTALL.md). Upgrade and removal are in [UPDATE.md](../UPDATE.md) and [UNINSTALL.md](../UNINSTALL.md).

## Links

- Home: https://github.com/maxwell-feng/dsh-kingdee
- Changelog: [CHANGELOG.md](../CHANGELOG.md)
