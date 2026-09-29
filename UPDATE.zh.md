# 更新说明

[英文](UPDATE.md) | 中文

> 已在 deepseek-harness **0.2.0-rc.2** 上、以插件 **0.12.0** 验证（`pnpm run typecheck` 零错误、`pnpm run build` 构建干净、**15** 项单元测试通过（`pnpm test`），且宿主自带的兼容性校验在运行时 `0.2.0-rc.2` 上准入 `dsh-kingdee@0.12.0`），并全面适配 **金蝶云·星空 V9.1 企业版**（向下兼容 V9.0 / V8.x）。**未进行真实账套联调验证。**

如何将 **dsh-kingdee** 升级到更新版本。

## 升级前

1. **查看 [CHANGELOG.md](./CHANGELOG.md) 或 [CHANGELOG.zh.md](./CHANGELOG.zh.md)** 中目标版本的条目。最大的风险是**破坏性变更**，每个版本的发行说明都会明确标注。
2. **备份你的配置。** 连接设置（`baseUrl`、`acctId`、`authMode` 等）存放在 profile 的 `cordis.yml` 或设置文档中；密钥在环境变量/凭据库里，不由本插件备份。

## 升级步骤

```sh
# 1. 把已安装的 bundle 更新到新版本
dsh plugin update dsh-kingdee

# 2. （建议）若从源码构建 host 半区，请重新安装/构建
pnpm install && pnpm run build
```

3. **重启 DSH host** 以加载新版本插件：停止并重新启动 DSH 进程（重新启动 `dsh` 应用 / 你的 DSH host）—— 没有 restart 子命令。

## 升级后

