# Release notes — v0.8.0


English | [Chinese](RELEASE.zh.md)
Release date: 2026-09-18

Eleventh release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. Aligns with **DeepSeek Harness `0.1.6-alpha.2`** and its new Plugins Manager specification (`ui-plugin-manager`), while maintaining full conformance with **Kingdee Cloud Starry Sky V9.1 Enterprise Edition** (backward-compatible with V9.0 / V8.x).

## Compatibility

- **DeepSeek Harness `0.1.6-alpha.2`**: `pnpm run typecheck` clean, **15** unit tests passing (`pnpm test`), and the bundle patch applying as a `# == dsh-kingdee` layer when installed into a real `0.1.6-alpha.2` profile.
- **Kingdee Cloud Starry Sky V9.1 Enterprise Edition**: Full support for classic `kdservice-sessionid` sessions (request header + Cookie dual channels), third-party app login (`AuthService.LoginByAppSecret`), query pagination (`orderString`, `limit`, `startRow`), document numbers (`numbers`) for workflow actions, and auto-submit/audit (`isAutoSubmitAndAudit`). Backward-compatible with V9.0 / V8.x.

## Update notes

- **Update**: `dsh plugin update dsh-kingdee` (or `dsh plugin add dsh-kingdee@0.8.0`).
- **Requirements**: harness `^0.1.6-alpha.2`, Node ≥22.
- **Client slot migration**: In DSH `0.1.6-alpha.2`, `settings.plugin.item` was retired. `dsh-kingdee` now registers into `plugins.row.config` (`dsh-kingdee#kingdee`) and `plugins.bundle.config` (`dsh-kingdee`), rendering a summary view under the header and an interactive form in page view.
- **Install**: `dsh plugin add dsh-kingdee` — bundle patch self-registers the `kingdee` loader row.
- **Uninstall**: `dsh plugin remove dsh-kingdee`.
- **Usage**: Configure the connection in the **Plugins → kingdee** configuration page, set the credential environment variables (`DSH_KINGDEE_USER` / `DSH_KINGDEE_PASSWORD` / `DSH_KINGDEE_APP_SECRET`), then invoke `kingdee_*` tools in chat sessions. See [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.8.0/USAGE.md) / [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.8.0/USAGE.zh.md).

## Highlights

- **Plugin Manager Conformance** — fully adapted to DeepSeek Harness `0.1.6-alpha.2`'s dedicated Plugins manager page (`ui-plugin-manager`), registering into `plugins.row.config` and `plugins.bundle.config`.
- **Dual-View UI Rendering** — delivers concise summary copy in `view: 'summary'` and mounts the revision-fenced configuration card in `view: 'page'`.
- **Up-to-date Dependencies** — all `@deepseek-ai/dsh-*` peerDependencies and devDependencies bumped to `0.1.6-alpha.2`, `engines.dsh` set to `^0.1.6-alpha.2`.
- **Robust Verification** — 15 unit tests passing, 0 TypeScript compilation errors, clean tsdown client bundle.

