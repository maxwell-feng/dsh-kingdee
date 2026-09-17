/**
 * Authentication building for the Kingdee Cloud WebAPI (V9.1).
 *
 * Two modes are supported, both of which establish a session that every later
 * call reuses through the `kdservice-sessionid` session:
 *
 * - `user`: a account-set username/password against `AuthService.ValidateUser`.
 * - `app`: a third-party application against `AuthService.LoginByAppSecret`,
 *   sending `acctId` + integration user + `appId` + `appSecret`.
 *
 * `app` is the mode Kingdee requires for public-cloud tenants opened after
 * 2022-11-29, where account/password login is refused. Both modes return the
 * session on the `kdservice-sessionid` cookie, so the caller attaches it the
 * same way regardless of mode.
 *
 * ## Named request keys
 *
 * The login services are called with a named JSON object. The key names below
 * (`acctID`, `username`, `appid`, `appsecret`, `lcid`) are the community-attested
 * spelling, not a published Kingdee contract, and KDServiceFx binds them
 * case-sensitively. Confirm them against your own tenant before relying on a
 * live connection: Common Settings → Dynamic Service Definition → WebAPI lists each operation's
 * parameters and a sample call.
 */
import type { KdConfig } from './types.ts';
/** Payload for `AuthService.ValidateUser` (`user` mode). */
export declare function buildLoginPayload(config: KdConfig): Record<string, unknown>;
/**
 * Payload for `AuthService.LoginByAppSecret` (`app` mode).
 *
 * A third-party application login still names the integration user it acts as, so
 * `userName` is required here as well as `appId`/`appSecret`.
 */
export declare function buildAppSecretLoginPayload(config: KdConfig): Record<string, unknown>;
/** Validate the parts a mode needs before an authenticated call. */
export declare function validateConfig(config: KdConfig): void;
/**
 * Headers attached to business (non-login) requests.
 *
 * Kingdee accepts the session on the `Cookie` header and, as its own real
 * captures show, also as a bare `kdservice-sessionid` request header. Both are
 * sent so either gateway path resolves; `kdsvc` rides along as the legacy
 * compatible name. The session is mode-independent — `LoginByAppSecret`
 * establishes the same cookie as `ValidateUser`.
 */
export declare function businessHeaders(config: KdConfig, sessionCookie?: string): Record<string, string>;
//# sourceMappingURL=auth.d.ts.map