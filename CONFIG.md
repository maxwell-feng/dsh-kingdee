# Configuration

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/CONFIG.zh.md)

All configuration for `dsh-kingdee` 0.20.0 on DeepSeek Harness (DSH) 0.2.2-rc.3. The config is a volatile schema checked by `@deepseek-ai/schemastery`: the Host discovers the exported `Config` schema, renders the entry's settings form (keyed by the profile row id, normally `kingdee`), and passes one live reference per field. Each operation captures all references once at its start, so a saved edit reaches the next operation without a restart.

## Fields

| Field | Type | Default | Sensitivity | Description |
|---|---|---|---|---|
| `baseUrl` | `string` | `""` | normal | WebAPI base URL, e.g. `https://erp.example.com/K3Cloud`. Must use `http:` or `https:`. |
| `acctId` | `string` | `""` | normal | Kingdee account-set / data-center id. |
| `authMode` | `user` / `app` | `"user"` | normal | `user` logs in with a username/password through `AuthService.ValidateUser`; `app` logs in through `AuthService.LoginByAppSecret` and requires `appId` + `appSecretRef` + `userNameRef`. |
| `appId` | `string` | `""` | normal | Application id, used by `app` mode. |
| `appSecretRef` | `string` | `"DSH_KINGDEE_APP_SECRET"` | credential-ref | Credential reference holding the app secret. |
| `userNameRef` | `string` | `"DSH_KINGDEE_USER"` | credential-ref | Credential reference holding the account-set username, or the integration user in `app` mode. Required in both modes. |
| `passwordRef` | `string` | `"DSH_KINGDEE_PASSWORD"` | credential-ref | Credential reference holding the account-set password. Used by `user` mode only. |
| `lcid` | `number` | `2052` | normal | Locale id sent to both login services. `2052` is zh-CN. |
| `organization` | `string` | `undefined` | normal | Optional default organization id or FNumber for queries. |
| `timeoutMs` | `number` | `30000` | normal | Request timeout in milliseconds, range 0–300000. |
| `mock` | `boolean` | `false` | normal | Use the local mock transport instead of a real Kingdee server. |
| `serviceEndpoints` | `object` | `undefined` | advanced | Optional overrides for WebAPI service names. |

### Service endpoint overrides

Defaults come from `src/kd-core/client.ts`:

- `loginService` — username/password login stub (default `Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser`)
- `loginByAppSecretService` — app login stub (default `Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret`)
- `logOutService` — logout stub (default `Kingdee.BOS.WebApi.ServicesStub.AuthService.LogOut`)
- `dynamicFormService` — dynamic-form service prefix, without the operation name (default `Kingdee.BOS.WebApi.ServicesStub.DynamicFormService`)
- `listDataCenterService` — data-center listing stub (default `Kingdee.BOS.WebApi.ServicesStub.DataCenterService.List`; version-specific, see the note below)
- `stubSuffix` — suffix appended to every generated stub path (default `.common.kdsvc`; a value that already ends with the suffix is left alone)

Service names vary by Kingdee version and deployment. If a tool reports an unknown service, override the matching name and confirm the real endpoint under Common Settings → Dynamic Service Definition → WebAPI.

## Network and SSRF baseline

Requests are validated before they are sent:

1. Only `http:` and `https:` are allowed.
2. These targets are refused:
   - `localhost`, `*.localhost`, `*.local`, `*.internal`, `*.lan`, `*.corp` and `0.0.0.0`
   - IPv4 loopback (`127.0.0.0/8`) and IPv6 loopback (`::1`)
   - RFC1918 private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
   - Link-local (`169.254.0.0/16`, `fe80::/10`)
   - Carrier-grade NAT (`100.64.0.0/10`)
   - IPv6 unique-local (`fc00::/7`)
   - Multicast, broadcast and reserved ranges
3. Use an enterprise domain or an authorized gateway, e.g. `https://erp.example.com/K3Cloud`.

## Credentials

Never store passwords or app secrets in a config file. Credentials are resolved from references on every operation, so rotation needs no restart.

`user` mode:

```sh
# Linux / macOS
export DSH_KINGDEE_USER="your_username"
export DSH_KINGDEE_PASSWORD="your_password"

# Windows PowerShell (current session)
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"
```

`app` mode also needs the integration user name:

```sh
# Linux / macOS
export DSH_KINGDEE_USER="your_integration_user"
export DSH_KINGDEE_APP_SECRET="your_app_secret"

# Windows PowerShell
$env:DSH_KINGDEE_USER = "your_integration_user"
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

Both login stubs return `{"LoginResultType": 1}`, not the `Result` / `IsSuccess` business envelope. A numeric `LoginResultType` decides the outcome (`1` succeeds, anything else raises `kd/auth-failed`); a response without it falls back to the business envelope.

## Profile configuration

Add the row to `cordis.yml` or a `cordis.patch.yml` layer. `user` mode:

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: true
      config:
        baseUrl: "https://erp.example.com/K3Cloud"
        acctId: "YOUR_ACCT_ID"
        authMode: "user"
        userNameRef: "DSH_KINGDEE_USER"
        passwordRef: "DSH_KINGDEE_PASSWORD"
        lcid: 2052
        organization: "100"
        timeoutMs: 30000
        mock: false
```

In `app` mode, set `authMode: "app"`, `appId`, `appSecretRef` and `userNameRef` (the integration user) instead.

The same fields are editable in **Settings → Plugins → kingdee**. The Host renders the schema form and the plugin adds its browser card (`src/client/settings-card.ts`, built to `lib/client.js`), which binds `plugins.row.config` and `plugins.bundle.config`. Writes are revision-fenced: a Host refusal reloads Host state instead of guessing.

## Kingdee V9.1

`dsh-kingdee` targets Kingdee Cloud Starry Sky V9.1 Enterprise Edition (patch PT-163015 → `9.1.0.20250807`) and stays backward-compatible with V9.0 / V8.x. V9.1 has no breaking WebAPI changes. The classic `{baseUrl}/{stub path}.common.kdsvc` + `kdservice-sessionid` protocol is unchanged.

Operational notes:

- `Delete` returns a correct `FNumber`; `SuccessEntitys[].Number` can be trusted from `9.1.0.20250807` on.
- The server logs WebAPI request bodies. Prefer `app` mode where possible.
- Permissions are stricter: a missing query permission can surface as an empty result. Run a probe query per `FormId`.
- Put the host's egress IP on the WebAPI rate-limit whitelist.

The login request keys (`acctID`, `username`, `appid`, `appsecret`, `lcid`), the `Limit` row cap (~2000) and the `listDataCenterService` default name are community-reported, not published by Kingdee. Confirm them per tenant under Common Settings → Dynamic Service Definition → WebAPI.
