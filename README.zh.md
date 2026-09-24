# dsh-kingdee

[英文](README.md) | 中文

> 面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的金蝶云星空二次开发插件。

`dsh-kingdee` 让 DSH agent 通过金蝶云星空的 **WebAPI** 对账套做一等公民、凭据安全的操作：提供一套类型化工具，用于查询、保存、提交、审核、反审核、查看、删除单据与基础资料，以及调用 BOS 自定义服务。配套的领域技能（`kingdee-bos`）讲解字段/枚举/状态机约定，以及数据层与平台插件层的边界。

- **凭据安全** —— 密钥以环境变量引用存放，经 DSH 凭据缝解析，绝不写在明文配置里。
- **全面适配金蝶云·星空 V9.1 企业版** —— 深度适配金蝶云·星空 V9.1 企业版（向下兼容 V9.0 / V8.x）：官方 `kdservice-sessionid` 会话同时以请求头与 Cookie 双通道发出；大表防扫表稳定游标分页（`orderString`、`limit`、`startRow`）；单据编号（`numbers`）直接驱动审批/反审/删除/反提交业务流程；保存时自动提审（`isAutoSubmitAndAudit`）。
- **两条真实登录链路** —— 账套用户名/密码走 `AuthService.ValidateUser`；第三方应用走 `AuthService.LoginByAppSecret`（金蝶对 2022-11-29 之后开通的公有云账套要求该模式）。两者建立同一个 `kdservice-sessionid` 会话，不使用任何伪造的认证请求头；登录响应按其自身的 `LoginResultType` 结构单独判定，而非业务信封。
- **SSRF 深度安全基线** —— 纯 TypeScript 实现严格的协议白名单（仅限 `http:` / `https:`）与网络边界拦截，自动屏蔽 `localhost`、环回及私有保留网段请求。
- **类型化工具** —— 通过 `kingdee_*` 工具完成查询、保存、提交、审核、反审核、查看、删除与调用 BOS 自定义服务，具体见下方工具表。
- **完整状态机** —— 创建/更新 → 提交 → 审核 → 反审核，开箱即用。
- **离线 Mock** —— 配置 `mock: true` 即切换到本地固化传输，无需可连通账套即可演示与测试。
- **双语文档** —— 英文与简体中文。

> 🧩 **边界说明。** 本插件覆盖金蝶云星空二次开发的**数据/服务层**。**平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）需使用 BOS 集成开发环境，**无法**经 WebAPI 触达。`kingdee-bos` 技能记录了这一边界。

## 安装

```sh
# 把 bundle 加进 DSH profile 并启用
dsh plugin add dsh-kingdee
```

> 已在 deepseek-harness **0.1.7-rc.2** 上验证：`pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`），且 bundle 补丁在真实 `0.1.7-rc.2` profile 中作为 `# == dsh-kingdee` 层正常生效（`dsh plugin --profile <name> add` → `dsh --profile <name> --dump-config`）。**未进行真实账套联调验证。**

详细配置见 [CONFIG.zh.md](./CONFIG.zh.md)，安装步骤见 [INSTALL.zh.md](./INSTALL.zh.md)，工具说明见 [USAGE.zh.md](./USAGE.zh.md)，升级/卸载见 [UPDATE.zh.md](./UPDATE.zh.md) 与 [UNINSTALL.zh.md](./UNINSTALL.zh.md)。版本历史见 [CHANGELOG.zh.md](./CHANGELOG.zh.md) / [CHANGELOG.md](./CHANGELOG.md)。

## 快速开始

1. 注册插件，在 **Plugins → kingdee** 设置卡片（或 `cordis.yml`）里填连接信息：WebAPI 地址、`acctId`、认证方式。
2. 把密钥放进环境变量（或凭据库），引用指向配置的引用名。所有系统使用相同的引用名，只是设置方式不同：

   ```sh
   # Linux / macOS (sh)
   export DSH_KINGDEE_USER=your_username
   export DSH_KINGDEE_PASSWORD=your_password
   # app 模式：DSH_KINGDEE_USER 存集成用户，且为必填
   export DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   ```powershell
   # Windows — PowerShell（当前会话）
   $env:DSH_KINGDEE_USER = "your_username"
   $env:DSH_KINGDEE_PASSWORD = "your_password"
   $env:DSH_KINGDEE_APP_SECRET = "your_app_secret"   # app 模式（USER 即集成用户）
   ```

   ```bat
   REM Windows — 命令提示符（当前会话）
   set DSH_KINGDEE_USER=your_username
   set DSH_KINGDEE_PASSWORD=your_password
   set DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   或者不用 shell 环境变量，而把值存进 DSH 凭据库：在 DSH 设置界面里填一次即可（凭据值只写不读 —— 页面只能看到脱敏描述符），也可直接编辑 `$DSH_HOME/.credentials.yaml`。插件配置里携带的是引用名，值永远不会进入配置文件。

   各系统的详细设置（含持久化 `setx` / `[Environment]::SetEnvironmentVariable`）见 [INSTALL.zh.md](./INSTALL.zh.md)。

