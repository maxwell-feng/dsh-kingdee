/**
 * dsh-kingdee Client-side settings card (browser half).
 *
 * Built by `tsdown.config.ts` into `lib/client.js` — the lazy-CJS factory the
 * client module system loads (`dsh.client` manifest in package.json). The Host
 * half that declares the `Config` schema is `src/index.ts`; this card edits the
 * same Host entry, so the two halves meet on one settings namespace.
 *
 * Per the DSH settings-card contract (docs/cookbook/adding-a-settings-card):
 *  - since 0.1.7 a form is reached through `ctx.configForms.get(entryId)`, where
 *    `entryId` is the Host profile entry id — the same key `SettingsService`
 *    derives each namespace from (`describe()` keys forms by `entry.options.id`);
 *  - reads/writes go through `ConfigForm` (revision-fenced, ordered writes; a
 *    Host-refused write reloads Host state rather than guessing);
 *  - the secret references (appSecretRef / userNameRef / passwordRef) are
 *    plain section fields holding reference NAMES, not secrets, so they ride
 *    the section like every other connection fact;
 *  - bundle-purity gate: no cross-plugin VALUE imports — the card renders its
 *    own chrome (type-only imports are erased before the gate runs).
 */

import React, { type ReactNode } from 'react'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the ctx.configForms merge (ConfigForms) into this program.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the ctx.remote merge (credentials domain) into this program.
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the ctx.slots merge (SlotRegistry) into this program.
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
// Type-only: pulls the ctx.locale merge (LocaleService) into this program.
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: the Plugins page slot types (`plugins.row.config`, `plugins.bundle.config`).
import type { PluginConfigViewProps } from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'

// This card owns the `settings.kingdee` locale namespace: its key type joins
// the map here so `ctx.locale.bind('settings.kingdee')` and the
// `locale:` declared on each slot entry type-check without touching the
// section package's dictionary.
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The Kingdee card's own copy. */
    'settings.kingdee': 'kingdeeTitle' | 'kingdeeDescription'
  }
}

/**
 * Host profile entry id this card edits, and therefore the settings namespace
 * `ctx.configForms.get()` addresses.
 *
 * Under the 0.1.7 model the namespace is not plugin-chosen: the Host serves a
 * form per profile entry, keyed by the entry id. This plugin's row is declared
 * in `cordis.patch.yml` as
 *
 *     - insert:
 *         - id: kingdee
 *           name: dsh-kingdee
 *
 * so the entry id is the ROW id `kingdee`, not the package name `dsh-kingdee`.
 * The same rule holds for every bundled DSH plugin — a bundle's row id is its
 * namespace (`- id: web-search-deepseek` →
 * `WEB_SEARCH_DEEPSEEK_SETTINGS_NAMESPACE`, `- id: bash-sandbox` → `BASH_NS`) —
 * and it is why the 0.1.6 `NAMESPACE = 'kingdee'` still names this section.
 * A profile that renames the row renames the namespace with it, which is why
 * `src/config.ts` documents both places together.
 */
const ENTRY_ID = 'kingdee'

/** Dictionary namespace owned by this card. */
const LOCALE_NS = 'settings.kingdee'

export const inject = ['slots', 'locale', 'connection', 'remote', 'configForms']

/** The section fields this card edits (all non-secret connection facts). */
interface KingdeeSettings {
  baseUrl?: string
  acctId?: string
  authMode?: 'user' | 'app'
  appId?: string
  appSecretRef?: string
  userNameRef?: string
  passwordRef?: string
  lcid?: number
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
  { field: 'userNameRef', label: 'User name / integration user reference (env name)' },
  { field: 'passwordRef', label: 'Password reference (env name)' },
  { field: 'lcid', label: 'Locale id (lcid)' },
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
  const t = ctx.locale.bind(LOCALE_NS)
  // The form is the provider's shared per-entry instance — `ConfigForms` owns
  // its lifetime and disposes it with the settings service, so this card only
  // subscribes to it and never disposes it. `props.form`, which the Plugins
  // page hands a configuration entry, is the same entry's form; this card
  // keeps its own handle because it draws its own chrome and save control.
  const form: ConfigForm<KingdeeSettings> = ctx.configForms.get<KingdeeSettings>(ENTRY_ID)

  // Staged drafts, one keyed input element per section field. Drafts live in
  // the DOM until Save; the form's revision fence serializes the write.
  const drafts = new Map<string, string>()
  const root = document.createElement('div')
  root.dataset.pluginCard = 'kingdee'

  const currentFields = (): Array<{ field: string; label: string; text: string }> => {
    const value = form.getSnapshot().value ?? {}
    return TEXT_FIELDS.map(({ field, label }) => ({
      field,
      label,
      text: drafts.get(field) ?? formatValue(value[field]),
    }))
  }

  const repaint = (): void => {
    const snapshot = form.getSnapshot()
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
    // `set` resolves false for a Host refusal, after reloading Host state into
    // the snapshot; dropping the draft either way lets the repaint below show
    // what the Host actually holds, never what the page hoped for.
    for (const [field, text] of drafts) {
      await form.set(field, text)
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

  ctx.effect(() => form.subscribe(repaint), 'kingdee-card: config form mirror')
  repaint()

  // Register the card's own locale dictionary under its namespace so the
  // `locale:` declared on the slot entry resolves at render time.
  ctx.effect(
    () =>
      ctx.locale.register(LOCALE_NS, {
        en: {
          kingdeeTitle: 'Kingdee Cloud Starry Sky',
          kingdeeDescription: 'Kingdee Cloud Starry Sky WebAPI connection and credential references',
        },
        zh: {
          kingdeeTitle: '金蝶云·星空',
          kingdeeDescription: '金蝶云·星空 WebAPI 连接参数与凭据引用配置',
        },
      }),
    'kingdee-card: dictionaries',
  )

  const cardComponent = (props: PluginConfigViewProps): ReactNode => {
    if (props.view === 'summary') return t('kingdeeDescription')
    return React.createElement('div', {
      ref: (el: HTMLDivElement | null) => {
        if (el && !el.contains(root)) {
          el.replaceChildren(root, saveBar)
        }
      },
    })
  }

  // Bundle patch row configuration: opens when clicking Configure on the row in the bundle's page.
  ctx.slots.inject('plugins.row.config', () =>
    ctx.slots.register(
      {
        name: 'plugins.row.config',
        key: 'dsh-kingdee#kingdee',
        locale: LOCALE_NS,
      },
      cardComponent,
    ),
  )

  // Bundle-level configuration: rendered directly on the bundle's page.
  ctx.slots.inject('plugins.bundle.config', () =>
    ctx.slots.register(
      {
        name: 'plugins.bundle.config',
        key: 'dsh-kingdee',
        locale: LOCALE_NS,
      },
      cardComponent,
    ),
  )
}
