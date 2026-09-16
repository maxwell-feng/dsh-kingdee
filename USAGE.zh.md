# 使用说明

[English](USAGE.md) | 中文

> 已在 deepseek-harness **0.1.6-alpha.1** 上验证（`pnpm run typecheck` 零错误、**15** 项单元测试通过（`pnpm test`），且 bundle 补丁在真实 `0.1.6-alpha.1` profile 中作为 `# == dsh-kingdee` 层正常生效：`dsh plugin --profile <name> add` → `dsh --profile <name> --dump-config`），并全面适配 **金蝶云·星空 V9.1 企业版**（Kingdee Cloud Starry Sky V9.1 Enterprise Edition，向下兼容 V9.0 / V8.x）。**未进行真实账套联调验证。**

本文档列出本插件注册的全部 `kingdee_*` 工具（见 `src/tools.ts`）。agent 在会话中调用这些工具；每个工具都是 `src/kd-core/` 中 `KdClient` 操作的薄类型化包装。

## 调用约定

- 每个工具返回规范化的规范值，以紧凑 JSON 文本呈现（输出 schema 为 `type: 'json'`）。
- 金蝶 `IsSuccess=false` 的返回会转成类型化错误（`kd/business-error`、`kd/auth-failed`、`kd/invalid-config`、`kd/network`、`kd/timeout`、`kd/unknown`），而不是文本描述。
- 凭据经 DSH 凭据缝在每次操作时重新解析，轮换后下一次调用即生效，无需重启。
- 认证是隐式的：无会话时首次操作自动登录，随后每次业务调用都会以**裸 `kdservice-sessionid` 请求头**与 **`Cookie`（`kdservice-sessionid=…; kdsvc=…`）双通道**附带会话，不使用 `KDAuthentication` 请求头。
- 登录 stub 返回的是它自身的 `{"LoginResultType": 1}` 结构，**不是** `Result`/`IsSuccess` 业务信封；客户端单独判定该结果，非 `1` 时以 `kd/auth-failed` 呈现。
- `formId` 为金蝶表单 id（例如 `SAL_SaleOrder`）。
- 星空 V9.1 规范：审核、反审、删除、反提交等操作支持直接传入 `numbers`（业务单据编号，如 `SO-20260901`），无须预查内部自增 `FID`；自产品版本 `9.1.0.20250807` 起，`Delete` 返回结果中的 `Number` 也可直接采信。

## kingdee_query

查询金蝶云单据与基础资料（`DynamicFormService.ExecuteBillQuery`），返回命中的行。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id，例如 `SAL_SaleOrder`。 |
| `fieldKeys` | 是 | `string[]` | 要返回的字段键，例如 `FBillNo`、`FDocumentStatus`。 |
| `filter` | 否 | `string` | 金蝶过滤表达式，例如 `FBillNo='SO-20260701'`。 |
| `orderString` | 否 | `string` | 排序子句，例如 `FCreateDate DESC, FBillNo ASC`。保障稳定游标分页的核心。 |
| `topCount` | 否 | `number` | 最多返回的行数（TopRowCount）。 |
| `limit` | 否 | `number` | 分页大小限制。 |
| `startRow` | 否 | `number` | 分页起始行偏移。 |
| `organization` | 否 | `string` | 可选的组织（org）id / FNumber。 |

```json
{
  "formId": "SAL_SaleOrder",
  "fieldKeys": ["FBillNo", "FDocumentStatus", "FDate"],
  "filter": "FDate >= '2026-01-01'",
  "orderString": "FDate DESC",
  "limit": 50,
  "startRow": 0
}
```

## kingdee_query_business_data

用较新的结构化 `QueryBusinessData` 接口查询金蝶云单据与基础资料，返回对象形态的行。入参与 `kingdee_query` 完全一致。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id，例如 `SAL_SaleOrder`。 |
| `fieldKeys` | 是 | `string[]` | 要返回的字段键，例如 `FBillNo`、`FDocumentStatus`。 |
| `filter` | 否 | `string` | 金蝶过滤表达式，例如 `FBillNo='SO-20260701'`。 |
| `orderString` | 否 | `string` | 排序子句，例如 `FCreateDate DESC, FBillNo ASC`。 |
| `topCount` | 否 | `number` | 最多返回的行数（TopRowCount）。 |
| `limit` | 否 | `number` | 分页大小限制。 |
| `startRow` | 否 | `number` | 分页起始行偏移。 |
| `organization` | 否 | `string` | 可选的组织（org）id / FNumber。 |

```json
{
  "formId": "SAL_SaleOrder",
  "fieldKeys": ["FBillNo", "FDocumentStatus"],
  "filter": "FBillNo='SO-20260701'",
  "orderString": "FBillNo ASC",
  "limit": 20
}
```

## kingdee_save

