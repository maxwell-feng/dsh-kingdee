/**
 * Shared types for the Kingdee Cloud (Kingdee Cloud Starry Sky) WebAPI client.
 *
 * This module is framework-free: it has no DSH dependency and is unit-testable
 * offline. Everything in `kd-core` is pure data + a transport seam.
 */
/** Authentication mode for the Kingdee Cloud WebAPI.
 *
 * - `user`: authenticates with a 账套 username/password (LoginService.ValidateUser,
 *   keeps the `kdsvc` session cookie for subsequent calls).
 * - `app`: authenticates as a third-party application using `appId`/`appSecret`.
 */
export type KdAuthMode = 'user' | 'app';
/**
 * Service endpoint names, overridable per Kingdee version.
 *
 * Sky Starry WebAPI service names vary slightly across versions. These defaults
 * cover the standard K3Cloud surface; set a field here to override it for your
 * deployment. Only the fields you set replace the default.
 */
export interface KdServiceEndpoints {
    /** `LoginService.ValidateUser` — user/password login. */
    loginService?: string;
    /** `LoginService.LogOut` — session logout. */
    logOutService?: string;
    /** `DynamicFormService.*` — the shared dynamic-form service prefix. */
    dynamicFormService?: string;
    /** Data-center list service (name is version-specific; verify per deployment). */
    listDataCenterService?: string;
    /** Prefix for custom services: `<prefix>.<serviceName>`. */
    servicePrefix?: string;
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
    baseUrl: string;
    /** Account / tenant id (`acctId`). */
    acctId: string;
    /** Authentication mode; defaults to `user`. */
    authMode?: KdAuthMode;
    /** Application id used by `app` auth mode. */
    appId?: string;
    /** Application secret used by `app` auth mode. */
    appSecret?: string;
    /** 账套 username used by `user` auth mode. */
    userName?: string;
    /** 账套 password used by `user` auth mode. */
    password?: string;
    /** Optional default organization id / FNumber applied to query operations. */
    organization?: string;
    /** Optional default request timeout in milliseconds. */
    timeoutMs?: number;
    /** Optional extra headers merged onto every request. */
    headers?: Record<string, string>;
    /** Optional literal cookie sent on every request (used by the DSH transport for session reuse). */
    cookie?: string;
    /** Optional service-endpoint overrides for this Kingdee version. */
    endpoints?: KdServiceEndpoints;
}
/** One HTTP request the transport performs. */
export interface KdRequest {
    method: 'GET' | 'POST';
    url: string;
    headers: Record<string, string>;
    /** JSON-serializable body for POST requests. */
    body?: unknown;
}
/** The response a transport returns. Header access lets a `user`-mode login read the session cookie. */
export interface KdHttpResponse {
    status: number;
    /** Already-parsed JSON payload, or `undefined` for empty bodies. */
    body: unknown;
    /** Parsed response headers (values may be raw strings, arrays, or absent). */
    headers?: Record<string, string | string[] | undefined>;
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
    Result: number | null;
    IsSuccess: boolean;
    Message: string | null;
    Data: T | null;
}
/** Parameters for `ExecuteBillQuery`. */
export interface KdQueryParams {
    /** Kingdee form id, e.g. `SAL_SaleOrder`. */
    formId: string;
    /** Field keys to return (the same keys Kingdee uses on the form). */
    fieldKeys: string[];
    /** Kingdee filter expression, e.g. `FBillNo='SO-20260701'`. */
    filter?: string;
    /** Maximum rows to return. */
    topCount?: number;
    /** Row offset for paging. */
    startRowIndex?: number;
    /** Optional organization (org) id / FNumber. */
    organization?: string;
}
/** Parameters for saving a form (DynamicFormService.Save). */
export interface KdSaveParams {
    /** Kingdee form id, e.g. `SAL_SaleOrder`. */
    formId: string;
    /** The bill payload keyed by Kingdee field keys. */
    data: Record<string, unknown>;
    /** Set `true` to skip the platform interaction (form plugin) validation. */
    interaction?: boolean;
}
/** Parameters for batch-saving multiple records in one call. */
export interface KdBatchSaveParams {
    /** Kingdee form id, e.g. `SAL_SaleOrder`. */
    formId: string;
    /** The list of bill payloads keyed by Kingdee field keys. */
    records: Record<string, unknown>[];
    /** Set `true` to skip the platform interaction (form plugin) validation. */
    interaction?: boolean;
}
/** Parameters for operations that address one or more existing records by id. */
export interface KdIdListParams {
    /** Kingdee form id, e.g. `SAL_SaleOrder`. */
    formId: string;
    /** The ids of the records to act on. */
    ids: string[];
}
/** Parameters for `Submit` (submission with an optional bill-number list). */
export interface KdSubmitParams {
    formId: string;
    ids: string[];
    /** Optional list of bill numbers accompanying the ids. */
    numbers?: string[];
}
/** Parameters for invoking a BOS custom service. */
export interface KdInvokeParams {
    /** Registered custom service name as exposed by Kingdee WebAPI. */
    serviceName: string;
    /** Optional service payload. */
    payload?: Record<string, unknown>;
    /** Optional form id the service acts on. */
    formId?: string;
}
/** The normalized value the DSH tools expose to the model. */
export interface KdToolResult<T = unknown> {
    ok: boolean;
    /** Raw numeric Kingdee result code. */
    result: number | null;
    /** Normalized payload; `null` when the call was not successful. */
    data: T | null;
    /** Human-readable Kingdee message (the error text when `ok` is false). */
    message: string | null;
}
//# sourceMappingURL=types.d.ts.map