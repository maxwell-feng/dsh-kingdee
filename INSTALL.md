# Installation

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/INSTALL.zh.md)

This guide installs **dsh-kingdee** 0.22.0 (DSH baseline 0.2.3-alpha.2) in a DeepSeek Harness profile.

## Prerequisites

- DeepSeek Harness with the web GUI, plus the `tools`, `credentials` and `settings` peers.
- Node.js `^24.22.3 || >=26.13.1`. DSH 0.2.3 itself requires Node.js 24.22.3 or newer in the 24.x line, or Node.js 26.13.1 or newer.
- Kingdee Cloud Starry Sky V9.1 Enterprise Edition (backward-compatible with V9.0 / V8.x) with the classic WebAPI enabled and a valid account. A tenant reachable only through the OpenAPI gateway (`https://api.kingdee.com/galaxyapi/`) is not supported.
- `baseUrl` must use `http:` or `https:`. The literal host is checked against localhost, loopback, RFC1918, link-local, CGNAT, IPv6 ULA, and multicast/reserved ranges; DNS is not resolved. Use a trusted public domain such as `https://erp.example.com/K3Cloud` and keep egress controls in front of the host.

## 1. Add the bundle

```sh
dsh plugin --profile web add dsh-kingdee
```

`--profile <name>` must come before `add`, `remove` or `update`; after the subcommand it is forwarded to pnpm and fails. For a static profile row, see [CONFIG.md](./CONFIG.md).

## 2. Configure the connection

Use **Plugins → kingdee** in DSH, or a `config:` block in `cordis.yml` / `cordis.patch.yml`. The main fields are:

| Key | Description |
|---|---|
| `baseUrl` | WebAPI base URL, e.g. `https://erp.example.com/K3Cloud` |
| `acctId` | Account-set id |
| `authMode` | `user` (username/password) or `app` (third-party application) |
| `appId` | Application id, used by `app` mode |
| `appSecretRef` | Credential reference holding the app secret |
| `userNameRef` | Credential reference: account-set username, or the integration user in `app` mode (required in both) |
| `passwordRef` | Credential reference holding the account-set password (`user` mode only) |
| `lcid` | Locale id sent to the login services; default `2052` (zh-CN) |
| `mock` | Use the local mock transport; default `false` |
| `serviceEndpoints` | Optional WebAPI service-name overrides; see [CONFIG.md](./CONFIG.md) |

`authMode: "app"` is required on public-cloud tenants that run V8.1 or later and were opened after 2022-11-29, where Kingdee refuses account/password login. It needs `appId` + `appSecretRef` + `userNameRef` (the integration user).

## 3. Provide the secrets

Secrets are references (environment-variable names), not literals. They are resolved per operation, so a rotated value reaches the next call without a restart.

**Linux / macOS** (`sh`):

```sh
# user mode
export DSH_KINGDEE_USER=your_username
export DSH_KINGDEE_PASSWORD=your_password

# app mode (DSH_KINGDEE_USER is the integration user, and is required)
export DSH_KINGDEE_USER=your_integration_user
export DSH_KINGDEE_APP_SECRET=your_app_secret
```

**Windows — PowerShell** (current session; restart DSH afterwards):

```powershell
# user mode
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"

# app mode (DSH_KINGDEE_USER is the integration user, and is required)
$env:DSH_KINGDEE_USER = "your_integration_user"
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

For Command Prompt, use `set NAME=value` in the current session and `setx NAME value` to persist. The DSH credential store works on every OS: add the value under `refs:` in `$DSH_HOME/.credentials.yaml`; the config carries only the reference name.

Default reference names are `DSH_KINGDEE_USER`, `DSH_KINGDEE_PASSWORD` and `DSH_KINGDEE_APP_SECRET`; change them with `userNameRef`, `passwordRef` and `appSecretRef`. `DSH_KINGDEE_USER` is the account-set username in `user` mode and the integration user in `app` mode. `DSH_KINGDEE_PASSWORD` is used only by `user` mode.

Login services return `{"LoginResultType": 1}`, not the business envelope. Any other value becomes `kd/auth-failed`.

## 4. Verify

Ask the agent to run a query against a known form id:

```
Query Kingdee Cloud sales orders (SAL_SaleOrder) with FBillNo starting with SO-202607.
```

If the companion `kingdee-bos` skill is installed, the agent can load it and call `kingdee_query`. A successful call returns normalized rows; a failure returns a typed `kd/*` error. The plugin ships the skill under `skills/kingdee-bos/SKILL.md` but does not register it automatically; copy the `skills/kingdee-bos` directory to `$DSH_HOME/skills/kingdee-bos` to add it to the session catalog. The bundle patch also shows up as a `# == dsh-kingdee` layer in `dsh --profile <name> --dump-config`.

## Optional: offline mock

Set `mock: true` to use the built-in mock transport, which returns canned Kingdee envelopes (for example a `SO-MOCK-1` bill) without a tenant. The settings card does not expose `mock`, so set it in configuration:

```yaml
config:
  mock: true
```

## Troubleshooting

- **`kd/auth-failed`** — check `acctId`, `appId`, `appSecretRef` and the integration user (`userNameRef`), and confirm that the WebAPI is enabled. On a public-cloud tenant that runs V8.1 or later and was opened after 2022-11-29, switch `authMode` to `"app"`. A tenant that only exposes the OpenAPI gateway cannot be used.
- **`kd/network` / `kd/invalid-config`** — confirm that `baseUrl` is reachable, is a valid `http:` / `https:` URL, and is not a localhost, loopback or private address.
- **`kd/business-error`** — the tenant rejected the call; read `message` for the missing field or the status that blocks the action.
- **A query returns no rows instead of an error** — a missing query permission can surface as an empty result. Validate a probe query per `FormId` and put the host's egress IP on the WebAPI rate-limit whitelist.
