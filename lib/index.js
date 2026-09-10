/**
 * dsh-kingdee host plugin entry.
 *
 * Registers the kingdee_* tool set and the `kingdee` settings namespace. Every
 * operation builds a fresh {@link KdClient} so credentials are re-resolved per call
 * (the DSH credential seam's hot-update contract). Compiled inside a DSH profile,
 * where the `@deepseek-ai/*` peer packages resolve.
 */
import { credentialRef } from '@deepseek-ai/dsh-credentials';
import { buildMockTransport, HttpTransport, KdClient } from "./kd-core/index.js";
import { buildKdConfig, Config, NAMESPACE } from "./config.js";
import { registerKingdeeTools } from "./tools.js";
export const name = 'dsh-kingdee';
export const inject = ['tools', 'credentials', 'settings'];
export function apply(ctx, config) {
    let live = () => config;
    const getClient = async () => {
        const credentials = await resolveCredentials(ctx, live());
        const kdConfig = buildKdConfig(live(), credentials);
        const transport = live().mock ? buildMockTransport() : new HttpTransport(kdConfig.timeoutMs);
        return new KdClient(kdConfig, transport);
    };
    registerKingdeeTools(ctx, getClient);
    ctx.inject(['settings'], (settingsCtx) => {
        settingsCtx.settings.installSection(ctx, NAMESPACE, Config, config, {
            // The seam hands a thunk: the authoritative value may be the settings
            // scope or the composition entry, depending on the provider's lifetime.
            setSource: (current) => {
                live = current;
            },
            onChange: () => {
                // Credentials re-resolve on every call, so a saved edit reaches the next operation
                // without a restart. Nothing to rebuild here.
            },
        });
    });
}
/** Resolve the credential references for the current operation into plain values. */
async function resolveCredentials(ctx, config) {
    const resolve = async (ref) => {
        if (!ref)
            return undefined;
        // CredentialRef is branded; the runtime value is the reference string.
        const got = await ctx.credentials.resolve(credentialRef(ref));
        return got?.value;
    };
    return {
        appSecret: await resolve(config.appSecretRef),
        userName: await resolve(config.userNameRef),
        password: await resolve(config.passwordRef),
    };
}
//# sourceMappingURL=index.js.map