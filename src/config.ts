/**
 * dsh-kingdee plugin configuration and credential resolution.
 *
 * This half imports DSH peer packages (`@deepseek-ai/*`) and is compiled inside a
 * DSH profile, where those packages resolve. The framework-free core that it
 * drives lives in `./kd-core` and is built/tested independently.
 */

import z from '@deepseek-ai/schemastery'
import type { KdAuthMode, KdConfig, KdServiceEndpoints } from './kd-core/index.ts'

/** Settings namespace (also the settings-card key on the Client side). */
export const NAMESPACE = 'kingdee'

/** Plugin configuration as the user edits it. Secrets are references, never literals. */
export interface Config {
  /** Kingdee Cloud WebAPI base URL, e.g. `http://your-server/K3Cloud`. */
  baseUrl?: string
  /** 账套 id (`acctId`). */
  acctId?: string
  /** Authentication mode. */
  authMode?: KdAuthMode
  /** Application id used by `app` mode. */
  appId?: string
  /** Credential reference (env-var name) holding the `app` secret. */
  appSecretRef?: string
  /**
   * Credential reference (env-var name) holding the 账套 username for `user` mode,
   * or the 集成用户 for `app` mode.
   */
  userNameRef?: string
  /** Credential reference (env-var name) holding the 账套 password for `user` mode. */
  passwordRef?: string
  /** Optional locale id sent to the login service. Kingdee's default is `2052` (zh-CN). */
  lcid?: number
  /** Optional default organization (org) id / FNumber applied to queries. */
  organization?: string
  /** Optional per-request timeout multiplier. */
  timeoutMs?: number
  /** When true, the plugin uses a local mock transport (no real Kingdee connection). */
  mock?: boolean
  /** Optional service-endpoint overrides for this Kingdee version. */
  serviceEndpoints?: KdServiceEndpoints
}

export const Config: z<Config> = z.object({
  baseUrl: z.string(),
  acctId: z.string(),
  authMode: z.union(['user', 'app'] as const).default('user'),
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
})

/**
 * Build a resolved {@link KdConfig} from plugin config plus the credential values
 * resolved for the current operation. Pure and testable: it never touches `ctx`.
 */
export function buildKdConfig(
  config: Config,
  resolved: { appSecret?: string; userName?: string; password?: string },
): KdConfig {
  const mode: KdAuthMode = config.authMode ?? 'user'
  const base = {
    baseUrl: config.baseUrl ?? '',
    acctId: config.acctId ?? '',
    authMode: mode,
    lcid: config.lcid ?? 2052,
    organization: config.organization,
    timeoutMs: config.timeoutMs ?? 30_000,
    endpoints: config.serviceEndpoints,
  }

  if (mode === 'user') {
    return {
      ...base,
      userName: resolved.userName,
      password: resolved.password,
    }
  }

  // `app` mode names the 集成用户 it acts as, alongside the application credentials.
  return {
    ...base,
    userName: resolved.userName,
    appId: config.appId,
    appSecret: resolved.appSecret,
  }
}
