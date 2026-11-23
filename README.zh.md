# dsh-kingdee

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/README.md) | 中文

面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的金蝶云·星空二次开发插件。它通过经典金蝶 WebAPI 向 agent 提供一组类型化 `kingdee_*` 工具：查询、保存、提交、审核、反审核、查看、删除，以及调用 BOS 自定义服务。配套技能（`kingdee-bos`）说明字段、枚举与单据状态约定。

- 插件版本：0.22.0。DSH 基线：0.2.3-alpha.2（2026-11-22 发布）。
- 目标版本：金蝶云·星空 V9.1 企业版（补丁 PT-163015 → 9.1.0.20250807），向下兼容 V9.0 / V8.x。仅支持经典 WebAPI，不支持 OpenAPI 网关。
- 凭据以环境变量引用保存，经 DSH 凭据缝解析，不写入明文配置。
- `user` 模式使用 `AuthService.ValidateUser`；`app` 模式使用 `AuthService.LoginByAppSecret`，需要 `appId`、`appSecretRef` 与 `userNameRef`（集成用户）。
- URL 主机过滤器仅允许 `http:` / `https:`，并拦截字面量形式的 localhost、环回、RFC1918 私网、链路本地、CGNAT、IPv6 唯一本地地址以及组播/保留地址。它不解析 DNS，因此解析到私网地址的公网域名不会被拦截；请使用可信的企业域名并配合出口网络管控。

## 安装

```sh
# 把 bundle 加进 DSH profile 并启用
dsh plugin --profile web add dsh-kingdee
```

`--profile <name>` 必须放在 `add`、`remove`、`update` 之前。把 `--profile` 放到子命令之后，它会被转发给 pnpm 并导致失败。

本包声明 `engines.dsh` `>=0.1.7-alpha.2 <0.3.0`。DSH 0.2.3 要求 Node.js 24.22.3 或更高的 24.x 版本，或 Node.js 26.13.1 或更高版本；本包声明同样的 `engines.node` 门槛。

## 快速开始

1. 在 DSH 中打开 **插件 → kingdee**，填写 WebAPI 基址、`acctId` 与 `authMode`。同样的字段也可以在 `cordis.yml` 中设置，详见 [CONFIG.zh.md](./CONFIG.zh.md)。
2. 按配置的引用名，把密钥放进环境变量或凭据库：

   ```sh
   # Linux / macOS (sh)
   export DSH_KINGDEE_USER=your_username
   export DSH_KINGDEE_PASSWORD=your_password
   # app 模式：DSH_KINGDEE_USER 存集成用户
   export DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   ```powershell
   # Windows — PowerShell（当前会话）
   $env:DSH_KINGDEE_USER = "your_username"
   $env:DSH_KINGDEE_PASSWORD = "your_password"
   $env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
   ```

   ```bat
   REM Windows — 命令提示符（当前会话）
   set DSH_KINGDEE_USER=your_username
   set DSH_KINGDEE_PASSWORD=your_password
   set DSH_KINGDEE_APP_SECRET=your_app_secret
   ```

   如果改用 DSH 凭据库，请在 `$DSH_HOME/.credentials.yaml` 的 `refs:` 下写入对应值（例如 `DSH_KINGDEE_USER: your_username`）。配置中只保存引用名。

3. 让 agent 查询：

   ```
   在金蝶云·星空查询销售订单 SO-20260701。
   ```

   若已安装配套的 `kingdee-bos` 技能（见[配套技能](#配套技能)），agent 可加载它，并以 `formId=SAL_SaleOrder` 调用 `kingdee_query`。

在没有真实账套时，可在插件配置中设置 `mock: true` 做演示。设置卡片不暴露 `mock`。

```yaml
config:
  mock: true
