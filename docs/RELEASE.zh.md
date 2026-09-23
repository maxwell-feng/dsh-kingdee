# 发行说明 — v0.9.1

[英文](RELEASE.md) | 中文

发布日期：2026-09-23

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.9.1：本版为文档与仓库工程化修补版本，不改运行时逻辑、不改配置、不改工具接口，行为与 v0.9.0 完全一致。宿主与账套兼容性保持不变（DeepSeek Harness `0.1.7-rc.1`、金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x）。

## 变更

- **仓库现只保留 TypeScript 源码。** 双语文档闸门由 `scripts/check-docs-language.mjs` 迁至 `scripts/check-docs-language.ts`。Node ≥22.19 会剥离类型，因此该闸门依旧无需安装任何依赖即可运行，CI 中也仍在安装依赖之前执行。`tsconfig.json` 的 include 新增 `scripts/**/*.ts`，`pnpm run typecheck` 会一并检查该闸门；`.gitattributes` 同时移除了针对 JavaScript 的换行规则。

## 修复

- **更新日志正文丢失。** 英文更新日志的 0.4.0、0.3.0、0.2.3、0.2.2 四个版本只剩空标题，0.1.0 的 `Documentation` 条目同样被截断。现全部恢复，且中文 0.1.0 条目已补齐到与英文同等的详略程度。
- **配置文档章节编号错乱。** 该文档出现过两个 `## 3.` 章节，且 `2.1` / `2.2` 两个子节挂在错误的父节之下。现编号为 1–6，子节为 3.1 / 3.2，并已把「第 5 节」的交叉引用改指重编号后的 V9.1 符合性章节。
- **清单顺序。** README 工具表现与 USAGE 的逐工具参考章节顺序保持一致；文档列表补上了此前遗漏的配置文档。
- **重复分隔线与标题层级。** 移除中文更新日志中 6 处重复的 `---`；两侧现逐版本使用一致的标题层级，并各自补齐了此前缺失的链接定义块。

## 更新说明

- **升级命令**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.9.1`）。
- **环境要求**：harness `^0.1.7-alpha.2`，Node ≥22。
- **无配置与接口变更** —— 十二个配置字段的名称、取值与默认值全部不变，`cordis.yml` 与 `cordis.patch.yml` 原样继续可用。详见 [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.9.1/USAGE.zh.md) / [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.9.1/USAGE.md)。

## 验证

- `pnpm run typecheck` 零错误（现覆盖 `scripts/`）、构建干净（`tsc` + `tsdown`）、**15** 项单元测试通过（`pnpm test`）。
- `node scripts/check-docs-language.ts` 通过；发现上述缺陷的文档审计已无剩余发现。
- 声明的 DSH peer 依赖仍通过 DeepSeek Harness 自带的 `evaluatePluginCompatibility`（`dsh-v0.1.7-rc.1`）对运行时 `0.1.7-rc.1` 的校验：准入通过，无需豁免。
