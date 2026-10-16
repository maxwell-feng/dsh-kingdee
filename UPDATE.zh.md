# 更新指南

[英文](UPDATE.md) | 中文

> 已在 deepseek-harness **0.2.1-alpha.4** 上、以插件 **0.14.0** 验证（`pnpm run typecheck` 零错误、`pnpm run build` 构建干净、**15** 项单元测试通过（`pnpm test`），且宿主自带的兼容性校验在运行时 `0.2.1-alpha.2` 上准入 `dsh-kingdee@0.14.0`），并全面适配 **金蝶云·星空 V9.1 企业版**（向下兼容 V9.0 / V8.x）。**未进行真实账套联调验证。**

如何将 **dsh-kingdee** 升级到更新版本。

## 升级前

1. **查看 [CHANGELOG.zh.md](./CHANGELOG.zh.md) 或 [CHANGELOG.md](./CHANGELOG.md)** 中目标版本的条目。最大的风险是**破坏性变更**，每个版本的发行说明都会明确标注。
2. **备份你的配置。** 连接设置（`baseUrl`、`acctId`、`authMode` 等）存放在 profile 的 `cordis.yml` 或设置文档中；密钥在环境变量或凭据库里，不由本插件备份。

## 升级步骤

```sh
# 1. 把已安装的 bundle 更新到新版本（注意：--profile 参数需位于命令前）
dsh plugin --profile web update dsh-kingdee

# 或者指定确切版本安装升级
dsh plugin --profile web add dsh-kingdee@0.14.0

# 2.（建议）若从源码构建 host 半区，请重新安装与构建
pnpm install && pnpm run build
```

3. **重启 DSH host** 以加载新版本插件：停止并重新启动 DSH 进程（重新启动 `dsh` 应用或你的 DSH host）—— 没有 restart 子命令。

## 升级后

