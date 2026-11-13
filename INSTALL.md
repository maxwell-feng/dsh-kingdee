# Installation

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/INSTALL.zh.md)

This guide installs **dsh-kingdee** 0.20.0 (DSH baseline 0.2.2-rc.3) in a DeepSeek Harness profile.

## Prerequisites

- DeepSeek Harness with the web GUI, plus the `tools`, `credentials` and `settings` peers.
- Node.js ≥ 22 for the core library and tests. DSH 0.2.2 hosts themselves require Node.js 24.9 or newer.
- Kingdee Cloud Starry Sky V9.1 Enterprise Edition (backward-compatible with V9.0 / V8.x) with the classic WebAPI enabled and a valid account. A tenant reachable only through the OpenAPI gateway (`https://api.kingdee.com/galaxyapi/`) is not supported.
- `baseUrl` must use `http:` or `https:`. Requests to localhost, loopback, RFC1918, link-local, CGNAT, IPv6 ULA, and multicast/reserved addresses are blocked. Use a public domain such as `https://erp.example.com/K3Cloud`.

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

`authMode: "app"` is required on public-cloud tenants opened after 2022-11-29, where Kingdee refuses account/password login. It needs `appId` + `appSecretRef` + `userNameRef` (the integration user).

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

For Command Prompt, use `set NAME=value` in the current session and `setx NAME value` to persist. The DSH credential store works on every OS: set each value once in the settings UI (write-only) or edit `$DSH_HOME/.credentials.yaml`.

Default reference names are `DSH_KINGDEE_USER`, `DSH_KINGDEE_PASSWORD` and `DSH_KINGDEE_APP_SECRET`; change them with `userNameRef`, `passwordRef` and `appSecretRef`. `DSH_KINGDEE_USER` is the account-set username in `user` mode and the integration user in `app` mode. `DSH_KINGDEE_PASSWORD` is used only by `user` mode.

Login services return `{"LoginResultType": 1}`, not the business envelope. Any other value becomes `kd/auth-failed`.

## 4. Verify

Ask the agent to run a query against a known form id:

```
Query Kingdee Cloud sales orders (SAL_SaleOrder) with FBillNo starting with SO-202607.
```

The agent loads the `kingdee-bos` skill and calls `kingdee_query`. A successful call returns normalized rows; a failure returns a typed `kd/*` error. The bundle patch also shows up as a `# == dsh-kingdee` layer in `dsh --profile <name> --dump-config`.

## Optional: offline mock

Set `mock: true` to use the built-in mock transport, which returns canned Kingdee envelopes (for example a `SO-MOCK-1` bill) without a tenant. The settings card does not expose `mock`, so set it in configuration:

```yaml
config:
  mock: true
```

## Troubleshooting

- **`kd/auth-failed`** — check `acctId`, `appId`, `appSecretRef` and the integration user (`userNameRef`), and confirm that the WebAPI is enabled. On a public-cloud tenant opened after 2022-11-29, switch `authMode` to `"app"`. A tenant that only exposes the OpenAPI gateway cannot be used.
- **`kd/network` / `kd/invalid-config`** — confirm that `baseUrl` is reachable, is a valid `http:` / `https:` URL, and is not a localhost, loopback or private address.
- **`kd/business-error`** — the tenant rejected the call; read `message` for the missing field or the status that blocks the action.
- **A query returns no rows instead of an error** — a missing query permission can surface as an empty result. Validate a probe query per `FormId` and put the host's egress IP on the WebAPI rate-limit whitelist.
