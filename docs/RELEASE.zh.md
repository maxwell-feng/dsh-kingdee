# 发行说明 — v0.7.0

发布日期：2026-09-16

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.7.0 版本：全面适配 **金蝶云·星空 V9.1 企业版**（Kingdee Cloud Starry Sky V9.1 Enterprise Edition，向下兼容 V9.0 / V8.x），落地真实的第三方应用登录（`AuthService.LoginByAppSecret`）、`lcid` 区域参数与文档化的 `.common.kdsvc` stub 约定，并修复了让登录响应本身得以正确判定的缺陷 —— 该缺陷此前使真实账套上的认证完全无法成功。已在 **deepseek-harness `0.1.6-alpha.1`** 上验证。

## 兼容性

- **金蝶云·星空 V9.1 企业版**：V9.1 **没有破坏性 WebAPI 变更**；完整支持经典 `kdservice-sessionid` 会话（请求头 + Cookie 双通道）、游标分页（`orderString`、`limit`、`startRow`）、以单据编号（`numbers`）驱动审批/反审/删除/反提交，以及保存时自动提审（`isAutoSubmitAndAudit`）；向下兼容 V9.0 / V8.x。
- **Harness `0.1.6-alpha.1`**：`pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`），且 bundle 补丁在真实 `0.1.6-alpha.1` profile 中作为 `# == dsh-kingdee` 层正常生效（`dsh plugin --profile <name> add` → `dsh --profile <name> --dump-config`）。**未进行真实账套联调验证。**

## 更新说明

