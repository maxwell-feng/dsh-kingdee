# 更新日志

[English](CHANGELOG.md) | 中文

**dsh-kingdee** 的所有关键版本演进记录均归档于此。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，并严格遵循 [语义化版本规范](https://semver.org/lang/zh-CN/)。

## [0.6.1] - 2026-09-13

### 移除与代码精简

- **清理死代码与未使用的遗留接口**：
  - 彻底移除 `src/kd-core/types.ts` 中废弃未被引用的 `KdToolResult` 接口定义及核心导出（工具输出全面统一为 `@deepseek-ai/dsh-util-values` 规范的 `JsonValue` 开放值模型）；
  - 移除 `src/kd-core/envelope.ts` 中内部未引用的 `parseEnvelopeFromText` 函数及其单测；
  - 移除 `src/kd-core/errors.ts` 中从未被业务或捕获层消费的死错误码 `'kd/not-found'`；
  - 精简 `pnpm-workspace.yaml` 中的历史多版本白名单规则，统一锁定为 `0.1.5-rc.2`；
  - 进一步优化包体积，提升运行效率与类型纯净度。

## [0.6.0] - 2026-09-13

### 新增

- **全面适配金蝶云·星空 V9.0 企业版（Kingdee Cloud Starry Sky V9.0 Enterprise Edition）**：
  - **官方标准会话 Cookie（`kdservice-sessionid`）**：支持解析和回传金蝶星空 V9.0 企业版官方标准响应头 `kdservice-sessionid`，并在业务请求中同时回传 `kdservice-sessionid` 与兼容字段 `kdsvc`，实现跨版本与星空微服务网关的稳定连接。
  - **大表防全量扫表与稳定游标分页（`orderString`、`limit`、`startRow`）**：为 `ExecuteBillQuery` 及 `QueryBusinessData` 接口补全了 `OrderString`（排序子句）、`Limit`（分页大小）与 `StartRow`（起始行偏移量），对齐星空 V9.0 性能与查询规范，确保 AI 在处理万级以上单据大表时避免全表锁定和游标抖动。
  - **业务单据编号驱动操作（`numbers`）**：针对 AI 智能体直接基于业务单号交互的特点，为单据审批（`kingdee_audit`）、反审（`kingdee_unaudit`）、删除（`kingdee_delete`）、反提交（`kingdee_unsubmit`）和暂存删除（`kingdee_delete_draft`）扩展了 `numbers` 数组参数，支持直接使用业务单号（例如 `SO-20260901`）执行批量操作，省去底层内部物理自增 `FID` 的中间查询。
  - **按单据编号直接查单（`kingdee_view`）**：增强了单据查看工具，除原有的 `id` 外，新增支持传入 `number` 参数直接定位并获取单张单据的完整 JSON 结构。
  - **保存时自动提审（`isAutoSubmitAndAudit`）**：在单据保存（`kingdee_save`）和批量保存（`kingdee_batch_save`）中新增 `isAutoSubmitAndAudit` 参数，充分利用星空 V9.0 企业版的“一步保存提审”原生能力。

### 安全

- **SSRF 深度防御与严格主机校验**：
  - 纯 TypeScript 零依赖实现，全面落实网络边界安全审计；
  - **协议白名单**：仅允许 `http:` 与 `https:` 请求，坚决拦截 `file:`、`ftp:`、`gopher:` 等非安全协议；
  - **网络边界拦截**：全面拦截并拒绝指向 `localhost`、环回地址（`127.0.0.0/8`、`::1`）、RFC1918 私网网段（`10.0.0.0/8`、`172.16.0.0/12`、`192.168.0.0/16`、`169.254.0.0/16` 链路本地）、运营商 NAT（`100.64.0.0/10`）、IPv6 链路本地（`fe80::/10`）以及唯一本地地址（`fc00::/7`）的请求；
  - 在配置验证层（`validateConfig`）与网络请求实际发出层（`HttpTransport.request`）双重设防，杜绝内网横向扫描与伪造请求风险。

---

## [0.5.0] - 2026-09-11

### 变更

- **适配 DeepSeek Harness `0.1.5-rc.2` 与插件清单规范现代化**：
  - 在 `package.json.dsh` 下补充 `manifestVersion: 1`，完全对齐 `@deepseek-ai/dsh-package-manifest`；
  - 在 `package.json.engines` 中显式约束宿主引擎兼容范围：`"dsh": "^0.1.5-rc.2"`；
  - 将所有 `@deepseek-ai/dsh-*` peerDependencies 与 devDependencies 升级至 `0.1.5-rc.2`；
  - 全面刷新双语文档，标注针对 `0.1.5-rc.2` 的验证。

---

## [0.4.0] - 2026-09-10

### 变更

- 按官方插件开发规范全面适配 deepseek-harness `0.1.5-rc.1`。
- 全面刷新双语文档，标注针对 `0.1.5-rc.1` 的验证。

### 新增

- 新增独立双语使用说明文档（`USAGE.md` / `USAGE.zh.md`），详述 14 个 `kingdee_*` 工具参数与示例。

---

## [0.3.0] - 2026-09-09

### 变更

- 适配 deepseek-harness `0.1.5-alpha.1`。

### 新增

- 新增独立双语配置说明文档（`CONFIG.md` / `CONFIG.zh.md`）。

---

## [0.2.4] - 2026-09-03

### 修复与完善

- 真实 peer 依赖替换 ambient 声明，类型检查 0 错误；
- 工具输出采用开放值 JSON schema；
- 浏览器设置卡片正常编译与产物输出。

---

## [0.1.0] - 2026-09-01

- 初始发布：纯 TypeScript 编写的 `kd-core` 运行时内核、DSH 工具集与凭据安全流。
