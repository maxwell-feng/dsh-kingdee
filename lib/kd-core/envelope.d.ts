/**
 * Parsing and normalization of the Kingdee Cloud WebAPI envelope and its services.
 */
import type { KdEnvelope } from './types.ts';
/** Parse a raw JSON response body into a {@link KdEnvelope}. Tolerates empty bodies and non-JSON text. */
export declare function parseEnvelope(body: unknown): KdEnvelope;
/** Normalize a JSON parse error into an envelope-friendly failure. */
export declare function parseEnvelopeFromText(text: string): KdEnvelope;
/** Join a base URL with an endpoint path, keeping exactly one slash between them. */
export declare function joinUrl(baseUrl: string, path: string): string;
/** Extract the `kdsvc` session cookie value from a response's `Set-Cookie` header, if present. */
export declare function extractKdsvcCookie(headers: Record<string, string | string[] | undefined> | undefined): string | undefined;
//# sourceMappingURL=envelope.d.ts.map