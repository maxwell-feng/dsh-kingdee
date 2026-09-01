# Release notes — v0.1.0

Release date: 2026-09-01

This is the initial release of **dsh-kingdee**, the Kingdee Cloud Starry Sky (金蝶云星空) secondary-development plugin for DeepSeek Harness.

## What's in this release

- A framework-free `kd-core` Kingdee Cloud WebAPI client (two auth modes, the full data/service operation set, envelope parsing, typed errors).
- A DSH plugin registering eight typed tools (`kingdee_query`, `kingdee_save`, `kingdee_submit`, `kingdee_audit`, `kingdee_unaudit`, `kingdee_view`, `kingdee_delete`, `kingdee_invoke`).
- Credential-safe configuration (secrets resolved per operation via the DSH credential seam).
- A `kingdee` settings namespace with a browser settings-card scaffold.
- A companion `kingdee-bos` domain skill (field/enum/status conventions, bill state machine, and the platform-plugin boundary).
- Unit tests for the core.

## Highlights

- **Offline mock.** Set `mock: true` to run the full tool pipeline against canned Kingdee envelopes with no reachable tenant.
- **Credential-safe by design.** No secrets in config; each call re-resolves `userNameRef` / `passwordRef` / `appSecretRef`.

## Known limitations

- The **platform-plugin layer** (server-side C# form/list plugins, UI layout, background events) is **not** exposed — it is outside the WebAPI's reach and is documented as a boundary.
- `app` authentication uses a default, deployment-agnostic header form; **verify the signing scheme against your Kingdee version** before relying on it against a live tenant (the mock path does not exercise signing).
- The DSH host/plugin half is compiled inside a DSH profile; only `kd-core` is built and tested standalone.

## Installation

See [INSTALL.md](../INSTALL.md). Upgrade and removal are in [UPDATE.md](../UPDATE.md) and [UNINSTALL.md](../UNINSTALL.md).

## Links

- Home: https://github.com/maxwell-feng/dsh-kingdee
- Changelog: [CHANGELOG.md](../CHANGELOG.md)