3. 让 agent 查询：

   ```
   在金蝶云星空查询销售订单 SO-20260701。
   ```

   agent 会加载 `kingdee-bos` 技能，并以 `formId=SAL_SaleOrder` 调用 `kingdee_query`。

在没有真实账套时，把插件配置设为 `mock: true` —— 工具会返回固化的金蝶信封。设置卡片会暴露非机密的连接字段，但不含 `mock`，因此该项请在配置中设置：

```yaml
config:
  mock: true
```

完整片段见 [INSTALL.zh.md](./INSTALL.zh.md#可选离线-mock)。

## 工具

| 工具 | 作用 | 关键入参 |
|---|---|---|
| `kingdee_query` | `ExecuteBillQuery` —— 查单据/基础资料 | `formId`、`fieldKeys[]`、`filter?`、`topCount?`、`organization?` |
| `kingdee_query_business_data` | 结构化查询（`QueryBusinessData`） | `formId`、`fieldKeys[]`、`filter?`、`topCount?`、`organization?` |
| `kingdee_save` | 保存（新增/更新）单据或基础资料 | `formId`、`data`、`interaction?` |
| `kingdee_batch_save` | 单次批量保存多条 | `formId`、`records[]`、`interaction?` |
| `kingdee_submit` | 提交一条或多条 | `formId`、`ids[]`、`numbers?` |
| `kingdee_unsubmit` | 反提交 | `formId`、`ids[]` |
| `kingdee_audit` | 审核 | `formId`、`ids[]` |
| `kingdee_unaudit` | 反审核 | `formId`、`ids[]` |
| `kingdee_view` | 按 id 查看单条 | `formId`、`id` |
| `kingdee_delete` | 按 id 删除 | `formId`、`ids[]` |
| `kingdee_delete_draft` | 删除草稿（暂存） | `formId`、`ids[]` |
| `kingdee_invoke` | 调用 BOS 自定义服务 | `serviceName`、`payload?`、`formId?` |
| `kingdee_logout` | 退出当前会话 | — |
| `kingdee_list_datacenters` | 列出该地址可达的数据中心/账套 | — |

表格顺序与 [USAGE.zh.md](./USAGE.zh.md) 的逐工具参考章节顺序一致。

每个工具返回规范化的规范值；金蝶 `IsSuccess=false` 的消息会转成类型化错误（`kd/business-error`、`kd/auth-failed` 等），而不是让模型去解析文本。

## 金蝶 V9.1 符合性

`dsh-kingdee` 面向 **金蝶云·星空 V9.1 企业版**（补丁 PT-163015 → 产品版本 `9.1.0.20250807`），并向下兼容 V9.0 / V8.x。

**V9.1 没有破坏性 WebAPI 变更。** 没有重命名或移除的操作、没有 Cookie 改名、没有 URL 约定变化、也没有新增必填请求头。本插件使用的经典 `{baseUrl}/{stub path}.common.kdsvc` + `kdservice-sessionid` 会话协议保持不变。

V9.1 在接口层真正发生的变化：

- `Delete` 现在返回正确的 `FNumber` —— 自 `9.1.0.20250807` 起 `SuccessEntitys[].Number` 可直接采信。
- 多文件附件（文件服务）字段可仅凭文件 ID 赋值。
- 服务端新增了 WebAPI 请求体日志。
- 在线文档补充了幂等性校验指引。
- WebAPI 限流增加了白名单。
- 报表 Stub / API 自定义接口做了安全加固。
- 外部用户访问控制被收紧。

由此带来的运维影响：

- 由于服务端会记录请求体，请尽可能优先使用 `app`（第三方）模式，而不是账号密码模式。
- 由于权限被收紧，缺少查询权限可能表现为**空结果而不是报错** —— 请针对每个 `FormId` 先跑一次探针查询验证，而不要直接相信空结果集。
- 请把插件所在主机的出口 IP 加入 WebAPI 限流白名单。

**证据诚实性说明。** 登录服务所用的具名请求键（`acctID` / `username` / `appid` / `appsecret` / `lcid`）、`Limit` 行数上限（约 2000）以及 `listDataCenterService` 默认服务名，均为**社区验证结论，并非金蝶官方发布**的契约。每个账套的权威来源是产品本身：以管理员登录 → 公共设置 → 动态服务定义 → WebAPI，选择业务对象与操作，直接查看该操作的参数说明与示例调用。

## 架构

```
src/
├─ kd-core/          无框架依赖的金蝶 WebAPI 客户端（纯逻辑）
│  ├─ auth.ts        user / app 两种认证
│  ├─ client.ts      业务操作集 + 会话管理
│  ├─ envelope.ts    信封解析与规范化
│  ├─ errors.ts      类型化错误映射
│  ├─ transport.ts   传输留缝（真实 HTTP 用 fetch）
│  └─ mock.ts        离线 mock 传输
├─ index.ts          DSH host 插件：注册 kingdee_* 工具 + 导出 Config schema
├─ tools.ts          类型化工具包装（defineTool）
├─ config.ts         插件配置 schema + 凭据解析
└─ client/
   └─ settings-card.ts  浏览器设置卡片（脚手架）
skills/
└─ kingdee-bos/      领域技能：字段/枚举/状态机约定 + 边界
```

`kd-core` 以 `dsh-kingdee/kd-core` 发布，**不依赖 DSH**，将来可被薄 MCP server 复用同一份逻辑。

## 构建与测试

无框架核心由 **15** 项单元测试验证，使用 Node 内置测试运行器（Node ≥ 22，TS 类型剥离）运行，核心无需 DSH 安装：

```sh
pnpm test        # node --test "test/**/*.test.ts"
```

DSH host/插件半区（`src/index.ts`、`tools.ts`、`config.ts`、`client/`）引用 `@deepseek-ai/*` peer 包，需**在 DSH profile 内**编译，那里这些 peer 才能解析。因此构建与 typecheck 使用 DSH 工具链：

```sh
pnpm install && pnpm run typecheck   # 需 deepseek-harness 单仓（或 DSH profile）提供 peers
```

仓库全量使用 TypeScript，没有需要同步维护的 JavaScript 源码。双语文档闸门为 [`scripts/check-docs-language.ts`](./scripts/check-docs-language.ts)，CI 在安装依赖之前用裸 Node 直接运行它（无需任何依赖）：

```sh
node scripts/check-docs-language.ts
```

## 已知限制

- **尚未实现公有云 OpenAPI 网关。** 越来越多的金蝶公有云账套要求走 OpenAPI 网关（`https://api.kingdee.com/galaxyapi/`）并使用 API 签名认证（`LoginByApiSignHeaders`）。本插件**未**实现该链路，只支持经典 `kdsvc` 会话协议。在这类账套上经典会话根本无法建立，因此所有操作都会在登录环节失败；必须使用仍然开放经典 WebAPI 的账套/网关。
- **平台插件层无法触达。** 服务器端 C# 表单/列表插件、界面布局与后台事件属于 BOS 集成开发环境，**无法**经 WebAPI 访问（见上文的边界说明）。
- **`./client` 产物由本包自行复现。** 共享的 `clientBundle` tsdown preset 位于 harness 仓库内部且未发布，因此本包自行输出文档化的 factory 格式。
- **未做真实账套联调。** 本文档的所有内容均以类型检查、单元测试套件与真实 `0.1.7-rc.2` profile 安装为依据，而非在运行中的金蝶账套上验证。

## 文档

- [INSTALL.zh.md](./INSTALL.zh.md) —— 安装与配置
- [CONFIG.zh.md](./CONFIG.zh.md) —— 配置参考：字段、认证模式、凭据与 SSRF 基线
- [USAGE.zh.md](./USAGE.zh.md) —— 工具说明（含入参与示例）
- [UPDATE.zh.md](./UPDATE.zh.md) —— 升级
- [UNINSTALL.zh.md](./UNINSTALL.zh.md) —— 卸载
- [CHANGELOG.zh.md](./CHANGELOG.zh.md) —— 版本历史
- [docs/RELEASE.zh.md](./docs/RELEASE.zh.md) —— 当前版本发行说明

## 许可证

本仓库采用**专有许可证**（保留所有权利），仅供**阅读/评估**。未经所有者书面许可，**禁止**在整体或部分上复制、复刻/fork、再托管、再发布、修改或制作衍生作品。详见 [LICENSE](./LICENSE)。
