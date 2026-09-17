/**
 * dsh-kingdee plugin configuration and credential resolution.
 *
 * This half imports DSH peer packages (`@deepseek-ai/*`) and is compiled inside a
 * DSH profile, where those packages resolve. The framework-free core that it
 * drives lives in `./kd-core` and is built/tested independently.
 */
import z from '@deepseek-ai/schemastery';
/** Settings namespace (also the settings-card key on the Client side). */
export const NAMESPACE = 'kingdee';
export const Config = z.object({
    baseUrl: z.string(),
    acctId: z.string(),
    authMode: z.union(['user', 'app']).default('user'),
    appId: z.string(),
    appSecretRef: z.string().default('DSH_KINGDEE_APP_SECRET'),
    userNameRef: z.string().default('DSH_KINGDEE_USER'),
    passwordRef: z.string().default('DSH_KINGDEE_PASSWORD'),
    lcid: z.number().step(1).min(0).default(2052),
    organization: z.string(),
    timeoutMs: z.number().step(1).min(0).max(300_000).default(30_000),
    mock: z.boolean().default(false),
    serviceEndpoints: z.object({
        loginService: z.string(),
        loginByAppSecretService: z.string(),
        logOutService: z.string(),
        dynamicFormService: z.string(),
        listDataCenterService: z.string(),
        stubSuffix: z.string(),
    }),
});
/**
 * Build a resolved {@link KdConfig} from plugin config plus the credential values
 * resolved for the current operation. Pure and testable: it never touches `ctx`.
 */
export function buildKdConfig(config, resolved) {
    const mode = config.authMode ?? 'user';
    const base = {
        baseUrl: config.baseUrl ?? '',
        acctId: config.acctId ?? '',
        authMode: mode,
        lcid: config.lcid ?? 2052,
        organization: config.organization,
        timeoutMs: config.timeoutMs ?? 30_000,
        endpoints: config.serviceEndpoints,
    };
    if (mode === 'user') {
        return {
            ...base,
            userName: resolved.userName,
            password: resolved.password,
        };
    }
    // `app` mode names the integration user it acts as, alongside the application credentials.
    return {
        ...base,
        userName: resolved.userName,
        appId: config.appId,
        appSecret: resolved.appSecret,
    };
}
//# sourceMappingURL=config.js.map