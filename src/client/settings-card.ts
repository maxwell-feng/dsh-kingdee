/**
 * dsh-kingdee Client-side settings card (browser half).
 *
 * Built by `tsdown.config.ts` into `lib/client.js` — the lazy-CJS factory the
 * client module system loads (`dsh.client` manifest in package.json). The Host
 * half that registers the `kingdee` settings namespace is `src/index.ts`; this
 * card keys on the same namespace so the settings page pairs the two halves.
 *
 * Per the DSH settings-card contract (docs/cookbook/adding-a-settings-card):
 *  - the card registers into the `settings.plugin.item` slot under `kingdee`;
 *  - reads/writes through `ctx.settingsScope` (revision-fenced writes);
 *  - the secret references (appSecretRef / userNameRef / passwordRef) are
 *    plain section fields holding reference NAMES, not secrets, so they ride
 *    the section like every other connection fact;
 *  - bundle-purity gate: no cross-plugin VALUE imports — the card renders its
 *    own chrome (type-only imports are erased before the gate runs).
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the ctx.settingsScope merge (SettingsScopeBinder) into this program.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the ctx.remote merge (credentials domain) into this program.
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the ctx.slots merge (SlotRegistry) into this program.
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
// Type-only: pulls the ctx.locale merge (LocaleService) into this program.
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: the settings slot types (`settings.plugin.item` slot declaration).
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type { SettingsScope } from '@deepseek-ai/dsh-client-ui-settings/client'

// This card owns the `settings.kingdee` locale namespace: its key type joins
// the map here so `ctx.slots.register({ locale: 'settings.kingdee' })` and the
// `t` seat type-check without touching the section package's dictionary.
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The Kingdee card's own copy. */
    'settings.kingdee': string
  }
}

export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope']

/** The section fields this card edits (all non-secret connection facts). */
interface KingdeeSettings {
  baseUrl?: string
  acctId?: string
  authMode?: 'user' | 'app'
  appId?: string
  appSecretRef?: string
  userNameRef?: string
  passwordRef?: string
  organization?: string
  timeoutMs?: number
  mock?: boolean
}

/** One connection fact the card renders as a text field. */
const TEXT_FIELDS: ReadonlyArray<{ field: keyof KingdeeSettings & string; label: string }> = [
  { field: 'baseUrl', label: 'Base URL' },
  { field: 'acctId', label: 'Account ID (acctId)' },
  { field: 'authMode', label: 'Auth mode (user | app)' },
  { field: 'appId', label: 'App ID (app mode)' },
  { field: 'appSecretRef', label: 'App secret reference (env name)' },
  { field: 'userNameRef', label: 'User name reference (env name)' },
  { field: 'passwordRef', label: 'Password reference (env name)' },
  { field: 'organization', label: 'Organization (FNumber)' },
  { field: 'timeoutMs', label: 'Timeout (ms)' },
]

/** Format one section value as draft text. */
function formatValue(value: unknown): string {
  return value === undefined || value === null ? '' : String(value)
}

/** Escape one value for safe interpolation into the card's HTML. */
function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/**
 * Render the card body. Self-contained HTML (no shared chrome imports): the
 * bundle-purity gate forbids value imports of another plugin's card chrome.
 */
function renderCard(state: {
  available: boolean
  writable: boolean
  fields: Array<{ field: string; label: string; text: string }>
  stagedCount: number
}): string {
  if (!state.available) {
    return '<div data-card="kingdee"><p>Kingdee settings are unavailable on this connection.</p></div>'
  }
  const rows = state.fields.map(({ field, label, text }) => `
    <label data-field="${field}" style="display:block;margin:8px 0">
      <span style="display:block;font-weight:600">${escapeHtml(label)}</span>
      <input data-bind="${field}" value="${escapeHtml(text)}" ${state.writable ? '' : 'disabled'}
        style="width:100%;box-sizing:border-box" />
    </label>`).join('')
  const note = state.stagedCount > 0
    ? `<p data-note="staged">${state.stagedCount} unsaved edit(s)</p>`
    : ''
  return `<div data-card="kingdee">${rows}${note}</div>`
}

export function apply(ctx: ClientContext): void {
  const scope: SettingsScope<KingdeeSettings> =
    ctx.settingsScope.bind({ namespace: 'kingdee' })

  // Staged drafts, one keyed input element per section field. Drafts live in
  // the DOM until Save; the scope's revision fence serializes the write.
  const drafts = new Map<string, string>()
  const root = document.createElement('div')
  root.dataset.pluginCard = 'kingdee'

  const currentFields = (): Array<{ field: string; label: string; text: string }> => {
    const value = scope.getSnapshot().value ?? {}
    return TEXT_FIELDS.map(({ field, label }) => ({
      field,
      label,
      text: drafts.get(field) ?? formatValue(value[field]),
    }))
  }

  const repaint = (): void => {
    const snapshot = scope.getSnapshot()
    root.innerHTML = renderCard({
      available: snapshot.status === 'ready',
      writable: snapshot.writable,
      fields: currentFields(),
      stagedCount: drafts.size,
    })
    for (const input of root.querySelectorAll<HTMLInputElement>('input[data-bind]')) {
      input.addEventListener('change', () => {
        const field = input.dataset.bind ?? ''
        if (input.value === '') drafts.delete(field)
        else drafts.set(field, input.value)
        repaint()
      })
    }
  }

  const save = async (): Promise<void> => {
    for (const [field, text] of drafts) {
      await scope.set(field, text)
    }
    drafts.clear()
    repaint()
  }

  const saveBar = document.createElement('div')
  const saveButton = document.createElement('button')
  saveButton.type = 'button'
  saveButton.textContent = 'Save'
  saveButton.addEventListener('click', () => { void save() })
  saveBar.appendChild(saveButton)

  ctx.effect(() => scope.subscribe(repaint), 'kingdee-card: scope mirror')
  repaint()

  // Register the card's own locale dictionary under its namespace so the
  // `locale:` declared on the slot entry resolves at render time.
  ctx.effect(
    () => ctx.locale.register('settings.kingdee', { en: { kingdeeTitle: 'Kingdee Cloud' }, zh: { kingdeeTitle: '金蝶云' } }),
    'kingdee-card: dictionaries',
  )

  ctx.slots.inject('settings.plugin.item', () =>
    ctx.slots.register(
      {
        name: 'settings.plugin.item',
        key: 'kingdee',
        locale: 'settings.kingdee',
        inject: () => ({ root: [root, saveBar] }),
      },
      // The renderer mounts whatever this inject face hands back; the card
      // owns the two nodes it injected above.
      () => ({ root: [root, saveBar] }),
    ),
  )
}
