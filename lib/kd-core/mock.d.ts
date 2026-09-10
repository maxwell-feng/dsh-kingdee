/**
 * Offline mock transport for dsh-kingdee.
 *
 * Returns canned Kingdee envelopes per operation so the full tool pipeline can be
 * exercised without a reachable Kingdee Cloud tenant. Use it in tests and in a
 * `mock: true` DSH configuration to demo the workflow.
 */
import type { KdEnvelope } from './types.ts';
import type { KdTransport } from './transport.ts';
/** Per-operation canned-envelope overrides and failure simulation. */
export interface MockOptions {
    /** Override the envelope returned for a given service operation (matched by the endpoint suffix). */
    overrides?: Record<string, KdEnvelope>;
    /** Form ids whose Save/Submit/Audit calls should fail, to exercise error mapping. */
    failingFormIds?: string[];
    /** Emit a `Set-Cookie: kdsvc=...` on the login response (makes user-mode session capture testable). */
    sessionCookie?: string;
}
/** Build a kingdee mock transport that never touches the network. */
export declare function buildMockTransport(options?: MockOptions): KdTransport;
//# sourceMappingURL=mock.d.ts.map