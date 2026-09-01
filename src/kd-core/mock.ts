/**
 * Offline mock transport for dsh-kingdee.
 *
 * Returns canned Kingdee envelopes per operation so the full tool pipeline can be
 * exercised without a reachable Kingdee Cloud tenant. Use it in tests and in a
 * `mock: true` DSH configuration to demo the workflow.
 */

import type { KdEnvelope, KdHttpResponse, KdRequest } from './types.ts'
import type { KdTransport } from './transport.ts'

/** Per-operation canned-envelope overrides and failure simulation. */
export interface MockOptions {
  /** Override the envelope returned for a given service operation (matched by the endpoint suffix). */
  overrides?: Record<string, KdEnvelope>
  /** Form ids whose Save/Submit/Audit calls should fail, to exercise error mapping. */
  failingFormIds?: string[]
  /** Emit a `Set-Cookie: kdsvc=...` on the login response (makes user-mode session capture testable). */
  sessionCookie?: string
}

/** Build a kingdee mock transport that never touches the network. */
export function buildMockTransport(options: MockOptions = {}): KdTransport {
  const sessionCookie = options.sessionCookie ?? 'mocksession'

  return {
    async request(request: KdRequest): Promise<KdHttpResponse> {
      const operation = operationOf(request.url)

      if (operation === 'LoginService.ValidateUser') {
        return {
          status: 200,
          body: { Result: 0, IsSuccess: true, Message: '', Data: '' },
          headers: { 'set-cookie': `kdsvc=${sessionCookie}` },
        }
      }

      const formId = extractFormId(request.body)
      if (options.failingFormIds?.includes(formId ?? '')) {
        return {
          status: 200,
          body: { Result: 1, IsSuccess: false, Message: `mock failure for ${formId}`, Data: null },
        }
      }

      if (options.overrides?.[operation]) {
        return { status: 200, body: options.overrides[operation] }
      }

      return { status: 200, body: envelopeFor(operation, formId) }
    },
  }
}

function operationOf(url: string): string {
  const service = /Kingdee\.BOS\.WebApi\.ServicesStub\.([^/?]+)/.exec(url)
  return service ? service[1] : 'UnknownService'
}

function extractFormId(body: unknown): string | undefined {
  if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>
    const form = obj.FormId
    return typeof form === 'string' ? form : undefined
  }
  return undefined
}

function envelopeFor(operation: string, formId?: string): KdEnvelope {
  if (operation === 'DynamicFormService.ExecuteBillQuery') {
    return {
      Result: 0,
      IsSuccess: true,
      Message: '',
      Data: [
        { FID: '1', FBillNo: 'SO-MOCK-1', FDocumentStatus: 'Z' },
        { FID: '2', FBillNo: 'SO-MOCK-2', FDocumentStatus: 'Z' },
      ],
    }
  }
  if (operation === 'DynamicFormService.Save') {
    return { Result: 0, IsSuccess: true, Message: '', Data: { Id: 'mock-1', Number: `SO-MOCK-${formId ?? ''}`, FormId: formId ?? '' } }
  }
  if (operation === 'DynamicFormService.Submit') {
    return { Result: 0, IsSuccess: true, Message: '', Data: { submitted: true } }
  }
  if (operation === 'DynamicFormService.Audit') {
    return { Result: 0, IsSuccess: true, Message: '', Data: { audited: true } }
  }
  if (operation === 'DynamicFormService.UnAudit') {
    return { Result: 0, IsSuccess: true, Message: '', Data: { unaudited: true } }
  }
  if (operation === 'DynamicFormService.View') {
    return { Result: 0, IsSuccess: true, Message: '', Data: { Id: 'mock-1', FBillNo: 'SO-MOCK-1' } }
  }
  if (operation === 'DynamicFormService.Delete') {
    return { Result: 0, IsSuccess: true, Message: '', Data: { deleted: true } }
  }
  // Generic custom-service response.
  return { Result: 0, IsSuccess: true, Message: '', Data: { ok: true, service: operation, result: 'OK' } }
}
