# 发行说明 — v0.20.0

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.md) | 中文

发布日期：2026-11-13

`dsh-kingdee` 0.20.0 完成与 DeepSeek Harness 0.2.2-rc.3（2026-11-13 发布）的对齐。本版仅更新依赖：没有 API、配置或行为变更。租户兼容性不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x。未做真实 profile 启动验证，也未做真实金蝶账套联调验证。

## 变更

- 插件版本升至 0.20.0。
- 全部 `@deepseek-ai/dsh-*` 开发依赖由 `0.2.2-rc.2` 移至 `0.2.2-rc.3`。
- 锁文件重新生成，工作区供应链豁免清单按 0.2.2-rc.3 包集合刷新。
- `engines.dsh` 保持 `>=0.1.7-alpha.2 <0.3.0`。DSH 0.2.2-rc.3 没有面向插件的破坏性变更。

## 验证

- `pnpm typecheck` 无错误。
- `pnpm build` 构建干净。
- `pnpm test`：15 项测试通过。
- 以上三项检查均针对 DSH 0.2.2-rc.3 运行。
- 未做真实 profile 启动验证，也未做真实金蝶账套联调验证。

## 升级

可选。执行 `dsh plugin --profile web add dsh-kingdee@0.20.0`，或让 profile 更新即可。`engines.dsh` 区间仍接纳整条 `0.2.x` 线，因此升级不是必须的。
