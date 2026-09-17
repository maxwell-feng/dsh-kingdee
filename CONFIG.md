# Configuration Guide

English | [Chinese](CONFIG.zh.md)

> Targets **Kingdee Cloud Starry Sky V9.1 Enterprise Edition** (backward-compatible with V9.0 / V8.x) and verified on DeepSeek Harness **0.1.6-alpha.2** (`pnpm run typecheck` clean, **15** unit tests passing via `pnpm test`, and the bundle patch applying as a `# == dsh-kingdee` layer in a real `0.1.6-alpha.2` profile). **No live-tenant verification was performed.**

This document details all configuration options, authentication modes, credential security mechanisms, environment variables, SSRF protection policies, and profile configuration methods for the `dsh-kingdee` plugin in DeepSeek Harness (DSH).

---

## 1. Configuration Options

Plugin configuration is strictly validated at runtime using `@deepseek-ai/schemastery`. Options are registered under the `kingdee` namespace.

| Field | Type | Default | Sensitivity | Description |
| :--- | :--- | :--- | :--- | :--- |
| `baseUrl` | `string` | `""` | Normal | Kingdee Cloud WebAPI base URL, e.g. `https://erp.example.com/K3Cloud`. Must use `http:` or `https:`. Requests to `localhost` or private IP ranges are blocked by SSRF defense. |
| `acctId` | `string` | `""` | Normal | Kingdee data center / account ID (`acctId`). |
| `authMode` | `'user' / 'app'` | `"user"` | Normal | Authentication mode. `"user"` logs in with an account-set username/password through `AuthService.ValidateUser`; `"app"` logs in as a third-party application through `AuthService.LoginByAppSecret` and requires `appId` + `appSecret` **and** `userNameRef` (the integration user). `"app"` is the mode Kingdee requires on public-cloud tenants opened after 2022-11-29, where account/password login is refused. In neither mode is a `KDAuthentication` header fabricated. |
| `appId` | `string` | `""` | Normal | Application ID, required when `authMode` is `"app"`. |
| `appSecretRef` | `string` | `"DSH_KINGDEE_APP_SECRET"` | `credential-ref` | Credential reference (env var name) holding the `app` secret. |
| `userNameRef` | `string` | `"DSH_KINGDEE_USER"` | `credential-ref` | Credential reference (env var name) holding the account-set username for `user` mode, or the integration user for `app` mode (required in both). |
| `passwordRef` | `string` | `"DSH_KINGDEE_PASSWORD"` | `credential-ref` | Credential reference (env var name) holding the account-set password (`user` mode only; not used by `app`). |
| `lcid` | `number` | `2052` | Normal | Locale id sent to both login services. `2052` is zh-CN, Kingdee's own default. |
| `organization` | `string` | `undefined` | Normal | Optional default organization ID or code (FNumber) for operations. |
| `timeoutMs` | `number` | `30000` | Normal | WebAPI request timeout in milliseconds (range 0 to 300000). |
| `mock` | `boolean` | `false` | Normal | Mock switch. When enabled, uses the local mock transport without a real Kingdee server. |
| `serviceEndpoints` | `object` | `undefined` | Advanced | Optional overrides for custom Kingdee WebAPI endpoint paths. |

### 1.1 Service Endpoints Override (`serviceEndpoints`)

For custom Kingdee deployments or specific version path overrides (defaults come from `src/kd-core/client.ts`):
- `loginService`: account-set username/password login stub (default `Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser`)
- `loginByAppSecretService`: Third-party application login stub (default `Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret`)
- `logOutService`: Logout stub (default `Kingdee.BOS.WebApi.ServicesStub.AuthService.LogOut`)
- `dynamicFormService`: Dynamic form service prefix, without the trailing operation (default `Kingdee.BOS.WebApi.ServicesStub.DynamicFormService`)
- `listDataCenterService`: Data center listing stub (default `Kingdee.BOS.WebApi.ServicesStub.DataCenterService.List`; the name is version-specific — see the evidence note in section 5)
- `stubSuffix`: Suffix appended to every generated stub path (default `.common.kdsvc`; a value already carrying the suffix is left alone)

---

## 2. Network & SSRF Security Baseline

To protect enterprise internal infrastructure against Server-Side Request Forgery (SSRF) and unauthorized lateral probing:
1. **Permitted Protocols**: Only `http:` and `https:` are allowed.
2. **Blocked Targets**: The plugin automatically detects and refuses requests targeting:
   - `localhost` and `*.localhost`
   - IPv4 loopback (`127.0.0.0/8`) and IPv6 loopback (`::1`)
   - RFC1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
   - Link-local addresses (`169.254.0.0/16`, `fe80::/10`)
   - Carrier-grade NAT (`100.64.0.0/10`)
   - IPv6 Unique Local Addresses (`fc00::/7`)
   - Multicast, broadcast, and reserved network segments
3. **Deployment Guidance**: Ensure your Kingdee Cloud WebAPI is reachable via an enterprise domain name or an authorized API gateway (e.g., `https://erp.mycompany.com/K3Cloud`).

