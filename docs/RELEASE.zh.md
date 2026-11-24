# 发行说明 — v0.22.0

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.md) | 中文

发布日期：2026-11-24

`dsh-kingdee` 0.22.0 完成与 DeepSeek Harness 0.2.3-alpha.2（2026-11-22 发布）的对齐。本版更新依赖、Node.js 门槛与文档；插件 API、配置字段与正常租户行为不变，配置校验现在抛出类型化 `kd/invalid-config` 错误。租户兼容性不变：金蝶云·星空 V9.1 企业版，兼容 V9.0/V8.x。

## 变更

- 插件版本升至 0.22.0。
- 全部 `@deepseek-ai/dsh-*` 开发依赖由 `0.2.2-rc.5` 移至 `0.2.3-alpha.2`，包括宿主侧 tools/credentials 与客户端设置、渲染、slots、插件管理器包。
- `@deepseek-ai/cordis` 升至 `4.2.0-alpha.1`，`@deepseek-ai/schemastery` 升至 `3.20.0-alpha.1`；peer 区间新增 0.2.3 线并保留旧区间；`engines.dsh` 仍接纳更早的 0.2.x 宿主。
- `engines.node` 与 DSH 0.2.3 一致：`^24.22.3 || >=26.13.1`。CI、发行与发布任务固定 Node.js 24.22.3。
- `engines.dsh` 保持 `>=0.1.7-alpha.2 <0.3.0`。
- 锁文件与工作区供应链豁免清单按 `0.2.3-alpha.2` 包集合刷新。

## 文档

- 文档标明插件版本 0.22.0、`0.2.3-alpha.2` 基线及 Node.js 门槛。
- 中英文工具表均按 USAGE 章节顺序。
- 插件管理器用官方名「金蝶云·星空」；两语言说明均写明凭据经环境变量引用解析。
- `kingdee-bos` 技能改为手动加入目录。
- 卸载指南改为直接移除 bundle、清理配置凭据并只重启一次。
- 修正 Node.js/PowerShell 表述，按字面量主机过滤重写 SSRF 且不再声称拦截 DNS，删除“设置界面填凭据”说法，拆开无效的反审核→反提交流程，明确 `acctId` 与 `acctID` 关系，统一产品名与中文页面路径。

## 验证

- `pnpm typecheck`：零错误。
- `pnpm build`：在 DSH 0.2.3-alpha.2 上构建干净，含浏览器 bundle。
- `pnpm test`：15 项测试通过。
- `node scripts/check-docs-language.ts`：通过。
- 未做真实 profile 启动验证，也未做真实金蝶账套联调验证。

## 升级

```sh
dsh plugin --profile web add dsh-kingdee@0.22.0
```

API、配置键与租户行为不变。运行在 Node.js 24.9 上的 DSH 0.2.2 宿主可继续用 0.21.0；升级到 DSH 0.2.3-alpha.2 或满足新 Node.js 门槛后再装 0.22.0。