- **0.14.0 完成与 DeepSeek Harness 0.2.1-alpha.4 的对齐，并修正许可证声明 —— 且本版并非强制升级。** 不改运行时逻辑、不改配置、不改工具接口：插件行为与 0.13.0 完全一致。`@deepseek-ai/dsh-*` 的全部开发依赖由 `0.2.1-alpha.2` 升至 `0.2.1-alpha.4`，锁文件按 `0.2.1-alpha.4` 重新生成，工作区的供应链豁免清单也刷新为 `0.2.1-alpha.4` 的包集合。`@deepseek-ai/dsh-credentials` 与 `@deepseek-ai/dsh-tools` 的 peer 区间**保持不变**，仍为 `>=0.1.7-alpha.2 <0.3.0`，因此 `0.13.0` 在 0.2.1-alpha.4 上同样被准入，没有任何因素强制本次升级。0.2.1-alpha.3 与 0.2.1-alpha.4 两个版本均未改动本插件所使用的任何服务缝。本版还修复了一处文档缺陷：两个语种的 README 都把仓库描述为采用专有许可，而 `LICENSE` 与 `package.json.license` 自 `0.5.0` 起一直是 MIT，且此前没有任何更新日志条目记录过这次回退。升级请执行 `dsh plugin --profile web add dsh-kingdee@0.14.0`（或 `dsh plugin --profile web update dsh-kingdee`）。
- **0.13.0 适配 DeepSeek Harness 0.2.1-alpha.2 并支持展示元数据规范。** 全部 `@deepseek-ai/dsh-*` 开发依赖更新至 `0.2.1-alpha.2`。本版本封装了原生 `icon.svg` 矢量图标与中英双语展示资源（`locale/en.json`、`locale/zh.json`），完全符合 DSH 0.2.1-alpha.2 插件管理器展示规范。配置了自包含 `prepare` 脚本以支持直接从源码或 Git 仓库安装。peer 依赖区间继续保持 `>=0.1.7-alpha.2 <0.3.0`，因此 `0.12.0` 与 `0.11.1` 在 0.2.1-alpha.2 上同样受支持，本版本非强制升级。
- **0.12.0 完成与 DeepSeek Harness 0.2.0-rc.2 的对齐 —— 且本版并非强制升级。** 不改运行时逻辑、不改配置、不改工具接口：插件行为与 0.11.1 完全一致。`@deepseek-ai/dsh-*` 的全部开发依赖由 `0.2.0-rc.1` 升至 `0.2.0-rc.2`，锁文件按 `0.2.0-rc.2` 重新生成，工作区的供应链豁免清单也刷新为 `0.2.0-rc.2` 的包集合。`@deepseek-ai/dsh-credentials` 与 `@deepseek-ai/dsh-tools` 的 peer 区间**保持不变**，仍为 `>=0.1.7-alpha.2 <0.3.0`，因此 `0.11.1` 在 0.2.0-rc.2 上同样被准入，没有任何因素强制本次升级。0.12.0 已针对 0.2.0-rc.2 完成验证（类型检查零错误、构建干净、15 项单元测试通过），并在 `0.2.0-rc.2`、`0.2.0-rc.1`、`0.2.0`、`0.1.7-rc.2`、`0.1.7-alpha.2` 上均被准入，在 `0.1.6-alpha.2` 上仍被拒绝；更早的 `0.10.0`（`^0.1.7-alpha.2`）在 **0.2.0-rc.2 上仍被拒绝**。升级请执行 `dsh plugin --profile web add dsh-kingdee@0.12.0`（或 `dsh plugin --profile web update dsh-kingdee`）。
- **0.11.1 只修正文档，不改代码、清单或行为。** 包内容与 0.11.0 完全一致——相同的源码、相同的 peer、相同的配置——因此从 0.11.0 升级无需任何操作。本版关闭了一轮完整双语校对发现的五处文档缺陷：英文 0.7.0 更新日志条目漏了第三方 `LoginByAppSecret` 登录、`app` 模式取消 `KDAuthentication` 并新增 `userNameRef` 必填这两项，以及导致真实账套认证失败的登录响应修复；中文 0.6.1 条目有一个与英文分类不一致的标题和一条没有对应内容的空泛条目；配置指南中同一示例使用了两个不同的占位域名；中文配置指南把凭据缝契约写成散文而英文用两条列表；中文安装指南漏掉了被拦截私网中的 `172.16.0.0/12` 网段。
- **0.11.0 完成与 DeepSeek Harness 0.2.0-rc.1 的适配 —— 而 0.10.0 在该版本上会被拒绝。** 不改运行时逻辑、不改配置、不改工具接口：清单改动仅限版本号、`@deepseek-ai/dsh-*` peer 区间、锁定的开发依赖与工作区的供应链豁免。`@deepseek-ai/dsh-credentials` 与 `@deepseek-ai/dsh-tools` 的 peer 区间由 `^0.1.7-alpha.2` 改为 `>=0.1.7-alpha.2 <0.3.0`，且每个 `@deepseek-ai/dsh-*` 开发依赖都锁定至 `0.2.0-rc.1`（`@deepseek-ai/cordis` 保持 `^4.0.4`、`@deepseek-ai/schemastery` 保持 `^3.18.4`）。DeepSeek Harness 0.2.0-rc.1 引入了**硬性 peer 兼容性闸门**：在插件行加载之前，宿主会用唯一的运行时版本校验每一处名为 `@deepseek-ai/dsh` / `@deepseek-ai/dsh-*` 的 peer 依赖，预发行版参与区间匹配；不兼容的行会被拒绝（不兼容的 bundle 会被跳过）。闸门读取的**不是** `engines.dsh`，因此 0.10.0 声明的 `^0.1.7-alpha.2`（不含 0.2.x）使该版本在 **0.2.0-rc.1 上被直接拒绝**。在 0.2.0-rc.1 上请执行 `dsh plugin --profile web add dsh-kingdee@0.11.0`（或 `dsh plugin --profile web update dsh-kingdee`）升级。0.11.0 在 `0.1.7-alpha.2` 至 `0.2.x` 上均被准入，但在 `0.1.6-alpha.2` 上仍会被拒绝。`dsh plugin allow-version <package@version> --dsh-version <runtime> --accept-risk`（或插件管理器）只会在 profile 的 `compatibility.json` 中记录一条**确切版本豁免**：那是风险确认而非兼容性修复，插件升级与宿主升级都不会继承该授权。
- **0.10.0 适配 DeepSeek Harness 0.1.7-rc.2。** 无运行时代码、配置或工具接口变更 —— 插件行为与 0.9.1 完全一致。`devDependencies` 固定至 `0.1.7-rc.2`；`@deepseek-ai/dsh-*` peer 区间保持 `^0.1.7-alpha.2`，因此插件仍可在 `0.1.7-alpha.2` 至 `0.1.7-rc.2` 的所有 0.1.7 预发行版上安装。本插件使用的所有服务缝在 `0.1.7-rc.1` 与 `0.1.7-rc.2` 间源码完全一致，因此无源码改动、无配置项变动。无需任何额外操作。
- **0.9.1 纯文档与仓库工具链发布。** 无运行时代码、配置或工具接口变更 —— 插件行为与 0.9.0 完全一致。仓库现在全部使用 TypeScript 源码：双语文档检查门禁已从 `scripts/check-docs-language.mjs` 迁移至 `scripts/check-docs-language.ts`，Node ≥22.19 可直接剥离类型运行（依然无需安装任何依赖，依然在 CI 安装步骤前执行），`scripts/**/*.ts` 也已加入 `tsconfig.json` 的 include 列表。本次发布还修复了自述文件中的工具表格顺序、配置指南中重复的章节编号，并补全了此前遗失文字的更新日志条目。无需任何额外操作。
- **0.9.0 提升宿主版本底线至 DeepSeek Harness 0.1.7。** 插件要求 `0.1.7-alpha.2` 或更高版本，并在 `0.1.7-rc.1` 上完成验证；`devDependencies` 固定至 `0.1.7-rc.1`，`engines.dsh` 为 `^0.1.7-alpha.2`。配置迁移至 0.1.7 **易失配置架构**：相同的 12 个字段、相同的名称、数值与默认值，但 `apply` 现在为每个字段读取一个活引用，并在每次操作开始时捕获一次，因此保存的配置修改与轮转的密钥无需重启即可在下一次操作中生效。插件不再注册设置区块（`ctx.settings.installSection` 已移除）——宿主自行读取导出的 `Config` schema，并按 profile 行标识符 `kingdee` 渲染对应表单。**在 `0.1.6` 宿主上插件会在加载时被拒绝**：DeepSeek Harness 0.1.7-rc.1 会在准入插件行前校验其声明的 `@deepseek-ai/dsh*` peer 与运行中宿主版本的兼容性，因此请先升级宿主，或使用 `dsh plugin allow-version dsh-kingdee@0.9.0 <your-dsh-version>` 授予确切版本豁免。**无破坏性配置变更** —— `cordis.yml` 与 `cordis.patch.yml` 保持原样工作。
- **0.8.0 适配 DeepSeek Harness 0.1.6-alpha.2 客户端界面。** DSH 0.1.6-alpha.2 废弃了 `settings.plugin.item` 并引入插件管理页面（`ui-plugin-manager`）。客户端配置卡片现已挂载至 `plugins.row.config`（`dsh-kingdee#kingdee`）与 `plugins.bundle.config`（`dsh-kingdee`），同时提供简明摘要与完整交互式配置视图。
- **0.7.0 重构认证与服务端点路径 —— 请优先核对。** `app` 模式现已走真实的 `AuthService.LoginByAppSecret` 登录流程，并且除 `appId` / `appSecret` 外**必须提供 `userNameRef`**（集成用户）；不再发送伪造的 `KDAuthentication` 请求头。所有服务路径现均以 `.common.kdsvc` 结尾，登录/登出服务位于 `AuthService.*`（`ValidateUser` / `LoginByAppSecret` / `LogOut`）。移除了 `serviceEndpoints.servicePrefix` —— 改用 `loginByAppSecretService` + `stubSuffix`。`kingdee_invoke` 的 `serviceName` 现接收自定义路径 `{命名空间}.{类名}.{方法名},{程序集}`（例如 `GetCust.GetCust.ExecuteService,GetCust`），该路径会替换动态表单的对应路径段。本次发布还修复了认证判定本身：登录服务返回其自有的 `{"LoginResultType": 1}` 结构，早期版本曾将其误判为失败的业务信封。
- **充分利用星空 V9.1 特性。** `kingdee_query` 与 `kingdee_query_business_data` 工具支持传入 `orderString`、`limit` 与 `startRow` 实现稳定分页。审核、反审、删除、反提交与暂存删除等工具现已支持直接传入单据编号数组 `numbers`（例如 `SO-20260901`），省去了查询内码的繁琐步骤。自产品版本 `9.1.0.20250807` 起，删除操作也会在成功实体中返回正确的编号。
- **重新核对 V9.1 权限与限流策略。** V9.1 收紧了外部用户权限，缺少查询权限可能表现为**返回空数据而不是报错** —— 请针对各业务对象先跑探针查询，而不要盲目采信空行集合。由于服务端新增了请求体日志记录，条件允许时请优先使用 `app` 模式，并务必将宿主出口 IP 加入限流白名单。
- **网络与安全基线检查。** 若此前配置使用了私网裸 IP（如 `192.168.x.x`、`10.x.x.x` 或 `localhost`），请将 `baseUrl` 更新为企业授权域名（例如 `https://erp.example.com/K3Cloud`）。为符合企业安全合规基线，插件默认拦截对环回地址与私有网段的直连请求。
- **核对设置面板项。** 新版本可能会增加配置项（例如新的 `lcid` 默认 `2052`，或 `app` 模式新增的 `userNameRef` 要求）。请确认界面上展示的各项取值符合预期。
- **验证查询。** 对已知单据类型执行一次 `kingdee_query`，确认连通性与认证依然正常工作。
- **密钥管理。** 密钥在每次操作执行时动态解析，因此除引用名称变更外无需调整 —— 若有变动请在设置中更新 `userNameRef` / `passwordRef` / `appSecretRef`。在 `app` 模式下 `userNameRef` 同样为必填项（用于指定集成用户）。

## 破坏性变更示例

- 工具名称或必填入参发生变动（例如工具重命名）。
- 凭据引用名称发生变动。
- 配置数据结构发生变动（配置项被重命名或移除）。

上述任何变动均会在对应版本的 [CHANGELOG.zh.md](./CHANGELOG.zh.md) / [CHANGELOG.md](./CHANGELOG.md) 中明确标注为破坏性变更。

## 版本回退

`dsh plugin update` 会记录版本；回退至上一个版本的方式与常规安装完全一致：

```sh
dsh plugin --profile web add dsh-kingdee@<previous-version>
```

回退后重启宿主并重新验证即可。
