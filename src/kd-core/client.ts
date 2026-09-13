/**
 * The Kingdee Cloud WebAPI client.
 *
 * Owns session management and the operations used by the DSH tools: login/logout,
 * query (legacy + structured), save (single + batch), submit, audit, un-audit,
 * un-submit, delete, delete-draft, view, data-center listing, and custom-service
 * invocation. Every operation funnels through the transport seam; a failed
 * envelope throws a {@link KdError} so tool output stays structured.
 *
 * Service endpoint names vary slightly across Kingdee versions, so they are
 * overridable through `KdConfig.endpoints`; the defaults cover the standard
 * K3Cloud surface.
 */

import { businessHeaders, buildLoginPayload, validateConfig } from './auth.ts'
import { assertSuccess, KdError, toKdError } from './errors.ts'
import { extractKdsvcCookie, joinUrl, parseEnvelope } from './envelope.ts'
import type { KdBatchSaveParams, KdConfig, KdIdListParams, KdInvokeParams, KdQueryParams, KdSaveParams, KdSubmitParams } from './types.ts'
import type { KdTransport } from './transport.ts'

/** Default K3Cloud WebAPI endpoints. Override individual fields via `KdConfig.endpoints`. */
const DEFAULT_ENDPOINTS = {
  loginService: 'Kingdee.BOS.WebApi.ServicesStub.LoginService.ValidateUser',
  logOutService: 'Kingdee.BOS.WebApi.ServicesStub.LoginService.LogOut',
  dynamicFormService: 'Kingdee.BOS.WebApi.ServicesStub.DynamicFormService',
  listDataCenterService: 'Kingdee.BOS.WebApi.ServicesStub.DataCenterService.List',
  servicePrefix: 'Kingdee.BOS.WebApi.ServicesStub',
}

type ResolvedEndpoints = typeof DEFAULT_ENDPOINTS

export class KdClient {
  private readonly cfg: KdConfig
  private readonly transport: KdTransport
  private readonly ep: ResolvedEndpoints
  private sessionCookie: string | undefined

  constructor(config: KdConfig, transport: KdTransport) {
    this.cfg = { ...config, authMode: config.authMode ?? 'user' }
    this.transport = transport
    this.sessionCookie = this.cfg.cookie
    this.ep = { ...DEFAULT_ENDPOINTS, ...(config.endpoints ?? {}) }
  }

  private get baseUrl(): string {
    return this.cfg.baseUrl
  }

  /** Authenticate as needed (user mode) and return the session cookie, or `undefined` for app mode. */
  async login(): Promise<string | undefined> {
    validateConfig(this.cfg)
    if ((this.cfg.authMode ?? 'user') !== 'user') return undefined

    const url = joinUrl(this.baseUrl, this.ep.loginService)
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

  /** Log out of the current session and clear the stored session cookie. */
  async logout(): Promise<unknown> {
    await this.ensureSession()
    const url = joinUrl(this.baseUrl, this.ep.logOutService)
    const headers = businessHeaders(this.cfg, this.sessionCookie)
    const body: Record<string, unknown> = { acctID: this.cfg.acctId }
    if (this.cfg.userName) body.userName = this.cfg.userName
    if (this.cfg.password) body.password = this.cfg.password

    try {
      const response = await this.transport.request({ method: 'POST', url, headers, body })
      if (response.status >= 400) throw new KdError('kd/network', `Kingdee Cloud returned HTTP ${response.status}`)
      const env = parseEnvelope(response.body)
      assertSuccess(env)
      this.sessionCookie = undefined
      return env.Data
    } catch (error) {
      throw toKdError(error)
    }
  }

  /** List the data centers / tenants reachable at this base URL (service name may be version-specific). */
  async listDataCenters(): Promise<unknown> {
    const url = joinUrl(this.baseUrl, this.ep.listDataCenterService)
    const headers = { 'Content-Type': 'application/json', ...(this.cfg.headers ?? {}) }
    try {
      const response = await this.transport.request({ method: 'POST', url, headers, body: {} })
      if (response.status >= 400) throw new KdError('kd/network', `Kingdee Cloud returned HTTP ${response.status}`)
      const env = parseEnvelope(response.body)
      assertSuccess(env)
      return env.Data
    } catch (error) {
      throw toKdError(error)
    }
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

  /** ExecuteBillQuery — query bills and base data (legacy, returns table-shaped rows). */
  async executeBillQuery(params: KdQueryParams): Promise<unknown> {
    return this.post(`${this.ep.dynamicFormService}.ExecuteBillQuery`, queryBody(params))
  }

  /** QueryBusinessData — newer structured query with richer, object-shaped results. */
  async queryBusinessData(params: KdQueryParams): Promise<unknown> {
    return this.post(`${this.ep.dynamicFormService}.QueryBusinessData`, queryBody(params))
  }

  /** Save a form (create or update a bill / base record). */
  async save(params: KdSaveParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId, Data: params.data }
    if (params.interaction !== undefined) body.Interaction = params.interaction
    if (params.isAutoSubmitAndAudit !== undefined) body.IsAutoSubmitAndAudit = params.isAutoSubmitAndAudit
    return this.post(`${this.ep.dynamicFormService}.Save`, body)
  }

  /** Batch-save multiple records in one call. */
  async batchSave(params: KdBatchSaveParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId, Data: params.records }
    if (params.interaction !== undefined) body.Interaction = params.interaction
    if (params.isAutoSubmitAndAudit !== undefined) body.IsAutoSubmitAndAudit = params.isAutoSubmitAndAudit
    return this.post(`${this.ep.dynamicFormService}.Save`, body)
  }

