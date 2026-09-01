/**
 * dsh-kingdee Client-side settings card (browser half).
 *
 * This half must be bundled by the DSH client module system (a `tsdown` client
 * bundle declaring `dsh.client`), which is not runnable in a standalone checkout.
 * The Host half that registers the `kingdee` settings namespace is `src/index.ts`;
 * the card below keys on the same namespace so the two are paired automatically.
 *
 * Per the DSH settings-card contract:
 *  - the card registers into the `settings.plugin.item` slot under `kingdee`;
 *  - reads/writes through `ctx.settingsScope` (revision-fenced);
 *  - must NOT value-import another plugin's card chrome (bundle-purity gate).
 *
 * This is an honest scaffold: the control render and the scope wiring below are
 * illustrative. Adapt them to your UI framework and build the half inside a DSH
 * client bundle before relying on it.
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: the keyed slot's declaration. Value imports fail the client bundle-purity gate.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'

export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope']

/** Data exposed to the card. Replace `snapshot()` with a real `settingsScope` read. */
function readSettings(scope: unknown): Record<string, unknown> {
  return { note: 'dsh-kingdee connection settings' }
}

/** A minimal card component. Replace with your UI framework's component. */
function KingdeeCard({ scope }: { scope: unknown }) {
  return { render: () => `<div data-card="kingdee">dsh-kingdee 配置：${JSON.stringify(readSettings(scope))}</div>` }
}

export function apply(ctx: ClientContext): void {
  // The keyed slot side is typed by `@deepseek-ai/dsh-client-ui-settings-plugins/client`;
  // view objects here are coerced because this scaffold does not import that package's value types.
  const slots = ctx.slots as unknown as {
    inject: (name: string, fn: () => unknown) => void
    register: (o: Record<string, unknown>, Comp: (p: { scope: unknown }) => { render: () => string }) => unknown
  }
  const settingsScope = ctx.settingsScope as unknown as { bind: (ns: { namespace: string }) => unknown }

  const scope = settingsScope.bind({ namespace: 'kingdee' })

  slots.inject('settings.plugin.item', () =>
    slots.register(
      {
        name: 'settings.plugin.item',
        key: 'kingdee',
        locale: 'settings.kingdee',
        inject: () => readSettings(scope),
      },
      (p: { scope: unknown }) => KingdeeCard({ scope: p.scope }),
    ),
  )
}
