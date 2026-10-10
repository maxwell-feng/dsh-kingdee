# 发行说明 — v0.13.0

[英文](RELEASE.md) | 中文

发行日期：2026-10-11

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布第十九版 v0.13.0。这是一个**适配 DeepSeek Harness 0.2.1-alpha.2 与插件展示元数据规范的版本**：包含了原生 `icon.svg` 矢量图标、中英双语展示资源清单（`locale/en.json`、`locale/zh.json`）、自包含的 prepare 构建脚本、纯 TypeScript 架构以及遵循最新规范的 `--profile <name>` 命令行选项排布。账套兼容性保持不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x；**未进行真实账套联调验证**。

## 新增

- **展示元数据与专属图标**：内置原生 `icon.svg` 矢量图标与中英双语展示清单（`locale/en.json`、`locale/zh.json`），完全符合 DeepSeek Harness 0.2.1-alpha.2 插件管理器规范。在 `package.json` 中配置顶层属性 `"icon": "./icon.svg"` 并导出 `"./locale/*.json"` 与 `"./icon"`。
- **自包含构建脚本**：在 `package.json` 中配置 `"prepare": "tsc -p tsconfig.build.json && tsdown"`，支持直接通过 Git 仓库安装，不依赖宿主环境是否预装全局 `pnpm`。

## 变更

- **开发依赖对齐**：全部 `@deepseek-ai/dsh-*` 开发依赖由 `0.2.0-rc.2` 升级至 `0.2.1-alpha.2`；`@deepseek-ai/cordis` 保持 `^4.0.4`，`@deepseek-ai/schemastery` 保持 `^3.18.4`。
- **兼容性区间保持稳定**：peer 依赖区间保持 `>=0.1.7-alpha.2 <0.3.0`，因此 `0.12.0` 与 `0.11.1` 在 DeepSeek Harness 0.2.1-alpha.2 上同样受支持，本版本非强制升级。
- **纯 TypeScript 架构**：优化 `src/config.ts` 中 `Config` 架构导出类型声明，消除 TS2742 类型不可便携警告，全库保持 100% 纯 TypeScript。
- **规范化命令行选项**：更新各文档中的 CLI 命令，遵循 DeepSeek Harness 0.2.1-alpha.1 规范，统一将 `--profile <name>` 参数置于 `add`、`remove`、`update` 等子命令之前。

## 更新说明

- **安装命令**：`dsh plugin --profile web add dsh-kingdee@0.13.0` 装入 DSH profile，然后启用该行。
- **升级命令**：`dsh plugin --profile web update dsh-kingdee`；或执行 `dsh plugin --profile web add dsh-kingdee@0.13.0` 锁定版本。
- **环境要求**：harness `>=0.1.7-alpha.2 <0.3.0`，Node 22 或更新。

## 验证

- `pnpm run typecheck` 零错误、`pnpm run build` 干净（`tsc -p tsconfig.build.json` 加 `tsdown` 客户端 bundle），15 项单元测试（`pnpm test`）在 DeepSeek Harness 0.2.1-alpha.2 上全部通过。
- `node scripts/check-docs-language.ts` 检查全部通过，零语言混淆或链接跳转错误。
