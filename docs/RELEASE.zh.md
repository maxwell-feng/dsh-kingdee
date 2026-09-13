# 发行说明 — v0.6.0

发布日期：2026-09-13

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.6.0 版本，全面适配 **金蝶云·星空 V9.0 企业版**（Kingdee Cloud Starry Sky V9.0 Enterprise Edition，并向下兼容 V8.x 及 V9.1），并经 **deepseek-harness `0.1.5-rc.2`** 验证。

## 兼容性

- **金蝶云·星空 V9.0 企业版**：深度支持官方标准 `kdservice-sessionid` 会话 Cookie；对齐大表防扫表与稳定游标分页（`orderString`、`limit`、`startRow`）；支持以单据编号（`numbers`）直接驱动审批、反审、删除与查看；支持保存时自动提审。
- **Harness `0.1.5-rc.2`**：已全面适配并在最新 `master` 上完成验证。
- 各核心运行时缝接口（`defineTool`、`ctx.tools.register`、`ctx.credentials.resolve`、`ctx.settings.installSection`）保持无缝兼容，行为无需迁移。

## 更新说明

- **升级**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.6.0`）。
- **环境要求**：harness `^0.1.5-rc.2`，Node ≥22。
- **安装**：`dsh plugin add dsh-kingdee` —— bundle 补丁自动注册 `kingdee` loader 行。
- **卸载**：`dsh plugin remove dsh-kingdee`。
- **使用**：在 **Plugins → kingdee** 设置卡片配置连接，设置凭据环境变量（`DSH_KINGDEE_USER` / `DSH_KINGDEE_PASSWORD` / `DSH_KINGDEE_APP_SECRET`），然后在会话中调用 `kingdee_*` 工具。完整工具说明见 [USAGE.zh.md](../USAGE.zh.md)。
- **配置**：详细配置见 [CONFIG.zh.md](../CONFIG.zh.md)。支持 `baseUrl`、`acctId`、`authMode`（`user` | `app`）、`appId`、凭据引用（`appSecretRef` / `userNameRef` / `passwordRef`）、`organization`、`timeoutMs`、`mock`、可选 `serviceEndpoints`。

## 版本亮点

- **全面适配金蝶云·星空 V9.0 企业版** —— 深度支持官方标准 `kdservice-sessionid` 会话 Cookie；对齐大表防扫表与稳定游标分页（`orderString`、`limit`、`startRow`）；支持以单据编号（`numbers`）直接驱动审批、反审、删除与查看；支持保存时自动提审。
- **企业级 SSRF 深度安全基线** —— 纯 TypeScript 实现严格的 http/https 协议白名单，自动拦截对 `localhost`、环回地址、私网保留网段的非授权请求。
- **全套中英双语文档体系** —— 更新日志（CHANGELOG）、安装说明（INSTALL）、升级指南（UPDATE）、使用文档（USAGE）、配置说明（CONFIG）、卸载指南（UNINSTALL）及项目主页全面保持中英双语对照。
- **严格测试与构建** —— 9 项单元测试全量通过，TypeScript 类型检查零错误。

## 已知限制

- **平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）**不在** WebAPI 范围内，需在 BOS 集成开发环境中开发，已在文档中明确边界。
- `./client` 产物遵循文档化的 factory 格式；共享的 `clientBundle` tsdown preset 位于 harness 仓库内部且未发布，本包自行复现该产物。

## 安装与维护

详见 [INSTALL.zh.md](../INSTALL.zh.md)。升级和卸载参见 [UPDATE.zh.md](../UPDATE.zh.md) 与 [UNINSTALL.zh.md](../UNINSTALL.zh.md)。

## 相关链接

- 主页：https://github.com/maxwell-feng/dsh-kingdee
- 使用文档：[USAGE.zh.md](../USAGE.zh.md) | [USAGE.md](../USAGE.md)
- 配置文档：[CONFIG.zh.md](../CONFIG.zh.md) | [CONFIG.md](../CONFIG.md)
- 变更日志：[CHANGELOG.zh.md](../CHANGELOG.zh.md) | [CHANGELOG.md](../CHANGELOG.md)
- 安装文档：[INSTALL.zh.md](../INSTALL.zh.md) | [INSTALL.md](../INSTALL.md)
- 升级文档：[UPDATE.zh.md](../UPDATE.zh.md) | [UPDATE.md](../UPDATE.md)
- 卸载文档：[UNINSTALL.zh.md](../UNINSTALL.zh.md) | [UNINSTALL.md](../UNINSTALL.md)
- 使用文档：[USAGE.zh.md](../USAGE.zh.md)
- 配置文档：[CONFIG.zh.md](../CONFIG.zh.md)
- 变更日志：[CHANGELOG.md](../CHANGELOG.md)
