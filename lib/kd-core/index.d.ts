/**
 * dsh-kingdee core output.
 *
 * Framework-free Kingdee Cloud WebAPI logic. Re-exported so the DSH tools and a
 * future MCP shell share one implementation.
 */
export { buildAppAuthHeader, businessHeaders, buildLoginPayload, validateConfig } from './auth.ts';
export { assertSuccess, KdError, toKdError } from './errors.ts';
export type { KdErrorCode } from './errors.ts';
export { extractKdsvcCookie, joinUrl, parseEnvelope, parseEnvelopeFromText } from './envelope.ts';
export { HttpTransport } from './transport.ts';
export type { KdTransport } from './transport.ts';
export { buildMockTransport } from './mock.ts';
export type { MockOptions } from './mock.ts';
export { KdClient } from './client.ts';
export type { KdAuthMode, KdBatchSaveParams, KdConfig, KdEnvelope, KdHttpResponse, KdIdListParams, KdInvokeParams, KdQueryParams, KdRequest, KdSaveParams, KdServiceEndpoints, KdSubmitParams, KdToolResult, } from './types.ts';
//# sourceMappingURL=index.d.ts.map