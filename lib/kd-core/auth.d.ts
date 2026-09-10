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
import type { KdConfig } from './types.ts';
/** Payload for `LoginService.ValidateUser` (user mode). */
export declare function buildLoginPayload(config: KdConfig): Record<string, unknown>;
/** Validate the parts a mode needs before an authenticated call. */
export declare function validateConfig(config: KdConfig): void;
/**
 * Headers attached to business (non-login) requests.
 *
 * - user mode: forwards the session `kdsvc` cookie.
 * - app mode: emits a signed `KDAuthentication` header (see the module note).
 */
export declare function businessHeaders(config: KdConfig, sessionCookie?: string): Record<string, string>;
/**
 * Build the authentication header for `app` mode.
 *
 * This is the extension point for a deployment's exact third-party signing
 * scheme. The default returns a `KDAuthentication<token>` header carrying the
 * token derived from `appId` and `appSecret`. Replace this body to match your
 * Kingdee version.
 */
export declare function buildAppAuthHeader(config: KdConfig): Record<string, string>;
//# sourceMappingURL=auth.d.ts.map