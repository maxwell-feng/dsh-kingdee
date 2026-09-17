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
import { assertSafePublicUrl } from "./security.js";
/** Default locale id: `2052` is zh-CN, Kingdee's own default. */
const DEFAULT_LCID = 2052;
/** Locale id sent to the login services. */
function lcidOf(config) {
    return config.lcid ?? DEFAULT_LCID;
}
/** Payload for `AuthService.ValidateUser` (`user` mode). */
export function buildLoginPayload(config) {
    return {
        acctID: config.acctId,
        username: config.userName ?? '',
        password: config.password ?? '',
        lcid: lcidOf(config),
    };
}
/**
 * Payload for `AuthService.LoginByAppSecret` (`app` mode).
 *
 * A third-party application login still names the integration user it acts as, so
 * `userName` is required here as well as `appId`/`appSecret`.
 */
export function buildAppSecretLoginPayload(config) {
    return {
        acctID: config.acctId,
        username: config.userName ?? '',
        appid: config.appId ?? '',
        appsecret: config.appSecret ?? '',
        lcid: lcidOf(config),
    };
}
/** Validate the parts a mode needs before an authenticated call. */
export function validateConfig(config) {
    if (!config.baseUrl)
        throw new Error('KdConfig.baseUrl is required');
    assertSafePublicUrl(config.baseUrl);
    if (!config.acctId)
        throw new Error('KdConfig.acctId is required');
    if ((config.authMode ?? 'user') === 'user') {
        if (!config.userName)
            throw new Error('KdConfig.userName is required for authMode "user"');
        if (!config.password)
            throw new Error('KdConfig.password is required for authMode "user"');
    }
    else {
        if (!config.userName)
            throw new Error('KdConfig.userName (the integration user) is required for authMode "app"');
        if (!config.appId)
            throw new Error('KdConfig.appId is required for authMode "app"');
        if (!config.appSecret)
            throw new Error('KdConfig.appSecret is required for authMode "app"');
    }
}
/**
 * Headers attached to business (non-login) requests.
 *
 * Kingdee accepts the session on the `Cookie` header and, as its own real
 * captures show, also as a bare `kdservice-sessionid` request header. Both are
 * sent so either gateway path resolves; `kdsvc` rides along as the legacy
 * compatible name. The session is mode-independent — `LoginByAppSecret`
 * establishes the same cookie as `ValidateUser`.
 */
export function businessHeaders(config, sessionCookie) {
    const base = { ...(config.headers ?? {}) };
    const session = sessionCookie ?? config.cookie;
    if (!session)
        return base;
    return {
        ...base,
        'kdservice-sessionid': session,
        Cookie: `kdservice-sessionid=${session}; kdsvc=${session}`,
    };
}
//# sourceMappingURL=auth.js.map