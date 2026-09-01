/**
 * The Kingdee Cloud WebAPI client.
 *
 * Owns session management and the eight operations used by the DSH tools:
 * query, save, submit, audit, unaudit, view, delete, and invoke a custom service.
 * Every operation funnels through the transport seam; a failed envelope throws a
 * {@link KdError} so tool output stays structured.
 */

import { businessHeaders, buildLoginPayload, validateConfig } from './auth.ts'
import { assertSuccess, KdError, toKdError } from './errors.ts'
import { extractKdsvcCookie, joinUrl, parseEnvelope } from './envelope.ts'
import type { KdConfig, KdIdListParams, KdInvokeParams, KdQueryParams, KdSaveParams, KdSubmitParams } from './types.ts'
import type { KdTransport } from './transport.ts'

/** Service entrypoint prefixes exposed by the Kingdee Cloud WebAPI. */
const LOGIN_SERVICE = 'Kingdee.BOS.WebApi.ServicesStub.LoginService.ValidateUser'
const DYNAMIC_SERVICE = 'Kingdee.BOS.WebApi.ServicesStub.DynamicFormService'
const SERVICE_PREFIX = 'Kingdee.BOS.WebApi.ServicesStub'

export class KdClient {
  private readonly cfg: KdConfig
  private readonly transport: KdTransport
  private sessionCookie: string | undefined

  constructor(config: KdConfig, transport: KdTransport) {
    this.cfg = { ...config, authMode: config.authMode ?? 'user' }
    this.transport = transport
    this.sessionCookie = this.cfg.cookie
  }

  private get baseUrl(): string {
    return this.cfg.baseUrl
  }

  /** Authenticate as needed (user mode) and return the session cookie, or `undefined` for app mode. */
  async login(): Promise<string | undefined> {
    validateConfig(this.cfg)
    if ((this.cfg.authMode ?? 'user') !== 'user') return undefined

    const url = joinUrl(this.baseUrl, LOGIN_SERVICE)
    const payload = buildLoginPayload(this.cfg)
    const response = await this.transport.request({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json', ...(this.cfg.headers ?? {}) },
      body: payload,
    })

    const cookie = extractKdsvcCookie(response.headers)
    if (cookie) this.sessionCookie = cookie

    const env = parseEnvelope(response.body)
    assertSuccess(env)
    return this.sessionCookie
  }

  /** Ensure a session exists for user mode before a business call. */
  private async ensureSession(): Promise<void> {
    if ((this.cfg.authMode ?? 'user') !== 'user') return
    if (this.sessionCookie) return
    await this.login()
  }

  private async post(endpoint: string, body: unknown): Promise<unknown> {
    await this.ensureSession()
    const url = joinUrl(this.baseUrl, endpoint)
    const headers = businessHeaders(this.cfg, this.sessionCookie)
    try {
      const response = await this.transport.request({ method: 'POST', url, headers, body })
      if (response.status >= 400) {
        throw new KdError('kd/network', `Kingdee Cloud returned HTTP ${response.status}`)
      }
      const env = parseEnvelope(response.body)
      assertSuccess(env)
      return env.Data
    } catch (error) {
      throw toKdError(error)
    }
  }

  /** ExecuteBillQuery — query bills and base data. */
  async executeBillQuery(params: KdQueryParams): Promise<unknown> {
    const body: Record<string, unknown> = {
      FormId: params.formId,
      FieldKeys: params.fieldKeys.join(','),
    }
    if (params.filter !== undefined) body.FilterString = params.filter
    if (params.topCount !== undefined) body.TopCount = params.topCount
    if (params.startRowIndex !== undefined) body.StartRowIndex = params.startRowIndex
    if (params.organization !== undefined) body.Organization = params.organization
    return this.post(`${DYNAMIC_SERVICE}.ExecuteBillQuery`, body)
  }

  /** Save a form (create or update a bill / base record). */
  async save(params: KdSaveParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId, Data: params.data }
    if (params.interaction !== undefined) body.Interaction = params.interaction
    return this.post(`${DYNAMIC_SERVICE}.Save`, body)
  }

  /** Submit a form. */
  async submit(params: KdSubmitParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId, Ids: params.ids.join(',') }
    if (params.numbers !== undefined) body.Numbers = params.numbers.join(',')
    return this.post(`${DYNAMIC_SERVICE}.Submit`, body)
  }

  /** Audit a form. */
  async audit(params: KdIdListParams): Promise<unknown> {
    return this.post(`${DYNAMIC_SERVICE}.Audit`, { FormId: params.formId, Ids: params.ids.join(',') })
  }

  /** Un-audit a form. */
  async unaudit(params: KdIdListParams): Promise<unknown> {
    return this.post(`${DYNAMIC_SERVICE}.UnAudit`, { FormId: params.formId, Ids: params.ids.join(',') })
  }

  /** View a single record by id. */
  async view(formId: string, id: string): Promise<unknown> {
    return this.post(`${DYNAMIC_SERVICE}.View`, { FormId: formId, Id: id })
  }

  /** Delete records by id. */
  async delete(params: KdIdListParams): Promise<unknown> {
    return this.post(`${DYNAMIC_SERVICE}.Delete`, { FormId: params.formId, Ids: params.ids.join(',') })
  }

  /** Invoke a BOS custom service. */
  async invokeService(params: KdInvokeParams): Promise<unknown> {
    const body: Record<string, unknown> = { ...(params.payload ?? {}) }
    if (params.formId !== undefined) body.FormId = params.formId
    return this.post(`${SERVICE_PREFIX}.${params.serviceName}`, body)
  }
}
