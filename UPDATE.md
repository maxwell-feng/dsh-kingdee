# Upgrade

English | [中文](UPDATE.zh.md)

> Verified against deepseek-harness **0.1.5-rc.2** (latest `master`) and adapted for **Kingdee Cloud Starry Sky V9.0 Enterprise Edition** (金蝶云·星空 V9.0 企业版).

How to move **dsh-kingdee** to a newer version.

## Before you upgrade

1. **Read the [CHANGELOG.md](./CHANGELOG.md)** for the target version. The biggest risk is a **breaking change**, and each release note marks them explicitly.
2. **Back up your configuration.** The connection settings (`baseUrl`, `acctId`, `authMode`, …) live in the profile's `cordis.yml` or settings document; the secrets stay in the environment / credentials store and are not backed up by this plugin.

## Upgrade steps

```sh
# 1. Update the installed bundle to the new version
dsh plugin update dsh-kingdee

# 2. (Recommended) rebuild / reinstall if you build the host half from source
pnpm install && pnpm run build

# 3. Restart the DSH host so the new plugin version is loaded
dsh restart
```

## After you upgrade

- **Take advantage of Kingdee V9.0 features.** The `kingdee_query` and `kingdee_query_business_data` tools now accept `orderString`, `limit`, and `startRow` for stable pagination. Tools such as `kingdee_audit`, `kingdee_unaudit`, `kingdee_delete`, `kingdee_unsubmit`, and `kingdee_delete_draft` now support passing `numbers` directly (e.g., `SO-20260901`), removing the need for manual surrogate ID resolution.
- **SSRF Safety & Host Configuration.** If your previous configuration used a raw private IP (such as `192.168.x.x`, `10.x.x.x`, or `localhost`), update `baseUrl` to an authorized enterprise domain name (e.g., `https://erp.example.com/K3Cloud`). Direct requests to loopback and private subnets without proper hostname resolution are blocked by default for enterprise security compliance.
- **Re-check the settings card.** A new version may add fields (e.g. a new `authMode` or `organization` default). Confirm the displayed values match what you intend.
- **Re-verify a query.** Run a `kingdee_query` against a known form id to confirm the connection and auth still work.
- **Credentials.** Credentials are re-resolved per operation, so no action is needed unless a reference name changed — in that case update `userNameRef` / `passwordRef` / `appSecretRef` in the settings.

## Examples of what a breaking change looks like

- A tool name or a required parameter changes (e.g. a tool is renamed).
- A credential reference name changes.
- The config shape changes (a key is renamed or removed).

Each of these is called out under a `### Breaking changes` heading in the relevant [CHANGELOG.md](./CHANGELOG.md) entry.

## Rollback

`dsh plugin update` records versions; roll back to the previous version the same way you installed it:

```sh
dsh plugin add dsh-kingdee@<previous-version>
```

Then restart and re-verify.
