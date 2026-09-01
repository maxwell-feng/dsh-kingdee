/**
 * Minimal ambient declarations for the DeepSeek Harness peer packages.
 *
 * These let tsc build the host plugin to `lib/` without the deepseek-harness
 * monorepo present. Inside a real DSH profile the actual packages resolve at
 * runtime; these declarations only satisfy the compiler for the standalone build.
 *
 * The package `peerDependencies` still list the real packages, so DSH installs
 * them when the plugin is loaded there.
 */

declare module '@deepseek-ai/cordis' {
  export type Context = any
  export type Plugin = any
}

declare module '@deepseek-ai/dsh-tools' {
  export const defineTool: (...args: any[]) => any
}

declare module '@deepseek-ai/schemastery' {
  const z: any
  export default z
}
