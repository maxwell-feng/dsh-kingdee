# Installation

This guide covers installing and configuring **dsh-kingdee** in a DeepSeek Harness (DSH) profile.

## Prerequisites

- A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) install with the web GUI (the `dsh` CLI, and the `tools`, `credentials` and `settings` peers available).
- Node ≥ 22 (only needed for the core library / tests).
- For real usage: a reachable Kingdee Cloud Starry Sky instance with the **WebAPI enabled**, plus a valid account.

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
        baseUrl: "http://your-server/K3Cloud"
        acctId: "YOUR_ACCT_ID"
        authMode: "user"
        appId: ""
        appSecretRef: "DSH_KINGDEE_APP_SECRET"
        userNameRef: "DSH_KINGDEE_USER"
        passwordRef: "DSH_KINGDEE_PASSWORD"
        mock: false
```

> `name: dsh-kingdee` references the installed package (its `main` is the built host entry `lib/index.js`). When developing from a source checkout, use `name: ./src/index.ts` instead — the DSH loader compiles TS directly.

## 2. Configure the connection

Set values either in the **Plugins → kingdee** settings card, or in the `config:` block above:

| Key | Description |
|---|---|
| `baseUrl` | WebAPI base URL, e.g. `http://your-server/K3Cloud` |
| `acctId` | 账套 id |
| `authMode` | `user` (账套 username/password) or `app` (appId/appSecret) |
| `appId` | Application id (used by `app` mode) |
| `organization` | Optional default organization (org) id / FNumber for queries |
| `serviceEndpoints` | Advanced: override WebAPI service names for your Kingdee version (see below) |

### Advanced: override service endpoints

WebAPI service names (e.g. `LogOut`, `ListDataCenter`, `UnSubmit`, `DeleteDraft`, `QueryBusinessData`) can differ slightly by Kingdee version. If a tool reports an unknown service, set the matching override in `serviceEndpoints` (e.g. `dynamicFormService`, `listDataCenterService`, `logOutService`, `servicePrefix`).

## 3. Provide the secrets

Secrets are **references** (environment-variable names), not literals. Set the values in the environment or in the credentials store; the plugin resolves them **per operation**, so a rotation reaches the very next call with no restart. The same reference names work on every OS — only the way you set an env var differs.

**Linux / macOS** (`sh`):

```sh
# user mode
export DSH_KINGDEE_USER=your_username
export DSH_KINGDEE_PASSWORD=your_password

# app mode
export DSH_KINGDEE_APP_SECRET=your_app_secret
```

**Windows — PowerShell** (current session, then restart DSH):

```powershell
# user mode
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"

# app mode
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

**DSH credential store** (any OS; the recommended way to avoid shell env var issues):

```sh
dsh credentials set DSH_KINGDEE_USER your_username
dsh credentials set DSH_KINGDEE_PASSWORD your_password
dsh credentials set DSH_KINGDEE_APP_SECRET your_app_secret
```

The default reference names are `DSH_KINGDEE_USER`, `DSH_KINGDEE_PASSWORD` and `DSH_KINGDEE_APP_SECRET`. Change them via `userNameRef` / `passwordRef` / `appSecretRef` if you prefer different names.

## 4. Verify

Ask the agent to run a query against a known form id:

```
Query Kingdee Cloud sales orders (SAL_SaleOrder) with FBillNo starting with SO-202607.
```

The agent loads the `kingdee-bos` skill and calls `kingdee_query`. A successful call returns normalized rows; a failure returns a typed `kd/*` error instead of prose.

## Optional: offline mock

To demo the pipeline without a reachable tenant, set `mock: true`. The tools then use a built-in mock transport that returns canned Kingdee envelopes (e.g. a `SO-MOCK-1` bill):

```sh
dsh plugin config set kingdee.mock true
```

or in `cordis.yml`:

```yaml
config:
  mock: true
```

## Troubleshooting

- **kingdee/auth-failed** — check `acctId` / `appId` / `appSecret`, and confirm the WebAPI is enabled on the tenant.
- **kingdee/network** — confirm the `baseUrl` is reachable from the DSH host and that the WebAPI endpoint responds.
- **kingdee/business-error** — the tenant rejected the call; read `message` (e.g. a missing required field, or a document status that cannot perform the requested action).
