/**
 * dsh-kingdee plugin configuration and credential resolution.
 *
 * This half imports DSH peer packages (`@deepseek-ai/*`) and is compiled inside a
 * DSH profile, where those packages resolve. The framework-free core that it
 * drives lives in `./kd-core` and is built/tested independently.
 *
 * Since DSH 0.1.7 every editable field is declared `Volatile`: the schema marks
 * it with `.volatile()`, `apply` receives a live reference per field, and an
 * operation reads `.get()` once at its start (see {@link captureConfig}).
 */

import type { Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type { KdAuthMode, KdConfig, KdServiceEndpoints } from './kd-core/index.ts'

/**
 * Under the 0.1.7 model the settings namespace is not plugin-chosen: the Host
 * derives it from the profile entry id (`SettingsService.describe` keys each form
 * by `entry.options.id`), which for this plugin is the `kingdee` row id in
 * `cordis.patch.yml` — the row id, NOT the package name (`dsh-kingdee`). A
 * profile that renames the row renames the namespace with it, which is why the
 * browser half (`src/client/settings-card.ts`) addresses the same row id.
 */

/**
 * Plugin configuration as the user edits it. Each field is a live reference;
 * {@link captureConfig} unwraps one consistent reading per operation. Secrets
 * are references, never literals.
 */
export interface Config {
  /** Kingdee Cloud WebAPI base URL, e.g. `http://your-server/K3Cloud`. */
  baseUrl: Volatile<string | undefined>
  /** Account-set id (`acctId`). */
  acctId: Volatile<string | undefined>
  /** Authentication mode. */
  authMode: Volatile<KdAuthMode | undefined>
  /** Application id used by `app` mode. */
  appId: Volatile<string | undefined>
  /** Credential reference (env-var name) holding the `app` secret. */
  appSecretRef: Volatile<string | undefined>
  /**
   * Credential reference (env-var name) holding the account-set username for `user` mode,
   * or the integration user for `app` mode.
   */
  userNameRef: Volatile<string | undefined>
  /** Credential reference (env-var name) holding the account-set password for `user` mode. */
  passwordRef: Volatile<string | undefined>
  /** Optional locale id sent to the login service. Kingdee's default is `2052` (zh-CN). */
  lcid: Volatile<number | undefined>
  /** Optional default organization (org) id / FNumber applied to queries. */
  organization: Volatile<string | undefined>
  /** Optional per-request timeout multiplier. */
  timeoutMs: Volatile<number | undefined>
  /** When true, the plugin uses a local mock transport (no real Kingdee connection). */
  mock: Volatile<boolean | undefined>
  /** Optional service-endpoint overrides for this Kingdee version. */
  serviceEndpoints: Volatile<KdServiceEndpoints | undefined>
}

/**
 * The schema the Host loads to build this entry's settings form. Every editable
 * field must be `.volatile()`: the Host refuses a write to a field that is not,
 * and only a volatile field becomes a `Volatile` reference in {@link Config}.
 */
export const Config = z.object({
  baseUrl: z.string().volatile(),
  acctId: z.string().volatile(),
  authMode: z.union(['user', 'app'] as const).default('user').volatile(),
  appId: z.string().volatile(),
  appSecretRef: z.string().default('DSH_KINGDEE_APP_SECRET').volatile(),
  userNameRef: z.string().default('DSH_KINGDEE_USER').volatile(),
  passwordRef: z.string().default('DSH_KINGDEE_PASSWORD').volatile(),
  lcid: z.number().step(1).min(0).default(2052).volatile(),
  organization: z.string().volatile(),
  timeoutMs: z.number().step(1).min(0).max(300_000).default(30_000).volatile(),
  mock: z.boolean().default(false).volatile(),
  serviceEndpoints: z.object({
    loginService: z.string(),
    loginByAppSecretService: z.string(),
    logOutService: z.string(),
    dynamicFormService: z.string(),
    listDataCenterService: z.string(),
    stubSuffix: z.string(),
  }).volatile(),
})

/**
 * One plugin {@link Config} with every live reference unwrapped to the value it
 * held at capture time — the shape the pure builders below consume.
 */
export type CapturedConfig = { [K in keyof Config]: ReturnType<Config[K]['get']> }

/**
 * Capture the authoritative value of every field once, at the start of one
 * operation.
 *
 * A reference stays live for the plugin's whole lifetime, so reading fields
 * one at a time as they are needed would let an edit landing mid-operation mix
 * two sections — a base URL read before the save and a credential reference
 * read after it. One capture gives the operation a single consistent reading,
 * and a saved edit reaches the next operation with no restart.
 *
 * @param config - the live plugin config as `apply` received it.
 * @returns the plain values for one operation.
 */
export function captureConfig(config: Config): CapturedConfig {
  return {
    baseUrl: config.baseUrl.get(),
    acctId: config.acctId.get(),
    authMode: config.authMode.get(),
    appId: config.appId.get(),
    appSecretRef: config.appSecretRef.get(),
    userNameRef: config.userNameRef.get(),
    passwordRef: config.passwordRef.get(),
    lcid: config.lcid.get(),
    organization: config.organization.get(),
    timeoutMs: config.timeoutMs.get(),
    mock: config.mock.get(),
    serviceEndpoints: config.serviceEndpoints.get(),
  }
}

/**
 * Build a resolved {@link KdConfig} from plugin config plus the credential values
 * resolved for the current operation. Pure and testable: it never touches `ctx`
 * and never reads a `Volatile` reference — pass an already-captured config.
 */
export function buildKdConfig(
  config: CapturedConfig,
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

  // `app` mode names the integration user it acts as, alongside the application credentials.
  return {
    ...base,
    userName: resolved.userName,
    appId: config.appId,
    appSecret: resolved.appSecret,
  }
}
