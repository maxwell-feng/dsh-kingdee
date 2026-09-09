# 发行说明 — v0.3.0

发布日期：2026-09-09

**dsh-kingdee**（金蝶云星空二次开发插件）的最新版本，已按官方插件开发规范全面适配 **deepseek-harness `0.1.5-alpha.1`** 最新 `master`。

## 兼容性

- **Harness `0.1.5-alpha.1`**：已全面适配并在最新 `master` 上验证。
- **Compatibility (EN)**: Verified on `0.1.5-alpha.1` latest `master`.

## 更新说明 / Update notes

- **升级**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.3.0`）。**Update**: `dsh plugin update dsh-kingdee`.
- **环境要求**：harness `0.1.5-alpha.1`；Node ≥22。**Requirements**: harness `0.1.5-alpha.1`, Node ≥22.
- **安装**：`dsh plugin add dsh-kingdee` —— bundle 补丁自动注册 `kingdee` loader 行。**Install**: the bundle patch self-registers the `kingdee` loader row.
- **卸载**：`dsh plugin remove dsh-kingdee`。**Uninstall**: `dsh plugin remove dsh-kingdee`.
- **使用**：在 **Plugins → kingdee** 设置卡片配置连接，设置凭据环境变量（`DSH_KINGDEE_USER` / `DSH_KINGDEE_PASSWORD` / `DSH_KINGDEE_APP_SECRET`），然后在会话中调用 `kingdee_*` 工具。**Usage**: configure the connection card, set the credential env vars, then call the `kingdee_*` tools in a session.
- **配置**：详细配置见 [CONFIG.zh.md](../CONFIG.zh.md)。支持 `baseUrl`、`acctId`、`authMode`（`user` | `app`）、`appId`、凭据引用（`appSecretRef` / `userNameRef` / `passwordRef`）、`organization`、`timeoutMs`、`mock`、可选 `serviceEndpoints`。

## 亮点

- **全面适配 DeepSeek Harness `0.1.5-alpha.1`** —— 将 `@deepseek-ai/dsh-*` devDependencies 统一升级至 `0.1.5-alpha.1`。
- **新增独立双语配置说明文档** —— 提供独立的 [CONFIG.zh.md](../CONFIG.zh.md) 与 [CONFIG.md](../CONFIG.md)，详尽说明各配置项、两种认证模式、环境变量注入和 Profile 配置。
- **文档体系全面同步** —— 更新使用说明（`README.md` / `README.zh.md`）、安装说明（`INSTALL.md` / `INSTALL.zh.md`）、升级说明（`UPDATE.md` / `UPDATE.zh.md`）和卸载说明（`UNINSTALL.md` / `UNINSTALL.zh.md`）。
- **测试与构建全部通过** —— 单元测试 7/7 通过，TypeScript 类型检查通过，打包生成规范 tarball 资产。

## Highlights (EN)

- Full compatibility with DeepSeek Harness `0.1.5-alpha.1`.
- Added standalone bilingual configuration documents (`CONFIG.md` / `CONFIG.zh.md`).
- Refreshed all setup, upgrade, uninstall, and usage documentation.
- All 7 test suites passing with 0 type errors.

## 已知限制

- **平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）**不在** WebAPI 范围内，已在文档中明确边界。
- `./client` 产物遵循文档化的 factory 格式；共享的 `clientBundle` tsdown preset 位于 harness 仓库内部且未发布，本包自行复现该产物。

## 链接

- 主页：https://github.com/maxwell-feng/dsh-kingdee
- 配置文档：[CONFIG.zh.md](../CONFIG.zh.md)
- 变更日志：[CHANGELOG.md](../CHANGELOG.md)
