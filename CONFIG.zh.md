# 配置说明文档 (Configuration Guide)

[英文](CONFIG.md) | 简体中文

> 面向 **金蝶云·星空 V9.1 企业版**（向下兼容 V9.0 / V8.x），并经 DeepSeek Harness **0.1.7-rc.1** 验证（`pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`），且 bundle 补丁在真实 `0.1.7-rc.1` profile 中作为 `# == dsh-kingdee` 层正常生效）。**未进行真实账套联调验证。**

本文档详细说明 `dsh-kingdee` 插件在 DeepSeek Harness（DSH）中的所有配置项、认证模式、凭据安全机制、SSRF 安全基线、环境变量以及配置文件配置方法。

---

## 1. 配置字段说明

插件配置由 `@deepseek-ai/schemastery` 严格校验。自 DeepSeek Harness 0.1.7 起，每个可编辑字段都声明为 `.volatile()`，因此 `apply` 收到的是逐字段的活引用（`Volatile<T>`）而非冻结值。Host 自行读取本插件导出的 `Config` schema（`entry.fiber.runtime.Config`）并渲染该条目的表单；表单以 **profile 行 id** 为键（`cordis.patch.yml` 中的 `kingdee`），这个命名空间由 Host 推导，并非插件自行选择。每次操作开始时一次性捕获全部引用，因此保存的修改无需重启即对下一次操作生效，且单次操作绝不会混用两个配置版本。

| 配置字段 | 类型 | 默认值 | 敏感级别 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `baseUrl` | `string` | `""` | 普通 | 金蝶云星空 WebAPI 基址，例如 `https://erp.example.com/K3Cloud`。必须采用 `http:` 或 `https:` 协议。直连 `localhost` 或私网 IP 会被 SSRF 安全策略拒绝。 |
| `acctId` | `string` | `""` | 普通 | 金蝶账套 ID（数据中心 ID）。 |
| `authMode` | `'user' / 'app'` | `"user"` | 普通 | 认证模式。`"user"` 以账套用户名/密码经 `AuthService.ValidateUser` 登录；`"app"` 以第三方应用经 `AuthService.LoginByAppSecret` 登录，除 `appId` + `appSecret` 外**还**必须提供 `userNameRef`（集成用户）。金蝶对 2022-11-29 之后开通的公有云账套拒绝账号密码登录，此类账套必须使用 `"app"`。两种模式都不会伪造 `KDAuthentication` 请求头。 |
| `appId` | `string` | `""` | 普通 | 应用 ID，仅在 `authMode: "app"` 时生效。 |
| `appSecretRef` | `string` | `"DSH_KINGDEE_APP_SECRET"` | `credential-ref` | 存放 AppSecret 密钥的凭据引用名（环境变量名）。 |
| `userNameRef` | `string` | `"DSH_KINGDEE_USER"` | `credential-ref` | 凭据引用名（环境变量名）：`user` 模式下为账套用户名，`app` 模式下为集成用户（两种模式均必填）。 |
| `passwordRef` | `string` | `"DSH_KINGDEE_PASSWORD"` | `credential-ref` | 存放账套密码的凭据引用名（环境变量名，仅 `user` 模式使用，`app` 模式不用）。 |
| `lcid` | `number` | `2052` | 普通 | 发送给两个登录服务的区域 id。`2052` 即 zh-CN，也是金蝶自身默认值。 |
| `organization` | `string` | `undefined` | 普通 | 可选。默认组织编码（FNumber）或组织 ID，将自动应用于单据保存与查询。 |
| `timeoutMs` | `number` | `30000` | 普通 | WebAPI 请求超时时间（毫秒），支持范围 0 ~ 300000。 |
| `mock` | `boolean` | `false` | 普通 | 本地 Mock 开关。开启后使用内置模拟传输器，无需连接真实金蝶服务器即可测试和演示。 |
| `serviceEndpoints` | `object` | `undefined` | 高级 | 可选。覆盖金蝶 WebAPI 默认服务端点名称。 |

### 1.1 服务端点高级覆盖 (`serviceEndpoints`)

针对特殊二开版本或定制路由的金蝶部署（默认值来自 `src/kd-core/client.ts`）：
- `loginService`：账套用户名/密码登录 stub（默认 `Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser`）
- `loginByAppSecretService`：第三方应用登录 stub（默认 `Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret`）
- `logOutService`：登出 stub（默认 `Kingdee.BOS.WebApi.ServicesStub.AuthService.LogOut`）
- `dynamicFormService`：动态表单服务前缀，不含末尾操作名（默认 `Kingdee.BOS.WebApi.ServicesStub.DynamicFormService`）
- `listDataCenterService`：数据中心列表 stub（默认 `Kingdee.BOS.WebApi.ServicesStub.DataCenterService.List`；该服务名随版本而异，见第 5 节的证据说明）
- `stubSuffix`：追加到所有生成 stub 路径末尾的后缀（默认 `.common.kdsvc`；若覆盖值已带该后缀则不再重复追加）

---

## 2. 网络与 SSRF 安全基线

