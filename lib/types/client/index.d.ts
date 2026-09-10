/**
 * Public type entry for the `./client` export.
 *
 * Manifest (`package.json` `./client` types) points at
 * `lib/types/client/index.d.ts`; with `tsconfig.build.json`
 * (`outDir: lib`, `rootDir: src`) this file emits exactly there.
 * The runtime for `./client` is the tsdown browser bundle at
 * `lib/client.js` — this module is never imported by the host at
 * runtime (it only re-exports the card so its types resolve).
 */
export * from '../../client/settings-card.ts';
//# sourceMappingURL=index.d.ts.map