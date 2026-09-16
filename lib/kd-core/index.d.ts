/**
 * dsh-kingdee core output.
 *
 * Framework-free Kingdee Cloud WebAPI logic. Re-exported so the DSH tools and a
 * future MCP shell share one implementation.
 */
export { buildAppSecretLoginPayload, businessHeaders, buildLoginPayload, validateConfig } from './auth.ts';
export { assertSuccess, KdError, toKdError } from './errors.ts';
export type { KdErrorCode } from './errors.ts';
export { extractKdsvcCookie, extractSessionCookie, joinUrl, parseEnvelope, parseLoginOutcome } from './envelope.ts';
export type { KdLoginOutcome } from './envelope.ts';
export { assertSafePublicUrl, isPrivateOrLocalHost } from './security.ts';
export { HttpTransport } from './transport.ts';
export type { KdTransport } from './transport.ts';
export { buildMockTransport } from './mock.ts';
export type { MockOptions } from './mock.ts';
export { KdClient } from './client.ts';
export type { KdAuthMode, KdBatchSaveParams, KdConfig, KdEnvelope, KdHttpResponse, KdIdListParams, KdInvokeParams, KdQueryParams, KdRequest, KdSaveParams, KdServiceEndpoints, KdSubmitParams, } from './types.ts';
//# sourceMappingURL=index.d.ts.map