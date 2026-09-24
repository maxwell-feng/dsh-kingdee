# 更新说明

[英文](UPDATE.md) | 中文

> 已在 deepseek-harness **0.1.7-rc.2** 上验证（`pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`），且 bundle 补丁在真实 `0.1.7-rc.2` profile 中作为 `# == dsh-kingdee` 层正常生效），并全面适配 **金蝶云·星空 V9.1 企业版**（向下兼容 V9.0 / V8.x）。**未进行真实账套联调验证。**

如何将 **dsh-kingdee** 升级到更新版本。

## 升级前

1. **查看 [CHANGELOG.md](./CHANGELOG.md) 或 [CHANGELOG.zh.md](./CHANGELOG.zh.md)** 中目标版本的条目。最大的风险是**破坏性变更**，每个版本的发行说明都会明确标注。
2. **备份你的配置。** 连接设置（`baseUrl`、`acctId`、`authMode` 等）存放在 profile 的 `cordis.yml` 或设置文档中；密钥在环境变量/凭据库里，不由本插件备份。

## 升级步骤

```sh
# 1. 把已安装的 bundle 更新到新版本
dsh plugin update dsh-kingdee

# 2. （建议）若从源码构建 host 半区，请重新安装/构建
pnpm install && pnpm run build
```

3. **重启 DSH host** 以加载新版本插件：停止并重新启动 DSH 进程（重新启动 `dsh` 应用 / 你的 DSH host）—— 没有 restart 子命令。

## 升级后

