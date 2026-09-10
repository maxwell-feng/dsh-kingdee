# 使用说明

[English](USAGE.md) | 中文

> 已在 deepseek-harness **0.1.5-rc.1** 最新 `master` 上验证。

本文档列出本插件注册的全部 `kingdee_*` 工具（见 `src/tools.ts`）。agent 在会话中调用这些工具；每个工具都是 `src/kd-core/` 中 `KdClient` 操作的薄类型化包装。

## 调用约定

- 每个工具返回规范化的规范值，以紧凑 JSON 文本呈现（输出 schema 为 `type: 'json'`）。
- 金蝶 `IsSuccess=false` 的返回会转成类型化错误（`kd/business-error`、`kd/auth-failed`、`kd/not-found`、`kd/invalid-config`、`kd/network`、`kd/timeout`、`kd/unknown`），而不是文本描述。
- 凭据经 DSH 凭据缝在每次操作时重新解析，轮换后下一次调用即生效，无需重启。
- `formId` 为金蝶表单 id（例如 `SAL_SaleOrder`）。

## kingdee_query

查询金蝶云单据与基础资料（`DynamicFormService.ExecuteBillQuery`），返回命中的行。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id，例如 `SAL_SaleOrder`。 |
| `fieldKeys` | 是 | `string[]` | 要返回的字段键，例如 `FBillNo`、`FDocumentStatus`。 |
| `filter` | 否 | `string` | 金蝶过滤表达式，例如 `FBillNo='SO-20260701'`。 |
| `topCount` | 否 | `number` | 最多返回的行数。 |
| `organization` | 否 | `string` | 可选的组织（org）id / FNumber。 |

```json
{
  "formId": "SAL_SaleOrder",
  "fieldKeys": ["FBillNo", "FDocumentStatus"],
  "filter": "FBillNo='SO-20260701'"
}
```

## kingdee_query_business_data

用较新的结构化 `QueryBusinessData` 接口查询金蝶云单据与基础资料，返回对象形态的行。入参与 `kingdee_query` 完全一致。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id，例如 `SAL_SaleOrder`。 |
| `fieldKeys` | 是 | `string[]` | 要返回的字段键，例如 `FBillNo`、`FDocumentStatus`。 |
| `filter` | 否 | `string` | 金蝶过滤表达式，例如 `FBillNo='SO-20260701'`。 |
| `topCount` | 否 | `number` | 最多返回的行数。 |
| `organization` | 否 | `string` | 可选的组织（org）id / FNumber。 |

```json
{
  "formId": "SAL_SaleOrder",
  "fieldKeys": ["FBillNo", "FDocumentStatus"],
  "filter": "FBillNo='SO-20260701'",
  "topCount": 20
}
```

## kingdee_save

保存金蝶云表单（新增或更新单据/基础资料），返回新增/更新记录的 id 与单号。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id，例如 `SAL_SaleOrder`。 |
| `data` | 是 | `object` | 以金蝶字段键为键的单据体。 |
| `interaction` | 否 | `boolean` | 置 true 可跳过平台（表单插件）校验。 |

```json
{
  "formId": "SAL_SaleOrder",
  "data": { "FBillNo": "SO-20260701" }
}
```

## kingdee_batch_save

一次调用批量保存多条金蝶云记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id，例如 `SAL_SaleOrder`。 |
| `records` | 是 | `object[]` | 以金蝶字段键为键的单据体列表。 |
| `interaction` | 否 | `boolean` | 置 true 可跳过平台（表单插件）校验。 |

```json
{
  "formId": "SAL_SaleOrder",
  "records": [{ "FBillNo": "SO-20260701" }, { "FBillNo": "SO-20260702" }]
}
```

## kingdee_submit

提交一条或多条金蝶云单据。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 是 | `string[]` | 要提交的记录 id。 |
| `numbers` | 否 | `string[]` | 随 id 附带的可选单号。 |

```json
{
  "formId": "SAL_SaleOrder",
  "ids": ["100001"]
}
```

## kingdee_unsubmit

反提交一条或多条金蝶云单据（撤销提交）。服务名可能随版本而异（见 [CONFIG.zh.md](./CONFIG.zh.md) 的 `serviceEndpoints`）。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 是 | `string[]` | 要反提交的记录 id。 |

```json
{
  "formId": "SAL_SaleOrder",
  "ids": ["100001"]
}
```

## kingdee_audit

审核一条或多条金蝶云单据。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 是 | `string[]` | 要审核的记录 id。 |

```json
{
  "formId": "SAL_SaleOrder",
  "ids": ["100001"]
}
```

## kingdee_unaudit

反审核一条或多条金蝶云单据。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 是 | `string[]` | 要反审核的记录 id。 |

```json
{
  "formId": "SAL_SaleOrder",
  "ids": ["100001"]
}
```

## kingdee_view

按 id 查看单条金蝶云记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `id` | 是 | `string` | 要查看的记录 id。 |

```json
{
  "formId": "SAL_SaleOrder",
  "id": "100001"
}
```

## kingdee_delete

按 id 删除一条或多条金蝶云记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 是 | `string[]` | 要删除的记录 id。 |

```json
{
  "formId": "SAL_SaleOrder",
  "ids": ["100001"]
}
```

## kingdee_delete_draft

按 id 删除草稿（暂存/created）状态的金蝶云记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 金蝶表单 id。 |
| `ids` | 是 | `string[]` | 要删除的草稿记录 id。 |

```json
{
  "formId": "SAL_SaleOrder",
  "ids": ["100001"]
}
```

## kingdee_invoke

调用经 WebAPI 注册的金蝶云 BOS 自定义服务。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `serviceName` | 是 | `string` | 自定义服务名（`Kingdee.BOS.WebApi.ServicesStub.` 之后的端点后缀）。 |
| `payload` | 否 | `object` | 服务入参。 |
| `formId` | 否 | `string` | 服务作用的可选表单 id。 |

```json
{
  "serviceName": "MyCustomService",
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
