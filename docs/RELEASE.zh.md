# 发行说明 — v0.15.0

[英文](RELEASE.md) | 中文

发行日期：2026-10-18

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.15.0，这是一个**适配 DeepSeek Harness 0.2.1-rc.2 的版本**：全部 `@deepseek-ai/dsh-*` 开发依赖升至 0.2.1-rc.2，锁文件与 pnpm 供应链豁免清单按该版本重新生成，`@deepseek-ai/cordis` 与 `@deepseek-ai/schemastery` 分别升至 `^4.0.5` 与 `^3.18.5`。账套兼容性保持不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x；**未进行真实账套联调验证**。

## 变更

- **宿主对齐**：全部 `@deepseek-ai/dsh-*` 开发依赖由 DeepSeek Harness 0.2.1-alpha.4 升级至 0.2.1-rc.2，锁文件按 0.2.1-rc.2 重新生成。`@deepseek-ai/cordis` 升至 `^4.0.5`，`@deepseek-ai/schemastery` 升至 `^3.18.5`。0.2.1-alpha.4 与 0.2.1-rc.2 两个版本未改动本插件所使用的任何服务缝：设置卡片背后的 `ctx.configForms.get()` 契约，以及该卡片注入的 `slots`、`locale`、`remote`、`connection` 契约，就本插件的用法而言声明完全一致。
- **供应链豁免清单重建**：工作区文件现对 0.2.1-rc.2 的各包豁免 pnpm 的最小发布年龄闸门 —— 否则 DSH 持续发布的预发行版会被拦下。该名单保持单一且由锁文件推导的区块。
- **源码改动：无。** `src/`、`test/`、`scripts/`、`.github/`、`skills/`、`cordis.patch.yml` 与构建配置下均无文件改动，配置字段也没有任何迁移：插件行为与 0.14.0 完全一致。

## 修复

- **两个语种的兼容性说明都错误描述了准入闸门。** `README.md`、`README.zh.md`、`INSTALL.md`、`INSTALL.zh.md`、`UPDATE.md` 与 `UPDATE.zh.md` 原先称闸门只读取 `@deepseek-ai/dsh*` 的 `peerDependencies`，且「闸门读取的**不是** `engines.dsh`」。自 DeepSeek Harness 0.2.1-alpha.4 起，插件自有的 `engines.dsh` 区间单独决定准入，peer 在该项校验中被忽略。相关说明现已更正，且准入结论不变：本插件声明 `engines.dsh: ">=0.1.7-alpha.2 <0.3.0"`，因此在 0.2.1-rc.2 上无需豁免即被准入。
- **中文文档的首段验证说明写错了运行时版本。** `INSTALL.zh.md`、`USAGE.zh.md`、`CONFIG.zh.md`、`UPDATE.zh.md` 与 `UNINSTALL.zh.md` 曾称宿主自带的兼容性校验在运行时 `0.2.1-alpha.2` 上准入本插件，而同一句的其余部分写的是 `0.2.1-alpha.4`；现统一改为本版实际验证所用的版本。

## 更新说明

- **安装命令**：`dsh plugin --profile web add dsh-kingdee@0.15.0` 装入 DSH profile，然后启用该行。
- **升级命令**：`dsh plugin --profile web update dsh-kingdee`；或执行 `dsh plugin --profile web add dsh-kingdee@0.15.0` 锁定版本。
- **环境要求**：harness `>=0.1.7-alpha.2 <0.3.0`，Node 22 或更新。
- **非强制升级**：`engines.dsh` 区间保持 `>=0.1.7-alpha.2 <0.3.0` 不变，因此 `dsh-kingdee@0.14.0` 在 DeepSeek Harness 0.2.1-rc.2 上同样被准入。

## 验证

- `pnpm run typecheck` 零错误、`pnpm run build` 干净（`tsc -p tsconfig.build.json` 加 `tsdown` 客户端 bundle），**15** 项单元测试（`pnpm test`）在 DeepSeek Harness 0.2.1-rc.2 上全部通过。
- `node scripts/check-docs-language.ts` 检查全部通过，零发现。
- 未验证项：在真实 `0.2.1-rc.2` profile 中的实际启动；以及一如既往，未做真实金蝶账套联调。
