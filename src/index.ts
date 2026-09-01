/**
 * dsh-kingdee host plugin entry.
 *
 * Registers the kingdee_* tool set and the `kingdee` settings namespace. Every
 * operation builds a fresh {@link KdClient} so credentials are re-resolved per call
 * (the DSH credential seam's hot-update contract). Compiled inside a DSH profile,
 * where the `@deepseek-ai/*` peer packages resolve.
 */

import type { Context } from '@deepseek-ai/cordis'
import { buildMockTransport, HttpTransport, KdClient } from './kd-core/index.ts'
import { buildKdConfig, Config, NAMESPACE } from './config.ts'
import type { Config as PluginConfig } from './config.ts'
import { registerKingdeeTools } from './tools.ts'

export const name = 'dsh-kingdee'
export const inject = ['tools', 'credentials', 'settings']

export function apply(ctx: Context, config: PluginConfig): void {
  let live = config

  const getClient = async (): Promise<KdClient> => {
    const credentials = await resolveCredentials(ctx, live)
    const kdConfig = buildKdConfig(live, credentials)
    const transport = live.mock ? buildMockTransport() : new HttpTransport(kdConfig.timeoutMs)
    return new KdClient(kdConfig, transport)
  }

  registerKingdeeTools(ctx, getClient)

  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.installSection(ctx, NAMESPACE, Config, config, {
      setSource: (current) => {
        live = current
      },
      onChange: () => {
        // Credentials re-resolve on every call, so a saved edit reaches the next operation
        // without a restart. Nothing to rebuild here.
      },
    })
  })
}

/** Resolve the credential references for the current operation into plain values. */
async function resolveCredentials(
  ctx: Context,
  config: PluginConfig,
): Promise<{ appSecret?: string; userName?: string; password?: string }> {
  const resolve = async (ref: string | undefined): Promise<string | undefined> => {
    if (!ref) return undefined
    // CredentialRef is branded; the runtime value is the reference string.
    const got = await ctx.credentials.resolve(ref as never)
    return got?.value
  }

  return {
    appSecret: await resolve(config.appSecretRef),
    userName: await resolve(config.userNameRef),
    password: await resolve(config.passwordRef),
  }
}