---

## 3. Credential Security (Recommended)

To protect sensitive credentials, **never store passwords or AppSecrets in plaintext configuration files or source code**. `dsh-kingdee` complies with the DeepSeek Harness Credentials Seam contract:
- Credentials are dynamically resolved from environment variables on every operation.
- Rotating or modifying environment variables does not require restarting the DSH host.

### 2.1 Username & Password Mode (`authMode: "user"`)

Set the environment variables on the host system:

```bash
# Linux / macOS / Android Termux
export DSH_KINGDEE_USER="your_username"
export DSH_KINGDEE_PASSWORD="your_password"

# Windows PowerShell (Current session)
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"

# Windows PowerShell (Persist to user profile)
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_USER', 'your_username', 'User')
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_PASSWORD', 'your_password', 'User')
```

### 2.2 App Authentication Mode (`authMode: "app"`)

`app` mode logs in as a third-party application through `AuthService.LoginByAppSecret`. It needs the **integration user** name as well as the application credentials, so set `DSH_KINGDEE_USER` too:

```bash
# Linux / macOS / Android Termux
export DSH_KINGDEE_USER="your_integration_user"
export DSH_KINGDEE_APP_SECRET="your_app_secret"

# Windows PowerShell
$env:DSH_KINGDEE_USER = "your_integration_user"
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

> **Login response shape.** Both login stubs answer with their own `{"LoginResultType": 1}` shape, **not** the `Result` / `IsSuccess` business envelope that every other operation returns. The client classifies the login outcome separately (`parseLoginOutcome` in `kd-core`): a numeric `LoginResultType` decides it (`1` = success, anything else throws `kd/auth-failed`), and a response without `LoginResultType` falls back to the business envelope.

---

## 3. Static Profile Configuration (`cordis.yml` / `cordis.patch.yml`)

Add the plugin entry to your DSH Profile configuration file:

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: true
      config:
        baseUrl: "http://your-server/K3Cloud"
        acctId: "YOUR_ACCT_ID"
        authMode: "user"
        userNameRef: "DSH_KINGDEE_USER"
        passwordRef: "DSH_KINGDEE_PASSWORD"
        lcid: 2052
        organization: "100"
        timeoutMs: 30000
        mock: false
```

Or for `app` mode:

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: true
      config:
        baseUrl: "http://your-server/K3Cloud"
        acctId: "YOUR_ACCT_ID"
        authMode: "app"
        appId: "your_app_id"
        appSecretRef: "DSH_KINGDEE_APP_SECRET"
        # The integration user the third-party app acts as (required in app mode).
        userNameRef: "DSH_KINGDEE_USER"
        lcid: 2052
        organization: "100"
        timeoutMs: 30000
        mock: false
```

---

## 4. Runtime Web UI Configuration

In the DeepSeek Harness Web GUI:
1. Navigate to **Settings** from the left-hand navigation.
2. Select **Plugins → kingdee**.
3. Adjust `baseUrl`, `acctId`, `authMode`, `appId`, `lcid`, `organization`, `timeoutMs`, and credential reference names interactively.
4. Save your changes to take effect immediately without host restart.

---

## 5. Kingdee V9.1 Conformance

`dsh-kingdee` targets **Kingdee Cloud Starry Sky V9.1 Enterprise Edition** (patch PT-163015 → product version `9.1.0.20250807`) and stays backward-compatible with V9.0 / V8.x.

**V9.1 has no breaking WebAPI changes.** No renamed or removed operation, no cookie rename, no URL-convention change, and no new required header. The classic `{baseUrl}/{stub path}.common.kdsvc` + `kdservice-sessionid` session protocol this plugin speaks is unchanged.

Interface-layer increments in V9.1:

- `Delete` now returns a correct `FNumber` — `SuccessEntitys[].Number` can be trusted as-is from `9.1.0.20250807` on.
- Multi-file attachment fields may be assigned by file ID alone.
- WebAPI request-body logging was added server-side.
- The online documentation gained idempotency guidance.
- WebAPI rate limiting gained a whitelist.
- Report stubs and custom API endpoints were security-hardened.
- External-user access control was tightened.

Operational consequences for this plugin:

- Because the server now logs request bodies, prefer the `app` (third-party) mode over account/password where possible.
- Because permissions were tightened, a missing query permission can surface as an **empty result rather than an error** — validate a probe query per `FormId` instead of trusting an empty row set.
- Put the plugin host's egress IP on the WebAPI rate-limit whitelist.

**Evidence honesty.** The login services' named request keys (`acctID` / `username` / `appid` / `appsecret` / `lcid`), the `Limit` row cap (~2000) and the `listDataCenterService` default name are **community-attested, not officially published** by Kingdee. The authoritative per-tenant source is the product itself: sign in as an administrator, then open Common Settings → Dynamic Service Definition → WebAPI, pick the business object and operation, and read that operation's parameter list and sample call.
