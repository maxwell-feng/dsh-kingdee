# Usage

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/USAGE.zh.md)

This guide documents every `kingdee_*` tool registered by `dsh-kingdee` 0.20.0 (DSH baseline 0.2.2-rc.3). Each tool is a thin typed wrapper over a `KdClient` operation in `src/kd-core/`.

## Conventions

- Every tool returns a normalized canonical value rendered as compact JSON text (output schema `type: 'json'`).
- A Kingdee `IsSuccess=false` response becomes a typed error: `kd/business-error`, `kd/auth-failed`, `kd/invalid-config`, `kd/network`, `kd/timeout` or `kd/unknown`.
- Credentials are resolved per operation, so a rotation reaches the next call without a restart.
- Login is implicit. The first operation logs in, and the session is attached to every business call as both a bare `kdservice-sessionid` request header and a `Cookie` (`kdservice-sessionid=…; kdsvc=…`). No `KDAuthentication` header is used.
- The login stubs return `{"LoginResultType": 1}`, not the `Result` / `IsSuccess` business envelope. A non-`1` value surfaces as `kd/auth-failed`.
- `formId` is the Kingdee form id, e.g. `SAL_SaleOrder`.
- Workflow tools accept `ids` or `numbers` (bill numbers such as `SO-20260901`). `kingdee_view` accepts `id` or `number`. From product version `9.1.0.20250807` on, `Delete` also returns a trustworthy `Number` in its success entities.

## kingdee_query

Query bills and base data (`DynamicFormService.ExecuteBillQuery`). Returns matching rows.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id, e.g. `SAL_SaleOrder`. |
| `fieldKeys` | yes | `string[]` | Field keys to return, e.g. `FBillNo`, `FDocumentStatus`. |
| `filter` | no | `string` | Filter expression, e.g. `FBillNo='SO-20260701'`. |
| `orderString` | no | `string` | Order expression, e.g. `FCreateDate DESC, FBillNo ASC`. Needed for stable pagination. |
| `topCount` | no | `number` | Maximum number of rows to return (TopRowCount). |
| `limit` | no | `number` | Page size for pagination. |
| `startRow` | no | `number` | Starting row offset for pagination. |
| `organization` | no | `string` | Optional organization id / FNumber. |

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

Query bills and base data with the structured `QueryBusinessData` endpoint. Returns object-shaped rows. Parameters are identical to `kingdee_query`.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id, e.g. `SAL_SaleOrder`. |
| `fieldKeys` | yes | `string[]` | Field keys to return. |
| `filter` | no | `string` | Filter expression. |
| `orderString` | no | `string` | Order expression; needed for stable pagination. |
| `topCount` | no | `number` | Maximum number of rows to return (TopRowCount). |
| `limit` | no | `number` | Page size for pagination. |
| `startRow` | no | `number` | Starting row offset for pagination. |
| `organization` | no | `string` | Optional organization id / FNumber. |

## kingdee_save

Save a form: create or update a bill or base record. Returns the record id and number.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id. |
| `data` | yes | `object` | Bill payload keyed by Kingdee field keys. |
| `interaction` | no | `boolean` | Set true to skip platform (form plugin) validation. |
| `isAutoSubmitAndAudit` | no | `boolean` | Set true to submit and audit the record on save. |

```json
{
  "formId": "SAL_SaleOrder",
  "data": { "FBillNo": "SO-20260701" },
  "isAutoSubmitAndAudit": true
}
```

## kingdee_batch_save

Batch-save several records in one call.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id. |
| `records` | yes | `object[]` | List of bill payloads keyed by Kingdee field keys. |
| `interaction` | no | `boolean` | Set true to skip platform (form plugin) validation. |
| `isAutoSubmitAndAudit` | no | `boolean` | Set true to submit and audit the records on save. |

## kingdee_submit

Submit one or more records.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id. |
| `ids` | one of | `string[]` | Record ids to submit. |
| `numbers` | one of | `string[]` | Bill numbers to submit, e.g. `SO-20260701`. |

## kingdee_unsubmit

Un-submit records, reversing a submit. The service name may be version-specific; see `serviceEndpoints` in [CONFIG.md](./CONFIG.md).

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id. |
| `ids` | one of | `string[]` | Record ids to un-submit. |
| `numbers` | one of | `string[]` | Bill numbers to un-submit. |

## kingdee_audit

Audit (approve) one or more records.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id. |
| `ids` | one of | `string[]` | Record ids to audit. |
| `numbers` | one of | `string[]` | Bill numbers to audit. |

## kingdee_unaudit

Un-audit one or more records.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id. |
| `ids` | one of | `string[]` | Record ids to un-audit. |
| `numbers` | one of | `string[]` | Bill numbers to un-audit. |

## kingdee_view

View a single record by id or bill number.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id. |
| `id` | one of | `string` | Record id to view. |
| `number` | one of | `string` | Bill number to view, e.g. `SO-20260701`. |

```json
{
  "formId": "SAL_SaleOrder",
  "number": "SO-20260701"
}
```

## kingdee_delete

Delete one or more records.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id. |
| `ids` | one of | `string[]` | Record ids to delete. |
| `numbers` | one of | `string[]` | Bill numbers to delete. |

## kingdee_delete_draft

Delete draft records in the created state (`FDocumentStatus` `Z`, not yet submitted).

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Form id. |
| `ids` | one of | `string[]` | Draft record ids to delete. |
| `numbers` | one of | `string[]` | Draft bill numbers to delete. |

## kingdee_invoke

Invoke a BOS custom service registered through the WebAPI. The custom service path replaces the dynamic-form segment of the stub URL.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `serviceName` | yes | `string` | Custom stub path as `{namespace}.{class}.{method},{assembly}`, e.g. `GetCust.GetCust.ExecuteService,GetCust`. `.common.kdsvc` is appended automatically. |
| `payload` | no | `object` | Service payload, passed to the stub as its business parameter object. |
| `formId` | no | `string` | Optional form id the service acts on. |

```json
{
  "serviceName": "GetCust.GetCust.ExecuteService,GetCust",
  "formId": "SAL_SaleOrder",
  "payload": {}
}
```

## kingdee_logout

Log out of the current Kingdee Cloud session and clear the stored session cookie. Takes no parameters.

## kingdee_list_datacenters

List the data centers / tenants reachable at the configured WebAPI base URL. Takes no parameters.

## Typical flow

```text
kingdee_save → kingdee_submit → kingdee_audit
kingdee_unaudit → kingdee_unsubmit → kingdee_save → kingdee_submit
```

To try the flow without a tenant, set `mock: true` in the plugin config. See [INSTALL.md](./INSTALL.md) for setup and [CONFIG.md](./CONFIG.md) for all configuration keys.
