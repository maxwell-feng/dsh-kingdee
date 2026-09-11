# 更新说明

[English](UPDATE.md) | 中文

> 已在 deepseek-harness **0.1.5-rc.2** 最新 `master` 上验证。

如何将 **dsh-kingdee** 升级到更新版本。

## 升级前

1. **查看 [CHANGELOG.md](./CHANGELOG.md)** 中目标版本的条目。最大的风险是**破坏性变更**，每个版本的发行说明都会明确标注。
2. **备份你的配置。** 连接设置（`baseUrl`、`acctId`、`authMode` 等）存放在 profile 的 `cordis.yml` 或设置文档中；密钥在环境变量/凭据库里，不由本插件备份。

## 升级步骤

```sh
# 1. 把已安装的 bundle 更新到新版本
dsh plugin update dsh-kingdee

# 2. （建议）若从源码构建 host 半区，请重新安装/构建
pnpm install && pnpm run build

# 3. 重启 DSH host 以加载新版本插件
dsh restart
```

## 升级后

- **复查设置卡片。** 新版本可能新增字段（如新的 `authMode` 或 `organization` 默认值）。确认显示值与你的预期一致。
- **重新验证一次查询。** 用 `kingdee_query` 对已知 FormId 发起查询，确认连接与认证仍正常。
- **密钥。** 密钥每次操作重新解析，因此无需处理，除非引用名变了——若变了，请在设置里更新 `userNameRef` / `passwordRef` / `appSecretRef`。

## 破坏性变更长什么样

- 工具名或某个必填参数发生变化（如某工具被改名）。
- 某个凭据引用名发生变化。
- 配置结构变化（某个键被改名或删除）。

这些都会在对应 [CHANGELOG.md](./CHANGELOG.md) 条目的 `### Breaking changes`（破坏性变更）标题下点明。

## 回滚

`dsh plugin update` 会记录版本；像安装那样回滚到之前的版本即可：

```sh
dsh plugin add dsh-kingdee@<上一版本>
```

然后重启并重新验证。
