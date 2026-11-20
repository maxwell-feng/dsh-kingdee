# 发行说明 — v0.21.0

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.md) | 中文

发布日期：2026-11-20

`dsh-kingdee` 0.21.0 完成与 DeepSeek Harness 0.2.2-rc.5（2026-11-18 发布）的对齐。本版为依赖与文档更新：没有 API、配置或行为变更。租户兼容性不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x。未做真实 profile 启动验证，也未做真实金蝶账套联调验证。

## 变更

- 插件版本升至 0.21.0。
- 全部 `@deepseek-ai/dsh-*` 开发依赖由 `0.2.2-rc.3` 移至 `0.2.2-rc.5`。
- 锁文件重新生成，工作区供应链豁免清单按 0.2.2-rc.5 包集合刷新。
- `engines.dsh` 保持 `>=0.1.7-alpha.2 <0.3.0`。DSH 0.2.2-rc.4 与 0.2.2-rc.5 都没有影响本包的破坏性变更。
- DSH 0.2.2-rc.4 修复了异常模型响应的处理，以及桌面端 LiveShare 无法创建分享的问题。DSH 0.2.2-rc.5 按模型路由改变了默认网页搜索提供方；本插件的工具不使用该缝，因此不受影响。

## 文档

- README、INSTALL、CONFIG、USAGE 与 UPDATE 现已标明 0.2.2-rc.5 基线与插件版本 0.21.0；2026-11-18 的 harness 发布日期见 README 与发行说明。
- 中英文档已校对，对表述不清或语序不顺之处作了更正；同时修正了 `FDocumentStatus` 状态映射、`organization` 配置说明、设置页字段覆盖范围与 `UnSubmit` 覆盖说明。

## 验证

- `pnpm typecheck` 无错误。
- `pnpm build` 构建干净。
- `pnpm test`：15 项测试通过。
- 以上三项检查均针对 DSH 0.2.2-rc.5 运行。
- 未做真实 profile 启动验证，也未做真实金蝶账套联调验证。

## 升级

可选。执行 `dsh plugin --profile web add dsh-kingdee@0.21.0`，或让 profile 更新即可。`engines.dsh` 区间仍接纳整条 `0.2.x` 线，因此升级不是必须的。
