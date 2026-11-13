# 更新指南

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/UPDATE.md) | 中文

如何把 **dsh-kingdee** 升级到更新版本。当前版本为 0.20.0，DSH 基线为 0.2.2-rc.3。

## 升级前

1. 查看目标版本的 [CHANGELOG.zh.md](./CHANGELOG.zh.md) 条目。破坏性变更会在其中标注。
2. 备份 profile 的 `cordis.yml` 或设置文档中的连接配置。密钥存放在环境变量或凭据库中，不属于插件配置。

## 升级步骤

```sh
# 更新已安装的 bundle（--profile 放在子命令之前）
dsh plugin --profile web update dsh-kingdee

# 或固定到确切版本
dsh plugin --profile web add dsh-kingdee@0.20.0

# 若从源码构建宿主侧
pnpm install && pnpm run build
```

更新后重启 DSH 宿主：停止并重新启动 DSH 进程，或重新启动应用。没有 restart 子命令。

## 0.20.0 的变更

本版仅更新依赖。版本号升至 0.20.0，全部 `@deepseek-ai/dsh-*` 开发依赖由 `0.2.2-rc.2` 移至 `0.2.2-rc.3`，锁文件与工作区供应链豁免清单同步刷新。没有 API、配置或行为变更；DSH 0.2.2-rc.3 没有面向插件的破坏性变更。`engines.dsh` 保持 `>=0.1.7-alpha.2 <0.3.0`，因此本版升级是可选的。

DSH 0.2.2 宿主要求 Node.js 24.9 或更新版本。本包自身的 `engines.node` 保持 `>=22`。

## 验证

`pnpm typecheck` 无错误，`pnpm build` 构建干净，`pnpm test` 在 DSH 0.2.2-rc.3 上通过 15 项测试。未做真实 profile 启动验证，也未做真实金蝶账套联调验证。

## 回滚

```sh
dsh plugin --profile web add dsh-kingdee@<previous-version>
```

重启宿主并重新执行一次查询，确认连接正常。

旧版本的版本历史见 [CHANGELOG.zh.md](./CHANGELOG.zh.md) / [CHANGELOG.md](./CHANGELOG.md)。
