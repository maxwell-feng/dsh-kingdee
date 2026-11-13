# 卸载说明

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/UNINSTALL.md) | 中文

如何从 DSH profile 移除 **dsh-kingdee**。

## 1. 禁用插件

没有专门的禁用子命令。请在 profile 的 `cordis.patch.yml` 中把该行的 `enabled` 置为 `false`（随包发布的 bundle 补丁中该值为 `true`），然后重启 DSH：

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: false
```

## 2. 移除 bundle

```sh
dsh plugin --profile web remove dsh-kingdee
```

这会移除已安装的 npm 包及其组合层。`--profile <name>` 必须放在 `remove` 之前。

## 3. 删除配置

连接设置存放在 profile 的 `cordis.yml` 或设置文档中。请删除第 1 步插入的 `kingdee` 行以及所有 `kingdee.*` 配置键。

## 4. 删除密钥

密钥存放在插件之外：环境变量，或 DSH 凭据库 `$DSH_HOME/.credentials.yaml` / 设置界面中只写不读的字段。请删除：

```sh
unset DSH_KINGDEE_USER DSH_KINGDEE_PASSWORD DSH_KINGDEE_APP_SECRET
```

如果值存放在 DSH 凭据库中，请在凭据库删除同名引用。凭据库没有 CLI 子命令，请在设置界面删除，或编辑 `$DSH_HOME/.credentials.yaml`。

## 5. 重启

停止并重新启动 DSH 进程（重新启动 `dsh` 应用或宿主）。没有 restart 子命令。重启后，`kingdee_*` 工具会从 agent 的工具集中消失。

## 会留下的内容

系统日志与缓存会话可能仍记录过往调用；若安全策略要求，请一并清理。如果是从 Git 检出安装的，请在完成上述步骤后删除仓库目录（如 `dsh-kingdee/`）。删除文件夹不会改动 DSH profile。
