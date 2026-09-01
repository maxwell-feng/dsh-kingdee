# dsh-kingdee

> 面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的金蝶云星空二次开发插件。

`dsh-kingdee` 让 DSH agent 通过金蝶云星空的 **WebAPI** 对账套做一等公民、凭据安全的操作：提供一套类型化工具，用于查询、保存、提交、审核、反审核、查看、删除单据与基础资料，以及调用 BOS 自定义服务。配套的领域技能（`kingdee-bos`）讲解字段/枚举/状态机约定，以及数据层与平台插件层的边界。

- **凭据安全** —— 密钥以环境变量引用存放，经 DSH 凭据缝解析，绝不写在明文配置里。
- **类型化工具** —— `kingdee_query`、`kingdee_save`、`kingdee_submit`、`kingdee_audit`、`kingdee_unaudit`、`kingdee_view`、`kingdee_delete`、`kingdee_invoke`。
- **完整状态机** —— 创建/更新 → 提交 → 审核 → 反审核，开箱即用。
- **离线 Mock** —— 配置 `mock: true` 即切换到本地固化传输，无需可连通账套即可演示与测试。
- **双语文档** —— 英文与简体中文。

> 🧩 **边界说明。** 本插件覆盖金蝶云星空二次开发的**数据/服务层**。**平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）需使用 BOS 集成开发环境，**无法**经 WebAPI 触达。`kingdee-bos` 技能记录了这一边界。

## 安装

```sh
# 把 bundle 加进 DSH profile 并启用
dsh plugin add dsh-kingdee
```

完整配置见 [INSTALL.zh.md](./INSTALL.zh.md)，升级/卸载见 [UPDATE.zh.md](./UPDATE.zh.md) 与 [UNINSTALL.zh.md](./UNINSTALL.zh.md)。版本历史见 [CHANGELOG.md](./CHANGELOG.md)。

## 快速开始

1. 注册插件，在 **Plugins → kingdee** 设置卡片（或 `cordis.yml`）里填连接信息：WebAPI 地址、`acctId`、认证方式。
2. 把密钥放进环境变量（或凭据库），引用指向配置的引用名。所有系统使用相同的引用名，只是设置方式不同：

   ```sh
   # Linux / macOS (sh)
   export DSH_KINGDEE_USER=your_username
   export DSH_KINGDEE_PASSWORD=your_password
   # 若用 app 模式：
   export DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   ```powershell
   # Windows — PowerShell（当前会话）
   $env:DSH_KINGDEE_USER = "your_username"
   $env:DSH_KINGDEE_PASSWORD = "your_password"
   $env:DSH_KINGDEE_APP_SECRET = "your_app_secret"   # app 模式
   ```

   ```bat
   REM Windows — 命令提示符（当前会话）
   set DSH_KINGDEE_USER=your_username
   set DSH_KINGDEE_PASSWORD=your_password
   set DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   或在任意系统上用 DSH 凭据库（推荐）：

   ```sh
   dsh credentials set DSH_KINGDEE_USER your_username
   dsh credentials set DSH_KINGDEE_PASSWORD your_password
   dsh credentials set DSH_KINGDEE_APP_SECRET your_app_secret
   ```

   各系统的详细设置（含持久化 `setx` / `[Environment]::SetEnvironmentVariable`）见 [INSTALL.zh.md](./INSTALL.zh.md)。

3. 让 agent 查询：

   ```
   在金蝶云星空查询销售订单 SO-20260701。
   ```

   agent 会加载 `kingdee-bos` 技能，并以 `formId=SAL_SaleOrder` 调用 `kingdee_query`。

在没有真实账套时，把插件配置设为 `mock: true` —— 工具会返回固化的金蝶信封。

```sh
export DSH_KINGDEE_MOCK=true
```

## 工具

| 工具 | 作用 | 关键入参 |
|---|---|---|
| `kingdee_query` | `ExecuteBillQuery` —— 查单据/基础资料 | `formId`、`fieldKeys[]`、`filter?`、`topCount?`、`organization?` |
| `kingdee_save` | 保存（新增/更新）单据或基础资料 | `formId`、`data`、`interaction?` |
| `kingdee_submit` | 提交一条或多条 | `formId`、`ids[]`、`numbers?` |
| `kingdee_audit` | 审核 | `formId`、`ids[]` |
| `kingdee_unaudit` | 反审核 | `formId`、`ids[]` |
| `kingdee_view` | 按 id 查看单条 | `formId`、`id` |
| `kingdee_delete` | 按 id 删除 | `formId`、`ids[]` |
| `kingdee_invoke` | 调用 BOS 自定义服务 | `serviceName`、`payload?`、`formId?` |

每个工具返回规范化的规范值；金蝶 `IsSuccess=false` 的消息会转成类型化错误（`kd/business-error`、`kd/auth-failed` 等），而不是让模型去解析文本。

## 架构

```
src/
├─ kd-core/          无框架依赖的金蝶 WebAPI 客户端（纯逻辑）
│  ├─ auth.ts        user / app 两种认证
│  ├─ client.ts      八个业务操作 + 会话管理
│  ├─ envelope.ts    信封解析与规范化
│  ├─ errors.ts      类型化错误映射
│  ├─ transport.ts   传输留缝（真实 HTTP 用 fetch）
│  └─ mock.ts        离线 mock 传输
├─ index.ts          DSH host 插件：注册工具 + 设置命名空间
├─ tools.ts          类型化工具包装（defineTool）
├─ config.ts         插件配置 schema + 凭据解析
└─ client/
   └─ settings-card.ts  浏览器设置卡片（脚手架）
skills/
└─ kingdee-bos/      领域技能：字段/枚举/状态机约定 + 边界
```

`kd-core` 以 `dsh-kingdee/kd-core` 发布，**不依赖 DSH**，将来可被薄 MCP server 复用同一份逻辑。

## 构建与测试

无框架核心由单元测试验证，使用 Node 内置测试运行器（Node ≥ 22，TS 类型剥离）运行，核心无需 DSH 安装：

```sh
pnpm test        # node --test "test/**/*.test.ts"
```

DSH host/插件半区（`src/index.ts`、`tools.ts`、`config.ts`、`client/`）引用 `@deepseek-ai/*` peer 包，需**在 DSH profile 内**编译，那里这些 peer 才能解析。因此构建与 typecheck 使用 DSH 工具链：

```sh
pnpm install && pnpm run typecheck   # 需 deepseek-harness 单仓（或 DSH profile）提供 peers
```

## 文档

- [INSTALL.zh.md](./INSTALL.zh.md) —— 安装与配置
- [UPDATE.zh.md](./UPDATE.zh.md) —— 升级
- [UNINSTALL.zh.md](./UNINSTALL.zh.md) —— 卸载
- [CHANGELOG.md](./CHANGELOG.md) —— 版本历史
- [docs/RELEASE.zh.md](./docs/RELEASE.zh.md) —— 当前版本发行说明

## 许可证

本仓库采用**专有许可证**（保留所有权利），仅供**阅读/评估**。未经所有者书面许可，**禁止**在整体或部分上复制、复刻/fork、再托管、再发布、修改或制作衍生作品。详见 [LICENSE](./LICENSE)。
