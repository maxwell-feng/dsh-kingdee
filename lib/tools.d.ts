/**
 * dsh-kingdee tool registration.
 *
 * Each tool is a thin typed wrapper over a {@link KdClient} operation. All business
 * logic lives in `./kd-core`; these wrappers only map the model-facing schema to a
 * canonical output value. Compiled inside a DSH profile (peer packages resolve there).
 *
 * Output contract: every Kingdee WebAPI response is an open JSON document, so the
 * tools declare the canonical open-value schema (`type: 'json'`) — the same shape
 * `cordis_inspect_list` uses — and render it as JSON text.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { KdClient } from './kd-core/index.ts';
/** Register the complete kingdee_* tool set. `getClient` is re-invoked per call so credentials re-resolve. */
export declare function registerKingdeeTools(ctx: Context, getClient: () => Promise<KdClient>): void;
//# sourceMappingURL=tools.d.ts.map