  /** Submit a form. */
  async submit(params: KdSubmitParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId }
    if (params.ids && params.ids.length > 0) body.Ids = params.ids.join(',')
    if (params.numbers && params.numbers.length > 0) body.Numbers = params.numbers.join(',')
    return this.post(`${this.ep.dynamicFormService}.Submit`, body)
  }

  /** Audit a form. */
  async audit(params: KdIdListParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId }
    if (params.ids && params.ids.length > 0) body.Ids = params.ids.join(',')
    if (params.numbers && params.numbers.length > 0) body.Numbers = params.numbers.join(',')
    return this.post(`${this.ep.dynamicFormService}.Audit`, body)
  }

  /** Un-audit a form. */
  async unaudit(params: KdIdListParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId }
    if (params.ids && params.ids.length > 0) body.Ids = params.ids.join(',')
    if (params.numbers && params.numbers.length > 0) body.Numbers = params.numbers.join(',')
    return this.post(`${this.ep.dynamicFormService}.UnAudit`, body)
  }

  /** Un-submit a submitted form (name may be version-specific). */
  async unsubmit(params: KdIdListParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId }
    if (params.ids && params.ids.length > 0) body.Ids = params.ids.join(',')
    if (params.numbers && params.numbers.length > 0) body.Numbers = params.numbers.join(',')
    return this.post(`${this.ep.dynamicFormService}.UnSubmit`, body)
  }

  /** Delete draft (暂存/created) records by id or number. */
  async deleteDraft(params: KdIdListParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId }
    if (params.ids && params.ids.length > 0) body.Ids = params.ids.join(',')
    if (params.numbers && params.numbers.length > 0) body.Numbers = params.numbers.join(',')
    return this.post(`${this.ep.dynamicFormService}.DeleteDraft`, body)
  }

  /** View a single record by id or bill number. */
  async view(formId: string, id?: string, number?: string): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: formId }
    if (id) body.Id = id
    if (number) body.Number = number
    return this.post(`${this.ep.dynamicFormService}.View`, body)
  }

  /** Delete records by id or bill number. */
  async delete(params: KdIdListParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId }
    if (params.ids && params.ids.length > 0) body.Ids = params.ids.join(',')
    if (params.numbers && params.numbers.length > 0) body.Numbers = params.numbers.join(',')
    return this.post(`${this.ep.dynamicFormService}.Delete`, body)
  }

  /** Invoke a BOS custom service. */
  async invokeService(params: KdInvokeParams): Promise<unknown> {
    const body: Record<string, unknown> = { ...(params.payload ?? {}) }
    if (params.formId !== undefined) body.FormId = params.formId
    return this.post(`${this.ep.servicePrefix}.${params.serviceName}`, body)
  }
}

/** Build the common query body shared by ExecuteBillQuery and QueryBusinessData. */
function queryBody(params: KdQueryParams): Record<string, unknown> {
  const body: Record<string, unknown> = {
    FormId: params.formId,
    FieldKeys: params.fieldKeys.join(','),
  }
  if (params.filter !== undefined) body.FilterString = params.filter
  if (params.orderString !== undefined) body.OrderString = params.orderString
  if (params.topCount !== undefined) {
    body.TopRowCount = params.topCount
    body.TopCount = params.topCount
  }
  if (params.limit !== undefined) body.Limit = params.limit
  if (params.startRowIndex !== undefined) body.StartRowIndex = params.startRowIndex
  if (params.startRow !== undefined) body.StartRow = params.startRow
  if (params.organization !== undefined) body.Organization = params.organization
  return body
}
