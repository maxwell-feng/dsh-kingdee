# 卸载说明

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/UNINSTALL.md) | 中文

如何从 DSH profile 移除 **dsh-kingdee**。

## 1. 移除 bundle

```sh
dsh plugin --profile web remove dsh-kingdee
```

这会移除已安装的 npm 包及其组合层，`kingdee_*` 工具随之停止注册。`--profile <name>` 必须放在 `remove` 之前。该命令也会从 `dsh.profile.bundles` 移除 bundle，因此不需要额外的禁用步骤。

## 2. 删除配置

连接设置存放在 profile 的 `cordis.yml`，或 `cordis.patch.yml` 中的 `kingdee` 覆盖项。请删除该行以及所有 `kingdee.*` 配置键。只设置过 `enabled: false` 的行可以直接删除。

## 3. 删除密钥

密钥存放在插件之外：环境变量，或 DSH 凭据库 `$DSH_HOME/.credentials.yaml` 的 `refs:` 下。请删除：

```sh
# Linux / macOS
unset DSH_KINGDEE_USER DSH_KINGDEE_PASSWORD DSH_KINGDEE_APP_SECRET
```

```powershell
# Windows PowerShell
Remove-Item Env:\DSH_KINGDEE_USER -ErrorAction SilentlyContinue
Remove-Item Env:\DSH_KINGDEE_PASSWORD -ErrorAction SilentlyContinue
Remove-Item Env:\DSH_KINGDEE_APP_SECRET -ErrorAction SilentlyContinue
```

```bat
REM Windows 命令提示符
set DSH_KINGDEE_USER=
set DSH_KINGDEE_PASSWORD=
set DSH_KINGDEE_APP_SECRET=
```

如果值存放在 DSH 凭据库中，请从 `$DSH_HOME/.credentials.yaml` 删除同名引用。凭据库没有 CLI 子命令。

## 4. 重启

停止并重新启动 DSH 进程（重新启动 `dsh` 应用或宿主）。没有 restart 子命令。重启后，`kingdee_*` 工具会从 agent 的工具集中消失。

## 会留下的内容

系统日志与缓存会话可能仍记录过往调用；若安全策略要求，请一并清理。如果是从 Git 检出安装的，请在完成上述步骤后删除仓库目录（如 `dsh-kingdee/`）。删除文件夹不会改动 DSH profile。
