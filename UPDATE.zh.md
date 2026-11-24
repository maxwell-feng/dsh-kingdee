# 更新指南

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/UPDATE.md) | 中文

如何把 **dsh-kingdee** 升级到更新版本。当前版本为 0.22.0，DSH 基线为 0.2.3-alpha.2。

## 升级前

1. 查看目标版本的 [CHANGELOG.zh.md](./CHANGELOG.zh.md) 条目，破坏性变更会在其中标注。
2. 备份 `cordis.yml` 或设置文档中的连接配置。密钥存放在环境变量或凭据库中，不属于插件配置。

## 升级步骤

```sh
# 更新已安装的 bundle（--profile 放在子命令之前）
dsh plugin --profile web update dsh-kingdee

# 或固定到确切版本
dsh plugin --profile web add dsh-kingdee@0.22.0

# 若从源码构建宿主侧
pnpm install && pnpm run build
```

更新后重启 DSH：停止/启动进程，或重新启动应用；没有 restart 子命令。

## 0.22.0 的变更

本版更新依赖、Node.js 门槛与文档。版本号升至 0.22.0；全部 `@deepseek-ai/dsh-*` 开发依赖移至 `0.2.3-alpha.2`；cordis 升至 `4.2.0-alpha.1`，schemastery 升至 `3.20.0-alpha.1`；锁文件与供应链豁免同步刷新。插件 API、配置字段与正常租户行为不变；配置校验现在抛出类型化 `kd/invalid-config` 错误。manifest 的 Node.js 与 peer 范围有变：`engines.dsh` 保持 `>=0.1.7-alpha.2 <0.3.0`，`engines.node` 与 DSH 0.2.3 一致（`^24.22.3 || >=26.13.1`）。

DSH 0.2.3 需 Node.js 24.22.3+（24.x）或 26.13.1+。运行在 Node.js 24.9 上的 DSH 0.2.2 宿主可继续用 0.21.0；升级到 DSH 0.2.3 或满足新 Node 门槛后再装 0.22.0。

## 验证

`pnpm typecheck`、`pnpm build` 与 15 项测试在 DSH 0.2.3-alpha.2 上均通过。未做真实 profile 启动或金蝶账套联调验证。

## 回滚

```sh
dsh plugin --profile web add dsh-kingdee@0.21.0
```

重启宿主并重新执行一次查询，确认连接正常。更早版本见 [CHANGELOG.zh.md](./CHANGELOG.zh.md) / [CHANGELOG.md](./CHANGELOG.md)。