为防范服务端请求伪造（SSRF）与内网未经授权横向扫描：
1. **协议白名单**：仅允许 `http:` 与 `https:` 请求，禁止其他协议。
2. **安全拦截范围**：插件自动拒绝指向以下地址的请求：
   - `localhost` 以及 `*.localhost` 域名
   - IPv4 环回地址（`127.0.0.0/8`）及 IPv6 环回地址（`::1`）
   - RFC1918 私有 IP 网段（`10.0.0.0/8`、`172.16.0.0/12`、`192.168.0.0/16`）
   - 链路本地地址（`169.254.0.0/16`、`fe80::/10`）
   - 运营商级 NAT 地址（`100.64.0.0/10`）
   - IPv6 唯一本地地址（`fc00::/7`）
   - 广播、组播及保留网段
3. **域名推荐**：金蝶服务器请配置企业正规域名，或通过安全反向代理/API 网关对外提供 WebAPI 接入服务（如 `https://erp.example.com/K3Cloud`）。

---

## 3. 凭据安全配置（推荐）

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

`app` 模式以第三方应用经 `AuthService.LoginByAppSecret` 登录。除应用凭据外还需要**集成用户**名，因此也要设置 `DSH_KINGDEE_USER`：

```bash
# Linux / macOS / Android Termux
export DSH_KINGDEE_USER="your_integration_user"
export DSH_KINGDEE_APP_SECRET="your_app_secret"

# Windows PowerShell
$env:DSH_KINGDEE_USER = "your_integration_user"
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

> **登录响应结构。** 两个登录 stub 返回的是它们**自己**的结构 `{"LoginResultType": 1}`，**不是**其他所有操作返回的 `Result` / `IsSuccess` 业务信封。客户端单独判定登录结果（`kd-core` 的 `parseLoginOutcome`）：存在数字型 `LoginResultType` 时以它为准（`1` 为成功，其余抛 `kd/auth-failed`）；没有 `LoginResultType` 时回退到业务信封。

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
        lcid: 2052
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
        # 第三方应用所代理的集成用户（app 模式必填）
        userNameRef: "DSH_KINGDEE_USER"
        lcid: 2052
        organization: "100"
        timeoutMs: 30000
        mock: false
```

---

## 4. 运行时 Web 界面配置

在 DeepSeek Harness Web 界面中：
1. 打开左侧导航栏的 **Settings（设置）**。
2. 进入 **Plugins → kingdee** 设置卡片。
3. 可视化修改 `baseUrl`、`acctId`、`authMode`、`appId`、`lcid`、`organization`、`timeoutMs` 及凭据引用名等字段。
4. 修改后点击保存，配置立即更新。

该页面由 Host 依据该条目的 schema 渲染，并叠加插件自带的浏览器半端（`src/client/settings-card.ts`，构建为 `lib/client.js`）：后者绑定 `plugins.row.config` 与 `plugins.bundle.config`，驱动 Plugins 页拥有的同一个逐条目 `ConfigForm`。写入带修订号栅栏——Host 拒绝时会重新加载 Host 状态而不是猜测，因此卡片绝不会显示 Host 并不持有的值。

---

## 5. 金蝶 V9.1 符合性

`dsh-kingdee` 面向 **金蝶云·星空 V9.1 企业版**（补丁 PT-163015 → 产品版本 `9.1.0.20250807`），并向下兼容 V9.0 / V8.x。

**V9.1 没有破坏性 WebAPI 变更。** 没有重命名或移除的操作、没有 Cookie 改名、没有 URL 约定变化、也没有新增必填请求头。本插件使用的经典 `{baseUrl}/{stub path}.common.kdsvc` + `kdservice-sessionid` 会话协议保持不变。

V9.1 在接口层的增量：

- `Delete` 现在返回正确的 `FNumber` —— 自 `9.1.0.20250807` 起 `SuccessEntitys[].Number` 可直接采信；
- 多文件附件（文件服务）字段可仅凭文件 ID 赋值；
- 服务端新增了 WebAPI 请求体日志；
- 在线文档补充了幂等性校验指引；
- WebAPI 限流增加了白名单；
- 报表 Stub / API 自定义接口做了安全加固；
- 外部用户访问控制被收紧。

对本插件的运维影响：

- 由于服务端会记录请求体，请尽可能优先使用 `app`（第三方）模式，而不是账号密码模式；
- 由于权限被收紧，缺少查询权限可能表现为**空结果而不是报错** —— 请针对每个 `FormId` 先跑一次探针查询验证，而不要直接相信空结果集；
- 请把插件所在主机的出口 IP 加入 WebAPI 限流白名单。

**证据诚实性说明。** 登录服务所用的具名请求键（`acctID` / `username` / `appid` / `appsecret` / `lcid`）、`Limit` 行数上限（约 2000）以及 `listDataCenterService` 默认服务名，均为**社区验证结论，并非金蝶官方发布**的契约。每个账套的权威来源是产品本身：以管理员登录 → 公共设置 → 动态服务定义 → WebAPI，选择业务对象与操作，直接查看该操作的参数说明与示例调用。
