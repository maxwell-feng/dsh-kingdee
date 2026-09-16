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

/** Join a base URL with an endpoint path, keeping exactly one slash between them. */
export function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, '')
  const endpoint = path.replace(/^\/+/, '')
  return `${base}/${endpoint}`
}

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
  ok: boolean
  /** Human-readable message when the response carried one. */
  message: string | null
  /** The raw `LoginResultType` when present; `null` when the response used the business envelope. */
  loginResultType: number | null
}

/**
 * Classify a login response.
 *
 * A numeric `LoginResultType` decides the outcome (`1` is success). When the
 * response carries no `LoginResultType` — some deployments and the offline mock
 * answer with the business envelope instead — `IsSuccess` decides it.
 */
export function parseLoginOutcome(body: unknown): KdLoginOutcome {
  if (body === null || body === undefined || typeof body !== 'object') {
    return { ok: false, message: 'Empty response body from Kingdee Cloud login', loginResultType: null }
  }

  const obj = body as Record<string, unknown>
  const message = typeof obj.Message === 'string' ? obj.Message : null

  if (typeof obj.LoginResultType === 'number') {
    return { ok: obj.LoginResultType === 1, message, loginResultType: obj.LoginResultType }
  }

  return { ok: obj.IsSuccess === true, message, loginResultType: null }
}

/** Extract the session cookie value (kdservice-sessionid or kdsvc) from a response's `Set-Cookie` header, if present. */
export function extractKdsvcCookie(headers: Record<string, string | string[] | undefined> | undefined): string | undefined {
  return extractSessionCookie(headers)
}

/** Extract the session cookie value (kdservice-sessionid or kdsvc) from a response's `Set-Cookie` header, if present. */
export function extractSessionCookie(headers: Record<string, string | string[] | undefined> | undefined): string | undefined {
  if (!headers) return undefined
  const values = headers['set-cookie']
  const merged = Array.isArray(values) ? values.join('; ') : values
  if (!merged) return undefined
  // Prefer standard Kingdee Starry Sky session cookie: kdservice-sessionid, with fallback to kdsvc_sessionid and kdsvc
  const match = merged.match(/(?:kdservice-sessionid|kdsvc_sessionid|kdsvc)=([^;]+)/i)
  return match ? match[1] : undefined
}
