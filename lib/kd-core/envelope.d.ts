/**
 * Parsing and normalization of the Kingdee Cloud WebAPI envelope and its services.
 */
import type { KdEnvelope } from './types.ts';
/** Parse a raw JSON response body into a {@link KdEnvelope}. Tolerates empty bodies and non-JSON text. */
export declare function parseEnvelope(body: unknown): KdEnvelope;
/** Join a base URL with an endpoint path, keeping exactly one slash between them. */
export declare function joinUrl(baseUrl: string, path: string): string;
/**
 * The outcome of a Kingdee login call.
 *
 * The login services answer with their **own** shape — `{"LoginResultType": 1}`
 * on success — and not with the `Result`/`IsSuccess` business envelope that
 * every other operation returns. Treating the login response as a business
 * envelope therefore reports a *successful* login as a failure, so the two are
 * parsed separately here.
 */
export interface KdLoginOutcome {
    /** Whether the session was established. */
    ok: boolean;
    /** Human-readable message when the response carried one. */
    message: string | null;
    /** The raw `LoginResultType` when present; `null` when the response used the business envelope. */
    loginResultType: number | null;
}
/**
 * Classify a login response.
 *
 * A numeric `LoginResultType` decides the outcome (`1` is success). When the
 * response carries no `LoginResultType` — some deployments and the offline mock
 * answer with the business envelope instead — `IsSuccess` decides it.
 */
export declare function parseLoginOutcome(body: unknown): KdLoginOutcome;
/** Extract the session cookie value (kdservice-sessionid or kdsvc) from a response's `Set-Cookie` header, if present. */
export declare function extractKdsvcCookie(headers: Record<string, string | string[] | undefined> | undefined): string | undefined;
/** Extract the session cookie value (kdservice-sessionid or kdsvc) from a response's `Set-Cookie` header, if present. */
export declare function extractSessionCookie(headers: Record<string, string | string[] | undefined> | undefined): string | undefined;
//# sourceMappingURL=envelope.d.ts.map