# 发行说明 — v0.8.0


[英文](RELEASE.md) | 中文
发布日期：2026-09-18

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.8.0 版本：全面适配 **DeepSeek Harness `0.1.6-alpha.2`** 及其全新的插件管理规范（`ui-plugin-manager`），并持续提供对 **金蝶云·星空 V9.1 企业版**（向下兼容 V9.0 / V8.x）的完整支持。

## 兼容性与运行环境

- **DeepSeek Harness `0.1.6-alpha.2`**：`pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`），客户端 bundle 产物构建正常，且 bundle 补丁在真实 `0.1.6-alpha.2` profile 中正常生效。
- **金蝶云·星空 V9.1 企业版**：完整支持经典 `kdservice-sessionid` 会话（请求头 + Cookie 双通道）、第三方应用登录（`AuthService.LoginByAppSecret`）、游标分页与单据编号驱动；向下兼容 V9.0 / V8.x。
- **环境要求**：harness `^0.1.6-alpha.2`，Node ≥22。

## 更新内容说明

- **升级命令**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.8.0`）。
- **客户端插槽迁移**：DSH `0.1.6-alpha.2` 废弃了旧的 `settings.plugin.item` 插槽，插件设置统一由独立的插件管理页面（`ui-plugin-manager`）承载。`dsh-kingdee` 现注册至 `plugins.row.config`（键名 `dsh-kingdee#kingdee`）与 `plugins.bundle.config`（键名 `dsh-kingdee`），规范提供 `summary` 与 `page` 双视图。
- **依赖与引擎范围更新**：所有 `@deepseek-ai/dsh-*` peer 依赖更新为 `^0.1.6-alpha.2`，开发依赖锁定至 `0.1.6-alpha.2`，`engines.dsh` 更新为 `^0.1.6-alpha.2`；新增 `@deepseek-ai/dsh-client-ui-plugin-manager` 开发依赖。
- **安装与配置**：`dsh plugin add dsh-kingdee`。安装后可在插件配置页面中配置 WebAPI 地址、账套 ID 与凭据引用名。

## 核心亮点

- **对齐最新插件开发规范** —— 规范接入 DeepSeek Harness `0.1.6-alpha.2` 的 `plugins.row.config` 与 `plugins.bundle.config` 插槽。
- **双视图渲染** —— 遵循 `PluginConfigViewProps` 契约，在列表/概览处展示紧凑描述，在详情配置页提供带版本围栏保存能力的交互式表单。
- **全量测试与类型安全** —— 15 项单元测试全部通过，TypeScript 编译与类型检查零错误。
