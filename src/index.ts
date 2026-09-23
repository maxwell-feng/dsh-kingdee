/**
 * dsh-kingdee host plugin entry.
 *
 * Registers the kingdee_* tool set. Every operation captures the live config
 * and builds a fresh {@link KdClient}, so both a saved settings edit and a
 * rotated credential reach the next operation without a restart (the DSH
 * volatile-config and credential-seam hot-update contracts). Compiled inside a
 * DSH profile, where the `@deepseek-ai/*` peer packages resolve.
 *
 * Since DSH 0.1.7 there is no host-side settings registration to perform: the
 * Host reads this entry's `Config` schema, serves its `.volatile()` fields as a
 * form under the entry's own profile id, and HMR-updates the references in
 * {@link apply}'s `config` argument. The browser half edits the same entry.
 */

import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-credentials'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { buildMockTransport, HttpTransport, KdClient } from './kd-core/index.ts'
import { buildKdConfig, captureConfig } from './config.ts'
import type { CapturedConfig, Config as PluginConfig } from './config.ts'
import { registerKingdeeTools } from './tools.ts'

export const name = 'dsh-kingdee'
export const inject = ['tools', 'credentials']

/**
 * The config schema the Host discovers on this module (`entry.fiber.runtime
 * .Config`): declaring the `.volatile()` fields here is what puts the plugin on
 * the settings seam at all.
 */
export { Config } from './config.ts'

export function apply(ctx: Context, config: PluginConfig): void {
  const getClient = async (): Promise<KdClient> => {
    // One capture at the start of the operation: the credential references and
    // the connection fields below all come from the same reading.
    const current = captureConfig(config)
    const credentials = await resolveCredentials(ctx, current)
    const kdConfig = buildKdConfig(current, credentials)
    const transport = current.mock ? buildMockTransport() : new HttpTransport(kdConfig.timeoutMs)
    return new KdClient(kdConfig, transport)
  }

  registerKingdeeTools(ctx, getClient)
}

/** Resolve the credential references for the current operation into plain values. */
async function resolveCredentials(
  ctx: Context,
  config: CapturedConfig,
): Promise<{ appSecret?: string; userName?: string; password?: string }> {
  const resolve = async (ref: string | undefined): Promise<string | undefined> => {
    if (!ref) return undefined
    // CredentialRef is branded; the runtime value is the reference string.
    const got = await ctx.credentials.resolve(credentialRef(ref))
    return got?.value
  }

  return {
    appSecret: await resolve(config.appSecretRef),
    userName: await resolve(config.userNameRef),
    password: await resolve(config.passwordRef),
  }
}
