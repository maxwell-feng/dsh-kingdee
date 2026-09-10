/**
 * Transport seam between the Kingdee client and the network.
 *
 * The client only depends on {@link KdTransport}; swapping in {@link MockTransport}
 * lets the whole pipeline run offline with canned Kingdee envelopes.
 */
/** A transport that performs real HTTP through the global `fetch` with JSON encoding and timeout. */
export class HttpTransport {
    timeoutMs;
    constructor(timeoutMs = 30_000) {
        this.timeoutMs = timeoutMs;
    }
    async request(request) {
        const headers = { 'Content-Type': 'application/json', ...request.headers };
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        let response;
        try {
            response = await globalThis.fetch?.(request.url, {
                method: request.method,
                headers,
                body: request.method === 'POST' ? JSON.stringify(request.body ?? {}) : undefined,
                signal: controller.signal,
            });
            if (!response)
                throw new Error('fetch is not available in this runtime');
        }
        catch (error) {
            clearTimeout(timer);
            throw error;
        }
        finally {
            clearTimeout(timer);
        }
        const text = await response.text();
        let body;
        try {
            body = text ? JSON.parse(text) : undefined;
        }
        catch {
            body = text;
        }
        return {
            status: response.status,
            body,
            headers: collectHeaders(response.headers),
        };
    }
}
/** Lowercase response headers into a plain object (works across DOM and undici Headers). */
function collectHeaders(headers) {
    const out = {};
    headers.forEach((value, key) => {
        out[key.toLowerCase()] = value;
    });
    return out;
}
//# sourceMappingURL=transport.js.map