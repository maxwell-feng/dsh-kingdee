/**
 * Authentication building for the Kingdee Cloud WebAPI.
 *
 * Two modes are supported:
 *
 * - `user`: a 账套 username/password. The client calls
 *   `LoginService.ValidateUser`, captures the `kdsvc` session cookie, and reuses it
 *   on every business call via a `Cookie` header.
 * - `app`: a third-party application (`appId`/`appSecret`). The exact signing
 *   scheme is deployment-specific; this module abstracts it behind
 *   {@link buildAppAuthHeader}. Default production behavior attaches the
 *   `KDAuthentication<token>` header form. **Verify this against your Kingdee
 *   version before relying on `app` mode against a live tenant** — the mock path
 *   does not exercise signing.
 */

import type { KdAuthMode, KdConfig } from './types.ts'

/** Payload for `LoginService.ValidateUser` (user mode). */
export function buildLoginPayload(config: KdConfig): Record<string, unknown> {
  return {
    acctID: config.acctId,
    userName: config.userName ?? '',
    password: config.password ?? '',
    license: config.appId ?? '',
  }
}

/** Validate the parts a mode needs before an authenticated call. */
export function validateConfig(config: KdConfig): void {
  if (!config.baseUrl) throw new Error('KdConfig.baseUrl is required')
  if (!config.acctId) throw new Error('KdConfig.acctId is required')

  if ((config.authMode ?? 'user') === 'user') {
    if (!config.userName) throw new Error('KdConfig.userName is required for authMode "user"')
    if (!config.password) throw new Error('KdConfig.password is required for authMode "user"')
  } else {
    if (!config.appId) throw new Error('KdConfig.appId is required for authMode "app"')
    if (!config.appSecret) throw new Error('KdConfig.appSecret is required for authMode "app"')
  }
}

/**
 * Headers attached to business (non-login) requests.
 *
 * - user mode: forwards the session `kdsvc` cookie.
 * - app mode: emits a signed `KDAuthentication` header (see the module note).
 */
export function businessHeaders(config: KdConfig, sessionCookie?: string): Record<string, string> {
  const mode: KdAuthMode = config.authMode ?? 'user'
  const base = { ...(config.headers ?? {}) }

  if (mode === 'user') {
    const cookie = sessionCookie ?? config.cookie
    if (cookie) base.Cookie = `kdsvc=${cookie}`
    return base
  }

  return { ...base, ...buildAppAuthHeader(config) }
}

/**
 * Build the authentication header for `app` mode.
 *
 * This is the extension point for a deployment's exact third-party signing
 * scheme. The default returns a `KDAuthentication<token>` header carrying the
 * token derived from `appId` and `appSecret`. Replace this body to match your
 * Kingdee version.
 */
export function buildAppAuthHeader(config: KdConfig): Record<string, string> {
  const token = `${config.appId}.${config.appSecret ?? ''}`
  return { KDAuthentication: token }
}
