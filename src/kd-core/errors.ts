/**
 * Normalized error mapping for the Kingdee Cloud WebAPI.
 *
 * The Kingdee envelope reports failures as `IsSuccess: false` plus a
 * human-readable `Message`; this module converts that into a typed {@link KdError}
 * so DSH tool output stays structured instead of forcing the model to parse prose.
 */

/** Categorical error codes surfaced by the DSH tools. */
export type KdErrorCode =
  | 'kd/business-error'
  | 'kd/auth-failed'
  | 'kd/not-found'
  | 'kd/invalid-config'
  | 'kd/network'
  | 'kd/timeout'
  | 'kd/unknown'

/** A typed Kingdee failure. `code` is stable and narrows `details` for branching. */
export class KdError extends Error {
  readonly code: KdErrorCode
  readonly details: Record<string, unknown> | undefined
  override readonly cause: unknown

  constructor(code: KdErrorCode, message: string, details?: Record<string, unknown>, options?: { cause?: unknown }) {
    super(message)
    this.name = 'KdError'
    this.code = code
    this.details = details
    this.cause = options?.cause
  }
}

/** Map a plain error thrown by the transport (or by a fetch wrapper) to a {@link KdError}. */
export function toKdError(error: unknown): KdError {
  if (error instanceof KdError) return error

  const message = error instanceof Error ? error.message : String(error)
  if (/timeout|abort|ETIMEDOUT/i.test(message)) {
    return new KdError('kd/timeout', message, {}, { cause: error })
  }
  if (/network|fetch|ECONNREFUSED|ENOTFOUND|socket/i.test(message)) {
    return new KdError('kd/network', message, {}, { cause: error })
  }
  return new KdError('kd/unknown', message, {}, { cause: error })
}

/** Classify a Kingdee envelope and throw when it reports a failed call. */
export function assertSuccess(env: { IsSuccess: boolean; Message: string | null; Result: number | null }): void {
  if (env.IsSuccess) return

  const code: KdErrorCode =
    env.Result === null
      ? 'kd/business-error'
      : /auth|登录|login|credential|permission/i.test(env.Message ?? '')
        ? 'kd/auth-failed'
        : 'kd/business-error'

  throw new KdError(code, env.Message ?? 'Kingdee Cloud returned an error', {
    result: env.Result,
    message: env.Message,
  })
}