- **0.12.0 完成与 DeepSeek Harness 0.2.0-rc.2 的对齐 —— 且本版并非强制升级。** 不改运行时逻辑、不改配置、不改工具接口：插件行为与 0.11.1 完全一致。`@deepseek-ai/dsh-*` 的全部开发依赖由 `0.2.0-rc.1` 升至 `0.2.0-rc.2`，锁文件按 `0.2.0-rc.2` 重新生成，工作区的供应链豁免清单也刷新为 `0.2.0-rc.2` 的包集合。`@deepseek-ai/dsh-credentials` 与 `@deepseek-ai/dsh-tools` 的 peer 区间**保持不变**，仍为 `>=0.1.7-alpha.2 <0.3.0`，因此 `0.11.1` 在 0.2.0-rc.2 上同样被准入，没有任何因素强制本次升级。0.12.0 已针对 0.2.0-rc.2 完成验证（类型检查零错误、构建干净、15 项单元测试通过），并在 `0.2.0-rc.2`、`0.2.0-rc.1`、`0.2.0`、`0.1.7-rc.2`、`0.1.7-alpha.2` 上均被准入，在 `0.1.6-alpha.2` 上仍被拒绝；更早的 `0.10.0`（`^0.1.7-alpha.2`）在 **0.2.0-rc.2 上仍被拒绝**。升级请执行 `dsh plugin add dsh-kingdee@0.12.0`（或 `dsh plugin update dsh-kingdee`）。
- **0.11.1 只修正文档，不改代码、清单或行为。** 包内容与 0.11.0 完全一致——相同的源码、相同的 peer、相同的配置——因此从 0.11.0 升级无需任何操作。本版关闭了一轮完整双语校对发现的五处文档缺陷：英文 0.7.0 更新日志条目漏了第三方 `LoginByAppSecret` 登录、`app` 模式取消 `KDAuthentication` 并新增 `userNameRef` 必填这两项，以及导致真实账套认证失败的登录响应修复；中文 0.6.1 条目有一个与英文分类不一致的标题和一条没有对应内容的空泛条目；配置指南中同一示例使用了两个不同的占位域名；中文配置指南把凭据缝契约写成散文而英文用两条列表；中文安装指南漏掉了被拦截私网中的 `172.16.0.0/12` 网段。
- **0.11.0 完成与 DeepSeek Harness 0.2.0-rc.1 的适配 —— 而 0.10.0 在该版本上会被拒绝。** 不改运行时逻辑、不改配置、不改工具接口：清单改动仅限版本号、`@deepseek-ai/dsh-*` peer 区间、锁定的开发依赖与工作区的供应链豁免。`@deepseek-ai/dsh-credentials` 与 `@deepseek-ai/dsh-tools` 的 peer 区间由 `^0.1.7-alpha.2` 改为 `>=0.1.7-alpha.2 <0.3.0`，且每个 `@deepseek-ai/dsh-*` 开发依赖都锁定至 `0.2.0-rc.1`（`@deepseek-ai/cordis` 保持 `^4.0.4`、`@deepseek-ai/schemastery` 保持 `^3.18.4`）。DeepSeek Harness 0.2.0-rc.1 引入了**硬性 peer 兼容性闸门**：在插件行加载之前，宿主会用唯一的运行时版本校验每一处名为 `@deepseek-ai/dsh` / `@deepseek-ai/dsh-*` 的 peer 依赖，预发行版参与区间匹配；不兼容的行会被拒绝（不兼容的 bundle 会被跳过）。闸门读取的**不是** `engines.dsh`，因此 0.10.0 声明的 `^0.1.7-alpha.2`（不含 0.2.x）使该版本在 **0.2.0-rc.1 上被直接拒绝**。在 0.2.0-rc.1 上请执行 `dsh plugin add dsh-kingdee@0.11.0`（或 `dsh plugin update dsh-kingdee`）升级。0.11.0 在 `0.1.7-alpha.2` 至 `0.2.x` 上均被准入，但在 `0.1.6-alpha.2` 上仍会被拒绝。`dsh plugin allow-version <package@version> --dsh-version <runtime> --accept-risk`（或插件管理器）只会在 profile 的 `compatibility.json` 中记录一条**确切版本豁免**：那是风险确认而非兼容性修复，插件升级与宿主升级都不会继承该授权。
- **0.10.0 完成与 DeepSeek Harness 0.1.7-rc.2 的对齐**：不改运行时逻辑、不改配置、不改工具接口，行为与 0.9.1 完全一致。开发依赖锁定至 `0.1.7-rc.2`；`@deepseek-ai/dsh-*` peer 区间保持 `^0.1.7-alpha.2`，因此插件在 `0.1.7-alpha.2` 至 `0.1.7-rc.2` 的每一个 `0.1.7` 预发行版上均可安装。本插件消费的全部接缝在 `0.1.7-rc.1` 与 `0.1.7-rc.2` 之间源码完全一致，故源码未作改动，配置字段也没有任何迁移。无需任何额外操作。
- **0.9.1 为文档与仓库工程化修补版本**：不改运行时逻辑、不改配置、不改工具接口，行为与 0.9.0 完全一致。仓库现只保留 TypeScript 源码：双语文档闸门由 `scripts/check-docs-language.mjs` 迁至 `scripts/check-docs-language.ts`，Node ≥22.19 直接剥离类型运行（依旧无需安装依赖，依旧在 CI 安装依赖之前执行），且 `tsconfig.json` 的 include 新增 `scripts/**/*.ts`。本版还修正了 README 工具表顺序、配置文档中重复的章节编号，并恢复了丢失正文的更新日志条目。无需任何额外操作。
- **0.9.0 将宿主基线抬升至 DeepSeek Harness 0.1.7**：插件现要求 `0.1.7-alpha.2` 或更新，并已在 `0.1.7-rc.1` 上验证；开发依赖锁定至 `0.1.7-rc.1`，`engines.dsh` 为 `^0.1.7-alpha.2`。配置迁移到 0.1.7 的**易变 schema**：十二个字段的名称、取值与默认值全部不变，但 `apply` 现在逐字段读取活引用，并在每次操作开始时一次性捕获，因此保存的修改与轮换后的凭据都无需重启即可对下一次操作生效。插件不再注册设置节（`ctx.settings.installSection` 已移除）——Host 自行读取导出的 `Config` schema 并以 profile 行 id `kingdee` 为键渲染该条目表单。**在 `0.1.6` 宿主上插件会在加载阶段被拒绝**：DSH 0.1.7-rc.1 会在加载插件行之前用运行时版本校验其 `@deepseek-ai/dsh*` peer 依赖，请先升级宿主，或按 DSH 打印的提示执行 `dsh plugin allow-version dsh-kingdee@0.9.0 <你的 dsh 版本>` 授予确切版本豁免。**配置无破坏性变更**——`cordis.yml` 与 `cordis.patch.yml` 原样继续可用。
- **0.8.0 适配 DeepSeek Harness 0.1.6-alpha.2 客户端 UI 规范**：DSH 0.1.6-alpha.2 废弃了旧的 `settings.plugin.item` 插槽，改由独立的插件管理页面（`ui-plugin-manager`）承载。客户端配置卡片现注册到 `plugins.row.config`（`dsh-kingdee#kingdee`）与 `plugins.bundle.config`（`dsh-kingdee`），支持紧凑摘要与完整配置双视图。
- **0.7.0 重写了认证与 stub URL，请优先核对这几项**：`app` 模式现执行真实的 `AuthService.LoginByAppSecret` 登录，除 `appId` / `appSecret` 外**还要求 `userNameRef`**（集成用户），且不再伪造 `KDAuthentication` 请求头；所有 stub URL 统一以 `.common.kdsvc` 结尾，登录/登出 stub 位于 `AuthService.*`（`ValidateUser` / `LoginByAppSecret` / `LogOut`）；`serviceEndpoints.servicePrefix` 已移除，改用 `loginByAppSecretService` + `stubSuffix`；`kingdee_invoke` 的 `serviceName` 现取 `{namespace}.{class}.{method},{assembly}` 形式的自定义 stub 路径（如 `GetCust.GetCust.ExecuteService,GetCust`），该段直接替换 dynamic-form URL 段。本版本还修复了认证本身：登录服务返回的是它自身的 `{"LoginResultType": 1}` 结构，旧版本会误判为失败的业务信封。
- **体验金蝶云·星空 V9.1 新特性**：查询工具 `kingdee_query` 与 `kingdee_query_business_data` 支持 `orderString`、`limit`、`startRow` 进行稳定游标分页；`kingdee_audit`、`kingdee_unaudit`、`kingdee_delete`、`kingdee_unsubmit` 与 `kingdee_delete_draft` 等工具支持直接传入 `numbers`（例如 `SO-20260901`），无需再手工解析替代 id；自产品版本 `9.1.0.20250807` 起，`Delete` 返回的 `Number` 也可直接采信。
- **复查 V9.1 权限与限流**：V9.1 收紧了外部用户访问控制，缺少查询权限可能表现为**空结果而不是报错** —— 请针对每个 `FormId` 先跑探针查询，而不要直接相信空结果集。服务端已开始记录 WebAPI 请求体，请尽可能优先使用 `app` 模式而非账号密码模式，并把主机出口 IP 加入 WebAPI 限流白名单。
- **SSRF 安全防护与 Host 配置检查**：若您此前在配置文件中直接使用裸内网 IP（如 `192.168.x.x`、`10.x.x.x` 或 `localhost`），请将 `baseUrl` 更新为企业标准域名（如 `https://erp.example.com/K3Cloud`）。为符合企业安全审计要求，插件已默认拦截直接针对未授权内网私有网段与环回地址的请求。
- **复查设置卡片。** 新版本可能新增字段（如新增的 `lcid`，默认 `2052`；或 `app` 模式对 `userNameRef` 的新要求）。确认显示值与你的预期一致。
- **重新验证一次查询。** 用 `kingdee_query` 对已知 FormId 发起查询，确认连接与认证仍正常。
- **密钥。** 密钥每次操作重新解析，因此无需处理，除非引用名变了——若变了，请在设置里更新 `userNameRef` / `passwordRef` / `appSecretRef`。`app` 模式下 `userNameRef` 现同样必填（它指向集成用户）。

## 破坏性变更长什么样

- 工具名或某个必填参数发生变化（如某工具被改名）。
- 某个凭据引用名发生变化。
- 配置结构变化（某个键被改名或删除）。

这些都会在对应 [CHANGELOG.md](./CHANGELOG.md) 或 [CHANGELOG.zh.md](./CHANGELOG.zh.md) 的条目中明确标注为破坏性变更。

## 回滚

`dsh plugin update` 会记录版本；像安装那样回滚到之前的版本即可：

```sh
dsh plugin add dsh-kingdee@<上一版本>
```

然后重启并重新验证。
