# 使用说明

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/USAGE.md) | 中文

本文档列出 `dsh-kingdee` 0.20.0（DSH 基线 0.2.2-rc.3）注册的全部 `kingdee_*` 工具。每个工具都是 `src/kd-core/` 中 `KdClient` 操作的薄类型化包装。

## 调用约定

- 每个工具返回统一格式的规范化结果，以紧凑 JSON 文本呈现（输出 schema 为 `type: 'json'`）。
- 金蝶 `IsSuccess=false` 的返回会转成类型化错误：`kd/business-error`、`kd/auth-failed`、`kd/invalid-config`、`kd/network`、`kd/timeout` 或 `kd/unknown`。
- 凭据在每次操作时解析，轮换后下一次调用即生效，无需重启。
- 登录是隐式的。首次操作会自动登录，随后每次业务调用都会同时附带裸 `kdservice-sessionid` 请求头与 `Cookie`（`kdservice-sessionid=…; kdsvc=…`）。不使用 `KDAuthentication` 请求头。
- 登录 stub 返回 `{"LoginResultType": 1}`，不是 `Result` / `IsSuccess` 业务信封。非 `1` 的值会以 `kd/auth-failed` 呈现。
- `formId` 为金蝶表单 id，例如 `SAL_SaleOrder`。
- 工作流工具接受 `ids` 或 `numbers`（业务单据编号，如 `SO-20260901`）；`kingdee_view` 接受 `id` 或 `number`。自产品版本 `9.1.0.20250807` 起，`Delete` 的成功实体中会返回可信的 `Number`。

## kingdee_query

查询单据与基础资料（`DynamicFormService.ExecuteBillQuery`），返回命中的行。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id，例如 `SAL_SaleOrder`。 |
| `fieldKeys` | 是 | `string[]` | 要返回的字段键，例如 `FBillNo`、`FDocumentStatus`。 |
| `filter` | 否 | `string` | 过滤表达式，例如 `FBillNo='SO-20260701'`。 |
| `orderString` | 否 | `string` | 排序子句，例如 `FCreateDate DESC, FBillNo ASC`。稳定分页需要该参数。 |
| `topCount` | 否 | `number` | 最多返回的行数（TopRowCount）。 |
| `limit` | 否 | `number` | 分页大小。 |
| `startRow` | 否 | `number` | 分页起始行偏移。 |
| `organization` | 否 | `string` | 可选的组织 id / FNumber。 |

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

用结构化 `QueryBusinessData` 接口查询单据与基础资料，返回对象形态的行。入参与 `kingdee_query` 完全一致。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id，例如 `SAL_SaleOrder`。 |
| `fieldKeys` | 是 | `string[]` | 要返回的字段键。 |
| `filter` | 否 | `string` | 过滤表达式。 |
| `orderString` | 否 | `string` | 排序子句；稳定分页需要该参数。 |
| `topCount` | 否 | `number` | 最多返回的行数（TopRowCount）。 |
| `limit` | 否 | `number` | 分页大小。 |
| `startRow` | 否 | `number` | 分页起始行偏移。 |
| `organization` | 否 | `string` | 可选的组织 id / FNumber。 |

## kingdee_save

保存表单：新增或更新单据、基础资料。返回记录 id 与编号。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id。 |
| `data` | 是 | `object` | 按金蝶字段键组织的单据载荷。 |
| `interaction` | 否 | `boolean` | 设为 true 可跳过平台（表单插件）校验。 |
| `isAutoSubmitAndAudit` | 否 | `boolean` | 设为 true 时保存后自动提交并审核。 |

```json
{
  "formId": "SAL_SaleOrder",
  "data": { "FBillNo": "SO-20260701" },
  "isAutoSubmitAndAudit": true
}
```

## kingdee_batch_save

单次批量保存多条记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id。 |
| `records` | 是 | `object[]` | 按金蝶字段键组织的单据载荷列表。 |
| `interaction` | 否 | `boolean` | 设为 true 可跳过平台（表单插件）校验。 |
| `isAutoSubmitAndAudit` | 否 | `boolean` | 设为 true 时保存后自动提交并审核。 |

## kingdee_submit

提交一条或多条记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id。 |
| `ids` | 二选一 | `string[]` | 要提交的记录 id。 |
| `numbers` | 二选一 | `string[]` | 要提交的单据编号，例如 `SO-20260701`。 |

## kingdee_unsubmit

反提交记录，撤销提交。服务名可能随版本而异，见 [CONFIG.zh.md](./CONFIG.zh.md) 的 `serviceEndpoints`。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id。 |
| `ids` | 二选一 | `string[]` | 要反提交的记录 id。 |
| `numbers` | 二选一 | `string[]` | 要反提交的单据编号。 |

## kingdee_audit

审核（批准）一条或多条记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id。 |
| `ids` | 二选一 | `string[]` | 要审核的记录 id。 |
| `numbers` | 二选一 | `string[]` | 要审核的单据编号。 |

## kingdee_unaudit

反审核一条或多条记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id。 |
| `ids` | 二选一 | `string[]` | 要反审核的记录 id。 |
| `numbers` | 二选一 | `string[]` | 要反审核的单据编号。 |

## kingdee_view

按 id 或单据编号查看单条记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id。 |
| `id` | 二选一 | `string` | 要查看的记录 id。 |
| `number` | 二选一 | `string` | 要查看的单据编号，例如 `SO-20260701`。 |

```json
{
  "formId": "SAL_SaleOrder",
  "number": "SO-20260701"
}
```

## kingdee_delete

删除一条或多条记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id。 |
| `ids` | 二选一 | `string[]` | 要删除的记录 id。 |
| `numbers` | 二选一 | `string[]` | 要删除的单据编号。 |

## kingdee_delete_draft

删除创建状态（`FDocumentStatus` 为 `Z`、尚未提交）的草稿记录。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `formId` | 是 | `string` | 表单 id。 |
| `ids` | 二选一 | `string[]` | 要删除的草稿记录 id。 |
| `numbers` | 二选一 | `string[]` | 要删除的草稿单据编号。 |

## kingdee_invoke

调用通过 WebAPI 注册的 BOS 自定义服务。自定义服务路径会替换 stub URL 中的动态表单段。

| 入参 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `serviceName` | 是 | `string` | 自定义 stub 路径，格式为 `{namespace}.{class}.{method},{assembly}`，例如 `GetCust.GetCust.ExecuteService,GetCust`。插件会自动追加 `.common.kdsvc`。 |
| `payload` | 否 | `object` | 服务载荷，作为业务参数对象传给 stub。 |
| `formId` | 否 | `string` | 可选，服务作用的表单 id。 |

```json
{
  "serviceName": "GetCust.GetCust.ExecuteService,GetCust",
  "formId": "SAL_SaleOrder",
  "payload": {}
}
```

## kingdee_logout

退出当前金蝶云会话并清除保存的会话 Cookie。无入参。

## kingdee_list_datacenters

列出配置的 WebAPI 基址下可达的数据中心/账套。无入参。

## 典型流程

```text
kingdee_save → kingdee_submit → kingdee_audit
kingdee_unaudit → kingdee_unsubmit → kingdee_save → kingdee_submit
```

在没有真实账套时，可在插件配置中设置 `mock: true` 试用该流程。安装步骤见 [INSTALL.zh.md](./INSTALL.zh.md)，全部配置键见 [CONFIG.zh.md](./CONFIG.zh.md)。
