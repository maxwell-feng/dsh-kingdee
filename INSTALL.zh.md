# 安装说明

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/INSTALL.md) | 中文

> 已在 deepseek-harness **0.2.1-rc.2** 上、以插件 **0.15.0** 验证（`pnpm run typecheck` 零错误、`pnpm run build` 构建干净、**15** 项单元测试通过（`pnpm test`），且宿主自带的兼容性校验在运行时 `0.2.1-rc.2` 上准入 `dsh-kingdee@0.15.0`），并全面适配 **金蝶云·星空 V9.1 企业版**（向下兼容 V9.0 / V8.x）。**未进行真实账套联调验证。** 详细配置项请参阅 [CONFIG.zh.md](./CONFIG.zh.md)。

本指南介绍如何在 DeepSeek Harness（DSH）profile 中安装与配置 **dsh-kingdee**。

## 前置条件

- 已安装 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 并自带 Web GUI（具备 `dsh` CLI，且已具备 `tools`、`credentials`、`settings` 这几个 peer 包）。
- Node ≥ 22（仅核心库/测试需要）。
- 具备一个可访问的、**已启用经典 WebAPI** 的金蝶云·星空实例（**V9.1 企业版**，向下兼容 V9.0 / V8.x），以及有效账套账号。账套需开放经典 `.../K3Cloud` stub 路径；仅提供公有云 OpenAPI 网关（`https://api.kingdee.com/galaxyapi/`）的账套不在支持范围内（见 [README.zh.md](./README.zh.md) 的已知限制）。
- **网络与 SSRF 安全要求**：配置的 `baseUrl` 必须采用 `http:` 或 `https:` 协议。为满足企业级网络安全基线，插件内置了 SSRF 深度防护机制，默认拒绝直接请求 `localhost`、环回地址或未经验证的私网保留网段（如 `127.0.0.0/8`、`10.0.0.0/8`、`192.168.0.0/16`、`172.16.0.0/12` 等）。生产中请配置企业专属解析域名或通过安全反向代理网关接入（如 `https://erp.example.com/K3Cloud`）。

## 1. 添加 bundle

本包以 DSH **bundle**（一个贡献配置层的 npm 包）形式发布。安装到 profile：

```sh
dsh plugin --profile web add dsh-kingdee
```

> **在 DeepSeek Harness 0.2.1-rc.2 上的兼容性。** 0.15.0 声明了自己的 `engines.dsh` 区间 `>=0.1.7-alpha.2 <0.3.0`。自 DeepSeek Harness 0.2.1-alpha.4 起，插件自有的 `engines.dsh` 区间单独决定是否准入，相应的 `@deepseek-ai/dsh` / `@deepseek-ai/dsh-*` peer 在该项校验中被忽略，因此这一条区间就让本插件在 `0.1.7-alpha.2` 至 `0.2.x` 上被准入（在 `0.1.6-alpha.2` 上仍会拒绝）。两种规则都会把预发行版与区间做匹配。该区间与 0.11.0 相比没有任何变化，因此 `0.14.0` 在 0.2.1-rc.2 上同样被准入 —— 本版不是强制升级。此前的 `0.10.0` 声明的是 `^0.1.7-alpha.2`，该区间不含 0.2.x，因此在 0.2.x 上它的行会在加载前被拒绝。请执行 `dsh plugin --profile web add dsh-kingdee@0.15.0`（或 `dsh plugin --profile web update dsh-kingdee`）升级。
>
> **CLI 语法特别提醒**：根据 DeepSeek Harness 0.2.1-alpha.1 起的规范，`--profile <name>` 必须置于被转发的 `add`、`remove`、`update` 等子命令之前；若将 `--profile` 放置在子命令之后，会被当做 pnpm 选项转发并报错。
>
> `dsh plugin allow-version <package@version> --dsh-version <runtime> --accept-risk`（或插件管理器）只会在 profile 的 `compatibility.json` 中记录一条**确切版本豁免**：那是风险确认而非兼容性修复，插件升级与宿主升级都不会继承该授权。

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

## 2. 配置连接

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

> `authMode: "app"` 是在 2022-11-29 之后开通的公有云账套上必须使用的模式（金蝶在该日期后开通的公有云账套上拒绝账号密码登录）。

### 高级：覆盖服务端点

不同金蝶版本的 WebAPI 服务名（如 `LogOut`、`ListDataCenter`、`UnSubmit`、`DeleteDraft`、`QueryBusinessData`）可能存在细微差异。如果工具有报未知服务，请在 `serviceEndpoints` 中配置对应的覆盖项（如 `dynamicFormService`、`listDataCenterService`、`logOutService`、`loginService`、`loginByAppSecretService`、`stubSuffix`）。其中 `listDataCenterService` 的具体名称因版本而异且为社区经验证值 —— 请在金蝶管理中心「公共设置 → 动态服务定义 → WebAPI」中核对。

## 3. 提供密钥

密钥以**引用**（环境变量名）的形式传递，而非明文字符串。请在操作系统环境变量或 DSH 凭据库中配置具体值；插件会在**每次操作执行时**动态解析凭据，因此凭据轮转能够立即在下一次调用中生效，无需重启服务。各操作系统使用相同的引用名，仅设置环境变量的方式不同。

