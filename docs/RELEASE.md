# Release Notes — v0.3.0

Release Date: 2026-09-09

**dsh-kingdee** release v0.3.0, fully adapted to **deepseek-harness `0.1.5-alpha.1`** latest `master`.

## Compatibility

- **Harness `0.1.5-alpha.1`**: Verified on `0.1.5-alpha.1` latest `master`.

## Update Notes

- **Update**: `dsh plugin update dsh-kingdee` (or `dsh plugin add dsh-kingdee@0.3.0`).
- **Requirements**: harness `0.1.5-alpha.1`, Node ≥22.
- **Install**: `dsh plugin add dsh-kingdee` — bundle patch self-registers the `kingdee` loader row.
- **Uninstall**: `dsh plugin remove dsh-kingdee`.
- **Usage**: Configure connection in **Plugins → kingdee**, set credential environment variables (`DSH_KINGDEE_USER` / `DSH_KINGDEE_PASSWORD` / `DSH_KINGDEE_APP_SECRET`), then invoke `kingdee_*` tools in chat sessions.
- **Config**: See [CONFIG.md](../CONFIG.md) for full configuration reference.

## Highlights

- **Full compatibility with DeepSeek Harness `0.1.5-alpha.1`** — devDependencies updated to `0.1.5-alpha.1`.
- **Standalone bilingual configuration guide** — added [CONFIG.md](../CONFIG.md) and [CONFIG.zh.md](../CONFIG.zh.md).
- **Refreshed all documentation** — installation, update, uninstall, and usage guides updated with latest version verification.
- **Robust test & build verification** — 7 unit tests passed, 0 type errors.

## Links

- Homepage: https://github.com/maxwell-feng/dsh-kingdee
- Config Guide: [CONFIG.md](../CONFIG.md)
- Changelog: [CHANGELOG.md](../CHANGELOG.md)
