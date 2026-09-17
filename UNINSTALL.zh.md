# 卸载说明

[English](UNINSTALL.md) | 中文

> 已在 deepseek-harness **0.1.6-alpha.2** 上验证（`pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`），且 bundle 补丁在真实 `0.1.6-alpha.2` profile 中作为 `# == dsh-kingdee` 层正常生效），并全面适配 **金蝶云·星空 V9.1 企业版**（向下兼容 V9.0 / V8.x）。**未进行真实账套联调验证。**

如何从 DSH profile 移除 **dsh-kingdee**。

## 一、禁用插件

通常第一步是移除 bundle 而保留配置；插件会从工具集与设置页消失。没有专门的禁用子命令 —— 请在 profile 的 `cordis.patch.yml` 里把该行的 `enabled` 置为 `false`（随包发布的 bundle 补丁中该值为 `true`）：

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: false
```

停止并重新启动 DSH 进程使其生效。

## 二、移除 bundle

```sh
dsh plugin remove dsh-kingdee
```

这会移除已安装的 npm 包及其组合层。

## 三、删除你的配置

连接设置存放在 profile 的 `cordis.yml` / 设置文档中。请删除 `kingdee` 插件行（及其 `kingdee.*` 配置键），以免移除后残留：

```yaml
# 删除这一行
- id: kingdee
  name: ...
```

## 四、删除密钥

密钥存放在插件之外（环境变量，或 DSH 凭据库 `$DSH_HOME/.credentials.yaml` / 设置界面中只写不读的字段）。请删除，避免留下任何值：

```sh
unset DSH_KINGDEE_USER DSH_KINGDEE_PASSWORD DSH_KINGDEE_APP_SECRET
```

若你把值存进了 DSH 凭据库而不是 shell 环境变量，请在凭据库里删除同名引用 —— 凭据库没有 CLI 子命令，请在设置界面删除对应条目，或直接编辑 `$DSH_HOME/.credentials.yaml`。

## 五、重启

停止并重新启动 DSH 进程（重新启动 `dsh` 应用 / 你的 DSH host）；没有 restart 子命令。

重启后，`kingdee_*` 工具会从 agent 的工具集中消失。

## 会留下什么

- 系统日志与缓存会话可能仍记录到过往调用；若你的安全策略需要，请一并清理。
- `kd-core` 库是独立导出项（`dsh-kingdee/kd-core`）——若不再使用，请用 `dsh plugin remove` 彻底卸载该包。

## 移除源码检出

若是从 Git 检出安装的，直接删除仓库目录（如 `dsh-kingdee/`）即可。删除文件夹不会改动你的 DSH profile，因此请先完成上述步骤。
