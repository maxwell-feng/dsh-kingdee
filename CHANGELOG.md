# Changelog

All notable changes to **dsh-kingdee** are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/); this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-09-01

### Fixed

- Reworked the README feature bullet (EN + zh-CN) so the `kingdee_*` tool list reads correctly when rendered on npm (avoids the long comma-separated inline-code span). The full list is in the Tools table.

## [0.2.0] - 2026-09-01

### Added

- **New data/service-layer operations** in `kd-core` and matching DSH tools:
  - `kingdee_logout` — `LoginService.LogOut`, clears the stored session cookie.
  - `kingdee_list_datacenters` — list the data centers / tenants reachable at the base URL.
  - `kingdee_query_business_data` — the newer structured `QueryBusinessData` query.
  - `kingdee_unsubmit` — un-submit a form (reverses a submit).
  - `kingdee_delete_draft` — delete draft (暂存/created) records.
  - `kingdee_batch_save` — batch-save several records in one call.
- **Overridable service endpoints** (`KdConfig.endpoints` / `serviceEndpoints` config) so WebAPI service names can be matched to a specific Kingdee version.
- Unit tests covering the new operations (7/7 passing).

### Changed

- Added cross-platform secrets documentation to `INSTALL.md` / `INSTALL.zh.md` and `README.md` / `README.zh.md` — Linux/macOS `export`, Windows PowerShell `$env:`, Windows CMD `set` / `setx`, and the DSH credential store (`dsh credentials set`).
- License changed from MIT to a **proprietary (all rights reserved)** license. The repository is read/evaluation-only: copying, forking, re-hosting, re-publishing, modifying, or creating derivative works is prohibited without prior written permission.

## [0.1.0] - 2026-09-01

Initial release.

### Added

- **kd-core** — a framework-free Kingdee Cloud Starry Sky WebAPI client:
  - Two authentication modes: `user` (账号 username/password, via `LoginService.ValidateUser` with the `kdsvc` session cookie) and `app` (appId/appSecret).
  - Typed operations: `executeBillQuery`, `save`, `submit`, `audit`, `unaudit`, `view`, `delete`, `invokeService`.
  - Envelope parsing/normalization and typed error mapping (`kd/business-error`, `kd/auth-failed`, `kd/not-found`, `kd/invalid-config`, `kd/network`, `kd/timeout`, `kd/unknown`).
  - Transport seam with a real `HttpTransport` (global `fetch`) and an offline `MockTransport`.
- **DSH plugin** — typed tools registered via `defineTool`:
  - `kingdee_query`, `kingdee_save`, `kingdee_submit`, `kingdee_audit`, `kingdee_unaudit`, `kingdee_view`, `kingdee_delete`, `kingdee_invoke`.
  - Credential-safe configuration: secrets resolved per operation through the DSH credential seam (`ctx.credentials.resolve`).
  - A `kingdee` settings namespace (Host half) with a browser settings card scaffold (Client half, `dsh.client`).
- **Companion skill** — `kingdee-bos`: field/enum/status conventions, the bill state machine, tool usage, and the data-layer vs platform-plugin-layer boundary.
- **Documentation** — bilingual (English / 简体中文): README, INSTALL, UPDATE, UNINSTALL, CHANGELOG, and release notes.
- **Tests** — unit tests for the core (envelope parsing, config validation, auth headers, the full mock flow, and error mapping) using the Node built-in test runner.

### Security

- No secret values are stored in configuration; they are resolved from environment-variable references per operation.

### Notes

- The platform-plugin layer (server-side C# form/list plugins, UI layout) is **not** reachable through the WebAPI and is documented as an explicit boundary in the `kingdee-bos` skill.
- The DSH host/plugin half is compiled inside a DSH profile (its `@deepseek-ai/*` peers resolve there); only `kd-core` is built and tested standalone.
