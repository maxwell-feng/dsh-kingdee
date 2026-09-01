# 卸载说明

如何从 DSH profile 移除 **dsh-kingdee**。

## 一、禁用插件

通常第一步是移除 bundle 而保留配置；插件会从工具集与设置页消失。

```sh
dsh plugin disable dsh-kingdee
```

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

密钥存放在插件之外（环境变量或凭据库）。请删除，避免留下任何值：

```sh
unset DSH_KINGDEE_USER DSH_KINGDEE_PASSWORD DSH_KINGDEE_APP_SECRET
# 或从凭据库移除
dsh credentials unset DSH_KINGDEE_USER
dsh credentials unset DSH_KINGDEE_PASSWORD
dsh credentials unset DSH_KINGDEE_APP_SECRET
```

## 五、重启

```sh
dsh restart
```

重启后，`kingdee_*` 工具会从 agent 的工具集中消失。

## 会留下什么

- 系统日志与缓存会话可能仍记录到过往调用；若你的安全策略需要，请一并清理。
- `kd-core` 库是独立导出项（`dsh-kingdee/kd-core`）——若不再使用，请用 `dsh plugin remove` 彻底卸载该包。

## 移除源码检出

若是从 Git 检出安装的，直接删除仓库目录（如 `dsh-kingdee/`）即可。删除文件夹不会改动你的 DSH profile，因此请先完成上述步骤。
