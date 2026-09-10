/**
 * The Kingdee Cloud WebAPI client.
 *
 * Owns session management and the operations used by the DSH tools: login/logout,
 * query (legacy + structured), save (single + batch), submit, audit, un-audit,
 * un-submit, delete, delete-draft, view, data-center listing, and custom-service
 * invocation. Every operation funnels through the transport seam; a failed
 * envelope throws a {@link KdError} so tool output stays structured.
 *
 * Service endpoint names vary slightly across Kingdee versions, so they are
 * overridable through `KdConfig.endpoints`; the defaults cover the standard
 * K3Cloud surface.
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
    /** Authenticate as needed (user mode) and return the session cookie, or `undefined` for app mode. */
    login(): Promise<string | undefined>;
    /** Log out of the current session and clear the stored session cookie. */
    logout(): Promise<unknown>;
    /** List the data centers / tenants reachable at this base URL (service name may be version-specific). */
    listDataCenters(): Promise<unknown>;
    /** Ensure a session exists for user mode before a business call. */
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
    /** Delete draft (暂存/created) records by id. */
    deleteDraft(params: KdIdListParams): Promise<unknown>;
    /** View a single record by id. */
    view(formId: string, id: string): Promise<unknown>;
    /** Delete records by id. */
    delete(params: KdIdListParams): Promise<unknown>;
    /** Invoke a BOS custom service. */
    invokeService(params: KdInvokeParams): Promise<unknown>;
}
//# sourceMappingURL=client.d.ts.map