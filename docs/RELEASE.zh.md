# 发行说明 — v0.4.0

发布日期：2026-09-10

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.4.0 版本，按官方插件开发规范全面适配 **deepseek-harness `0.1.5-rc.1`** 最新 `master`。

## 兼容性

- **Harness `0.1.5-rc.1`**：已全面适配并在最新 `master` 上完成验证。
- 各核心运行时缝接口（`defineTool`、`ctx.tools.register`、`ctx.credentials.resolve`、`ctx.settings.installSection`）保持无缝兼容，行为无需迁移。

## 更新说明

- **升级**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.4.0`）。
- **环境要求**：harness `0.1.5-rc.1`，Node ≥22。
- **安装**：`dsh plugin add dsh-kingdee` —— bundle 补丁自动注册 `kingdee` loader 行。
- **卸载**：`dsh plugin remove dsh-kingdee`。
- **使用**：在 **Plugins → kingdee** 设置卡片配置连接，设置凭据环境变量（`DSH_KINGDEE_USER` / `DSH_KINGDEE_PASSWORD` / `DSH_KINGDEE_APP_SECRET`），然后在会话中调用 `kingdee_*` 工具。完整工具说明见 [USAGE.zh.md](../USAGE.zh.md)。
- **配置**：详细配置见 [CONFIG.zh.md](../CONFIG.zh.md)。支持 `baseUrl`、`acctId`、`authMode`（`user` | `app`）、`appId`、凭据引用（`appSecretRef` / `userNameRef` / `passwordRef`）、`organization`、`timeoutMs`、`mock`、可选 `serviceEndpoints`。

## 版本亮点

- **全面适配 DeepSeek Harness `0.1.5-rc.1`** —— 将 `@deepseek-ai/dsh-*` devDependencies 统一升级至 `0.1.5-rc.1`，`dsh-credentials` / `dsh-tools` peer 范围升至 `^0.1.5-rc.1`。
- **新增独立双语使用说明文档** —— 提供独立的 [USAGE.zh.md](../USAGE.zh.md) 与 [USAGE.md](../USAGE.md)，覆盖全部 14 个 `kingdee_*` 工具的入参与示例。
- **文档体系全面同步** —— 更新使用说明（`README.md` / `README.zh.md`）、安装说明（`INSTALL.md` / `INSTALL.zh.md`）、升级说明（`UPDATE.md` / `UPDATE.zh.md`）和卸载说明（`UNINSTALL.md` / `UNINSTALL.zh.md`）。
- **测试与构建全部通过** —— 单元测试 7/7 通过，TypeScript 类型检查通过，打包生成规范 tarball 资产。

## 已知限制

- **平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）**不在** WebAPI 范围内，需在 BOS 集成开发环境中开发，已在文档中明确边界。
- `./client` 产物遵循文档化的 factory 格式；共享的 `clientBundle` tsdown preset 位于 harness 仓库内部且未发布，本包自行复现该产物。

## 安装与维护

详见 [INSTALL.zh.md](../INSTALL.zh.md)。升级和卸载参见 [UPDATE.zh.md](../UPDATE.zh.md) 与 [UNINSTALL.zh.md](../UNINSTALL.zh.md)。

## 相关链接

- 主页：https://github.com/maxwell-feng/dsh-kingdee
- 使用文档：[USAGE.zh.md](../USAGE.zh.md)
- 配置文档：[CONFIG.zh.md](../CONFIG.zh.md)
- 变更日志：[CHANGELOG.md](../CHANGELOG.md)
