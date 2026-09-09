# 配置说明文档 (Configuration Guide)

[English](CONFIG.md) | 简体中文

本文档详细说明 `dsh-kingdee` 插件在 DeepSeek Harness（DSH）中的所有配置项、认证模式、凭据安全机制、环境变量以及配置文件配置方法。

---

## 1. 配置字段说明

插件配置通过 `@deepseek-ai/schemastery` 进行运行时严格校验。配置位于 `kingdee` 命名空间下。

| 配置字段 | 类型 | 默认值 | 敏感级别 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `baseUrl` | `string` | `""` | 普通 | 金蝶云星空 WebAPI 基址，例如 `http://192.168.1.100/K3Cloud`。 |
| `acctId` | `string` | `""` | 普通 | 金蝶账套 ID（数据中心 ID / Data Center ID）。 |
| `authMode` | `'user' / 'app'` | `"user"` | 普通 | 认证模式。`"user"` 为账套用户名/密码认证；`"app"` 为第三方应用授权（AppId + AppSecret）认证。 |
| `appId` | `string` | `""` | 普通 | 应用 ID，仅在 `authMode: "app"` 时生效。 |
| `appSecretRef` | `string` | `"DSH_KINGDEE_APP_SECRET"` | `credential-ref` | 存放 AppSecret 密钥的凭据引用名（环境变量名）。 |
| `userNameRef` | `string` | `"DSH_KINGDEE_USER"` | `credential-ref` | 存放账套用户名的凭据引用名（环境变量名）。 |
| `passwordRef` | `string` | `"DSH_KINGDEE_PASSWORD"` | `credential-ref` | 存放账套密码的凭据引用名（环境变量名）。 |
| `organization` | `string` | `undefined` | 普通 | 可选。默认组织编码（FNumber）或组织 ID，将自动应用于单据保存与查询。 |
| `timeoutMs` | `number` | `30000` | 普通 | WebAPI 请求超时时间（毫秒），支持范围 0 ~ 300000。 |
| `mock` | `boolean` | `false` | 普通 | 本地 Mock 开关。开启后使用内置模拟传输器，无需连接真实金蝶服务器即可测试和演示。 |
| `serviceEndpoints` | `object` | `undefined` | 高级 | 可选。覆盖金蝶 WebAPI 默认服务端点名称。 |

### 1.1 服务端点高级覆盖 (`serviceEndpoints`)

某些特殊定制或旧版本金蝶云星空实例的服务名可能有所调整，可通过此项覆盖：
- `loginService`: 登录端点路径
- `logOutService`: 登出端点路径
- `dynamicFormService`: 动态表单服务路径
- `listDataCenterService`: 数据中心列表端点路径
- `servicePrefix`: 服务统一前缀

---

## 2. 凭据安全配置（推荐）

为了确保凭据安全，**严禁将账套密码或 AppSecret 明文写在配置文件或代码中**。`dsh-kingdee` 遵循 DeepSeek Harness 的凭据缝（Credentials Seam）规范，在每次请求时动态解析环境变量。修改环境变量后无需重启 DSH 即可在下次调用时立即生效。

### 2.1 用户名密码模式 (`authMode: "user"`)

在主机上配置以下环境变量：

```bash
# Linux / macOS / Android Termux
export DSH_KINGDEE_USER="your_username"
export DSH_KINGDEE_PASSWORD="your_password"

# Windows PowerShell（当前会话）
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"

# Windows PowerShell（持久化到用户环境变量）
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_USER', 'your_username', 'User')
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_PASSWORD', 'your_password', 'User')
```

### 2.2 应用授权模式 (`authMode: "app"`)

在主机上配置以下环境变量：

```bash
# Linux / macOS / Android Termux
export DSH_KINGDEE_APP_SECRET="your_app_secret"

# Windows PowerShell
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

---

## 3. 在 Profile 中进行静态配置 (`cordis.yml` / `cordis.patch.yml`)

在你的 DSH Profile 配置文件中添加插件配置项：

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

若使用 `app` 授权模式：

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

## 4. 运行时 Web 界面配置

在 DeepSeek Harness Web 界面中：
1. 打开左侧导航栏的 **Settings（设置）**。
2. 进入 **Plugins → kingdee** 设置卡片。
3. 可视化修改 `baseUrl`、`acctId`、`authMode`、`organization`、`timeoutMs` 等字段。
4. 修改后点击保存，配置立即更新。
