# 安装说明

[英文](INSTALL.md) | 中文

> 已在 deepseek-harness **0.1.7-rc.2** 上验证（`pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`），且 bundle 补丁在真实 `0.1.7-rc.2` profile 中作为 `# == dsh-kingdee` 层正常生效），并全面适配 **金蝶云·星空 V9.1 企业版**（向下兼容 V9.0 / V8.x）。**未进行真实账套联调验证。** 详细配置项请参阅 [CONFIG.zh.md](./CONFIG.zh.md)。

本指南介绍如何在 DeepSeek Harness（DSH）profile 中安装与配置 **dsh-kingdee**。

## 前置条件

- 已安装 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 并自带 Web GUI（具备 `dsh` CLI，且已具备 `tools`、`credentials`、`settings` 这几个 peer 包）。
- Node ≥ 22（仅核心库/测试需要）。
- 具备一个可访问的、**已启用经典 WebAPI** 的金蝶云·星空实例（**V9.1 企业版**，向下兼容 V9.0 / V8.x），以及有效账套账号。账套需开放经典 `.../K3Cloud` stub 路径；仅提供公有云 OpenAPI 网关（`https://api.kingdee.com/galaxyapi/`）的账套不在支持范围内（见 [README.zh.md](./README.zh.md) 的已知限制）。
- **网络与 SSRF 安全要求**：配置的 `baseUrl` 必须采用 `http:` 或 `https:` 协议。为满足企业级网络安全基线，插件内置了 SSRF 深度防护机制，默认拒绝直接请求 `localhost`、环回地址或未经验证的私网保留网段（如 `127.0.0.0/8`、`192.168.0.0/16`、`10.0.0.0/8` 等）。生产中请配置企业专属解析域名或通过安全反向代理网关接入（如 `https://erp.example.com/K3Cloud`）。

## 一、添加 bundle

本包以 DSH **bundle**（一个贡献配置层的 npm 包）形式发布。安装到 profile：

```sh
dsh plugin add dsh-kingdee
```

或从源码检出，加进你的 `cordis.yml`（或某一层 `cordis.patch.yml`）：

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

> `name: dsh-kingdee` 引用已安装的包（其 `main` 即构建后的 host 入口 `lib/index.js`）。从源码检出开发时改用 `name: ./src/index.ts`——DSH loader 会直接编译 TS。

## 二、配置连接

在 **Plugins → kingdee** 设置卡片，或上述 `config:` 块中设置这些值：

| 键 | 说明 |
|---|---|
| `baseUrl` | WebAPI 基址，如 `http://your-server/K3Cloud` |
| `acctId` | 账套 id |
| `authMode` | `user`（账套用户名/密码，经 `AuthService.ValidateUser`）或 `app`（第三方应用，经 `AuthService.LoginByAppSecret`） |
| `appId` | 应用 id（`app` 模式用） |
| `userNameRef` | 凭据引用：`user` 模式下为账套用户名，`app` 模式下为集成用户（必填） |
| `lcid` | 发送给登录服务的区域 id；默认 `2052`（zh-CN） |
| `organization` | 可选的默认组织（org）id / FNumber，用于查询 |
| `serviceEndpoints` | 高级：按你的金蝶版本覆盖 WebAPI 服务名（见下） |

> 金蝶对 2022-11-29 之后开通的公有云账套拒绝账号密码登录，这类账套请使用 `authMode: "app"`。

### 高级：覆盖服务端点

WebAPI 服务名（如 `LogOut`、`ListDataCenter`、`UnSubmit`、`DeleteDraft`、`QueryBusinessData`）可能随金蝶版本略有差异。若某工具提示未知服务，请在 `serviceEndpoints` 中覆盖对应项（如 `dynamicFormService`、`listDataCenterService`、`logOutService`、`loginService`、`loginByAppSecretService`、`stubSuffix`）。其中 `listDataCenterService` 的服务名尤其随版本而异且属社区验证结论 —— 请在产品内「公共设置 → 动态服务定义 → WebAPI」核对。

## 三、提供密钥

密钥是**引用**（环境变量名），不是字面值。把值放进环境变量或凭据库即可；插件**每次操作都重新解析**，因此轮换后无需重启即可在下一次调用生效。所有系统使用相同的引用名，只是设置环境变量的方式不同。

**Linux / macOS**（`sh`）：

