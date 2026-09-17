# Upgrade

English | [Chinese](UPDATE.zh.md)

> Verified against deepseek-harness **0.1.6-alpha.2** (`pnpm run typecheck` clean, **15** unit tests passing via `pnpm test`, and the bundle patch applying as a `# == dsh-kingdee` layer in a real `0.1.6-alpha.2` profile) and adapted for **Kingdee Cloud Starry Sky V9.1 Enterprise Edition** (backward-compatible with V9.0 / V8.x). **No live-tenant verification was performed.**

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
```

3. **Restart the DSH host** so the new plugin version is loaded: stop and start the DSH process (relaunch the `dsh` app / your DSH host) — there is no restart verb.

## After you upgrade

- **0.8.0 adapts to DeepSeek Harness 0.1.6-alpha.2 client UI.** DSH 0.1.6-alpha.2 retired `settings.plugin.item` and introduced the Plugins manager page (`ui-plugin-manager`). The client configuration card now binds into `plugins.row.config` (`dsh-kingdee#kingdee`) and `plugins.bundle.config` (`dsh-kingdee`), providing both concise summary and full interactive configuration views.
- **0.7.0 rewires authentication and stub URLs — check these first.** `app` mode now performs a real `AuthService.LoginByAppSecret` login and **requires `userNameRef`** (the integration user) alongside `appId` / `appSecret`; it no longer emits a `KDAuthentication` header. Every stub URL now ends with `.common.kdsvc`, and the login/logout stubs live under `AuthService.*` (`ValidateUser` / `LoginByAppSecret` / `LogOut`). `serviceEndpoints.servicePrefix` was removed — use `loginByAppSecretService` + `stubSuffix` instead. `kingdee_invoke`'s `serviceName` now takes the custom-stub path `{namespace}.{class}.{method},{assembly}` (e.g. `GetCust.GetCust.ExecuteService,GetCust`), which replaces the dynamic-form URL segment. This release also fixes authentication itself: the login services answer with their own `{"LoginResultType": 1}` shape, which earlier versions misread as a failed business envelope.
- **Take advantage of Kingdee V9.1 features.** The `kingdee_query` and `kingdee_query_business_data` tools accept `orderString`, `limit`, and `startRow` for stable pagination. Tools such as `kingdee_audit`, `kingdee_unaudit`, `kingdee_delete`, `kingdee_unsubmit`, and `kingdee_delete_draft` support passing `numbers` directly (e.g., `SO-20260901`), removing the need for manual surrogate ID resolution. From product version `9.1.0.20250807` on, `Delete` also returns a correct `Number`.
- **Re-check V9.1 permissions and rate limits.** V9.1 tightened external-user access control, so a missing query permission can surface as an **empty result rather than an error** — run a probe query per `FormId` instead of trusting an empty row set. Because the server now logs WebAPI request bodies, prefer `app` mode over account/password where possible, and put the host's egress IP on the WebAPI rate-limit whitelist.
- **SSRF Safety & Host Configuration.** If your previous configuration used a raw private IP (such as `192.168.x.x`, `10.x.x.x`, or `localhost`), update `baseUrl` to an authorized enterprise domain name (e.g., `https://erp.example.com/K3Cloud`). Direct requests to loopback and private subnets without proper hostname resolution are blocked by default for enterprise security compliance.
- **Re-check the settings card.** A new version may add fields (e.g. the new `lcid`, default `2052`, or the new `app`-mode requirement on `userNameRef`). Confirm the displayed values match what you intend.
- **Re-verify a query.** Run a `kingdee_query` against a known form id to confirm the connection and auth still work.
- **Credentials.** Credentials are re-resolved per operation, so no action is needed unless a reference name changed — in that case update `userNameRef` / `passwordRef` / `appSecretRef` in the settings. `userNameRef` is now required in `app` mode too (it names the integration user).

## Examples of what a breaking change looks like

- A tool name or a required parameter changes (e.g. a tool is renamed).
- A credential reference name changes.
- The config shape changes (a key is renamed or removed).

Each of these is called out explicitly as breaking in the relevant [CHANGELOG.md](./CHANGELOG.md) entry.

## Rollback

`dsh plugin update` records versions; roll back to the previous version the same way you installed it:

```sh
dsh plugin add dsh-kingdee@<previous-version>
```

Then restart and re-verify.
