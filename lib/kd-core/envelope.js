/**
 * Parsing and normalization of the Kingdee Cloud WebAPI envelope and its services.
 */
/** Parse a raw JSON response body into a {@link KdEnvelope}. Tolerates empty bodies and non-JSON text. */
export function parseEnvelope(body) {
    if (body === null || body === undefined || body === '') {
        return { Result: null, IsSuccess: false, Message: 'Empty response body from Kingdee Cloud', Data: null };
    }
    if (typeof body !== 'object') {
        return { Result: null, IsSuccess: false, Message: `Unexpected response body: ${String(body)}`, Data: null };
    }
    const obj = body;
    return {
        Result: typeof obj.Result === 'number' ? obj.Result : null,
        IsSuccess: obj.IsSuccess === true,
        Message: typeof obj.Message === 'string' ? obj.Message : null,
        Data: obj.Data ?? null,
    };
}
/** Join a base URL with an endpoint path, keeping exactly one slash between them. */
export function joinUrl(baseUrl, path) {
    const base = baseUrl.replace(/\/+$/, '');
    const endpoint = path.replace(/^\/+/, '');
    return `${base}/${endpoint}`;
}
/**
 * Classify a login response.
 *
 * A numeric `LoginResultType` decides the outcome (`1` is success). When the
 * response carries no `LoginResultType` — some deployments and the offline mock
 * answer with the business envelope instead — `IsSuccess` decides it.
 */
export function parseLoginOutcome(body) {
    if (body === null || body === undefined || typeof body !== 'object') {
        return { ok: false, message: 'Empty response body from Kingdee Cloud login', loginResultType: null };
    }
    const obj = body;
    const message = typeof obj.Message === 'string' ? obj.Message : null;
    if (typeof obj.LoginResultType === 'number') {
        return { ok: obj.LoginResultType === 1, message, loginResultType: obj.LoginResultType };
    }
    return { ok: obj.IsSuccess === true, message, loginResultType: null };
}
/** Extract the session cookie value (kdservice-sessionid or kdsvc) from a response's `Set-Cookie` header, if present. */
export function extractKdsvcCookie(headers) {
    return extractSessionCookie(headers);
}
/** Extract the session cookie value (kdservice-sessionid or kdsvc) from a response's `Set-Cookie` header, if present. */
export function extractSessionCookie(headers) {
    if (!headers)
        return undefined;
    const values = headers['set-cookie'];
    const merged = Array.isArray(values) ? values.join('; ') : values;
    if (!merged)
        return undefined;
    // Prefer standard Kingdee Starry Sky session cookie: kdservice-sessionid, with fallback to kdsvc_sessionid and kdsvc
    const match = merged.match(/(?:kdservice-sessionid|kdsvc_sessionid|kdsvc)=([^;]+)/i);
    return match ? match[1] : undefined;
}
//# sourceMappingURL=envelope.js.map