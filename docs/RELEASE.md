# Release notes — v0.2.0

Release date: 2026-09-01

Second release of **dsh-kingdee**, the Kingdee Cloud Starry Sky (金蝶云星空) secondary-development plugin for DeepSeek Harness.

## New in this release

- **Six additional data/service-layer operations** with matching DSH tools:
  - `kingdee_logout` (session logout)
  - `kingdee_list_datacenters` (list reachable data centers / tenants)
  - `kingdee_query_business_data` (the newer structured query)
  - `kingdee_unsubmit` (un-submit)
  - `kingdee_delete_draft` (delete draft/暂存)
  - `kingdee_batch_save` (batch save several records in one call)
- **Overridable service endpoints** (`serviceEndpoints` config / `KdConfig.endpoints`) so WebAPI service names can be matched to your Kingdee version.
- Unit tests for the new operations (7/7 passing).
- Cross-platform secrets documentation (Linux/macOS, Windows PowerShell/CMD, DSH credential store).
- License switched to proprietary (all rights reserved).

## Highlights

- **Broader state machine** — create/update → batch save → submit → audit → un-audit → un-submit, plus draft delete — off the shelf.
- **Offline mock** still covers the full tool set (`mock: true`).
- **Endpoint configurability** lets a deployment that names a service differently override it without a code change.

## Known limitations

- The **platform-plugin layer** (server-side C# form/list plugins, UI layout, background events) is **not** exposed — it is outside the WebAPI's reach and is documented as a boundary.
- **`app` authentication** uses a default, deployment-agnostic header form; verify the signing scheme against your Kingdee version before relying on it against a live tenant (the mock path does not exercise signing). Newer public-cloud tenants may require third-party (app) auth / OpenAPI.
- A few endpoint names (`LogOut`, `ListDataCenter`, `UnSubmit`, `DeleteDraft`, `QueryBusinessData`) vary by Kingdee version; set `serviceEndpoints` to override on your deployment.
- The DSH host/plugin half is compiled inside a DSH profile; only `kd-core` is built and tested standalone.

## Installation

See [INSTALL.md](../INSTALL.md). Upgrade and removal are in [UPDATE.md](../UPDATE.md) and [UNINSTALL.md](../UNINSTALL.md).

## Links

- Home: https://github.com/maxwell-feng/dsh-kingdee
- Changelog: [CHANGELOG.md](../CHANGELOG.md)
