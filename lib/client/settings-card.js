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
export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope'];
/** One connection fact the card renders as a text field. */
const TEXT_FIELDS = [
    { field: 'baseUrl', label: 'Base URL' },
    { field: 'acctId', label: 'Account ID (acctId)' },
    { field: 'authMode', label: 'Auth mode (user | app)' },
    { field: 'appId', label: 'App ID (app mode)' },
    { field: 'appSecretRef', label: 'App secret reference (env name)' },
    { field: 'userNameRef', label: 'User name reference (env name)' },
    { field: 'passwordRef', label: 'Password reference (env name)' },
    { field: 'organization', label: 'Organization (FNumber)' },
    { field: 'timeoutMs', label: 'Timeout (ms)' },
];
/** Format one section value as draft text. */
function formatValue(value) {
    return value === undefined || value === null ? '' : String(value);
}
/** Escape one value for safe interpolation into the card's HTML. */
function escapeHtml(text) {
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
/**
 * Render the card body. Self-contained HTML (no shared chrome imports): the
 * bundle-purity gate forbids value imports of another plugin's card chrome.
 */
function renderCard(state) {
    if (!state.available) {
        return '<div data-card="kingdee"><p>Kingdee settings are unavailable on this connection.</p></div>';
    }
    const rows = state.fields.map(({ field, label, text }) => `
    <label data-field="${field}" style="display:block;margin:8px 0">
      <span style="display:block;font-weight:600">${escapeHtml(label)}</span>
      <input data-bind="${field}" value="${escapeHtml(text)}" ${state.writable ? '' : 'disabled'}
        style="width:100%;box-sizing:border-box" />
    </label>`).join('');
    const note = state.stagedCount > 0
        ? `<p data-note="staged">${state.stagedCount} unsaved edit(s)</p>`
        : '';
    return `<div data-card="kingdee">${rows}${note}</div>`;
}
export function apply(ctx) {
    const scope = ctx.settingsScope.bind({ namespace: 'kingdee' });
    // Staged drafts, one keyed input element per section field. Drafts live in
    // the DOM until Save; the scope's revision fence serializes the write.
    const drafts = new Map();
    const root = document.createElement('div');
    root.dataset.pluginCard = 'kingdee';
    const currentFields = () => {
        const value = scope.getSnapshot().value ?? {};
        return TEXT_FIELDS.map(({ field, label }) => ({
            field,
            label,
            text: drafts.get(field) ?? formatValue(value[field]),
        }));
    };
    const repaint = () => {
        const snapshot = scope.getSnapshot();
        root.innerHTML = renderCard({
            available: snapshot.status === 'ready',
            writable: snapshot.writable,
            fields: currentFields(),
            stagedCount: drafts.size,
        });
        for (const input of root.querySelectorAll('input[data-bind]')) {
            input.addEventListener('change', () => {
                const field = input.dataset.bind ?? '';
                if (input.value === '')
                    drafts.delete(field);
                else
                    drafts.set(field, input.value);
                repaint();
            });
        }
    };
    const save = async () => {
        for (const [field, text] of drafts) {
            await scope.set(field, text);
        }
        drafts.clear();
        repaint();
    };
    const saveBar = document.createElement('div');
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => { void save(); });
    saveBar.appendChild(saveButton);
    ctx.effect(() => scope.subscribe(repaint), 'kingdee-card: scope mirror');
    repaint();
    // Register the card's own locale dictionary under its namespace so the
    // `locale:` declared on the slot entry resolves at render time.
    ctx.effect(() => ctx.locale.register('settings.kingdee', { en: { kingdeeTitle: 'Kingdee Cloud' }, zh: { kingdeeTitle: '金蝶云' } }), 'kingdee-card: dictionaries');
    ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
        name: 'settings.plugin.item',
        key: 'kingdee',
        locale: 'settings.kingdee',
        inject: () => ({ root: [root, saveBar] }),
    }, 
    // The renderer mounts whatever this inject face hands back; the card
    // owns the two nodes it injected above.
    () => ({ root: [root, saveBar] })));
}
//# sourceMappingURL=settings-card.js.map