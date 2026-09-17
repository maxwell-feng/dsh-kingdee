/**
 * The Kingdee Cloud WebAPI client (V9.1).
 *
 * Owns session management and the operations used by the DSH tools: login/logout,
 * query (legacy + structured), save (single + batch), submit, audit, un-audit,
 * un-submit, delete, delete-draft, view, data-center listing, and custom-stub
 * invocation. Every operation funnels through the transport seam; a failed
 * envelope throws a {@link KdError} so tool output stays structured.
 *
 * Stub paths follow the documented V9.1 convention
 * `/K3Cloud/{stub path}.common.kdsvc`, where the stub path is either
 * `Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.<Operation>` or, for a
 * BOS custom service, `{namespace}.{class}.{method},{assembly}`. Service names
 * vary across versions and deployments, so they stay overridable through
 * `KdConfig.endpoints`; the defaults cover the standard K3Cloud surface.
 */
import type { KdBatchSaveParams, KdConfig, KdIdListParams, KdInvokeParams, KdQueryParams, KdSaveParams, KdSubmitParams } from './types.ts';
import type { KdTransport } from './transport.ts';
export declare class KdClient {
    private readonly cfg;
    private readonly transport;
    private readonly ep;
    private sessionCookie;
    constructor(config: KdConfig, transport: KdTransport);
    private get baseUrl();
    /**
     * Append the documented `.common.kdsvc` stub suffix, tolerating an endpoint
     * override that already carries it.
     */
    private stub;
    /** Build a `DynamicFormService.<operation>` stub path. */
    private form;
    /**
     * Authenticate and return the session value.
     *
     * Both modes call their login stub and capture the `kdservice-sessionid`
     * cookie; `user` mode calls `ValidateUser`, `app` mode calls
     * `LoginByAppSecret` because Kingdee refuses account/password login on
     * public-cloud tenants opened after 2022-11-29.
     */
    login(): Promise<string | undefined>;
    /** Log out of the current session and clear the stored session cookie. */
    logout(): Promise<unknown>;
    /** List the data centers / tenants reachable at this base URL (service name may be version-specific). */
    listDataCenters(): Promise<unknown>;
    /** Ensure a session exists before a business call. */
    private ensureSession;
    private post;
    /** ExecuteBillQuery — query bills and base data (legacy, returns table-shaped rows). */
    executeBillQuery(params: KdQueryParams): Promise<unknown>;
    /** QueryBusinessData — newer structured query with richer, object-shaped results. */
    queryBusinessData(params: KdQueryParams): Promise<unknown>;
    /** Save a form (create or update a bill / base record). */
    save(params: KdSaveParams): Promise<unknown>;
    /** Batch-save multiple records in one call. */
    batchSave(params: KdBatchSaveParams): Promise<unknown>;
    /** Submit a form. */
    submit(params: KdSubmitParams): Promise<unknown>;
    /** Audit a form. */
    audit(params: KdIdListParams): Promise<unknown>;
    /** Un-audit a form. */
    unaudit(params: KdIdListParams): Promise<unknown>;
    /** Un-submit a submitted form (name may be version-specific). */
    unsubmit(params: KdIdListParams): Promise<unknown>;
    /** Delete draft records in the draft / created state by id or number. */
    deleteDraft(params: KdIdListParams): Promise<unknown>;
    /** View a single record by id or bill number. */
    view(formId: string, id?: string, number?: string): Promise<unknown>;
    /**
     * Delete records by id or bill number.
     *
     * V9.1 corrected the `FNumber` this operation returns; the value in
     * `SuccessEntitys[].Number` can be trusted as-is from 9.1.0.20250807 on, and
     * only older builds need a follow-up query to resolve the number.
     */
    delete(params: KdIdListParams): Promise<unknown>;
    /**
     * Invoke a BOS custom service.
     *
     * A custom stub replaces the dynamic-form segment entirely, so it is posted
     * at `/K3Cloud/{serviceName}.common.kdsvc` rather than under
     * `DynamicFormService`.
     */
    invokeService(params: KdInvokeParams): Promise<unknown>;
}
//# sourceMappingURL=client.d.ts.map