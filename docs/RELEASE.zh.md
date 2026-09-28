# 发行说明 — v0.11.0

[英文](RELEASE.md) | 中文

发行日期：2026-09-28

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布第十六版 v0.11.0。本版通过把 `@deepseek-ai/dsh-credentials` 与 `@deepseek-ai/dsh-tools` 两个 peer 区间放宽为 `>=0.1.7-alpha.2 <0.3.0`，完成对 DeepSeek Harness 0.2.0-rc.1 的适配：0.2.0-rc.1 引入了硬性 peer 兼容性闸门，凡 DSH peer 与唯一运行时不匹配的插件行都会被拒绝。此前的 0.10.0 声明的是 `^0.1.7-alpha.2`，该区间不含 0.2.x，因此在 0.2.0-rc.1 上会被拒绝，必须升级。本版不改运行时逻辑、不改配置、不改工具接口，行为与 v0.10.0 完全一致。账套兼容性保持不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x；**未进行真实账套联调验证**。

## 变更

- **宿主对齐**：开发依赖升级到 DeepSeek Harness 0.2.0-rc.1，并已针对该版本完成验证；`@deepseek-ai/cordis` 保持 `^4.0.4`、`@deepseek-ai/schemastery` 保持 `^3.18.4`。
- **peer 区间放宽为 `>=0.1.7-alpha.2 <0.3.0`**：DeepSeek Harness 0.2.0-rc.1 会在插件行加载之前，用唯一的运行时版本校验每一处名为 `@deepseek-ai/dsh` / `@deepseek-ai/dsh-*` 的 peer 依赖，预发行版参与区间匹配；不兼容的行会被拒绝（不兼容的 bundle 会被跳过）。凭据与工具两个 peer 现可准入 `0.1.7-alpha.2` 至 `0.2.x`，因此插件在两条发布线上均可加载，但在 `0.1.6-alpha.2` 上仍会被拒绝。闸门读取的**不是** `engines.dsh`。
- **供应链闸门**：工作区文件现对 `0.2.0-rc.1` 的各包豁免 pnpm 的最小发布年龄闸门 —— 否则 DSH 持续发布的预发行版会被拦下；锁文件已按 `0.2.0-rc.1` 重新生成。
- **源码改动**：无。`src/`、`test/`、`scripts/`、`.github/`、`skills/`、`cordis.patch.yml` 与构建配置下均无文件改动，配置字段也没有任何迁移。

## 修复

- **0.10.0 在 DeepSeek Harness 0.2.0-rc.1 上会在加载阶段被拒绝**：它声明的 `@deepseek-ai/dsh-*` peer 区间不含 0.2.x，因此被新闸门拒绝。放宽区间后，插件无需豁免即可在 0.2.0-rc.1 上准入，因此 0.2.0-rc.1 上的用户必须升级到 0.11.0。`dsh plugin allow-version <package@version> --dsh-version <runtime> --accept-risk`（或插件管理器）仅作为记录在 profile `compatibility.json` 中的确切版本风险确认而存在：它不是兼容性修复，插件升级与宿主升级也都不会继承该授权。

## 更新说明

- **安装命令**：`dsh plugin add dsh-kingdee@0.11.0` 装入 DSH profile，然后启用该行。
- **升级命令**：`dsh plugin update dsh-kingdee`；或执行 `dsh plugin add dsh-kingdee@0.11.0` 锁定版本。在 DeepSeek Harness 0.2.0-rc.1 上**必须**离开 0.10.0：其 `@deepseek-ai/dsh-*` peer 区间不含 0.2.x，宿主会在加载阶段拒绝该行。
- **环境要求**：harness `>=0.1.7-alpha.2 <0.3.0`，Node 22 或更新。
- **无配置、接口与工具变更。** 十二个配置字段的名称、取值与默认值全部不变，cordis.yml 与 cordis.patch.yml 原样继续可用。详见 USAGE.zh.md 与 USAGE.md。

## 验证

- 类型检查与构建均干净（`pnpm run typecheck`、`pnpm run build` —— `tsc -p tsconfig.build.json` 加 `tsdown` 客户端 bundle），15 项单元测试（`pnpm test`）在 DeepSeek Harness 0.2.0-rc.1 上全部通过。
- `pnpm install` 通过 pnpm 的供应链（最小发布年龄）闸门。
- 宿主自带的已发布实现 `evaluatePluginCompatibility` / `getDshRuntimeVersion`（来自 `@deepseek-ai/dsh-app-boot@0.2.0-rc.1`）报告运行时为 `0.2.0-rc.1`，在 `0.2.0-rc.1`、`0.2.0`、`0.1.7-rc.2`、`0.1.7-alpha.2` 上均准入 `dsh-kingdee@0.11.0`，并在 `0.2.0-rc.1` 上以 `@deepseek-ai/dsh-credentials`、`@deepseek-ai/dsh-tools`（`^0.1.7-alpha.2`）peer 不满足为由拒绝 `dsh-kingdee@0.10.0`；对 `0.1.6-alpha.2` 上的 `0.11.0` 同样拒绝。
- 实际打包的 0.11.0 压缩包含构建产物 `lib/`、`cordis.patch.yml`、`skills/kingdee-bos` 技能与中英双语指南，其清单即上述闸门所准入的那一份。
- 未验证项：在真实 `0.2.0-rc.1` profile 中的实际启动（验证机器上没有 `dsh` CLI），以及未做真实金蝶账套联调。
