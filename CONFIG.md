# Configuration Guide

English | [简体中文](CONFIG.zh.md)

This document details all configuration options, authentication modes, credential security mechanisms, environment variables, and profile configuration methods for the `dsh-kingdee` plugin in DeepSeek Harness (DSH).

---

## 1. Configuration Options

Plugin configuration is strictly validated at runtime using `@deepseek-ai/schemastery`. Options are registered under the `kingdee` namespace.

| Field | Type | Default | Sensitivity | Description |
| :--- | :--- | :--- | :--- | :--- |
| `baseUrl` | `string` | `""` | Normal | Kingdee Cloud WebAPI base URL, e.g. `http://192.168.1.100/K3Cloud`. |
| `acctId` | `string` | `""` | Normal | Kingdee data center / account ID (`acctId`). |
| `authMode` | `'user' / 'app'` | `"user"` | Normal | Authentication mode. `"user"` uses account username/password; `"app"` uses AppId + AppSecret. |
| `appId` | `string` | `""` | Normal | Application ID, required when `authMode` is `"app"`. |
| `appSecretRef` | `string` | `"DSH_KINGDEE_APP_SECRET"` | `credential-ref` | Credential reference (env var name) holding the `app` secret. |
| `userNameRef` | `string` | `"DSH_KINGDEE_USER"` | `credential-ref` | Credential reference (env var name) holding the account username. |
| `passwordRef` | `string` | `"DSH_KINGDEE_PASSWORD"` | `credential-ref` | Credential reference (env var name) holding the account password. |
| `organization` | `string` | `undefined` | Normal | Optional default organization ID or code (FNumber) for operations. |
| `timeoutMs` | `number` | `30000` | Normal | WebAPI request timeout in milliseconds (range 0 to 300000). |
| `mock` | `boolean` | `false` | Normal | Mock switch. When enabled, uses the local mock transport without a real Kingdee server. |
| `serviceEndpoints` | `object` | `undefined` | Advanced | Optional overrides for custom Kingdee WebAPI endpoint paths. |

### 1.1 Service Endpoints Override (`serviceEndpoints`)

For custom Kingdee deployments or specific version path overrides:
- `loginService`: Login endpoint path
- `logOutService`: Logout endpoint path
- `dynamicFormService`: Dynamic form generic endpoint path
- `listDataCenterService`: Data center listing endpoint path
- `servicePrefix`: Shared service URL prefix

---

## 2. Credential Security (Recommended)

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

Set the environment variables on the host system:

```bash
# Linux / macOS / Android Termux
export DSH_KINGDEE_APP_SECRET="your_app_secret"

# Windows PowerShell
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

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
        organization: "100"
        timeoutMs: 30000
        mock: false
```

---

## 4. Runtime Web UI Configuration

In the DeepSeek Harness Web GUI:
1. Navigate to **Settings** from the left-hand navigation.
2. Select **Plugins → kingdee**.
3. Adjust `baseUrl`, `acctId`, `authMode`, `organization`, `timeoutMs`, and credential reference names interactively.
4. Save your changes to take effect immediately without host restart.
