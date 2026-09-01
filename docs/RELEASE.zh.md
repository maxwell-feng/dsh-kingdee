# 发行说明 — v0.2.2

发布日期：2026-09-02

**dsh-kingdee**（金蝶云星空二次开发插件）的第三个版本，已在 **deepseek-harness `0.1.2-alpha.4`** 最新 `master` 上验证。

## 兼容性

- **Harness `0.1.2-alpha.4`**：自 `0.1.2-alpha.3` 以来无影响本插件的 DSH 缝变更 —— `defineTool` / `ctx.credentials` / `ctx.settings` 及 WebAPI 传输保持稳定，无需代码迁移。双语文档已补齐 **发行版 / 更新说明 / 安装 / 卸载 / 使用 / 配置** 六项覆盖。
- **Compatibility (EN)**: Verified on `0.1.2-alpha.4` latest `master`, no seam changes since `0.1.2-alpha.3`.

## 亮点

- **无代码变更** —— `kd-core` WebAPI 客户端及 14 个 `kingdee_*` 工具自 `0.2.1` 以来未变。
- **文档刷新** —— README / INSTALL / UPDATE / UNINSTALL 现已标明已验证的 Harness 版本及六项双语覆盖。
- **测试** —— `kd-core` 单元测试（7/7）在 Node ≥22 上通过。

## 已知限制

- **平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）**不在** WebAPI 范围内，已在文档中明确边界。
- DSH host/插件半区需在 DSH profile 内编译；仅 `kd-core` 可独立构建与测试。

## 安装

见 [INSTALL.zh.md](../INSTALL.zh.md)。升级与卸载见 [UPDATE.zh.md](../UPDATE.zh.md) 与 [UNINSTALL.zh.md](../UNINSTALL.zh.md)。

## 链接

- 主页：https://github.com/maxwell-feng/dsh-kingdee
- 更新日志：[CHANGELOG.md](../CHANGELOG.md)
