# 发行说明 — v0.2.0

发布日期：2026-09-01

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）第二次发布。

## 本版本新增

- **六项新增数据/服务层操作**及对应 DSH 工具：
  - `kingdee_logout`（退出会话）
  - `kingdee_list_datacenters`（列出可达数据中心/账套）
  - `kingdee_query_business_data`（新版结构化查询）
  - `kingdee_unsubmit`（反提交）
  - `kingdee_delete_draft`（删除草稿/暂存）
  - `kingdee_batch_save`（单次批量保存多条）
- **可覆盖的服务端点**（`serviceEndpoints` 配置 / `KdConfig.endpoints`），可按你的金蝶版本匹配 WebAPI 服务名。
- 新增操作的单元测试（7/7 通过）。
- 跨平台密钥配置文档（Linux/macOS、Windows PowerShell/CMD、DSH 凭据库）。
- 许可证改为专有（保留所有权利）。

## 亮点

- **更完整的状态机** —— 创建/更新 → 批量保存 → 提交 → 审核 → 反审核 → 反提交 + 删草稿，开箱即用。
- **离线 Mock** 仍覆盖全部工具集（`mock: true`）。
- **端点可配置**，让服务名不同的部署无需改代码即可覆盖。

## 已知限制

- **平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）**未**暴露——它超出 WebAPI 触达范围，已作为边界记录。
- **`app` 认证**使用了默认的、与部署无关的头部形式；在对真实账套使用前，请对照你的金蝶版本核对签名方案（mock 路径不校验签名）。较新的公有云租户可能要求第三方（app）认证 / OpenAPI。
- 部分端点名（`LogOut`、`ListDataCenter`、`UnSubmit`、`DeleteDraft`、`QueryBusinessData`）随金蝶版本而异；请在你的部署中用 `serviceEndpoints` 覆盖。
- DSH host/插件半区在 DSH profile 内编译；仅 `kd-core` 独立构建与测试。

## 安装

见 [INSTALL.zh.md](../INSTALL.zh.md)。升级与卸载见 [UPDATE.zh.md](../UPDATE.zh.md) 与 [UNINSTALL.zh.md](../UNINSTALL.zh.md)。

## 链接

- 主页：https://github.com/maxwell-feng/dsh-kingdee
- 更新历史：[CHANGELOG.md](../CHANGELOG.md)
