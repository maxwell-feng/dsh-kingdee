# Usage

English | [中文](USAGE.zh.md)

> Verified against deepseek-harness **0.1.6-alpha.1** (`pnpm run typecheck` clean, **15** unit tests passing via `pnpm test`, and the bundle patch applying as a `# == dsh-kingdee` layer in a real `0.1.6-alpha.1` profile: `dsh plugin --profile <name> add` → `dsh --profile <name> --dump-config`) and adapted for **Kingdee Cloud Starry Sky V9.1 Enterprise Edition** (金蝶云·星空 V9.1 企业版, backward-compatible with V9.0 / V8.x). **No live-tenant verification was performed.**

This guide documents every `kingdee_*` tool the plugin registers (see `src/tools.ts`). The agent calls these tools in a chat session; each one is a thin typed wrapper over a `KdClient` operation in `src/kd-core/`.

## Conventions

- Every tool returns a normalized canonical value rendered as compact JSON text (output schema `type: 'json'`).
- A Kingdee `IsSuccess=false` response becomes a typed error (`kd/business-error`, `kd/auth-failed`, `kd/invalid-config`, `kd/network`, `kd/timeout`, `kd/unknown`) instead of prose.
- Credentials re-resolve per operation through the DSH credential seam, so a rotation reaches the next call with no restart.
- Authentication is implicit: the first operation logs in when no session is held, and the session is then attached to every business call as **both** a bare `kdservice-sessionid` request header **and** a `Cookie` (`kdservice-sessionid=…; kdsvc=…`). No `KDAuthentication` header is used.
- The login stubs answer with their own `{"LoginResultType": 1}` shape, **not** the `Result`/`IsSuccess` business envelope; the client classifies that outcome separately, so a non-`1` value surfaces as `kd/auth-failed`.
- `formId` is the Kingdee form id (e.g. `SAL_SaleOrder`).
- In Kingdee V9.1, operations such as audit, unaudit, delete, unsubmit, and delete_draft accept either `ids` or `numbers` (bill numbers such as `SO-20260901`). From product version `9.1.0.20250807` on, `Delete` also returns a trustworthy `Number` in its success entities.

## kingdee_query

Query Kingdee Cloud bills and base data (`DynamicFormService.ExecuteBillQuery`). Returns matching rows.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id, e.g. `SAL_SaleOrder`. |
| `fieldKeys` | yes | `string[]` | Field keys to return, e.g. `FBillNo`, `FDocumentStatus`. |
| `filter` | no | `string` | Kingdee filter expression, e.g. `FBillNo='SO-20260701'`. |
| `orderString` | no | `string` | Order expression, e.g. `FCreateDate DESC, FBillNo ASC`. Recommended for stable cursor pagination. |
| `topCount` | no | `number` | Maximum number of rows to return (TopRowCount). |
| `limit` | no | `number` | Page size limit for query pagination. |
| `startRow` | no | `number` | Starting row offset for query pagination. |
| `organization` | no | `string` | Optional organization (org) id / FNumber. |

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

Query Kingdee Cloud bills and base data with the newer structured `QueryBusinessData` endpoint. Returns object-shaped rows. Parameters are identical to `kingdee_query`.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id, e.g. `SAL_SaleOrder`. |
| `fieldKeys` | yes | `string[]` | Field keys to return, e.g. `FBillNo`, `FDocumentStatus`. |
| `filter` | no | `string` | Kingdee filter expression, e.g. `FBillNo='SO-20260701'`. |
| `orderString` | no | `string` | Order expression, e.g. `FCreateDate DESC, FBillNo ASC`. Recommended for stable cursor pagination. |
| `topCount` | no | `number` | Maximum number of rows to return (TopRowCount). |
| `limit` | no | `number` | Page size limit for query pagination. |
| `startRow` | no | `number` | Starting row offset for query pagination. |
| `organization` | no | `string` | Optional organization (org) id / FNumber. |

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

Save a Kingdee Cloud form (create or update a bill / base record). Returns the created/updated record id and number.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id, e.g. `SAL_SaleOrder`. |
| `data` | yes | `object` | Bill payload keyed by Kingdee field keys. |
| `interaction` | no | `boolean` | Set true to skip platform (form plugin) validation. |
| `isAutoSubmitAndAudit` | no | `boolean` | Set true to automatically submit and audit the record upon save. |

```json
{
  "formId": "SAL_SaleOrder",
  "data": { "FBillNo": "SO-20260701" },
  "isAutoSubmitAndAudit": true
}
```

