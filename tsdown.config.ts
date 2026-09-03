/**
 * Client bundle build for dsh-kingdee's browser half (`src/client/`).
 *
 * The harness's `clientBundle` preset lives inside the deepseek-harness
 * repository and is not published, so this standalone package reproduces the
 * same artifact contract itself:
 *  - output `lib/client.js`, a lazy-CJS factory:
 *      `window.__ModuleLoader__.load({ id, factory: (require) => { ... } })`;
 *  - `platform: 'browser'`, CJS, single `client.js` entry + source map;
 *  - every `dsh.client.inject` specifier stays an import (resolved at runtime
 *    through the injected module table), everything else inlines.
 */
import { defineConfig } from 'tsdown'

const ID = 'dsh-kingdee'

/** Module-table requests this package declares in `dsh.client.inject`. */
const REQUESTED = [
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-locale',
  '@deepseek-ai/dsh-client-ui-settings',
]

export default defineConfig({
  entry: { client: 'src/client/settings-card.ts' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  deps: {
    neverBundle: (specifier: string) => REQUESTED.includes(specifier),
    alwaysBundle: (specifier: string) => !REQUESTED.includes(specifier) && !specifier.startsWith('node:'),
  },
  inputOptions: {
    resolve: {
      conditionNames: ['production', 'browser', 'import', 'module', 'default'],
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
  },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(ID)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
})
