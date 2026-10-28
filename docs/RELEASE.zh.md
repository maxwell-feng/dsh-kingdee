# 发行说明 — v0.16.0

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.md) | 中文

发行日期：2026-10-28

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.16.0，这是一个**适配 DeepSeek Harness 0.2.2-alpha.2 的版本**：全部 `@deepseek-ai/dsh-*` 开发依赖升至 0.2.2-alpha.2，锁文件与 pnpm 供应链豁免清单按该版本重新生成，`@deepseek-ai/cordis` 与 `@deepseek-ai/schemastery` 分别升至 `~4.0.6-alpha.1` 与 `~3.18.6-alpha.1`。账套兼容性保持不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x；**未进行真实账套联调验证**。

## 变更

- **宿主对齐**：全部 `@deepseek-ai/dsh-*` 开发依赖由 DeepSeek Harness 0.2.1-rc.2 升级至 0.2.2-alpha.2，锁文件按 0.2.2-alpha.2 重新生成。`@deepseek-ai/cordis` 升至 `~4.0.6-alpha.1`，`@deepseek-ai/schemastery` 升至 `~3.18.6-alpha.1`。
- **peer 区间放宽**：`@deepseek-ai/cordis` 改为 `^4.0.4 || ^4.0.6-alpha.1`，`@deepseek-ai/schemastery` 改为 `^3.18.4 || ~3.18.6-alpha.1`，因此本插件既继续接受此前验证过的 4.0.4 / 4.0.5 / 3.18.4 / 3.18.5，也接受当前构建与测试所用的新预发行版。
- **供应链豁免清单重建**：工作区文件现对 0.2.2-alpha.2 的各包豁免 pnpm 的最小发布年龄闸门 —— 否则 DSH 持续发布的预发行版会被拦下。该名单保持单一且由锁文件推导的区块。
- **源码改动：无。** `src/`、`test/`、`scripts/`、`.github/`、`skills/`、`cordis.patch.yml` 与构建配置下均无文件改动，配置字段也没有任何迁移：插件行为与 0.15.1 完全一致。

## 已对照 0.2.2-alpha.2 核对（均确认为无影响）

DeepSeek Harness 0.2.2-alpha.2 公布了三项可能波及插件的破坏性变更。以下逐条对照本仓库实际代码核对，而非默认其无害：

- **Cordis Timer 同步上游实现，返回值发生变化。** 本插件唯一的计时器用法在 `src/kd-core/transport.ts`，它用全局 `setTimeout` 设定单次请求超时，并用 `clearTimeout` 清除；从不调用 `ctx.timer.timeout()` / `interval()` / `throttle()` / `debounce()`，因此变化后的返回值不会触及本插件。核对方式：在 `src/` 中检索全部计时器用法。
- **`dsh-tools` 把声明拆分为 `Contracts` / `ToolExecutor` / pipeline 等模块。** `src/tools.ts` 使用 `defineTool({ … })` 加 `ctx.tools.register(definition)`，该调用仍能通过类型检查。`DefineToolOptions` 与 `ToolDefinition` —— 包括必需的 `output.schema` 与 `render` 投影 —— 在 0.2.1-rc.2 与 0.2.2-alpha.2 的 `lib/types/schema.d.ts` / `contracts.d.ts` 之间声明完全一致。注册接口上唯一的改动是纯新增：`ToolsService.register` 增加了一个可选第二参数（`ToolRegistrationOptions`，用于按步骤的条件启用），因此原有的单参数调用依然有效。
- **`dsh.client` manifest（`platform` / `inject`）语义。** `dsh.client.inject` 中列出的每个包 —— `dsh-client-locale`、`dsh-client-ui-settings`、`dsh-client-ui-plugin-manager`、`dsh-api-remotes`、`dsh-client-connection` —— 在 0.2.2-alpha.2 上仍照常发布，仍各自声明 `dsh.client.platform: "web"`，也仍各自导出 `./client` bundle，因此无需删除任何一项。bundle 唯一的外部模块请求 `react` 没有变化。

除上述三项公布变更外，设置卡片的服务缝也一并复核：`ctx.configForms.get()`、`slots` 与 `remote` 在两个版本之间声明完全一致。locale 服务有一处改动，属于放宽而非破坏：`LocaleRuntime.register()` 的带类型重载现在也接受额外语种字典（rc2 要求恰好为 `Record<BuiltInLocaleId, LocaleDictOf<N>>`；alpha2 则接受该类型与 `Record<LocaleId, LocaleDictOf<N>>` 的交叉类型）。卡片在单次调用中注册 `{ en, zh }`，仍满足放宽后的签名 —— 已由 `npx tsc -p tsconfig.json --noEmit` 验证。

## 更新说明

- **安装命令**：`dsh plugin --profile web add dsh-kingdee@0.16.0` 装入 DSH profile，然后启用该行。
- **升级命令**：`dsh plugin --profile web update dsh-kingdee`；或执行 `dsh plugin --profile web add dsh-kingdee@0.16.0` 锁定版本。
- **环境要求**：harness `>=0.1.7-alpha.2 <0.3.0`，Node 22 或更新。
- **非强制升级**：`engines.dsh` 区间保持 `>=0.1.7-alpha.2 <0.3.0` 不变，因此 `dsh-kingdee@0.15.1` 在 DeepSeek Harness 0.2.2-alpha.2 上同样被准入。

## 验证

- `node scripts/check-docs-language.ts` 检查全部通过，零发现。
- `npx tsc -p tsconfig.json --noEmit` 零错误。
- `npm run build` 干净（`tsc -p tsconfig.build.json` 加 `tsdown` 客户端 bundle）。
- **15** 项单元测试（`npm test`）在 DeepSeek Harness 0.2.2-alpha.2 上全部通过。
- 未验证项：在真实 `0.2.2-alpha.2` profile 中的实际启动；以及一如既往，未做真实金蝶账套联调。
