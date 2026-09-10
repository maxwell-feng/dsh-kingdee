/**
 * Normalized error mapping for the Kingdee Cloud WebAPI.
 *
 * The Kingdee envelope reports failures as `IsSuccess: false` plus a
 * human-readable `Message`; this module converts that into a typed {@link KdError}
 * so DSH tool output stays structured instead of forcing the model to parse prose.
 */
/** A typed Kingdee failure. `code` is stable and narrows `details` for branching. */
export class KdError extends Error {
    code;
    details;
    cause;
    constructor(code, message, details, options) {
        super(message);
        this.name = 'KdError';
        this.code = code;
        this.details = details;
        this.cause = options?.cause;
    }
}
/** Map a plain error thrown by the transport (or by a fetch wrapper) to a {@link KdError}. */
export function toKdError(error) {
    if (error instanceof KdError)
        return error;
    const message = error instanceof Error ? error.message : String(error);
    if (/timeout|abort|ETIMEDOUT/i.test(message)) {
        return new KdError('kd/timeout', message, {}, { cause: error });
    }
    if (/network|fetch|ECONNREFUSED|ENOTFOUND|socket/i.test(message)) {
        return new KdError('kd/network', message, {}, { cause: error });
    }
    return new KdError('kd/unknown', message, {}, { cause: error });
}
/** Classify a Kingdee envelope and throw when it reports a failed call. */
export function assertSuccess(env) {
    if (env.IsSuccess)
        return;
    const code = env.Result === null
        ? 'kd/business-error'
        : /auth|登录|login|credential|permission/i.test(env.Message ?? '')
            ? 'kd/auth-failed'
            : 'kd/business-error';
    throw new KdError(code, env.Message ?? 'Kingdee Cloud returned an error', {
        result: env.Result,
        message: env.Message,
    });
}
//# sourceMappingURL=errors.js.map