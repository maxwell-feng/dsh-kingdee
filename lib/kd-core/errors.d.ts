/**
 * Normalized error mapping for the Kingdee Cloud WebAPI.
 *
 * The Kingdee envelope reports failures as `IsSuccess: false` plus a
 * human-readable `Message`; this module converts that into a typed {@link KdError}
 * so DSH tool output stays structured instead of forcing the model to parse prose.
 */
/** Categorical error codes surfaced by the DSH tools. */
export type KdErrorCode = 'kd/business-error' | 'kd/auth-failed' | 'kd/not-found' | 'kd/invalid-config' | 'kd/network' | 'kd/timeout' | 'kd/unknown';
/** A typed Kingdee failure. `code` is stable and narrows `details` for branching. */
export declare class KdError extends Error {
    readonly code: KdErrorCode;
    readonly details: Record<string, unknown> | undefined;
    readonly cause: unknown;
    constructor(code: KdErrorCode, message: string, details?: Record<string, unknown>, options?: {
        cause?: unknown;
    });
}
/** Map a plain error thrown by the transport (or by a fetch wrapper) to a {@link KdError}. */
export declare function toKdError(error: unknown): KdError;
/** Classify a Kingdee envelope and throw when it reports a failed call. */
export declare function assertSuccess(env: {
    IsSuccess: boolean;
    Message: string | null;
    Result: number | null;
}): void;
//# sourceMappingURL=errors.d.ts.map