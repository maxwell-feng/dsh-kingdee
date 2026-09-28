# 发行说明 — v0.11.1

[英文](RELEASE.md) | 中文

发行日期：2026-09-28

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布第十七版 v0.11.1。这是一个**纯文档修正版本**：源码、清单 peer 与配置均与 v0.11.0 完全一致，插件行为不变。本版关闭了一轮完整双语校对发现的缺陷，并保留 0.11.0 引入的 DeepSeek Harness 0.2.0-rc.1 适配。账套兼容性保持不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x；**未进行真实账套联调验证**。

## 修复

- **英文 0.7.0 条目比中文单薄。** 补齐第三方 `LoginByAppSecret` 登录（`app` 模式）、取消伪造 `KDAuthentication` 请求头并新增 `userNameRef` 必填要求，以及曾导致真实账套认证失败的登录响应修复（`parseLoginOutcome`）。
- **中文 0.6.1 条目有一个与英文分类不一致的标题，以及一条没有对应内容的空泛条目**；标题现为 `移除`，填充条目已删除。
- **同一示例出现两个占位域名。** 配置指南用 `https://erp.mycompany.com/K3Cloud`，而其他指南统一用 `https://erp.example.com/K3Cloud`；两侧现统一为 `erp.example.com`。
- **中文配置指南把凭据缝契约写成散文**，而英文为两条列表；中文侧现改为相同的两条列表。
- **中文安装指南漏列 `172.16.0.0/12`** 这一被前置条件中列举的私网网段。
- **中文指南的章节编号现与英文一致。** 安装与卸载指南的顶层章节原用中文数字，而英文用 `1.`–`5.`；两侧现统一编号，可逐节对齐。

## 更新说明

- **安装命令**：`dsh plugin add dsh-kingdee@0.11.1` 装入 DSH profile，然后启用该行。
- **升级命令**：`dsh plugin update dsh-kingdee`；或执行 `dsh plugin add dsh-kingdee@0.11.1` 锁定版本。除更新包之外无需任何操作：本次只有文档变化。
- **环境要求**：harness `>=0.1.7-alpha.2 <0.3.0`，Node 22 或更新。在 DeepSeek Harness 0.2.0-rc.1 上，较旧的 `0.10.0` 仍会在加载阶段被拒绝，因为它的 `@deepseek-ai/dsh-*` peer 区间不含 0.2.x。
- **无配置、接口与工具变更。** 十二个配置字段的名称、取值与默认值全部不变，cordis.yml 与 cordis.patch.yml 原样继续可用。详见 USAGE.zh.md 与 USAGE.md。

## 验证

- `pnpm run typecheck` 零错误、`pnpm run build` 干净（`tsc -p tsconfig.build.json` 加 `tsdown` 客户端 bundle），15 项单元测试（`pnpm test`）在 DeepSeek Harness 0.2.0-rc.1 上全部通过。
- `node scripts/check-docs-language.ts` 通过；另对全部双语文档做了两遍机械校对（结构与代码围栏对齐、乱码与控制字符扫描、更新日志由新到旧排序且链接引用完整、逐节条目对应）。
- 宿主自带的已发布实现 `evaluatePluginCompatibility` / `getDshRuntimeVersion`（来自 `@deepseek-ai/dsh-app-boot@0.2.0-rc.1`）报告运行时为 `0.2.0-rc.1`，在 `0.2.0-rc.1`、`0.2.0`、`0.1.7-rc.2`、`0.1.7-alpha.2` 上均准入 `dsh-kingdee@0.11.1`；并在 `0.2.0-rc.1` 上拒绝 `dsh-kingdee@0.10.0`，在 `0.1.6-alpha.2` 上拒绝 `dsh-kingdee@0.11.1`。
- 实际打包的 0.11.1 压缩包含构建产物 `lib/`、`cordis.patch.yml`、`skills/kingdee-bos` 技能与中英双语指南，其清单即上述闸门所准入的那一份。
- 未验证项：在真实 `0.2.0-rc.1` profile 中的实际启动（验证机器上没有 `dsh` CLI），以及未做真实金蝶账套联调。
