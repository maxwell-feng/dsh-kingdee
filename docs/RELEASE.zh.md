# 发行说明 — v0.14.0

[英文](RELEASE.md) | 中文

发行日期：2026-10-16

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布第二十版 v0.14.0。这是一个**适配 DeepSeek Harness 0.2.1-alpha.4 并修正许可证声明的版本**：全部 `@deepseek-ai/dsh-*` 开发依赖升至 0.2.1-alpha.4，锁文件与 pnpm 供应链豁免清单按该版本重新生成，两个语种的 README 也不再声称 `LICENSE` 文件自 0.5.0 起就已不再采用的专有许可。账套兼容性保持不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x；**未进行真实账套联调验证**。

## 变更

- **宿主对齐**：全部 `@deepseek-ai/dsh-*` 开发依赖由 DeepSeek Harness 0.2.1-alpha.2 升级至 0.2.1-alpha.4，锁文件按 0.2.1-alpha.4 重新生成。`@deepseek-ai/cordis` 保持 `^4.0.4`，`@deepseek-ai/schemastery` 保持 `^3.18.4`。0.2.1-alpha.3 与 0.2.1-alpha.4 两个版本未改动本插件所使用的任何服务缝：`@deepseek-ai/dsh-web`、`@deepseek-ai/dsh-tools`、`@deepseek-ai/dsh-credentials`，以及设置卡片背后的 `ctx.configForms.get()` 契约，就本插件的用法而言源码完全一致。
- **供应链豁免清单重建**：工作区文件现对 0.2.1-alpha.4 的各包豁免 pnpm 的最小发布年龄闸门 —— 否则 DSH 持续发布的预发行版会被拦下。此前的名单还带有第二个 `minimumReleaseAgeExclude` 键，其过期的 `0.2.0-rc.2` 条目会让 pnpm 拒绝重新生成的锁文件；该名单现为单一且由锁文件推导的区块。
- **源码改动：无。** `src/`、`test/`、`scripts/`、`.github/`、`skills/`、`cordis.patch.yml` 与构建配置下均无文件改动，配置字段也没有任何迁移：插件行为与 0.13.0 完全一致。

## 修复

- **两个语种的 README 许可证章节都与 LICENSE 文件矛盾。** `README.md` 与 `README.zh.md` 把本仓库描述为采用「专有许可证（保留所有权利）」，而 `LICENSE` 与 `package.json.license` 自 0.5.0 起一直是 MIT 许可证；GitHub 与 npm 对已发布包的识别结果也都是 `MIT`。两个 README 现均写明 MIT 并链接 LICENSE 文件。
- **更新日志从未记录许可证回退。** 0.2.0 条目仍把专有授权描述为现行状态。该条目现标注该授权已被撤销，并在 0.5.0 条目中记录 MIT 的恢复，使版本历史与实际发布物一致。

## 更新说明

- **安装命令**：`dsh plugin --profile web add dsh-kingdee@0.14.0` 装入 DSH profile，然后启用该行。
- **升级命令**：`dsh plugin --profile web update dsh-kingdee`；或执行 `dsh plugin --profile web add dsh-kingdee@0.14.0` 锁定版本。
- **环境要求**：harness `>=0.1.7-alpha.2 <0.3.0`，Node 22 或更新。
- **非强制升级**：peer 区间保持 `>=0.1.7-alpha.2 <0.3.0` 不变，因此 `dsh-kingdee@0.13.0` 在 DeepSeek Harness 0.2.1-alpha.4 上同样被准入。

## 验证

- `pnpm run typecheck` 零错误、`pnpm run build` 干净（`tsc -p tsconfig.build.json` 加 `tsdown` 客户端 bundle），**15** 项单元测试（`pnpm test`）在 DeepSeek Harness 0.2.1-alpha.4 上全部通过。
- `node scripts/check-docs-language.ts` 检查全部通过，零发现。
- 未验证项：在真实 `0.2.1-alpha.4` profile 中的实际启动；以及一如既往，未做真实金蝶账套联调。