**Linux / macOS**（`sh`）：

```sh
# user 模式
export DSH_KINGDEE_USER=your_username
export DSH_KINGDEE_PASSWORD=your_password

# app 模式（DSH_KINGDEE_USER 在此模式下代表集成用户，且为必填）
export DSH_KINGDEE_USER=your_integration_user
export DSH_KINGDEE_APP_SECRET=your_app_secret
```

**Windows — PowerShell**（当前会话生效）：

```powershell
# user 模式
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"

# app 模式（DSH_KINGDEE_USER 在此模式下代表集成用户，且为必填）
$env:DSH_KINGDEE_USER = "your_integration_user"
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

若要在后续新打开的终端中永久生效，请写入用户级环境变量（PowerShell）：

```powershell
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_USER', 'your_username', 'User')
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_PASSWORD', 'your_password', 'User')
[Environment]::SetEnvironmentVariable('DSH_KINGDEE_APP_SECRET', 'your_app_secret', 'User')
```

**Windows — 命令提示符**（`cmd`）：

```bat
REM 当前会话生效
set DSH_KINGDEE_USER=your_username
set DSH_KINGDEE_PASSWORD=your_password
set DSH_KINGDEE_APP_SECRET=your_app_secret

REM 永久生效（新打开的命令提示符）
setx DSH_KINGDEE_USER your_username
setx DSH_KINGDEE_PASSWORD your_password
setx DSH_KINGDEE_APP_SECRET your_app_secret
```

**DSH 凭据库**（全平台适用，推荐用于生产环境，避免暴露于 shell 环境变量）。凭据库无需通过 CLI 管理：只需在 DSH 网页设置面板中配置一次（凭据字段只写不读，界面仅展示脱敏描述符），亦可直接编辑 `$DSH_HOME/.credentials.yaml` 文件。插件配置中仅保存引用名称，真实密码与密钥绝不进入版本控制或配置文件。

默认引用名称分别为 `DSH_KINGDEE_USER`、`DSH_KINGDEE_PASSWORD` 与 `DSH_KINGDEE_APP_SECRET`。若有自定义需求，可通过 `userNameRef`、`passwordRef`、`appSecretRef` 配置项更改对应名称。`DSH_KINGDEE_USER` 在 `user` 模式下为账套用户名，在 `app` 模式下为**集成用户**（必填）；`DSH_KINGDEE_PASSWORD` 仅在 `user` 模式下使用。

金蝶登录接口返回特定的 `{"LoginResultType": 1}` 结构，而非其他业务操作使用的 `Result`/`IsSuccess` 业务信封格式；插件已对该响应结构做专门分类解析，非 `1` 的返回值会准确识别为 `kd/auth-failed` 认证失败。

## 4. 验证

让 agent 对已知单据类型发起查询测试：

```
查询销售订单（SAL_SaleOrder），单据编号以 SO-202607 开头。
```

agent 会自动加载 `kingdee-bos` 技能并调用 `kingdee_query`。调用成功将返回标准化行数据；调用失败则返回结构化的 `kd/*` 错误类型，而非难以解析的散落文本。

即使未连接真实账套，亦可验证插件安装状态：成功安装的 bundle 会在导出的 profile 配置中呈现为 `# == dsh-kingdee` 覆盖层：

```sh
dsh plugin --profile <name> add dsh-kingdee
dsh --profile <name> --dump-config
```

## 可选：离线 Mock

在无可用金蝶账套的情况下，可配置 `mock: true` 进行演示与自动化测试。此时工具会调用内置的 Mock 传输链路，返回预置的标准金蝶数据信封（例如 `SO-MOCK-1` 单据）。由于图形设置面板为安全起见不暴露非网络连接项，该项需在配置文件中显式启用 —— 在 `cordis.yml` 中：

```yaml
config:
  mock: true
```

或在当前 profile 的 `cordis.patch.yml` 中配置 `kingdee` 条目：

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: true
      config:
        mock: true
```

## 常见问题排查

- **kingdee/auth-failed** —— 请仔细核对 `acctId`、`appId`、`appSecret` 以及集成用户（`userNameRef`），并确认账套已启用 WebAPI。在 2022-11-29 之后开通的金蝶公有云账套上，金蝶官方强制拒绝传统用户名密码登录，此时必须将 `authMode` 切换为 `"app"`。若账套仅能通过公有云网关（`https://api.kingdee.com/galaxyapi/`）访问，则无法使用本插件，因为经典会话在此类接口上无法建立。
- **kingdee/network** —— 请确认宿主服务器网络可直连目标 `baseUrl`，且该 WebAPI 端点响应正常。
- **kingdee/business-error** —— 金蝶账套拒绝了业务请求；请查阅返回的 `message` 字段详细描述（例如缺少必填字段，或者单据当前状态不支持所请求的操作）。
- **查询无结果且不报错** —— 金蝶 V9.1 对外部用户权限进行了严格管控，缺少单据查询权限时常常表现为空数据而非错误。请在排查时对指定 `FormId` 执行最小化探针查询，并务必将 DSH 宿主出口 IP 加入金蝶服务器 WebAPI 限流白名单。
