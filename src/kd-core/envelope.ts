/**
 * Parsing and normalization of the Kingdee Cloud WebAPI envelope and its services.
 */

import type { KdEnvelope } from './types.ts'

/** Parse a raw JSON response body into a {@link KdEnvelope}. Tolerates empty bodies and non-JSON text. */
export function parseEnvelope(body: unknown): KdEnvelope {
  if (body === null || body === undefined || body === '') {
    return { Result: null, IsSuccess: false, Message: 'Empty response body from Kingdee Cloud', Data: null }
  }

  if (typeof body !== 'object') {
    return { Result: null, IsSuccess: false, Message: `Unexpected response body: ${String(body)}`, Data: null }
  }

  const obj = body as Record<string, unknown>
  return {
    Result: typeof obj.Result === 'number' ? obj.Result : null,
    IsSuccess: obj.IsSuccess === true,
    Message: typeof obj.Message === 'string' ? obj.Message : null,
    Data: (obj.Data as KdEnvelope['Data']) ?? null,
  }
}

/** Normalize a JSON parse error into an envelope-friendly failure. */
export function parseEnvelopeFromText(text: string): KdEnvelope {
  try {
    return parseEnvelope(JSON.parse(text))
  } catch (error) {
    return {
      Result: null,
      IsSuccess: false,
      Message: `Failed to parse Kingdee response: ${error instanceof Error ? error.message : String(error)}`,
      Data: null,
    }
  }
}

/** Join a base URL with an endpoint path, keeping exactly one slash between them. */
export function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, '')
  const endpoint = path.replace(/^\/+/, '')
  return `${base}/${endpoint}`
}

/** Extract the `kdsvc` session cookie value from a response's `Set-Cookie` header, if present. */
export function extractKdsvcCookie(headers: Record<string, string | string[] | undefined> | undefined): string | undefined {
  if (!headers) return undefined
  const values = headers['set-cookie']
  const merged = Array.isArray(values) ? values.join('; ') : values
  if (!merged) return undefined
  const match = /kdsvc=([^;]+)/i.exec(merged)
  return match ? match[1] : undefined
}
