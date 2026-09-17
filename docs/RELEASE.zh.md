# 发行说明 — v0.8.1

[英文](RELEASE.md) | 中文

发布日期：2026-09-18

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.8.1：本版补齐语言边界 —— 运行时文案与全部文档都只有一种语言 —— 并加入保持这一状态的规则与检查脚本。宿主与账套兼容性与 v0.8.0 一致（DeepSeek Harness `0.1.6-alpha.2`、金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x）。

## 变更

- **运行时文案全部英文化**：`kingdee_delete_draft` 工具描述、设置卡的用户名标签、`authMode: "app"` 的报错文案，以及全部源码注释。
- **按设计保留两处中文**：`src/kd-core/errors.ts` 中用于识别金蝶 WebAPI 中文报错的 `登录` 匹配式，以及插件卡片上的中文产品显示名。两者都登记在检查脚本的 `SRC_CJK_ALLOW` 中。
- **双语文档规范化**：所有文档一文件一语言（`X.md` 英文、`X.zh.md` 中文），成对齐全、切换行统一；两份更新日志现覆盖同样的 13 个版本。

## 新增

- `AGENTS.md` 写明双语规则；`scripts/check-docs-language.mjs` 在本地与 CI 中检查文档、源码文案与配对（CI 在安装依赖前运行）。

## 更新说明

- **升级命令**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.8.1`）。
- **环境要求**：harness `^0.1.6-alpha.2`，Node ≥22。
- **无配置与接口变更** —— 本版只改文案、文档与工具链。详见 [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.8.1/USAGE.zh.md) / [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.8.1/USAGE.md)。

## 验证

- `pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`）、构建干净，且 `node scripts/check-docs-language.mjs` 全绿。
