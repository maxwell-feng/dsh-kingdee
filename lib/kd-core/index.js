/**
 * dsh-kingdee core output.
 *
 * Framework-free Kingdee Cloud WebAPI logic. Re-exported so the DSH tools and a
 * future MCP shell share one implementation.
 */
export { buildAppAuthHeader, businessHeaders, buildLoginPayload, validateConfig } from "./auth.js";
export { assertSuccess, KdError, toKdError } from "./errors.js";
export { extractKdsvcCookie, joinUrl, parseEnvelope, parseEnvelopeFromText } from "./envelope.js";
export { HttpTransport } from "./transport.js";
export { buildMockTransport } from "./mock.js";
export { KdClient } from "./client.js";
//# sourceMappingURL=index.js.map