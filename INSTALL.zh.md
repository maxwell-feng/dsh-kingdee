# 安装说明

> 已在 deepseek-harness **0.1.2-alpha.5** 最新 `master` 上验证（`0.1.2-alpha.4` → `0.1.2-alpha.5` 无影响本插件的缝变更）。

本指南介绍如何在 DeepSeek Harness（DSH）profile 中安装与配置 **dsh-kingdee**。

## 前置条件

- 已安装 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 并自带 Web GUI（具备 `dsh` CLI，且已具备 `tools`、`credentials`、`settings` 这几个 peer 包）。
- Node ≥ 22（仅核心库/测试需要）。
- 真实使用需：一个**已启用 WebAPI** 的可达金蝶云星空实例，以及有效账套账号。

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
        baseUrl: "http://your-server/K3Cloud"
        acctId: "YOUR_ACCT_ID"
        authMode: "user"
        appId: ""
        appSecretRef: "DSH_KINGDEE_APP_SECRET"
        userNameRef: "DSH_KINGDEE_USER"
        passwordRef: "DSH_KINGDEE_PASSWORD"
        mock: false
```

> `name: dsh-kingdee` 引用已安装的包（其 `main` 即构建后的 host 入口 `lib/index.js`）。从源码检出开发时改用 `name: ./src/index.ts`——DSH loader 会直接编译 TS。

## 二、配置连接

在 **Plugins → kingdee** 设置卡片，或上述 `config:` 块中设置这些值：

| 键 | 说明 |
|---|---|
| `baseUrl` | WebAPI 基址，如 `http://your-server/K3Cloud` |
| `acctId` | 账套 id |
| `authMode` | `user`（账套用户名/密码）或 `app`（appId/appSecret） |
| `appId` | 应用 id（`app` 模式用） |
| `organization` | 可选的默认组织（org）id / FNumber，用于查询 |
| `serviceEndpoints` | 高级：按你的金蝶版本覆盖 WebAPI 服务名（见下） |

### 高级：覆盖服务端点

WebAPI 服务名（如 `LogOut`、`ListDataCenter`、`UnSubmit`、`DeleteDraft`、`QueryBusinessData`）可能随金蝶版本略有差异。若某工具提示未知服务，请在 `serviceEndpoints` 中覆盖对应项（如 `dynamicFormService`、`listDataCenterService`、`logOutService`、`servicePrefix`）。

## 三、提供密钥

密钥是**引用**（环境变量名），不是字面值。把值放进环境变量或凭据库即可；插件**每次操作都重新解析**，因此轮换后无需重启即可在下一次调用生效。所有系统使用相同的引用名，只是设置环境变量的方式不同。

**Linux / macOS**（`sh`）：

```sh
# user 模式
export DSH_KINGDEE_USER=your_username
export DSH_KINGDEE_PASSWORD=your_password

# app 模式
export DSH_KINGDEE_APP_SECRET=your_app_secret
```

**Windows — PowerShell**（当前会话，然后重启 DSH）：

```powershell
# user 模式
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"

# app 模式
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

**DSH 凭据库**（任意系统；推荐做法，避免 shell 环境变量问题）：

```sh
dsh credentials set DSH_KINGDEE_USER your_username
dsh credentials set DSH_KINGDEE_PASSWORD your_password
dsh credentials set DSH_KINGDEE_APP_SECRET your_app_secret
```

默认引用名为 `DSH_KINGDEE_USER`、`DSH_KINGDEE_PASSWORD`、`DSH_KINGDEE_APP_SECRET`。如需改用其它名称，请调整 `userNameRef` / `passwordRef` / `appSecretRef`。

## 四、验证

让 agent 对已知 FormId 发起查询：

```
在金蝶云星空查询销售订单（SAL_SaleOrder），FBillNo 以 SO-202607 开头。
```

agent 会加载 `kingdee-bos` 技能并调用 `kingdee_query`。成功返回规范化行；失败返回类型化 `kd/*` 错误而非文本。

## 可选：离线 Mock

没有可达账套时，设置 `mock: true`。工具会改用内置 mock 传输，返回固化的金蝶信封（如一张 `SO-MOCK-1` 单据）：

```sh
dsh plugin config set kingdee.mock true
```

或在 `cordis.yml`：

```yaml
config:
  mock: true
```

## 常见问题

- **kingdee/auth-failed** —— 检查 `acctId` / `appId` / `appSecret`，并确认账套已启用 WebAPI。
- **kingdee/network** —— 确认从 DSH host 能访问 `baseUrl`，且 WebAPI 端点有响应。
- **kingdee/business-error** —— 账套拒绝了该调用；请读 `message`（例如缺必填字段，或单据状态不允许该操作）。
