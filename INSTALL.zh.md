# 安装说明

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/INSTALL.md) | 中文

本指南介绍如何在 DeepSeek Harness（DSH）profile 中安装 **dsh-kingdee** 0.20.0（DSH 基线 0.2.2-rc.3）。

## 前置条件

- 已安装带 Web GUI 的 DeepSeek Harness，并具备 `tools`、`credentials`、`settings` 这三个 peer 包。
- 核心库与测试需要 Node.js ≥ 22。DSH 0.2.2 宿主自身要求 Node.js 24.9 或更新版本。
- 一个可访问、已启用经典 WebAPI 的金蝶云·星空 V9.1 企业版实例（向下兼容 V9.0 / V8.x），以及有效账套账号。仅提供 OpenAPI 网关（`https://api.kingdee.com/galaxyapi/`）的账套不在支持范围内。
- `baseUrl` 必须使用 `http:` 或 `https:`。指向 localhost、环回、RFC1918 私网、链路本地、CGNAT、IPv6 唯一本地地址以及组播/保留地址的请求会被拦截。请使用公网域名，例如 `https://erp.example.com/K3Cloud`。

## 1. 添加 bundle

```sh
dsh plugin --profile web add dsh-kingdee
```

`--profile <name>` 必须放在 `add`、`remove`、`update` 之前；放在子命令之后会被转发给 pnpm 并导致失败。静态 profile 配置示例见 [CONFIG.zh.md](./CONFIG.zh.md)。

## 2. 配置连接

在 DSH 的 **Plugins → kingdee** 页面配置，或在 `cordis.yml` / `cordis.patch.yml` 中写 `config:` 块。主要字段如下：

| 键 | 说明 |
|---|---|
| `baseUrl` | WebAPI 基址，例如 `https://erp.example.com/K3Cloud` |
| `acctId` | 账套 id |
| `authMode` | `user`（用户名/密码）或 `app`（第三方应用） |
| `appId` | 应用 id，`app` 模式使用 |
| `appSecretRef` | 保存应用密钥的凭据引用 |
| `userNameRef` | 凭据引用：`user` 模式为账套用户名，`app` 模式为集成用户（两种模式均必填） |
| `passwordRef` | 保存账套密码的凭据引用（仅 `user` 模式） |
| `lcid` | 发送给登录服务的区域 id；默认 `2052`（zh-CN） |
| `mock` | 使用本地 mock 传输；默认 `false` |
| `serviceEndpoints` | 可选的 WebAPI 服务名覆盖，详见 [CONFIG.zh.md](./CONFIG.zh.md) |

在 2022-11-29 之后开通的公有云账套上必须使用 `authMode: "app"`，因为金蝶拒绝账号密码登录。该模式需要 `appId` + `appSecretRef` + `userNameRef`（集成用户）。

## 3. 提供密钥

密钥以引用（环境变量名）形式传递，不是明文字符串。插件在每次操作时解析凭据，轮换后的值会在下一次调用生效，无需重启。

**Linux / macOS**（`sh`）：

```sh
# user 模式
export DSH_KINGDEE_USER=your_username
export DSH_KINGDEE_PASSWORD=your_password

# app 模式（DSH_KINGDEE_USER 为集成用户，必填）
export DSH_KINGDEE_USER=your_integration_user
export DSH_KINGDEE_APP_SECRET=your_app_secret
```

**Windows — PowerShell**（当前会话；之后重启 DSH）：

```powershell
# user 模式
$env:DSH_KINGDEE_USER = "your_username"
$env:DSH_KINGDEE_PASSWORD = "your_password"

# app 模式（DSH_KINGDEE_USER 为集成用户，必填）
$env:DSH_KINGDEE_USER = "your_integration_user"
$env:DSH_KINGDEE_APP_SECRET = "your_app_secret"
```

命令提示符下用 `set NAME=value` 设置当前会话，用 `setx NAME value` 永久保存。DSH 凭据库适用于所有系统：在设置界面填写一次（只写不读），或编辑 `$DSH_HOME/.credentials.yaml`。

默认引用名为 `DSH_KINGDEE_USER`、`DSH_KINGDEE_PASSWORD` 与 `DSH_KINGDEE_APP_SECRET`，可用 `userNameRef`、`passwordRef`、`appSecretRef` 更改。`DSH_KINGDEE_USER` 在 `user` 模式下为账套用户名，在 `app` 模式下为集成用户。`DSH_KINGDEE_PASSWORD` 仅 `user` 模式使用。

登录服务返回 `{"LoginResultType": 1}`，不是业务信封。其他值会转成 `kd/auth-failed`。

## 4. 验证

让 agent 对已知单据类型发起查询：

```
查询金蝶云星空销售订单（SAL_SaleOrder），单据编号以 SO-202607 开头。
```

agent 会加载 `kingdee-bos` 技能并调用 `kingdee_query`。成功时返回规范化行数据；失败时返回类型化 `kd/*` 错误。bundle 补丁也会出现在 `dsh --profile <name> --dump-config` 的输出中，表现为 `# == dsh-kingdee` 覆盖层。

## 可选：离线 mock

设置 `mock: true` 后，插件使用内置 mock 传输，在没有真实账套的情况下返回固化的金蝶信封（例如 `SO-MOCK-1` 单据）。设置卡片不暴露 `mock`，请在配置中设置：

```yaml
config:
  mock: true
```

## 常见问题排查

- **`kd/auth-failed`** —— 检查 `acctId`、`appId`、`appSecretRef` 与集成用户（`userNameRef`），并确认账套已启用 WebAPI。2022-11-29 之后开通的公有云账套需把 `authMode` 切换为 `"app"`。仅开放 OpenAPI 网关的账套无法使用。
- **`kd/network` / `kd/invalid-config`** —— 确认 `baseUrl` 可达、是合法的 `http:` / `https:` 地址，且不是 localhost、环回或私网地址。
- **`kd/business-error`** —— 账套拒绝了调用；查看 `message` 中的缺失字段或阻止该操作的单据状态。
- **查询无结果且不报错** —— 可能缺少查询权限。请针对每个 `FormId` 跑探针查询，并把宿主出口 IP 加入 WebAPI 限流白名单。