- **0.10.0 完成与 DeepSeek Harness 0.1.7-rc.2 的对齐**：不改运行时逻辑、不改配置、不改工具接口，行为与 0.9.1 完全一致。开发依赖锁定至 `0.1.7-rc.2`；`@deepseek-ai/dsh-*` peer 区间保持 `^0.1.7-alpha.2`，因此插件在 `0.1.7-alpha.2` 至 `0.1.7-rc.2` 的每一个 `0.1.7` 预发行版上均可安装。本插件消费的全部接缝在 `0.1.7-rc.1` 与 `0.1.7-rc.2` 之间源码完全一致，故源码未作改动，配置字段也没有任何迁移。无需任何额外操作。
- **0.9.1 为文档与仓库工程化修补版本**：不改运行时逻辑、不改配置、不改工具接口，行为与 0.9.0 完全一致。仓库现只保留 TypeScript 源码：双语文档闸门由 `scripts/check-docs-language.mjs` 迁至 `scripts/check-docs-language.ts`，Node ≥22.19 直接剥离类型运行（依旧无需安装依赖，依旧在 CI 安装依赖之前执行），且 `tsconfig.json` 的 include 新增 `scripts/**/*.ts`。本版还修正了 README 工具表顺序、配置文档中重复的章节编号，并恢复了丢失正文的更新日志条目。无需任何额外操作。
- **0.9.0 将宿主基线抬升至 DeepSeek Harness 0.1.7**：插件现要求 `0.1.7-alpha.2` 或更新，并已在 `0.1.7-rc.1` 上验证；开发依赖锁定至 `0.1.7-rc.1`，`engines.dsh` 为 `^0.1.7-alpha.2`。配置迁移到 0.1.7 的**易变 schema**：十二个字段的名称、取值与默认值全部不变，但 `apply` 现在逐字段读取活引用，并在每次操作开始时一次性捕获，因此保存的修改与轮换后的凭据都无需重启即可对下一次操作生效。插件不再注册设置节（`ctx.settings.installSection` 已移除）——Host 自行读取导出的 `Config` schema 并以 profile 行 id `kingdee` 为键渲染该条目表单。**在 `0.1.6` 宿主上插件会在加载阶段被拒绝**：DSH 0.1.7-rc.1 会在加载插件行之前用运行时版本校验其 `@deepseek-ai/dsh*` peer 依赖，请先升级宿主，或按 DSH 打印的提示执行 `dsh plugin allow-version dsh-kingdee@0.9.0 <你的 dsh 版本>` 授予确切版本豁免。**配置无破坏性变更**——`cordis.yml` 与 `cordis.patch.yml` 原样继续可用。
- **0.8.0 适配 DeepSeek Harness 0.1.6-alpha.2 客户端 UI 规范**：DSH 0.1.6-alpha.2 废弃了旧的 `settings.plugin.item` 插槽，改由独立的插件管理页面（`ui-plugin-manager`）承载。客户端配置卡片现注册到 `plugins.row.config`（`dsh-kingdee#kingdee`）与 `plugins.bundle.config`（`dsh-kingdee`），支持紧凑摘要与完整配置双视图。
- **0.7.0 重写了认证与 stub URL，请优先核对这几项**：`app` 模式现执行真实的 `AuthService.LoginByAppSecret` 登录，除 `appId` / `appSecret` 外**还要求 `userNameRef`**（集成用户），且不再伪造 `KDAuthentication` 请求头；所有 stub URL 统一以 `.common.kdsvc` 结尾，登录/登出 stub 位于 `AuthService.*`（`ValidateUser` / `LoginByAppSecret` / `LogOut`）；`serviceEndpoints.servicePrefix` 已移除，改用 `loginByAppSecretService` + `stubSuffix`；`kingdee_invoke` 的 `serviceName` 现取 `{namespace}.{class}.{method},{assembly}` 形式的自定义 stub 路径（如 `GetCust.GetCust.ExecuteService,GetCust`），该段直接替换 dynamic-form URL 段。本版本还修复了认证本身：登录服务返回的是它自身的 `{"LoginResultType": 1}` 结构，旧版本会误判为失败的业务信封。
- **体验金蝶云·星空 V9.1 新特性**：查询工具 `kingdee_query` 与 `kingdee_query_business_data` 支持 `orderString`、`limit`、`startRow` 进行稳定游标分页；审批、反审、删除、反提交等工具支持传入 `numbers` 数组（单据编号），无需再提前查底层自增 `FID`；自产品版本 `9.1.0.20250807` 起，`Delete` 返回的 `Number` 也可直接采信。
- **复查 V9.1 权限与限流**：V9.1 收紧了外部用户访问控制，缺少查询权限可能表现为**空结果而不是报错** —— 请针对每个 `FormId` 先跑探针查询，而不要直接相信空结果集。服务端已开始记录 WebAPI 请求体，请尽可能优先使用 `app` 模式而非账号密码模式，并把主机出口 IP 加入 WebAPI 限流白名单。
- **SSRF 安全防护与 Host 配置检查**：若您此前在配置文件中直接使用裸内网 IP（如 `192.168.x.x`、`10.x.x.x` 或 `localhost`），请将 `baseUrl` 更新为企业标准域名（如 `https://erp.example.com/K3Cloud`）。为符合企业安全审计要求，插件已默认拦截直接针对未授权内网私有网段与环回地址的请求。
- **复查设置卡片。** 新版本可能新增字段（如新增的 `lcid`，默认 `2052`；或 `app` 模式对 `userNameRef` 的新要求）。确认显示值与你的预期一致。
- **重新验证一次查询。** 用 `kingdee_query` 对已知 FormId 发起查询，确认连接与认证仍正常。
- **密钥。** 密钥每次操作重新解析，因此无需处理，除非引用名变了——若变了，请在设置里更新 `userNameRef` / `passwordRef` / `appSecretRef`。`app` 模式下 `userNameRef` 现同样必填（它指向集成用户）。

## 破坏性变更长什么样

- 工具名或某个必填参数发生变化（如某工具被改名）。
- 某个凭据引用名发生变化。
- 配置结构变化（某个键被改名或删除）。

这些都会在对应 [CHANGELOG.md](./CHANGELOG.md) 或 [CHANGELOG.zh.md](./CHANGELOG.zh.md) 的条目中明确标注为破坏性变更。

## 回滚

`dsh plugin update` 会记录版本；像安装那样回滚到之前的版本即可：

```sh
dsh plugin add dsh-kingdee@<上一版本>
```

然后重启并重新验证。
