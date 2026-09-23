# 更新日志

[英文](CHANGELOG.md) | 中文

**dsh-kingdee** 的所有关键版本演进记录均归档于此。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，并严格遵循 [语义化版本规范](https://semver.org/lang/zh-CN/)。

---

## [0.9.0] - 2026-09-23

**适配 DeepSeek Harness 0.1.7-rc.1：schema 驱动的易变配置**

### 变更

- **宿主对齐**：开发依赖锁定至 DeepSeek Harness `0.1.7-rc.1`（最新发行版），并已针对该版本完成验证。`@deepseek-ai/dsh-*` peer 区间为 `^0.1.7-alpha.2`——即引入易变配置的那条发布线——因此插件在 `0.1.7-alpha.2` 与 `0.1.7-rc.1` 上均可安装；对本插件消费的全部包而言，这两个版本的源码完全一致。`engines.dsh` 为 `^0.1.7-alpha.2`，`@deepseek-ai/cordis` 升至 `4.0.4`，`@deepseek-ai/schemastery` 升至 `3.18.4`。
- **配置迁移至 0.1.7 的易变 schema**：每个可编辑字段都声明为 `.volatile()`，`apply` 因此收到逐字段的活引用。插件不再注册设置节——`ctx.settings.installSection` 调用、`ctx.inject(['settings'])` 与 `@deepseek-ai/dsh-settings` 依赖均已移除。Host 自行读取导出的 `Config` schema（`entry.fiber.runtime.Config`），并以 profile 行 id `kingdee` 为键渲染该条目的表单。
- **每次操作一次配置快照**：`captureConfig` 在操作开始时一次性读取全部引用，因此单次操作绝不会混用「保存前读到的 `baseUrl`」与「保存后读到的凭据引用」。凭据仍逐次操作解析，轮换后的密钥同样对下一次调用生效。
- **`pnpm-workspace.yaml`**：为 `0.1.7-rc.1` 的确切包集合显式豁免 pnpm 的最小发布年龄闸门——否则 DSH 持续发布的预发行版会被该闸门拦下。
- **构建产物不再纳入版本库**：`lib/` 已加入忽略列表，由 `pnpm build`（以及 npm 的 `prepublishOnly` 钩子）在打包前生成。

### 新增

- **补充宿主兼容性闸门说明**：DeepSeek Harness 0.1.7-rc.1 会在加载前用运行时版本校验插件的 `@deepseek-ai/dsh*` peer 依赖，不兼容的行会被直接拒绝。本发行版声明的 peer 均实际满足，无需豁免；README 与升级文档均写明了该拒绝行为及 `dsh plugin allow-version` 豁免方式。
- **补充客户端卡片契约说明**：`src/client/settings-card.ts` 已写明是 Plugins 页所拥有的同一个逐条目 `ConfigForm` 的浏览器半端。

### 修复

- **补齐客户端半端的 `dsh.client.inject` 声明**：该卡片注册到 `plugins.row.config` / `plugins.bundle.config`（由 `@deepseek-ai/dsh-client-ui-plugin-manager` 提供），并读取 `ctx.remote` 与 `ctx.connection`，但此前只声明了 `@deepseek-ai/dsh-client-locale` 与 `@deepseek-ai/dsh-client-ui-settings`。现补齐 `@deepseek-ai/dsh-client-ui-plugin-manager`、`@deepseek-ai/dsh-api-remotes` 与 `@deepseek-ai/dsh-client-connection`，与使用同一批服务的官方客户端卡片保持一致。

### 验证

- `pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`）、构建干净（`tsc` + `tsdown`），且 `node scripts/check-docs-language.mjs` 全绿。
- `pnpm install --frozen-lockfile` 通过 pnpm 的供应链策略校验；声明的 DSH peer 依赖经 DeepSeek Harness 自带的 `evaluatePluginCompatibility` 对运行时 `0.1.7-rc.1` 校验通过。

---

## [0.8.1] - 2026-09-18

### 变更

- **语言边界补齐**：运行时文案全部英文化 —— `kingdee_delete_draft` 工具描述、设置卡的用户名标签、`authMode: "app"` 的报错文案，以及全部源码注释。按设计保留两处中文：`src/kd-core/errors.ts` 中用于识别金蝶 WebAPI 中文报错的 `登录` 匹配式，以及插件卡片上的中文产品显示名。
- **双语文档规范化**：所有文档一文件一语言（`X.md` 英文、`X.zh.md` 中文），成对齐全、切换行统一；两份更新日志现覆盖同样的 13 个版本。

### 新增

- `scripts/check-docs-language.mjs` 在本地与 CI 中检查文档、源码文案与配对（CI 在安装依赖前运行）。

## [0.8.0] - 2026-09-18

### 变更

- **全面适配 DeepSeek Harness 0.1.6-alpha.2**：
  - **客户端配置插槽迁移**：DeepSeek Harness `0.1.6-alpha.2` 将插件配置表面从已废弃的 `settings.plugin.item` 插槽迁移至独立的插件管理页面（`ui-plugin-manager`）。`dsh-kingdee` 现注册至 `plugins.row.config`（键名 `dsh-kingdee#kingdee`）与 `plugins.bundle.config`（键名 `dsh-kingdee`）；
  - **双视图渲染（`summary` 与 `page`）**：遵循新规范中的 `PluginConfigViewProps` 契约，卡片在 `view: 'summary'` 下提供紧凑的单行描述，在 `view: 'page'` 下挂载完整的带版本围栏保存能力的配置表单；
  - **依赖与引擎范围更新**：所有 `@deepseek-ai/dsh-*` peer 依赖更新为 `^0.1.6-alpha.2`，开发依赖锁定至 `0.1.6-alpha.2`，`engines.dsh` 更新为 `^0.1.6-alpha.2`；新增 `@deepseek-ai/dsh-client-ui-plugin-manager` 开发依赖；
  - **全面刷新双语文档**（`README`、`INSTALL`、`USAGE`、`CONFIG`、`UPDATE`、`UNINSTALL`、`CHANGELOG`、`docs/RELEASE`），对齐 `0.1.6-alpha.2` 适配与验证。

---

## [0.7.0] - 2026-09-16

### 新增

- **全面适配金蝶云·星空 V9.1 企业版**：
  - **第三方应用登录（`AuthService.LoginByAppSecret`）**：`authMode: "app"` 现执行真实的 `LoginByAppSecret` 登录（载荷 `acctID` / `username` / `appid` / `appsecret` / `lcid`），除 `appId` / `appSecret` 外还必须提供 `userNameRef`（集成用户），并与 `user` 模式建立同一个 `kdservice-sessionid` 会话。金蝶对 2022-11-29 之后开通的公有云账套拒绝账号密码登录，此类账套必须使用该模式。
  - **`lcid` 配置项**：新增可选区域 id（数字，默认 `2052`，即 zh-CN），同时发送给两个登录服务。
  - **新增端点字段**：`serviceEndpoints` 增加 `loginByAppSecretService`（默认 `Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret`）与 `stubSuffix`（默认 `.common.kdsvc`）。
  - **双通道会话**：会话同时以裸 `kdservice-sessionid` 请求头与 `Cookie`（`kdservice-sessionid=…; kdsvc=…`）发出。

### 变更

- **近似破坏性变更**：
  - `app` 模式不再伪造 `KDAuthentication` 请求头，改为经 `LoginByAppSecret` 认证后与 `user` 模式一样复用会话；并新增集成用户名（`userNameRef`）必填要求；
  - 所有 stub URL 统一以 `.common.kdsvc` 结尾；登录 stub 为 `AuthService.ValidateUser`、登出 stub 为 `AuthService.LogOut`（此前文档写的是 `LoginService.*`）；
  - `kingdee_invoke` 的 `serviceName` 现取自定义 stub 路径 `{namespace}.{class}.{method},{assembly}`（如 `GetCust.GetCust.ExecuteService,GetCust`），该段**直接替换** dynamic-form URL 段，`.common.kdsvc` 自动追加；
  - `serviceEndpoints.servicePrefix` 已移除，由 `loginByAppSecretService` + `stubSuffix` 取代；
  - DSH 锁定至 `0.1.6-alpha.1`（peer 范围、devDependencies、`engines.dsh`）。
- **全面刷新双语文档**（`README`、`INSTALL`、`USAGE`、`CONFIG`、`UPDATE`、`UNINSTALL`、`CHANGELOG`、`docs/RELEASE`），对齐 V9.1 目标与 `0.1.6-alpha.1` 验证。

### 修复

- **登录响应被当成业务信封解析，导致登录成功却报失败**：登录服务返回的是它**自己**的结构（`{"LoginResultType": 1}`），而不是其他所有操作返回的 `Result`/`IsSuccess` 业务信封。此前把登录响应送进业务信封断言，导致 `IsSuccess` 缺失 → 被判为 `false` → **在真实账套上认证永远无法成功**。现在登录结果由 `parseLoginOutcome`（从 `kd-core` 子路径导出）单独判定：存在数字型 `LoginResultType` 时以它为准（`1` 为成功，其余抛 `kd/auth-failed`）；没有 `LoginResultType` 时回退到业务信封。离线 mock 也改为用真实的 `{"LoginResultType": 1}` 结构应答登录 stub，确保该路径始终被覆盖；
- **自定义 BOS stub URL**：此前会被拼上 `Kingdee.BOS.WebApi.ServicesStub.` 前缀，任何 BOS 自定义服务都无法解析；现由自定义路径整段替换；
- **补上缺失的 `lcid`**：登录载荷现携带此前缺失的 `lcid`；
- 从 `user` 模式登录载荷中移除无意义的 `license: appId` 字段。

### 移除

- 从 `kd-core` 子路径 API 移除 `buildAppAuthHeader`（由 `buildAppSecretLoginPayload` 取代）。

---
## [0.6.1] - 2026-09-13

### 移除与代码精简

- **清理死代码与未使用的遗留接口**：
  - 彻底移除 `src/kd-core/types.ts` 中废弃未被引用的 `KdToolResult` 接口定义及核心导出（工具输出全面统一为 `@deepseek-ai/dsh-util-values` 规范的 `JsonValue` 开放值模型）；
  - 移除 `src/kd-core/envelope.ts` 中内部未引用的 `parseEnvelopeFromText` 函数及其单测；
  - 移除 `src/kd-core/errors.ts` 中从未被业务或捕获层消费的死错误码 `'kd/not-found'`；
  - 精简 `pnpm-workspace.yaml` 中的历史多版本白名单规则，统一锁定为 `0.1.5-rc.2`；
  - 进一步优化包体积，提升运行效率与类型纯净度。

---

## [0.6.0] - 2026-09-13

### 新增

- **全面适配金蝶云·星空 V9.0 企业版**：
  - **官方标准会话 Cookie（`kdservice-sessionid`）**：支持解析和回传金蝶星空 V9.0 企业版官方标准响应头 `kdservice-sessionid`，并在业务请求中同时回传 `kdservice-sessionid` 与兼容字段 `kdsvc`，实现跨版本与星空微服务网关的稳定连接。
  - **大表防全量扫表与稳定游标分页（`orderString`、`limit`、`startRow`）**：为 `ExecuteBillQuery` 及 `QueryBusinessData` 接口补全了 `OrderString`（排序子句）、`Limit`（分页大小）与 `StartRow`（起始行偏移量），对齐星空 V9.0 性能与查询规范，确保 AI 在处理万级以上单据大表时避免全表锁定和游标抖动。
  - **业务单据编号驱动操作（`numbers`）**：针对 AI 智能体直接基于业务单号交互的特点，为单据审批（`kingdee_audit`）、反审（`kingdee_unaudit`）、删除（`kingdee_delete`）、反提交（`kingdee_unsubmit`）和暂存删除（`kingdee_delete_draft`）扩展了 `numbers` 数组参数，支持直接使用业务单号（例如 `SO-20260901`）执行批量操作，省去底层内部物理自增 `FID` 的中间查询。
  - **按单据编号直接查单（`kingdee_view`）**：增强了单据查看工具，除原有的 `id` 外，新增支持传入 `number` 参数直接定位并获取单张单据的完整 JSON 结构。
  - **保存时自动提审（`isAutoSubmitAndAudit`）**：在单据保存（`kingdee_save`）和批量保存（`kingdee_batch_save`）中新增 `isAutoSubmitAndAudit` 参数，充分利用星空 V9.0 企业版的“一步保存提审”原生能力。

### 安全

- **SSRF 深度防御与严格主机校验**：
  - 纯 TypeScript 零依赖实现，全面落实网络边界安全审计；
  - **协议白名单**：仅允许 `http:` 与 `https:` 请求，坚决拦截 `file:`、`ftp:`、`gopher:` 等非安全协议；
  - **网络边界拦截**：全面拦截并拒绝指向 `localhost`、环回地址（`127.0.0.0/8`、`::1`）、RFC1918 私网网段（`10.0.0.0/8`、`172.16.0.0/12`、`192.168.0.0/16`、`169.254.0.0/16` 链路本地）、运营商 NAT（`100.64.0.0/10`）、IPv6 链路本地（`fe80::/10`）以及唯一本地地址（`fc00::/7`）的请求；
  - 在配置验证层（`validateConfig`）与网络请求实际发出层（`HttpTransport.request`）双重设防，杜绝内网横向扫描与伪造请求风险。

---
## [0.5.0] - 2026-09-11

### 变更

- **适配 DeepSeek Harness `0.1.5-rc.2` 与插件清单规范现代化**：
  - 在 `package.json.dsh` 下补充 `manifestVersion: 1`，完全对齐 `@deepseek-ai/dsh-package-manifest`；
  - 在 `package.json.engines` 中显式约束宿主引擎兼容范围：`"dsh": "^0.1.5-rc.2"`；
  - 将所有 `@deepseek-ai/dsh-*` peerDependencies 与 devDependencies 升级至 `0.1.5-rc.2`；
  - 全面刷新双语文档，标注针对 `0.1.5-rc.2` 的验证。

---
## [0.4.0] - 2026-09-10

### 变更

- 按官方插件开发规范全面适配 deepseek-harness `0.1.5-rc.1`。
- 全面刷新双语文档，标注针对 `0.1.5-rc.1` 的验证。

### 新增

- 新增独立双语使用说明文档（`USAGE.md` / `USAGE.zh.md`），详述 14 个 `kingdee_*` 工具参数与示例。

---
## [0.3.0] - 2026-09-09

### 变更

- 适配 deepseek-harness `0.1.5-alpha.1`。

### 新增

- 新增独立双语配置说明文档（`CONFIG.md` / `CONFIG.zh.md`）。

---
## [0.2.4] - 2026-09-03

### 变更

- 按官方插件开发规范适配 deepseek-harness `0.1.2-rc.1`（`docs/user/develop/basic/config|tool|publish`、`docs/cookbook/adding-a-settings-card`）。本插件使用的 DSH 缝 —— `defineTool`、`ctx.tools.register`、`ctx.credentials.resolve`、`ctx.settings.installSection` —— 自 `0.1.2-alpha.5` 以来未变，工具集与凭据流行为一致。

### 修复

- 以真实已发布的 peer 包替换 ambient `any` 声明（`src/types/peers.d.ts`），`npm run typecheck` 现为 0 错误（此前 43 个隐式 `any`）；
- 工具输出采用开放值 JSON schema；
- 浏览器设置卡片正常编译并产出 `lib/client.js` 产物。

---
## [0.2.3] - 2026-09-02

### 变更
- **已在 deepseek-harness `0.1.2-alpha.5` 最新 `master` 上验证。** 自 `0.1.2-alpha.4` 以来无影响本插件的 DSH 缝变更 —— `defineTool` / `ctx.credentials` / `ctx.settings` 契约及 WebAPI 传输保持稳定，无需代码改动。版本升至 `0.2.3`，并刷新双语文档（发行版 / 更新说明 / 安装 / 卸载 / 使用 / 配置）。

---

## [0.2.2] - 2026-09-02

### 变更
- **已在 deepseek-harness `0.1.2-alpha.4` 最新 `master` 上验证。** 自 `0.1.2-alpha.3` 以来无影响本插件的 DSH 缝变更 —— `defineTool` / `ctx.credentials` / `ctx.settings` 契约及 WebAPI 传输保持稳定，无需代码改动。版本升至 `0.2.2`，并刷新双语文档（发行版 / 更新说明 / 安装 / 卸载 / 使用 / 配置）。

---

## [0.2.1] - 2026-09-01

### 修复

- 重写 README 的功能要点（英文 + 中文），使 `kingdee_*` 工具列表在 npm 上渲染正确（避免过长的逗号分隔行内代码段）。完整列表见工具表。

---

## [0.2.0] - 2026-09-01

### 新增

- **`kd-core` 与对应 DSH 工具新增数据/服务层操作**：
  - `kingdee_logout` —— `LoginService.LogOut`，清除已存会话 cookie；
  - `kingdee_list_datacenters` —— 列出基址可达的数据中心/账套；
  - `kingdee_query_business_data` —— 新版结构化 `QueryBusinessData` 查询；
  - `kingdee_unsubmit` —— 反提交单据（撤销提交）；
  - `kingdee_delete_draft` —— 删除暂存/创建状态的记录；
  - `kingdee_batch_save` —— 单次批量保存多条记录。
- **可覆盖的服务端点**（`KdConfig.endpoints` / `serviceEndpoints` 配置），便于把 WebAPI 服务名对齐到具体的金蝶版本。
- 覆盖上述新操作的单元测试（7/7 通过）。

### 变更

- 在 `INSTALL.md` / `INSTALL.zh.md` 与 `README.md` / `README.zh.md` 中补充跨平台密钥配置说明 —— Linux/macOS 的 `export`、Windows PowerShell 的 `$env:`、Windows CMD 的 `set` / `setx`，以及 DSH 凭据存储。
- 许可证由 MIT 变更为**专有许可（保留所有权利）**，仓库仅供阅读/评估：未经所有者事先书面许可，禁止在整体或部分上复制、复刻/fork、再托管、再发布、修改或制作衍生作品。

---


## [0.1.0] - 2026-09-01

初始发布。

### 新增

- **`kd-core`** —— 无框架依赖的金蝶云·星空 WebAPI 客户端：
  - 两种认证模式：`user`（账套用户名/密码，经 `LoginService.ValidateUser`，使用 `kdsvc` 会话 cookie）与 `app`（appId/appSecret）。
  - 类型化操作：`executeBillQuery`、`save`、`submit`、`audit`、`unaudit`、`view`、`delete`、`invokeService`。
  - 信封解析/规范化与类型化错误映射（`kd/business-error`、`kd/auth-failed`、`kd/not-found`、`kd/invalid-config`、`kd/network`、`kd/timeout`、`kd/unknown`）。
  - 传输留缝：真实 `HttpTransport`（全局 `fetch`）与离线 `MockTransport`。
- **DSH 插件** —— 经 `defineTool` 注册的类型化工具：
  - `kingdee_query`、`kingdee_save`、`kingdee_submit`、`kingdee_audit`、`kingdee_unaudit`、`kingdee_view`、`kingdee_delete`、`kingdee_invoke`。
  - 凭据安全配置：密钥每次操作经 DSH 凭据缝（`ctx.credentials.resolve`）解析。
  - `kingdee` 设置命名空间（Host 半端）与浏览器设置卡片脚手架（Client 半端，`dsh.client`）。
- **配套技能** —— `kingdee-bos`：字段/枚举/状态约定、单据状态机、工具用法，以及数据层与平台插件层的边界。
- **文档** —— 中英双语（英文 + 简体中文）`README` 与逐版本发行说明。
- **测试** —— 内核单元测试（信封解析、配置校验、认证头、完整 mock 流程与错误映射），使用 Node 内置测试运行器。

### 安全

- 配置中不存储任何明文密钥；密钥每次操作从环境变量引用解析。

### 说明

- 平台插件层（服务端 C# 表单/列表插件、UI 布局）**无法**经 WebAPI 触达，已在 `kingdee-bos` 技能中明确记录该边界。
- DSH host/插件半区需在 DSH profile 内编译（其 `@deepseek-ai/*` peer 在其中解析）；仅 `kd-core` 可独立构建与测试。

[0.9.0]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.9.0
[0.8.1]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.8.1
[0.8.0]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.8.0
[0.7.0]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.7.0
[0.6.1]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.6.1
[0.6.0]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.6.0
[0.5.0]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.5.0
[0.4.0]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.4.0
[0.3.0]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.3.0
[0.2.4]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.2.4
[0.2.3]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.2.3
[0.2.2]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.2.2
[0.2.1]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.2.1
[0.2.0]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.2.0
[0.1.0]: https://github.com/maxwell-feng/dsh-kingdee/releases/tag/v0.1.0
