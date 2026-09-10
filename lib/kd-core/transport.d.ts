/**
 * Transport seam between the Kingdee client and the network.
 *
 * The client only depends on {@link KdTransport}; swapping in {@link MockTransport}
 * lets the whole pipeline run offline with canned Kingdee envelopes.
 */
import type { KdHttpResponse, KdRequest } from './types.ts';
/** Boundary the Kingdee client talks to. Implement it with a real fetch or a mock. */
export interface KdTransport {
    request(request: KdRequest): Promise<KdHttpResponse>;
}
/** A transport that performs real HTTP through the global `fetch` with JSON encoding and timeout. */
export declare class HttpTransport implements KdTransport {
    private readonly timeoutMs;
    constructor(timeoutMs?: number);
    request(request: KdRequest): Promise<KdHttpResponse>;
}
//# sourceMappingURL=transport.d.ts.map