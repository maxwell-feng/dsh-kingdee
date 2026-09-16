/**
 * Shared types for the Kingdee Cloud (Kingdee Cloud Starry Sky) WebAPI client.
 *
 * This module is framework-free: it has no DSH dependency and is unit-testable
 * offline. Everything in `kd-core` is pure data + a transport seam.
 */

/** Authentication mode for the Kingdee Cloud WebAPI.
 *
 * - `user`: authenticates with a 账套 username/password (`AuthService.ValidateUser`),
 *   then reuses the `kdservice-sessionid` session for subsequent calls.
 * - `app`: authenticates as a third-party application via
 *   `AuthService.LoginByAppSecret` using `acctId`/`username`/`appId`/`appSecret`.
 *   This is the mode Kingdee requires for public-cloud tenants opened after
 *   2022-11-29, where account/password login is no longer accepted.
 */
export type KdAuthMode = 'user' | 'app'

/**
 * Service endpoint names, overridable per Kingdee version.
 *
 * Sky Starry WebAPI service names and stub paths vary slightly across versions
 * and deployments. These defaults follow the documented V9.1 convention, where
 * every stub URL ends in `.common.kdsvc`; set a field here to override it for
 * your deployment. Only the fields you set replace the default.
 *
 * The authoritative per-tenant list lives in the product itself: sign in as an
 * administrator, then open 公共设置 → 动态服务定义 → WebAPI, pick the business
 * object and operation, and read the parameter help and sample call.
 */
export interface KdServiceEndpoints {
  /** `AuthService.ValidateUser` — 账套 username/password login (`user` mode). */
  loginService?: string
  /** `AuthService.LoginByAppSecret` — third-party application login (`app` mode). */
  loginByAppSecretService?: string
  /** `AuthService.LogOut` — session logout. */
  logOutService?: string
  /** `DynamicFormService` — the shared dynamic-form service prefix (no trailing operation). */
  dynamicFormService?: string
  /** Data-center list service (name is version-specific; verify per deployment). */
  listDataCenterService?: string
  /** Suffix appended to every generated stub path. The documented value is `.common.kdsvc`. */
  stubSuffix?: string
}

/**
 * Connection and authentication configuration for one Kingdee Cloud tenant.
 *
 * Secrets are NOT carried here in plaintext at the DSH layer: the DSH plugin
 * resolves `appSecretRef` / `userNameRef` / `passwordRef` through the credentials
 * seam and fills this object at call time. This interface keeps no secret values
 * on the wire when a config object is logged.
 */
export interface KdConfig {
  /** Base URL of the Kingdee Cloud WebAPI, e.g. `http://your-server/K3Cloud`. Trailing slashes are tolerated. */
  baseUrl: string
  /** Account / tenant id (`acctId`). */
  acctId: string
  /** Authentication mode; defaults to `user`. */
  authMode?: KdAuthMode
  /** Application id used by `app` auth mode. */
  appId?: string
  /** Application secret used by `app` auth mode. */
  appSecret?: string
  /** 账套 username used by `user` auth mode, and the 集成用户 used by `app` auth mode. */
  userName?: string
  /** 账套 password used by `user` auth mode. */
  password?: string
  /** Optional locale id sent to the login service. Kingdee's default is `2052` (zh-CN). */
  lcid?: number
  /** Optional default organization id / FNumber applied to query operations. */
  organization?: string
  /** Optional default request timeout in milliseconds. */
  timeoutMs?: number
  /** Optional extra headers merged onto every request. */
  headers?: Record<string, string>
  /** Optional literal cookie sent on every request (used by the DSH transport for session reuse). */
  cookie?: string
  /** Optional service-endpoint overrides for this Kingdee version. */
  endpoints?: KdServiceEndpoints
}

/** One HTTP request the transport performs. */
export interface KdRequest {
  method: 'GET' | 'POST'
  url: string
  headers: Record<string, string>
  /** JSON-serializable body for POST requests. */
  body?: unknown
}

