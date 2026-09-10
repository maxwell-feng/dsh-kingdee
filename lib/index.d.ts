/**
 * dsh-kingdee host plugin entry.
 *
 * Registers the kingdee_* tool set and the `kingdee` settings namespace. Every
 * operation builds a fresh {@link KdClient} so credentials are re-resolved per call
 * (the DSH credential seam's hot-update contract). Compiled inside a DSH profile,
 * where the `@deepseek-ai/*` peer packages resolve.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { Config as PluginConfig } from './config.ts';
export declare const name = "dsh-kingdee";
export declare const inject: string[];
export declare function apply(ctx: Context, config: PluginConfig): void;
//# sourceMappingURL=index.d.ts.map