```

## 配套技能

本包随附 `skills/kingdee-bos/SKILL.md`，但插件不会自动注册它。若要让它进入会话技能目录，请把 `skills/kingdee-bos` 目录复制到 `$DSH_HOME/skills/kingdee-bos`，或把包内的 `skills` 目录加入 `@deepseek-ai/dsh-skill-filesystem` 的 `customSkillDirs`。未执行该步骤时工具仍可使用，只是会话目录中缺少字段、枚举与状态机指导。

## 工具

| 工具 | 作用 | 关键入参 |
|---|---|---|
| `kingdee_query` | `ExecuteBillQuery` —— 查询单据/基础资料 | `formId`、`fieldKeys[]`、`filter?`、`orderString?`、`topCount?`、`limit?`、`startRow?`、`organization?` |
| `kingdee_query_business_data` | 结构化查询（`QueryBusinessData`） | `formId`、`fieldKeys[]`、`filter?`、`orderString?`、`topCount?`、`limit?`、`startRow?`、`organization?` |
| `kingdee_save` | 保存（新增/更新）单据或基础资料 | `formId`、`data`、`interaction?`、`isAutoSubmitAndAudit?` |
| `kingdee_batch_save` | 单次批量保存多条 | `formId`、`records[]`、`interaction?`、`isAutoSubmitAndAudit?` |
| `kingdee_submit` | 提交一条或多条 | `formId`、`ids[]` / `numbers[]` |
| `kingdee_unsubmit` | 反提交 | `formId`、`ids[]` / `numbers[]` |
| `kingdee_audit` | 审核 | `formId`、`ids[]` / `numbers[]` |
| `kingdee_unaudit` | 反审核 | `formId`、`ids[]` / `numbers[]` |
| `kingdee_view` | 按 id 或单据编号查看单条 | `formId`、`id` / `number` |
| `kingdee_delete` | 删除单据 | `formId`、`ids[]` / `numbers[]` |
| `kingdee_delete_draft` | 删除草稿 | `formId`、`ids[]` / `numbers[]` |
| `kingdee_invoke` | 调用 BOS 自定义服务 | `serviceName`、`payload?`、`formId?` |
| `kingdee_logout` | 退出当前会话 | — |
| `kingdee_list_datacenters` | 列出该地址可达的数据中心/账套 | — |

表格顺序与 [USAGE.zh.md](./USAGE.zh.md) 的逐工具章节顺序一致。

每个工具返回统一格式的规范化结果。金蝶 `IsSuccess=false` 的消息会转成 `kd/business-error`（登录被拒为 `kd/auth-failed`）；客户端侧失败使用 `kd/invalid-config`、`kd/network`、`kd/timeout` 或 `kd/unknown`，而不是一段自然语言文本。

## 金蝶 V9.1

`dsh-kingdee` 面向金蝶云·星空 V9.1 企业版（补丁 PT-163015 → `9.1.0.20250807`），并向下兼容 V9.0 / V8.x。V9.1 没有破坏性 WebAPI 变更：没有重命名或移除的操作，没有 Cookie 改名，没有 URL 约定变化，也没有新增必填请求头。

实际使用中需要注意的接口变化：

- `Delete` 返回正确的 `FNumber`；自 `9.1.0.20250807` 起可直接信任 `SuccessEntitys[].Number`。
- 多文件附件字段可以只凭文件 ID 赋值。
- 服务端会记录 WebAPI 请求体。条件允许时优先用 `app` 模式，而不是账号密码模式。
- 权限被收紧，缺少查询权限可能表现为空结果而不是报错。请先针对每个 `FormId` 跑一次探针查询，再相信空结果。
- 请把插件所在主机的出口 IP 加入 WebAPI 限流白名单。

登录请求键（`acctID`、`username`、`appid`、`appsecret`、`lcid`）、`Limit` 行数上限（约 2000）以及 `listDataCenterService` 默认服务名均为社区经验值，并非金蝶官方公布。请在具体账套的「公共设置 → 动态服务定义 → WebAPI」中核对。

## 构建与测试

```sh
pnpm install && pnpm run typecheck
pnpm run build
pnpm test        # 15 项测试，Node 内置测试运行器
node scripts/check-docs-language.ts
```

`pnpm test` 通过 15 项测试，`pnpm typecheck` 无错误，`pnpm build` 在 DSH 0.2.3-alpha.2 上构建干净。未做真实 profile 启动验证，也未做真实金蝶账套联调验证。

## 已知限制

- **未实现 OpenAPI 网关。** 插件只支持经典 `kdsvc` 会话协议。仅开放 OpenAPI 网关（`https://api.kingdee.com/galaxyapi/`）的账套无法使用：所有需要登录的操作都会在登录环节失败（`kingdee_list_datacenters` 不登录，但 OpenAPI-only 账套同样不提供经典服务）。
- **平台插件层无法触达。** 服务器端 C# 表单/列表插件、界面布局与后台事件属于 BOS 集成开发环境，无法经 WebAPI 访问。
- **未做真实账套联调。** 行为由类型检查、构建与单元测试覆盖，而不是在运行中的金蝶账套上验证。

## 文档

- [INSTALL.zh.md](./INSTALL.zh.md) —— 安装与首次连接
- [CONFIG.zh.md](./CONFIG.zh.md) —— 配置字段、认证模式、凭据与主机过滤
- [USAGE.zh.md](./USAGE.zh.md) —— 工具说明
- [UPDATE.zh.md](./UPDATE.zh.md) —— 升级
- [UNINSTALL.zh.md](./UNINSTALL.zh.md) —— 卸载
- [CHANGELOG.zh.md](./CHANGELOG.zh.md) —— 版本历史
- [docs/RELEASE.zh.md](./docs/RELEASE.zh.md) —— 当前版本发行说明

## 许可证

MIT —— 见 [LICENSE](./LICENSE)。
