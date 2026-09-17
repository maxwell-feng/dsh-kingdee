# Installation

English | [Chinese](INSTALL.zh.md)

> Verified against deepseek-harness **0.1.6-alpha.2** (`pnpm run typecheck` clean, **15** unit tests passing via `pnpm test`, and the bundle patch applying as a `# == dsh-kingdee` layer in a real `0.1.6-alpha.2` profile) and adapted for **Kingdee Cloud Starry Sky V9.1 Enterprise Edition** (backward-compatible with V9.0 / V8.x). **No live-tenant verification was performed.** For full configuration details, see [CONFIG.md](./CONFIG.md).

This guide covers installing and configuring **dsh-kingdee** in a DeepSeek Harness (DSH) profile.

## Prerequisites

- A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) install with the web GUI (the `dsh` CLI, and the `tools`, `credentials` and `settings` peers available).
- Node ≥ 22 (only needed for the core library / tests).
- A reachable Kingdee Cloud Starry Sky instance (**V9.1 Enterprise Edition**, backward-compatible with V9.0 / V8.x) with the **classic WebAPI enabled**, plus a valid account. The tenant must expose the classic `.../K3Cloud` stubs; a public-cloud tenant that only offers the OpenAPI gateway (`https://api.kingdee.com/galaxyapi/`) is out of scope (see the Known Limitations in [README.md](./README.md)).
- **Network & SSRF Safety**: Target `baseUrl` must use `http:` or `https:`. Per enterprise SSRF security defenses, direct requests targeting `localhost` or unresolvable private IP ranges (`127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`) are blocked by default. Use a designated enterprise domain or public gateway endpoint (e.g. `https://erp.example.com/K3Cloud`).

## 1. Add the bundle

The package ships as a DSH **bundle** (an npm package that contributes a configuration layer). Install it into a profile:

```sh
dsh plugin add dsh-kingdee
```

Or, from a source checkout, add it to your `cordis.yml` (or a `cordis.patch.yml` layer):

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: true
      config:
        baseUrl: "https://erp.example.com/K3Cloud"
        acctId: "YOUR_ACCT_ID"
        authMode: "user"
        appId: ""
        appSecretRef: "DSH_KINGDEE_APP_SECRET"
        userNameRef: "DSH_KINGDEE_USER"
        passwordRef: "DSH_KINGDEE_PASSWORD"
        lcid: 2052
        mock: false
```

> `name: dsh-kingdee` references the installed package (its `main` is the built host entry `lib/index.js`). When developing from a source checkout, use `name: ./src/index.ts` instead — the DSH loader compiles TS directly.

## 2. Configure the connection

Set values either in the **Plugins → kingdee** settings card, or in the `config:` block above:

| Key | Description |
|---|---|
| `baseUrl` | WebAPI base URL, e.g. `http://your-server/K3Cloud` |
| `acctId` | account-set id |
| `authMode` | `user` (account-set username/password through `AuthService.ValidateUser`) or `app` (third-party `AuthService.LoginByAppSecret` login) |
| `appId` | Application id (used by `app` mode) |
| `userNameRef` | Credential reference holding the account-set username (`user` mode) or the integration user (`app` mode — required) |
| `lcid` | Locale id sent to the login services; default `2052` (zh-CN) |
| `organization` | Optional default organization (org) id / FNumber for queries |
| `serviceEndpoints` | Advanced: override WebAPI service names for your Kingdee version (see below) |

> `authMode: "app"` is the mode to use on public-cloud tenants opened after 2022-11-29, where Kingdee refuses account/password login.

### Advanced: override service endpoints

WebAPI service names (e.g. `LogOut`, `ListDataCenter`, `UnSubmit`, `DeleteDraft`, `QueryBusinessData`) can differ slightly by Kingdee version. If a tool reports an unknown service, set the matching override in `serviceEndpoints` (e.g. `dynamicFormService`, `listDataCenterService`, `logOutService`, `loginService`, `loginByAppSecretService`, `stubSuffix`). The `listDataCenterService` name in particular is version-specific and community-attested — confirm it in the product under Common Settings → Dynamic Service Definition → WebAPI.

## 3. Provide the secrets

Secrets are **references** (environment-variable names), not literals. Set the values in the environment or in the credentials store; the plugin resolves them **per operation**, so a rotation reaches the very next call with no restart. The same reference names work on every OS — only the way you set an env var differs.