保存金蝶云表单（新增或更新单据/基础资料），返回新增/更新记录的 id 与单号。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id，例如 `SAL_SaleOrder`。 |
| `data` | 是 | `object` | 以金蝶字段键为键的单据体。 |
| `interaction` | 否 | `boolean` | 置 true 可跳过平台（表单插件）校验。 |
| `isAutoSubmitAndAudit` | 否 | `boolean` | 置 true 可一步执行保存、自动提交并审核。 |

```json
{
  "formId": "SAL_SaleOrder",
  "data": { "FBillNo": "SO-20260701" },
  "isAutoSubmitAndAudit": true
}
```

## kingdee_batch_save

一次调用批量保存多条金蝶云记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id，例如 `SAL_SaleOrder`。 |
| `records` | 是 | `object[]` | 以金蝶字段键为键的单据体列表。 |
| `interaction` | 否 | `boolean` | 置 true 可跳过平台（表单插件）校验。 |
| `isAutoSubmitAndAudit` | 否 | `boolean` | 置 true 可一步执行保存、自动提交并审核。 |

```json
{
  "formId": "SAL_SaleOrder",
  "records": [{ "FBillNo": "SO-20260701" }, { "FBillNo": "SO-20260702" }],
  "isAutoSubmitAndAudit": false
}
```

## kingdee_submit

提交一条或多条金蝶云单据。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 否 | `string[]` | 要提交的记录内部 id（`ids` 与 `numbers` 二选一）。 |
| `numbers` | 否 | `string[]` | 业务单据编号列表（例如 `SO-20260701`）。 |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_unsubmit

反提交一条或多条金蝶云单据（撤销提交）。服务名可能随版本而异（见 [CONFIG.zh.md](./CONFIG.zh.md) 的 `serviceEndpoints`）。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 否 | `string[]` | 要反提交的记录内部 id（`ids` 与 `numbers` 二选一）。 |
| `numbers` | 否 | `string[]` | 业务单据编号列表。 |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_audit

审核一条或多条金蝶云单据。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 否 | `string[]` | 要审核的记录内部 id（`ids` 与 `numbers` 二选一）。 |
| `numbers` | 否 | `string[]` | 业务单据编号列表（例如 `SO-20260701`）。 |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_unaudit

反审核一条或多条金蝶云单据。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 否 | `string[]` | 要反审核的记录内部 id（`ids` 与 `numbers` 二选一）。 |
| `numbers` | 否 | `string[]` | 业务单据编号列表。 |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_view

按 id 或单据编号查看单条金蝶云记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `id` | 否 | `string` | 要查看的记录内部 id（`id` 与 `number` 二选一）。 |
| `number` | 否 | `string` | 要查看的业务单据编号（例如 `SO-20260701`）。 |

```json
{
  "formId": "SAL_SaleOrder",
  "number": "SO-20260701"
}
```

## kingdee_delete

按 id 或单据编号删除一条或多条金蝶云记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 否 | `string[]` | 要删除的记录内部 id（`ids` 与 `numbers` 二选一）。 |
| `numbers` | 否 | `string[]` | 业务单据编号列表。 |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_delete_draft

按 id 或单据编号删除草稿（暂存/created）状态的金蝶云记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 否 | `string[]` | 要删除的草稿内部 id（`ids` 与 `numbers` 二选一）。 |
| `numbers` | 否 | `string[]` | 业务单据编号列表。 |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_invoke

调用经 WebAPI 注册的金蝶云 BOS 自定义服务。自定义服务路径会**整段替换** stub URL 中的 dynamic-form 段，因此自定义 stub 不经过 `DynamicFormService`。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `serviceName` | 是 | `string` | 自定义服务 stub 路径，格式为 `{namespace}.{class}.{method},{assembly}`，例如 `GetCust.GetCust.ExecuteService,GetCust`。`.common.kdsvc` 后缀自动追加。 |
| `payload` | 否 | `object` | 服务入参，作为业务参数对象交给该 stub。 |
| `formId` | 否 | `string` | 服务作用的可选表单 id。 |

```json
{
  "serviceName": "GetCust.GetCust.ExecuteService,GetCust",
  "formId": "SAL_SaleOrder",
  "payload": {}
}
```

## kingdee_logout

退出当前金蝶云会话并清除已存会话 cookie。无入参。

```json
{}
```

## kingdee_list_datacenters

列出当前 WebAPI 地址可达的数据中心/账套。无入参。

```json
{}
```

## 典型流程

新增/更新 → 提交 → 审核，需要时用反审核/反提交回退：

```
kingdee_save → kingdee_submit → kingdee_audit
kingdee_unaudit → kingdee_unsubmit → kingdee_save → kingdee_submit
```

没有真实账套时，把插件配置设为 `mock: true` —— 工具会返回固化的金蝶信封。安装步骤见 [INSTALL.zh.md](./INSTALL.zh.md)，全部配置项见 [CONFIG.zh.md](./CONFIG.zh.md)。
