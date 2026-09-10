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
import type { Context as ClientContext } from '@deepseek-ai/cordis';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The Kingdee card's own copy. */
        'settings.kingdee': string;
    }
}
export declare const inject: string[];
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=settings-card.d.ts.map