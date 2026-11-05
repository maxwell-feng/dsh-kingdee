# 发行说明 — v0.18.0

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.md) | 中文

发行日期：2026-11-05

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.18.0，这是一个**宿主基线版本**：构建基准由 `0.2.2-alpha.2` master 预览线迁移到 **`0.2.2-rc.1`**（npm `next` 标签，2026-11-04 发布），并同时针对 **`0.2.2-rc.1`** 与 **`0.2.1-rc.5`** 两条线完成验证 —— 后者是 npm `latest` 标签上的最新正式发布，也是桌面版实际内置的运行时。账套兼容性保持不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x。**既未做真实 profile 启动验证，也未做真实账套联调验证。**

## 本版为何存在

DeepSeek Harness 同时推进两个 dist-tag：`latest` 跟最新的节点版本发布，`next` 跟下一条版本线的候选发布。2026-11-04 `next` 前进到 `0.2.2-rc.1`，即 `0.2.2-alpha.2` 所预览的那条线进入候选发布阶段。只按 alpha 预览构建的插件，会比 `next` 用户实际装到的版本落后一步，因此 0.18.0 把构建基准挪到 rc.1 并在该线上重跑全套检查，同时保留 rc.5 的验证，让跑桌面版运行时的用户仍被覆盖。

## 变更

- **构建基准迁移到 `0.2.2-rc.1`。** `@deepseek-ai/dsh-*` 的全部开发依赖由 `0.2.2-alpha.2` 升至 `0.2.2-rc.1`，锁文件按 rc.1 重新生成；`@deepseek-ai/cordis` 升至 `~4.1.0`，`@deepseek-ai/schemastery` 升至 `~3.19.0`。
- **peer 区间无需改动，这是一个结论而不是疏漏。** `@deepseek-ai/cordis` 仍为 `^4.0.4 || ^4.0.6-alpha.1`，`@deepseek-ai/schemastery` 仍为 `^3.18.4 || ~3.18.6-alpha.1`，因为 `^4.0.4` 本已覆盖 cordis 4.1.0、`^3.18.4` 本已覆盖 schemastery 3.19.0。两条线都不被排除，此时放宽区间只会暗示一个并不存在的破坏性变更。
- **供应链豁免清单已刷新。** 工作区名单对 rc.1 的包集合豁免 pnpm 的最小发布年龄闸门；它仍然保持单一且由锁文件推导的区块。
- **源码改动：无。** `src/`、`test/`、`scripts/`、`locale/`、`skills/`、`docs/`、`.github/`、`cordis.patch.yml`、`tsconfig*.json` 与 `tsdown.config.ts` 下均无文件改动，配置字段也没有任何迁移：插件行为与 0.17.0 完全一致。相对 0.17.0 的 `git diff --stat` 只列出 `package.json`、`pnpm-lock.yaml` 与 `pnpm-workspace.yaml`。

## 已对照 0.2.2-rc.1 核对（均确认为无影响）

本次比对描述的是本包实际消费的内容，而不是读发布说明推断：

- **声明逐字节相同。** `dsh-tools`、`dsh-web` 与 `dsh-credentials` 三个包与 `0.2.2-alpha.2` 的对应版本仅 `package.json` 不同；本插件读取的每一份 `.d.ts` 声明都没有变化。因此 `DefineToolOptions`、`ToolDefinition`、`ToolsService.register`、`credentialRef` / `ctx.credentials.resolve`、`ctx.configForms.get()`、`slots` 与 `remote` 的形状全部保持不变。
- **`dsh-util-values` 做了内部重构。** 仅涉及实现；本插件调用的配置取值辅助函数声明不变。
- **`dsh-llm` 的 `GenerateOptions.purpose` 改为泛型。** 无影响：本插件从不构造辅助 LLM 请求，因此从未构造该选项。
- **`dsh-client-ui-settings` 新增可选 slot `settings.section.icon`。** 纯增量；本插件不注册任何设置区块 slot，其设置卡片无需改动即可编译。
- **`dsh-client-ui-plugin-manager` 的 `InstallState` 新增诊断字段。** 纯增量；本插件不读取任何 `InstallState` 字段。
- **`cordis` 4.1.0 与 4.0.6-alpha.2 声明完全一致**，因此 `Schema.string().volatile()` 与整个 `Config` 对象在 `schemastery` 3.19.0 + `cordis` 4.1.0 下仍通过类型检查。
- **rc.1 公布的破坏性变更均不触及本插件。** 最低 Node.js 提升到 **24.9**；Cordis Core 升到 **4.1.0**，配套 Loader **1.1.0** 与 Include **1.1.0**；`web_fetch` 不再拒绝私网地址。前两项属于宿主运行时，本包自有的 `engines.node` 仍为 `>=22` —— 但在这样的宿主上实际需要 Node.js 24.9 或更新版本。第三项针对宿主的 fetch provider，而本插件从不调用该工具：它经 `src/kd-core/transport.ts` 自行发起 HTTP 请求，并用 `src/kd-core/security.ts` 中的 `isPrivateOrLocalHost` 校验每个主机，因此自带的 SSRF 防御保持不变。

## 更新说明

- **安装命令**：`dsh plugin --profile web add dsh-kingdee@0.18.0` 装入 DSH profile，然后启用该行。
- **升级命令**：`dsh plugin --profile web update dsh-kingdee`；或执行 `dsh plugin --profile web add dsh-kingdee@0.18.0` 锁定版本。
- **环境要求**：harness `>=0.1.7-alpha.2 <0.3.0`，核心库与测试需要 Node 22 或更新版本。
- **非强制升级**：`engines.dsh` 区间保持 `>=0.1.7-alpha.2 <0.3.0` 不变，按区间语义本身就把 `0.2.2-rc.1` 纳入准入，因此 `dsh-kingdee@0.17.0`、`0.16.0` 与 `0.15.1` 在两条已验证版本线上同样被准入。

## 验证

- rc.1 线（钉定 `0.2.2-rc.1` / `cordis` 4.1.0 / `schemastery` 3.19.0）：`tsc -p tsconfig.json --noEmit` 零错误、`npm run build` 构建干净、**15/15** 单元测试通过。
- rc.5 线（钉定 `0.2.1-rc.5` / `cordis` 4.0.5 / `schemastery` 3.18.5）：`tsc -p tsconfig.json --noEmit` 零错误、`npm run build` 构建干净、**15/15** 单元测试通过。
- `node scripts/check-docs-language.ts` 在全部中英文档对上均为零发现；对同一批文档对另做了一轮人工检查，表格列数、标题层级、列表编号、链接定义、重复词与标点混排均未发现缺陷。
- 相对 0.17.0 的 `git diff --stat` 只列出 `package.json`、`pnpm-lock.yaml` 与 `pnpm-workspace.yaml`，因此两条线验证的是同一份代码。
- 未验证项：在真实 rc.1 或 rc.5 profile 中的实际启动；宿主自带的插件兼容性准入校验（需真实 profile）；以及一如既往，未做真实金蝶账套联调。
