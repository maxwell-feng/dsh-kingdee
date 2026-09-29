# 发行说明 — v0.12.0

[英文](RELEASE.md) | 中文

发行日期：2026-09-29

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布第十八版 v0.12.0。这是一个**适配 DeepSeek Harness 0.2.0-rc.2 的版本**：`@deepseek-ai/dsh-*` 的全部开发依赖升至 `0.2.0-rc.2`，锁文件按该版本重新生成，工作区的供应链豁免清单也刷新为 `0.2.0-rc.2` 的包集合。运行时源码、配置字段与工具接口均未改动，因此插件行为与 v0.11.1 完全一致。账套兼容性保持不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x；**未进行真实账套联调验证**。

## 变更

- **宿主对齐**：`@deepseek-ai/dsh-*` 的全部开发依赖由 `0.2.0-rc.1` 升至 `0.2.0-rc.2`，锁文件按 `0.2.0-rc.2` 重新生成。`@deepseek-ai/cordis` 保持 `^4.0.4`、`@deepseek-ai/schemastery` 保持 `^3.18.4`。
- **peer 区间不变**：`@deepseek-ai/dsh-credentials` 与 `@deepseek-ai/dsh-tools` 仍为 `>=0.1.7-alpha.2 <0.3.0`，即 0.11.0 放宽后的区间，因此 `dsh-kingdee@0.11.1` 在 DeepSeek Harness 0.2.0-rc.2 上同样被准入，**本版不是强制升级**。它是已针对 0.2.0-rc.2 完成验证、并对齐该版本开发依赖的版本。
- **供应链闸门**：工作区文件现对 `0.2.0-rc.2` 的各包豁免 pnpm 的最小发布年龄闸门 —— 否则 DSH 持续发布的预发行版会被拦下。
- **源码改动**：无。`src/`、`test/`、`scripts/`、`.github/`、`skills/`、`cordis.patch.yml` 与构建配置下均无文件改动，配置字段也没有任何迁移：插件行为与 0.11.1 完全一致。

## 更新说明

- **安装命令**：`dsh plugin add dsh-kingdee@0.12.0` 装入 DSH profile，然后启用该行。
- **升级命令**：`dsh plugin update dsh-kingdee`；或执行 `dsh plugin add dsh-kingdee@0.12.0` 锁定版本。由于 0.11.1 在 0.2.0-rc.2 上仍能加载，本版只要求更新包本身，且可以稍后再做。
- **环境要求**：harness `>=0.1.7-alpha.2 <0.3.0`，Node 22 或更新。在 DeepSeek Harness 0.2.0-rc.2 上，较旧的 `0.10.0` 仍会在加载阶段被拒绝，因为它的 `@deepseek-ai/dsh-*` peer（`^0.1.7-alpha.2`）不含 0.2.x。
- **无配置、接口与工具变更。** 十二个配置字段的名称、取值与默认值全部不变，`cordis.yml` 与 `cordis.patch.yml` 原样继续可用。详见 USAGE.zh.md 与 USAGE.md。

## 验证

- `pnpm run typecheck` 零错误、`pnpm run build` 干净（`tsc -p tsconfig.build.json` 加 `tsdown` 客户端 bundle），15 项单元测试（`pnpm test`）在 DeepSeek Harness 0.2.0-rc.2 上全部通过。
- 宿主自带的已发布实现 `evaluatePluginCompatibility` / `getDshRuntimeVersion`（来自 `@deepseek-ai/dsh-app-boot@0.2.0-rc.2`）报告运行时为 `0.2.0-rc.2`，在 `0.2.0-rc.2`、`0.2.0-rc.1`、`0.2.0`、`0.1.7-rc.2`、`0.1.7-alpha.2` 上均准入 `dsh-kingdee@0.12.0`；对 `0.1.6-alpha.2` 上的 `0.12.0` 则拒绝，而更早的 `dsh-kingdee@0.10.0`（`^0.1.7-alpha.2`）在 `0.2.0-rc.2` 上仍被拒绝。
- 未验证项：在真实 `0.2.0-rc.2` profile 中的实际启动（验证机器上没有 `dsh` CLI），以及未做真实金蝶账套联调。
