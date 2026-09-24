# 发行说明 — v0.10.0

[英文](RELEASE.md) | 中文

发行日期：2026-09-24

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布第十五版 v0.10.0。本版完成与 DeepSeek Harness `0.1.7-rc.2` 的对齐——即本插件所遵循的插件开发文档的当前发行版——不改运行时逻辑、不改配置、不改工具接口，行为与 v0.9.1 完全一致。账套兼容性保持不变（金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x；**未进行真实账套联调验证**）。

## 变更

- **宿主对齐**：开发依赖锁定至 DeepSeek Harness `0.1.7-rc.2`，并已针对该版本完成验证。`@deepseek-ai/dsh-*` peer 区间保持 `^0.1.7-alpha.2`（引入易变配置的那条发布线），因此插件在 `0.1.7-alpha.2` 至 `0.1.7-rc.2` 的每一个 `0.1.7` 预发行版上均可安装。`engines.dsh` 保持 `^0.1.7-alpha.2`，`engines.node` 保持 `>=22`。
- **按 0.1.7-rc.2 插件开发文档逐缝核对**：本插件消费的全部接缝在 `0.1.7-rc.1` 与 `0.1.7-rc.2` 之间源码完全一致——包括由 Host 以 `entry.fiber.runtime.Config` 读取的宿主侧 `Config` schema（含各 `.volatile()` 字段，以及按 `entry.options.id` 键控的逐条目表单）；`ctx.tools.register` 与 `defineTool`；`ctx.credentials.resolve` 与 `credentialRef`；以及浏览器半端的各项契约——`ctx.configForms.get(entryId)` 返回的 `ConfigForm`（`getSnapshot` / `subscribe` / `set`）、`plugins.row.config` 与 `plugins.bundle.config` 槽位所用的 `PluginConfigViewProps`、`ctx.locale` 与 `ctx.slots`。本插件所消费的包中唯一发生改动的文件是 `@deepseek-ai/dsh-client-ui-settings` 的 `contract/slots.ts`，它只为 `SettingsLauncherOwnerProps` 增加了两个可选字段，而本插件并不使用该类型。故本版不改动任何插件源码。
- **`pnpm-workspace.yaml`**：改为对 `0.1.7-rc.2` 的确切包集合显式豁免 pnpm 的最小发布年龄闸门——否则 DSH 持续发布的预发行版会被该闸门拦下。

## 修复

- **中文更新日志的 0.3.0 条目已补齐到与英文同等的详略程度**，中文文档列表也改为指向 `CHANGELOG.zh.md` 而非英文更新日志。不涉及运行时逻辑、配置或工具接口变更。

## 更新说明

- **升级命令**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.10.0`）。
- **环境要求**：harness `^0.1.7-alpha.2`，Node ≥22。
- **无配置、接口与工具变更** —— 十二个配置字段的名称、取值与默认值全部不变，`cordis.yml` 与 `cordis.patch.yml` 原样继续可用。详见 [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.10.0/USAGE.zh.md) / [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.10.0/USAGE.md)。

## 验证

- `pnpm run typecheck` 零错误、构建干净（`tsc` + `tsdown`）、**15** 项单元测试在 DeepSeek Harness `0.1.7-rc.2` 上全部通过（`pnpm test`）。
- `pnpm install --frozen-lockfile` 通过 pnpm 的供应链策略校验。
- 声明的 DSH peer 依赖经 DeepSeek Harness 自带的 `evaluatePluginCompatibility`（`dsh-v0.1.7-rc.2`）对运行时 `0.1.7-rc.2`、`0.1.7-rc.1`、`0.1.7-alpha.2` 校验均准入，无需豁免。
- 实际发布的 `dsh-kingdee-0.10.0.tgz` 可装入真实的 `0.1.7-rc.2` profile（`dsh plugin --profile <name> add ./dsh-kingdee-0.10.0.tgz`），并以行 id `kingdee` 组合出 `# == dsh-kingdee` 层；`dsh --profile <name> --dump-config` 显示各 schema 默认值均已生效。
