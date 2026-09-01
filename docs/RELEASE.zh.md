# 发行说明 — v0.1.0

发布日期：2026-09-01

这是 **dsh-kingdee** 的首次发布，面向 DeepSeek Harness 的金蝶云星空二次开发插件。

## 本版本包含

- 无框架依赖的 `kd-core` 金蝶云星空 WebAPI 客户端（两种认证、完整数据/服务操作集、信封解析、类型化错误）。
- 一个 DSH 插件，注册八个类型化工具（`kingdee_query`、`kingdee_save`、`kingdee_submit`、`kingdee_audit`、`kingdee_unaudit`、`kingdee_view`、`kingdee_delete`、`kingdee_invoke`）。
- 凭据安全的配置（密钥每次操作经 DSH 凭据缝重新解析）。
- 一个 `kingdee` 设置命名空间，并附浏览器设置卡片脚手架。
- 配套的 `kingdee-bos` 领域技能（字段/枚举/状态机约定、单据状态机、平台插件边界）。
- 核心单元测试。

## 亮点

- **离线 Mock。** 设置 `mock: true` 即可用固化的金蝶信封跑通完整工具流程，无需可达账套。
- **默认凭据安全。** 配置里不含明文密钥；每次调用会重新解析 `userNameRef` / `passwordRef` / `appSecretRef`。

## 已知限制

- **平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）**未**暴露——它超出 WebAPI 触达范围，已作为边界记录。
- `app` 认证使用了默认的、与部署无关的头部形式；**在对真实账套使用前，请对照你的金蝶版本核对签名方案**（mock 路径不校验签名）。
- DSH host/插件半区在 DSH profile 内编译；仅 `kd-core` 独立构建与测试。

## 安装

见 [INSTALL.zh.md](../INSTALL.zh.md)。升级与卸载见 [UPDATE.zh.md](../UPDATE.zh.md) 与 [UNINSTALL.zh.md](../UNINSTALL.zh.md)。

## 链接

- 主页：https://github.com/maxwell-feng/dsh-kingdee
- 更新历史：[CHANGELOG.md](../CHANGELOG.md)