```sh
# user 模式
export DSH_KINGDEE_USER=your_username
export DSH_KINGDEE_PASSWORD=your_password

# app 模式（此处的 DSH_KINGDEE_USER 是集成用户，且为必填）
export DSH_KINGDEE_USER=your_integration_user
export DSH_KINGDEE_APP_SECRET=your_app_secret
```

**Windows — PowerShell**（当前会话，然后重启 DSH）：

```powershell
# user 模式
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"

# app 模式（此处的 DSH_KINGDEE_USER 是集成用户，且为必填）
$env:DSH_KINGDEE_USER = "your_integration_user"
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

写入用户级变量使其在新建 shell 中保留（PowerShell）：

```powershell
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_USER', 'your_username', 'User')
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_PASSWORD', 'your_password', 'User')
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_APP_SECRET', 'your_app_secret', 'User')
```

**Windows — 命令提示符**（`cmd`）：

```bat
REM 当前会话
set DSH_KINGDEE_USER=your_username
set DSH_KINGDEE_PASSWORD=your_password
set DSH_KINGDEE_APP_SECRET=your_app_secret

REM 持久化（新建 shell 生效）
setx DSH_KINGDEE_USER your_username
setx DSH_KINGDEE_PASSWORD your_password
setx DSH_KINGDEE_APP_SECRET your_app_secret
```

**DSH 凭据库**（任意系统；可避免 shell 环境变量问题）。凭据库没有对应的 CLI 子命令：在 DSH 设置界面里填一次即可（凭据值只写不读 —— 页面只能看到脱敏描述符），也可直接编辑 `$DSH_HOME/.credentials.yaml`。插件配置里携带的是引用名，值永远不会进入配置文件。

默认引用名为 `DSH_KINGDEE_USER`、`DSH_KINGDEE_PASSWORD`、`DSH_KINGDEE_APP_SECRET`。如需改用其它名称，请调整 `userNameRef` / `passwordRef` / `appSecretRef`。`DSH_KINGDEE_USER` 在 `user` 模式下存账套用户名、在 `app` 模式下存**集成用户**（后者为必填）；`DSH_KINGDEE_PASSWORD` 仅在 `user` 模式使用。

登录服务返回的是它自身的 `{"LoginResultType": 1}` 结构，而不是其他操作返回的 `Result`/`IsSuccess` 业务信封；插件单独判定该响应，非 `1` 时以 `kd/auth-failed` 呈现。

## 四、验证

让 agent 对已知 FormId 发起查询：

```
在金蝶云星空查询销售订单（SAL_SaleOrder），FBillNo 以 SO-202607 开头。
```

agent 会加载 `kingdee-bos` 技能并调用 `kingdee_query`。成功返回规范化行；失败返回类型化 `kd/*` 错误而非文本。

无需账套也可以验证安装本身：bundle 补丁会作为 `# == dsh-kingdee` 层出现在 profile 的组合配置里：

```sh
dsh plugin --profile <name> add dsh-kingdee
dsh --profile <name> --dump-config
```

## 可选：离线 Mock

没有可达账套时，设置 `mock: true`。工具会改用内置 mock 传输，返回固化的金蝶信封（如一张 `SO-MOCK-1` 单据）。该开关没有 CLI 子命令：设置卡片会暴露非机密的连接字段，但不含 `mock`，因此请在配置中设置 —— 在 `cordis.yml`：

```yaml
config:
  mock: true
```

或在 profile 的 `cordis.patch.yml` 里给 `kingdee` 行加上：

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: true
      config:
        mock: true
```

## 常见问题

- **kingdee/auth-failed** —— 检查 `acctId` / `appId` / `appSecret` 与集成用户（`userNameRef`），并确认账套已启用 WebAPI。若账套是 2022-11-29 之后开通的公有云账套，金蝶会拒绝账号密码登录 —— 请把 `authMode` 改为 `"app"`。若账套只能经 OpenAPI 网关（`https://api.kingdee.com/galaxyapi/`）访问，则完全无法使用：经典会话根本建立不起来，所有调用都会在登录环节失败。
- **kingdee/network** —— 确认从 DSH host 能访问 `baseUrl`，且 WebAPI 端点有响应。
- **kingdee/business-error** —— 账套拒绝了该调用；请读 `message`（例如缺必填字段，或单据状态不允许该操作）。
- **查询返回空结果而不是报错** —— V9.1 收紧了外部用户权限，缺少查询权限可能表现为空结果。请针对每个 `FormId` 先跑一次探针查询验证，再相信空结果集；并把主机出口 IP 加入 WebAPI 限流白名单。