## kingdee_batch_save

Batch-save multiple Kingdee Cloud records in one call.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id, e.g. `SAL_SaleOrder`. |
| `records` | yes | `object[]` | List of bill payloads keyed by Kingdee field keys. |
| `interaction` | no | `boolean` | Set true to skip platform (form plugin) validation. |
| `isAutoSubmitAndAudit` | no | `boolean` | Set true to automatically submit and audit the records upon save. |

```json
{
  "formId": "SAL_SaleOrder",
  "records": [{ "FBillNo": "SO-20260701" }, { "FBillNo": "SO-20260702" }],
  "isAutoSubmitAndAudit": false
}
```

## kingdee_submit

Submit one or more Kingdee Cloud forms.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id. |
| `ids` | no | `string[]` | Record ids to submit (either `ids` or `numbers` required). |
| `numbers` | no | `string[]` | Optional bill numbers (e.g. `SO-20260701`) accompanying or replacing the ids. |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_unsubmit

Un-submit one or more Kingdee Cloud forms (reverses a submit). Service name may be version-specific (see `serviceEndpoints` in [CONFIG.md](./CONFIG.md)).

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id. |
| `ids` | no | `string[]` | Record ids to un-submit (either `ids` or `numbers` required). |
| `numbers` | no | `string[]` | Optional bill numbers to un-submit. |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_audit

Audit (approve) one or more Kingdee Cloud forms.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id. |
| `ids` | no | `string[]` | Record ids to audit (either `ids` or `numbers` required). |
| `numbers` | no | `string[]` | Optional bill numbers (e.g. `SO-20260701`) to audit. |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_unaudit

Un-audit one or more Kingdee Cloud forms.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id. |
| `ids` | no | `string[]` | Record ids to un-audit (either `ids` or `numbers` required). |
| `numbers` | no | `string[]` | Optional bill numbers to un-audit. |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_view

View a single Kingdee Cloud record by id or bill number.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id. |
| `id` | no | `string` | Record id to view (either `id` or `number` required). |
| `number` | no | `string` | Record bill number to view (e.g. `SO-20260701`). |

```json
{
  "formId": "SAL_SaleOrder",
  "number": "SO-20260701"
}
```

## kingdee_delete

Delete one or more Kingdee Cloud records by id or bill number.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id. |
| `ids` | no | `string[]` | Record ids to delete (either `ids` or `numbers` required). |
| `numbers` | no | `string[]` | Optional bill numbers to delete. |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_delete_draft

Delete draft (暂存/created) Kingdee Cloud records by id or bill number.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `formId` | yes | `string` | Kingdee form id. |
| `ids` | no | `string[]` | Draft record ids to delete (either `ids` or `numbers` required). |
| `numbers` | no | `string[]` | Optional draft bill numbers to delete. |

```json
{
  "formId": "SAL_SaleOrder",
  "numbers": ["SO-20260701"]
}
```

## kingdee_invoke

Invoke a Kingdee Cloud BOS custom service registered via the WebAPI. The custom service path **replaces** the dynamic-form segment of the stub URL, so a custom stub is not addressed through `DynamicFormService`.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `serviceName` | yes | `string` | Custom service stub path in the form `{namespace}.{class}.{method},{assembly}`, e.g. `GetCust.GetCust.ExecuteService,GetCust`. The `.common.kdsvc` suffix is appended automatically. |
| `payload` | no | `object` | Service payload, handed to the stub as its business parameter object. |
| `formId` | no | `string` | Optional form id the service acts on. |

```json
{
  "serviceName": "GetCust.GetCust.ExecuteService,GetCust",
  "formId": "SAL_SaleOrder",
  "payload": {}
}
```

## kingdee_logout

Log out the current Kingdee Cloud session and clear the stored session cookie. Takes no parameters.

```json
{}
```

## kingdee_list_datacenters

List the data centers / tenants reachable at the configured WebAPI base URL. Takes no parameters.

```json
{}
```

## Typical flow

Create/update → submit → audit, reversing with un-audit / un-submit when needed:

```
kingdee_save → kingdee_submit → kingdee_audit
kingdee_unaudit → kingdee_unsubmit → kingdee_save → kingdee_submit
```

To try the flow without a real tenant, set `mock: true` in the plugin config — the tools then return canned Kingdee envelopes. See [INSTALL.md](./INSTALL.md) for setup and [CONFIG.md](./CONFIG.md) for all configuration keys.
