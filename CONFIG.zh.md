# 配置指南

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/CONFIG.md) | 中文

本文档说明 `dsh-kingdee` 0.20.0 在 DeepSeek Harness（DSH）0.2.2-rc.3 上的全部配置。配置由 `@deepseek-ai/schemastery` 校验，采用易失（volatile）schema：宿主读取导出的 `Config` schema，渲染该条目的设置表单（以 profile 行 id 为键，通常为 `kingdee`），并为每个字段传入一个活引用。每次操作开始时一次性捕获全部引用，因此保存的修改无需重启即可在下一次操作生效。

## 配置字段

| 字段 | 类型 | 默认值 | 敏感级别 | 说明 |
|---|---|---|---|---|
| `baseUrl` | `string` | `""` | 普通 | WebAPI 基址，例如 `https://erp.example.com/K3Cloud`。必须使用 `http:` 或 `https:`。 |
| `acctId` | `string` | `""` | 普通 | 金蝶账套 / 数据中心 id。 |
| `authMode` | `user` / `app` | `"user"` | 普通 | `user` 以用户名/密码经 `AuthService.ValidateUser` 登录；`app` 经 `AuthService.LoginByAppSecret` 登录，需要 `appId` + `appSecretRef` + `userNameRef`。 |
| `appId` | `string` | `""` | 普通 | 应用 id，`app` 模式使用。 |
| `appSecretRef` | `string` | `"DSH_KINGDEE_APP_SECRET"` | 凭据引用 | 保存应用密钥的凭据引用。 |
| `userNameRef` | `string` | `"DSH_KINGDEE_USER"` | 凭据引用 | 保存账套用户名的凭据引用；`app` 模式下为集成用户。两种模式均必填。 |
| `passwordRef` | `string` | `"DSH_KINGDEE_PASSWORD"` | 凭据引用 | 保存账套密码的凭据引用，仅 `user` 模式使用。 |
| `lcid` | `number` | `2052` | 普通 | 发送给两个登录服务的区域 id。`2052` 即 zh-CN。 |
| `organization` | `string` | `undefined` | 普通 | 可选的查询默认组织 id 或 FNumber。 |
| `timeoutMs` | `number` | `30000` | 普通 | 请求超时（毫秒），范围 0–300000。 |
| `mock` | `boolean` | `false` | 普通 | 使用本地 mock 传输，不连接真实金蝶服务器。 |
| `serviceEndpoints` | `object` | `undefined` | 高级 | 可选的 WebAPI 服务名覆盖。 |

### 服务端点覆盖

默认值来自 `src/kd-core/client.ts`：

- `loginService` —— 用户名/密码登录 stub（默认 `Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser`）
- `loginByAppSecretService` —— 应用登录 stub（默认 `Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret`）
- `logOutService` —— 登出 stub（默认 `Kingdee.BOS.WebApi.ServicesStub.AuthService.LogOut`）
- `dynamicFormService` —— 动态表单服务前缀，不含操作名（默认 `Kingdee.BOS.WebApi.ServicesStub.DynamicFormService`）
- `listDataCenterService` —— 数据中心列表 stub（默认 `Kingdee.BOS.WebApi.ServicesStub.DataCenterService.List`；服务名随版本而异，见下方说明）
- `stubSuffix` —— 追加到每个生成 stub 路径末尾的后缀（默认 `.common.kdsvc`；若覆盖值已带该后缀则不重复追加）

服务名随金蝶版本和部署方式而异。若工具报告未知服务，请覆盖对应名称，并在「公共设置 → 动态服务定义 → WebAPI」中核实真实端点。

## 网络与 SSRF 基线

请求发出前会经过校验：

1. 仅允许 `http:` 与 `https:`。
2. 以下目标会被拒绝：
   - `localhost`、`*.localhost`、`*.local`、`*.internal`、`*.lan`、`*.corp` 与 `0.0.0.0`
   - IPv4 环回（`127.0.0.0/8`）与 IPv6 环回（`::1`）
   - RFC1918 私网（`10.0.0.0/8`、`172.16.0.0/12`、`192.168.0.0/16`）
   - 链路本地（`169.254.0.0/16`、`fe80::/10`）
   - 运营商级 NAT（`100.64.0.0/10`）
   - IPv6 唯一本地地址（`fc00::/7`）
   - 组播、广播与保留网段
3. 请使用企业域名或授权的网关，例如 `https://erp.example.com/K3Cloud`。

## 凭据

不要把密码或应用密钥写进配置文件。凭据在每次操作时按引用解析，轮换无需重启。

`user` 模式：

```sh
# Linux / macOS
export DSH_KINGDEE_USER="your_username"
export DSH_KINGDEE_PASSWORD="your_password"

# Windows PowerShell（当前会话）
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"
```

`app` 模式还需要集成用户名：

```sh
# Linux / macOS
export DSH_KINGDEE_USER="your_integration_user"
export DSH_KINGDEE_APP_SECRET="your_app_secret"

# Windows PowerShell
$env:DSH_KINGDEE_USER = "your_integration_user"
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

两个登录 stub 返回 `{"LoginResultType": 1}`，不是 `Result` / `IsSuccess` 业务信封。数字型 `LoginResultType` 决定结果（`1` 成功，其他值抛出 `kd/auth-failed`）；没有该字段时回退到业务信封。

## Profile 配置

在 `cordis.yml` 或某一层 `cordis.patch.yml` 中加入该行。`user` 模式：

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

`app` 模式改为设置 `authMode: "app"`、`appId`、`appSecretRef` 与 `userNameRef`（集成用户）。

同样的字段可在 **设置 → 插件 → kingdee** 页面编辑。宿主渲染 schema 表单，插件叠加自带的浏览器卡片（`src/client/settings-card.ts`，构建为 `lib/client.js`），绑定 `plugins.row.config` 与 `plugins.bundle.config`。写入带修订号栅栏：宿主拒绝时会重新加载宿主状态，而不是猜测。

## 金蝶 V9.1

`dsh-kingdee` 面向金蝶云·星空 V9.1 企业版（补丁 PT-163015 → `9.1.0.20250807`），向下兼容 V9.0 / V8.x。V9.1 没有破坏性 WebAPI 变更。经典 `{baseUrl}/{stub path}.common.kdsvc` + `kdservice-sessionid` 协议保持不变。

运维要点：

- `Delete` 返回正确的 `FNumber`；自 `9.1.0.20250807` 起可直接信任 `SuccessEntitys[].Number`。
- 服务端会记录 WebAPI 请求体。条件允许时优先用 `app` 模式。
- 权限更严格：缺少查询权限可能表现为空结果。请针对每个 `FormId` 跑探针查询。
- 请把宿主出口 IP 加入 WebAPI 限流白名单。

登录请求键（`acctID`、`username`、`appid`、`appsecret`、`lcid`）、`Limit` 行数上限（约 2000）以及 `listDataCenterService` 默认服务名均为社区经验值，并非金蝶官方发布。请在具体账套的「公共设置 → 动态服务定义 → WebAPI」中核对。