- **升级**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.7.0`）。
- **环境要求**：harness `^0.1.6-alpha.1`，Node ≥22。
- **需优先核对的近似破坏性变更**：`app` 模式现执行真实的 `AuthService.LoginByAppSecret` 登录，除 `appId` / `appSecret` 外**还要求 `userNameRef`**（集成用户），且不再伪造 `KDAuthentication` 请求头；所有 stub URL 统一以 `.common.kdsvc` 结尾，登录/登出 stub 移至 `AuthService.*`；`serviceEndpoints.servicePrefix` 由 `loginByAppSecretService` + `stubSuffix` 取代；`kingdee_invoke` 的 `serviceName` 现取 `{namespace}.{class}.{method},{assembly}` 形式的自定义 stub 路径。
- **安装**：`dsh plugin add dsh-kingdee` —— bundle 补丁自动注册 `kingdee` loader 行。
- **卸载**：`dsh plugin remove dsh-kingdee`。
- **使用**：在 **Plugins → kingdee** 设置卡片配置连接，设置凭据环境变量（`DSH_KINGDEE_USER` / `DSH_KINGDEE_PASSWORD` / `DSH_KINGDEE_APP_SECRET`；`app` 模式下 `DSH_KINGDEE_USER` 即集成用户且为必填），然后在会话中调用 `kingdee_*` 工具。完整工具说明见 [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/USAGE.zh.md)。
- **配置**：详细配置见 [CONFIG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/CONFIG.zh.md)。支持 `baseUrl`、`acctId`、`authMode`（`user` | `app`）、`appId`、凭据引用（`appSecretRef` / `userNameRef` / `passwordRef`）、`lcid`、`organization`、`timeoutMs`、`mock` 与可选 `serviceEndpoints`。

## 版本亮点

- **认证真正可用了** —— 登录服务返回的是它**自己**的 `{"LoginResultType": 1}` 结构，而不是 `Result` / `IsSuccess` 业务信封。旧实现把该响应当业务信封断言，导致**登录成功却报失败**，在真实账套上认证永远无法成功。现在登录由独立的 `parseLoginOutcome`（从 `kd-core` 子路径导出）判定，离线 mock 也用真实结构应答登录 stub。
- **全面适配金蝶云·星空 V9.1 企业版** —— 经典 `kdservice-sessionid` 会话以请求头 + Cookie 双通道发出；对齐大表防扫表与稳定游标分页（`orderString`、`limit`、`startRow`）；以单据编号（`numbers`）直接驱动审批、反审、删除、反提交与查看；自 `9.1.0.20250807` 起 `Delete` 返回的 `Number` 可直接采信。
- **真实的第三方应用登录** —— `authMode: "app"` 现以文档化的 `acctID` / `username` / `appid` / `appsecret` / `lcid` 键调用 `AuthService.LoginByAppSecret`，并要求提供集成用户（`userNameRef`）；这是 2022-11-29 之后开通的公有云账套必须使用的模式。
- **修正 stub 拼装** —— 所有 stub URL 以 `.common.kdsvc` 结尾，登录/登出位于 `AuthService.*`；BOS 自定义服务路径整段替换 dynamic-form 段，不再被拼上任何自定义服务都无法解析的前缀。
- **证据诚实的 V9.1 说明** —— V9.1 符合性章节明确区分哪些接口事实属社区验证而非官方发布，并指出每个账套的权威来源是产品内的「公共设置 → 动态服务定义 → WebAPI」。
- **严格测试与构建** —— 15 项单元测试通过、TypeScript 类型检查零错误，并在真实 `0.1.6-alpha.1` profile 中确认 bundle 层生效；未做真实账套联调。

## V9.1 符合性

`dsh-kingdee` 面向**金蝶云·星空 V9.1 企业版**（补丁 PT-163015 → 产品版本 `9.1.0.20250807`），向下兼容 V9.0 / V8.x。**V9.1 没有破坏性 WebAPI 变更**：没有重命名或移除的操作、没有 Cookie 改名、没有 URL 约定变化、也没有新增必填请求头。接口层增量包括：`Delete` 现返回正确的 `FNumber`；多文件附件（文件服务）字段可仅凭文件 ID 赋值；服务端新增请求体日志；在线文档补充幂等性校验；限流增加白名单；报表 Stub / API 自定义接口做安全加固；外部用户访问控制收紧。运维影响：因服务端记录请求体，请优先使用 `app` 模式；因权限收紧，缺少权限可能表现为**空结果而非报错**，请对每个 `FormId` 先跑探针查询；并把主机出口 IP 加入 WebAPI 限流白名单。

**证据诚实性说明。** 登录服务的具名请求键（`acctID` / `username` / `appid` / `appsecret` / `lcid`）、`Limit` 行数上限（约 2000）与 `listDataCenterService` 默认服务名均为**社区验证结论，并非金蝶官方发布**。每个账套的权威来源是产品本身：以管理员登录 → 公共设置 → 动态服务定义 → WebAPI，查看各操作的参数与示例调用。

## 已知限制

- **尚未实现公有云 OpenAPI 网关。** 越来越多的金蝶公有云账套要求走 OpenAPI 网关（`https://api.kingdee.com/galaxyapi/`）并使用 API 签名认证（`LoginByApiSignHeaders`）。本插件**未**实现该链路，只支持经典 `kdsvc` 会话协议。在这类账套上经典会话根本无法建立，因此所有操作都会在登录环节失败；必须使用仍然开放经典 WebAPI 的账套/网关。
- **平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）**不在** WebAPI 范围内，需在 BOS 集成开发环境中开发，已在文档中明确边界。
- `./client` 产物遵循文档化的 factory 格式；共享的 `clientBundle` tsdown preset 位于 harness 仓库内部且未发布，本包自行复现该产物。
- **未做真实账套联调** —— 本版本以类型检查、单元测试套件与真实 `0.1.6-alpha.1` profile 安装为依据，而非在运行中的金蝶账套上验证。

## 安装与维护

详见 [INSTALL.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/INSTALL.zh.md)。升级和卸载参见 [UPDATE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/UPDATE.zh.md) 与 [UNINSTALL.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/UNINSTALL.zh.md)。

## 相关链接

- 主页：https://github.com/maxwell-feng/dsh-kingdee
- 使用文档：[USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/USAGE.zh.md) | [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/USAGE.md)
- 配置文档：[CONFIG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/CONFIG.zh.md) | [CONFIG.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/CONFIG.md)
- 变更日志：[CHANGELOG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/CHANGELOG.zh.md) | [CHANGELOG.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/CHANGELOG.md)
- 安装文档：[INSTALL.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/INSTALL.zh.md) | [INSTALL.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/INSTALL.md)
- 升级文档：[UPDATE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/UPDATE.zh.md) | [UPDATE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/UPDATE.md)
- 卸载文档：[UNINSTALL.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/UNINSTALL.zh.md) | [UNINSTALL.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.7.0/UNINSTALL.md)