**Linux / macOS** (`sh`):

```sh
# user mode
export DSH_KINGDEE_USER=your_username
export DSH_KINGDEE_PASSWORD=your_password

# app mode (DSH_KINGDEE_USER is the integration user here, and is required)
export DSH_KINGDEE_USER=your_integration_user
export DSH_KINGDEE_APP_SECRET=your_app_secret
```

**Windows — PowerShell** (current session, then restart DSH):

```powershell
# user mode
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"

# app mode (DSH_KINGDEE_USER is the integration user here, and is required)
$env:DSH_KINGDEE_USER = "your_integration_user"
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

Persist a user-level variable so it survives new shells (PowerShell):

```powershell
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_USER', 'your_username', 'User')
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_PASSWORD', 'your_password', 'User')
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_APP_SECRET', 'your_app_secret', 'User')
```

**Windows — Command Prompt** (`cmd`):

```bat
REM current session
set DSH_KINGDEE_USER=your_username
set DSH_KINGDEE_PASSWORD=your_password
set DSH_KINGDEE_APP_SECRET=your_app_secret

REM persistent (new shells)
setx DSH_KINGDEE_USER your_username
setx DSH_KINGDEE_PASSWORD your_password
setx DSH_KINGDEE_APP_SECRET your_app_secret
```

**DSH credential store** (any OS; avoids shell environment-variable issues). The credential store is not managed by a CLI verb: set each value once in the DSH settings UI (credential values are write-only — the page only ever shows a redacted descriptor), or edit `$DSH_HOME/.credentials.yaml` directly. The reference name is what the plugin config carries; the value never enters a config file.

The default reference names are `DSH_KINGDEE_USER`, `DSH_KINGDEE_PASSWORD` and `DSH_KINGDEE_APP_SECRET`. Change them via `userNameRef` / `passwordRef` / `appSecretRef` if you prefer different names. `DSH_KINGDEE_USER` carries the account-set username in `user` mode and the **integration user** in `app` mode, where it is required; `DSH_KINGDEE_PASSWORD` is only used by `user` mode.

The login services answer with their own `{"LoginResultType": 1}` shape, not the `Result`/`IsSuccess` business envelope every other operation returns; the plugin classifies that response separately, so a non-`1` value is reported as `kd/auth-failed`.

## 4. Verify

Ask the agent to run a query against a known form id:

```
Query Kingdee Cloud sales orders (SAL_SaleOrder) with FBillNo starting with SO-202607.
```

The agent loads the `kingdee-bos` skill and calls `kingdee_query`. A successful call returns normalized rows; a failure returns a typed `kd/*` error instead of prose.

The installation itself is verifiable without a tenant: the bundle patch shows up as a `# == dsh-kingdee` layer in the composed profile config:

```sh
dsh plugin --profile <name> add dsh-kingdee
dsh --profile <name> --dump-config
```

## Optional: offline mock

To demo the pipeline without a reachable tenant, set `mock: true`. The tools then use a built-in mock transport that returns canned Kingdee envelopes (e.g. a `SO-MOCK-1` bill). There is no CLI verb for this: the settings card exposes the non-secret connection fields but not `mock`, so set it in configuration — in `cordis.yml`:

```yaml
config:
  mock: true
```

or on the `kingdee` row of your profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: true
      config:
        mock: true
```

## Troubleshooting

- **kingdee/auth-failed** — check `acctId` / `appId` / `appSecret` and the integration user (`userNameRef`), and confirm the WebAPI is enabled on the tenant. On a public-cloud tenant opened after 2022-11-29 Kingdee refuses account/password login — switch `authMode` to `"app"`. A tenant reachable only through the OpenAPI gateway (`https://api.kingdee.com/galaxyapi/`) cannot be used at all: the classic session cannot be established, so every call fails at login.
- **kingdee/network** — confirm the `baseUrl` is reachable from the DSH host and that the WebAPI endpoint responds.
- **kingdee/business-error** — the tenant rejected the call; read `message` (e.g. a missing required field, or a document status that cannot perform the requested action).
- **A query returns no rows instead of an error** — V9.1 tightened external-user permissions, so a missing query permission can surface as an empty result. Validate a probe query per `FormId` before trusting an empty row set, and put the host's egress IP on the WebAPI rate-limit whitelist.