/** The response a transport returns. Header access lets a `user`-mode login read the session cookie. */
export interface KdHttpResponse {
  status: number
  /** Already-parsed JSON payload, or `undefined` for empty bodies. */
  body: unknown
  /** Parsed response headers (values may be raw strings, arrays, or absent). */
  headers?: Record<string, string | string[] | undefined>
}

/**
 * The Kingdee Cloud WebAPI envelope.
 *
 * Every service returns this shape regardless of success. A successful call has
 * `IsSuccess: true`; a failed call has `IsSuccess: false` and a human-readable
 * `Message`. `Data` holds the service-specific payload. `Result` is the raw
 * numeric status code (0 on many successes, non-zero on failure).
 */
export interface KdEnvelope<T = unknown> {
  Result: number | null
  IsSuccess: boolean
  Message: string | null
  Data: T | null
}

/** Parameters for `ExecuteBillQuery`. */
export interface KdQueryParams {
  /** Kingdee form id, e.g. `SAL_SaleOrder`. */
  formId: string
  /** Field keys to return (the same keys Kingdee uses on the form). */
  fieldKeys: string[]
  /** Kingdee filter expression, e.g. `FBillNo='SO-20260701'`. */
  filter?: string
  /** Maximum rows to return (maps to TopRowCount / TopCount). */
  topCount?: number
  /** Row offset for paging (maps to StartRowIndex / StartRow). */
  startRowIndex?: number
  /** Page size limit for query pagination. */
  limit?: number
  /** Page start row offset. */
  startRow?: number
  /** Order clause, e.g. `FCreateDate DESC, FBillNo ASC`. Crucial for stable paging. */
  orderString?: string
  /** Optional organization (org) id / FNumber. */
  organization?: string
}

/** Parameters for saving a form (DynamicFormService.Save). */
export interface KdSaveParams {
  /** Kingdee form id, e.g. `SAL_SaleOrder`. */
  formId: string
  /** The bill payload keyed by Kingdee field keys. */
  data: Record<string, unknown>
  /** Set `true` to skip the platform interaction (form plugin) validation. */
  interaction?: boolean
  /** Set `true` to automatically submit and audit the record upon save. */
  isAutoSubmitAndAudit?: boolean
}

/** Parameters for batch-saving multiple records in one call. */
export interface KdBatchSaveParams {
  /** Kingdee form id, e.g. `SAL_SaleOrder`. */
  formId: string
  /** The list of bill payloads keyed by Kingdee field keys. */
  records: Record<string, unknown>[]
  /** Set `true` to skip the platform interaction (form plugin) validation. */
  interaction?: boolean
  /** Set `true` to automatically submit and audit the records upon save. */
  isAutoSubmitAndAudit?: boolean
}

/** Parameters for operations that address one or more existing records by id or number. */
export interface KdIdListParams {
  /** Kingdee form id, e.g. `SAL_SaleOrder`. */
  formId: string
  /** The ids of the records to act on. Either ids or numbers must be provided. */
  ids?: string[]
  /** Optional list of bill numbers accompanying or replacing the ids (e.g. `SO-20260901`). */
  numbers?: string[]
}

/** Parameters for `Submit` (submission with an optional bill-number list). */
export interface KdSubmitParams {
  formId: string
  ids?: string[]
  /** Optional list of bill numbers accompanying or replacing the ids. */
  numbers?: string[]
}

/** Parameters for invoking a BOS custom service. */
export interface KdInvokeParams {
  /**
   * The custom service stub path, in the documented V9.1 form
   * `{namespace}.{class}.{method},{assembly}` — for example
   * `GetCust.GetCust.ExecuteService,GetCust`. The `.common.kdsvc` suffix is
   * added for you. This replaces the dynamic-form segment in the URL, so a
   * custom stub is NOT addressed through `DynamicFormService`.
   */
  serviceName: string
  /** Optional service payload; handed to the stub as its business parameter object. */
  payload?: Record<string, unknown>
  /** Optional form id the service acts on. */
  formId?: string
}
