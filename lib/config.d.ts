/**
 * dsh-kingdee plugin configuration and credential resolution.
 *
 * This half imports DSH peer packages (`@deepseek-ai/*`) and is compiled inside a
 * DSH profile, where those packages resolve. The framework-free core that it
 * drives lives in `./kd-core` and is built/tested independently.
 */
import z from '@deepseek-ai/schemastery';
import type { KdAuthMode, KdConfig, KdServiceEndpoints } from './kd-core/index.ts';
/** Settings namespace (also the settings-card key on the Client side). */
export declare const NAMESPACE = "kingdee";
/** Plugin configuration as the user edits it. Secrets are references, never literals. */
export interface Config {
    /** Kingdee Cloud WebAPI base URL, e.g. `http://your-server/K3Cloud`. */
    baseUrl?: string;
    /** 账套 id (`acctId`). */
    acctId?: string;
    /** Authentication mode. */
    authMode?: KdAuthMode;
    /** Application id used by `app` mode. */
    appId?: string;
    /** Credential reference (env-var name) holding the `app` secret. */
    appSecretRef?: string;
    /** Credential reference (env-var name) holding the 账套 username for `user` mode. */
    userNameRef?: string;
    /** Credential reference (env-var name) holding the 账套 password for `user` mode. */
    passwordRef?: string;
    /** Optional default organization (org) id / FNumber applied to queries. */
    organization?: string;
    /** Optional per-request timeout multiplier. */
    timeoutMs?: number;
    /** When true, the plugin uses a local mock transport (no real Kingdee connection). */
    mock?: boolean;
    /** Optional service-endpoint overrides for this Kingdee version. */
    serviceEndpoints?: KdServiceEndpoints;
}
export declare const Config: z<Config>;
/**
 * Build a resolved {@link KdConfig} from plugin config plus the credential values
 * resolved for the current operation. Pure and testable: it never touches `ctx`.
 */
export declare function buildKdConfig(config: Config, resolved: {
    appSecret?: string;
    userName?: string;
    password?: string;
}): KdConfig;
//# sourceMappingURL=config.d.ts.map