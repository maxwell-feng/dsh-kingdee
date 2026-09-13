# Release notes — v0.6.0

Release date: 2026-09-13

Eighth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. Fully adapted to **Kingdee Cloud Starry Sky V9.0 Enterprise Edition** (金蝶云·星空 V9.0 企业版, as well as V8.x / V9.1) and verified on **deepseek-harness `0.1.5-rc.2`**.

## Compatibility / 兼容性

- **Kingdee Cloud Starry Sky V9.0 Enterprise Edition**: Full support for standard `kdservice-sessionid` session cookies, query pagination (`orderString`, `limit`, `startRow`), document numbers (`numbers`) for workflow actions, and auto-submit/audit (`isAutoSubmitAndAudit`).
- **Harness `0.1.5-rc.2`**: Verified on `0.1.5-rc.2` latest `master`. No breaking DSH seam changes affecting this plugin — `defineTool` / `ctx.credentials` / `ctx.settings` and the WebAPI transport remain stable.
- **中文兼容性**：全面适配金蝶云·星空 V9.0 企业版（及 V8.x/V9.1），并在 deepseek-harness `0.1.5-rc.2` 最新 `master` 上完成全量验证。

## Update notes / 更新说明

- **Update**: `dsh plugin update dsh-kingdee` (or `dsh plugin add dsh-kingdee@0.6.0`).
  **升级**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.6.0`）。
- **Requirements**: harness `^0.1.5-rc.2`, Node ≥22.
  **环境要求**：harness `^0.1.5-rc.2`，Node ≥22。
- **Install**: `dsh plugin add dsh-kingdee` — bundle patch self-registers the `kingdee` loader row.
  **安装**：`dsh plugin add dsh-kingdee` —— bundle 补丁自动注册 `kingdee` loader 行。
- **Uninstall**: `dsh plugin remove dsh-kingdee`.
  **卸载**：`dsh plugin remove dsh-kingdee`。
- **Usage**: Configure connection in the **Plugins → kingdee** settings card, set credential environment variables (`DSH_KINGDEE_USER` / `DSH_KINGDEE_PASSWORD` / `DSH_KINGDEE_APP_SECRET`), then invoke `kingdee_*` tools in chat sessions. See [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/USAGE.md) / [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/USAGE.zh.md) for the full tool reference.
  **使用**：在 **Plugins → kingdee** 设置卡片配置连接，配置凭据环境变量，然后在会话中调用 `kingdee_*` 工具。完整工具说明见 [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/USAGE.zh.md)。
- **Config**: See [CONFIG.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/CONFIG.md) / [CONFIG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/CONFIG.zh.md) for full configuration reference.
  **配置**：详细配置见 [CONFIG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/CONFIG.zh.md)。支持 `baseUrl`、`acctId`、`authMode`（`user` | `app`）、`appId`、凭据引用、`organization`、`timeoutMs`、`mock`、可选 `serviceEndpoints`。

## Highlights

- **Kingdee Cloud Starry Sky V9.0 Enterprise Edition Adaptation** — Extracting and forwarding standard `kdservice-sessionid` session cookies alongside `kdsvc`; adding `orderString`, `limit`, and `startRow` for large table queries; and enabling `numbers` array direct actuation on audit, unaudit, delete, unsubmit, delete-draft, and view.
- **Enterprise SSRF Defenses** — Pure TypeScript protocol and host boundary checks enforcing `http:` / `https:` and rejecting loopback (`127.0.0.0/8`, `::1`), private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`), and reserved IP addresses.
- **Full Bilingual Documentation** — Refreshed and synchronized documentation across `CHANGELOG`, `INSTALL`, `UPDATE`, `USAGE`, `CONFIG`, `UNINSTALL`, and `README`.
- **Robust Verification** — 9 native test suites passing, 0 TypeScript compilation errors.

## 亮点（中文）

- **全面适配金蝶云·星空 V9.0 企业版** —— 深度支持官方标准 `kdservice-sessionid` 会话 Cookie；对齐大表防扫表与稳定游标分页（`orderString`、`limit`、`startRow`）；支持以单据编号（`numbers`）直接驱动审批、反审、删除与查看；支持保存时自动提审。
- **企业级 SSRF 深度安全基线** —— 纯 TypeScript 实现严格的 http/https 协议白名单，自动拦截对 `localhost`、环回地址、私网保留网段的非授权请求。
- **全套中英双语文档体系** —— 更新日志（CHANGELOG）、安装说明（INSTALL）、升级指南（UPDATE）、使用文档（USAGE）、配置说明（CONFIG）、卸载指南（UNINSTALL）及项目主页全面保持中英双语对照。
- **严格测试与构建** —— 9 项单元测试全量通过，TypeScript 类型检查零错误。

## Known Limitations / 已知限制

- The **platform-plugin layer** (server-side C# form/list plugins, UI layout, background events) is **not** exposed — it is outside the WebAPI's reach and is documented as a boundary.
- **平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）**不在** WebAPI 范围内，需在 BOS 集成开发环境中开发，已在文档中明确边界。
- The `./client` bundle follows the documented factory format; the shared `clientBundle` tsdown preset lives inside the harness repository and is not published, so this package reproduces the artifact itself.
- `./client` 产物遵循文档化的 factory 格式；共享的 `clientBundle` tsdown preset 位于 harness 仓库内部且未发布，本包自行复现该产物。

## Installation / 安装说明

See [INSTALL.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/INSTALL.md) / [INSTALL.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/INSTALL.zh.md). Upgrade and removal are in [UPDATE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/UPDATE.md) and [UNINSTALL.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/UNINSTALL.md).

## Links / 相关链接

- Homepage / 主页: https://github.com/maxwell-feng/dsh-kingdee
- Usage Guide / 使用文档: [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/USAGE.md) | [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/USAGE.zh.md)
- Config Guide / 配置文档: [CONFIG.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/CONFIG.md) | [CONFIG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/CONFIG.zh.md)
- Changelog / 变更日志: [CHANGELOG.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/CHANGELOG.md) | [CHANGELOG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.6.0/CHANGELOG.zh.md)
