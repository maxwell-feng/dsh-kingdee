/**
 * The Kingdee Cloud WebAPI client (V9.1).
 *
 * Owns session management and the operations used by the DSH tools: login/logout,
 * query (legacy + structured), save (single + batch), submit, audit, un-audit,
 * un-submit, delete, delete-draft, view, data-center listing, and custom-stub
 * invocation. Every operation funnels through the transport seam; a failed
 * envelope throws a {@link KdError} so tool output stays structured.
 *
 * Stub paths follow the documented V9.1 convention
 * `/K3Cloud/{stub path}.common.kdsvc`, where the stub path is either
 * `Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.<Operation>` or, for a
 * BOS custom service, `{namespace}.{class}.{method},{assembly}`. Service names
 * vary across versions and deployments, so they stay overridable through
 * `KdConfig.endpoints`; the defaults cover the standard K3Cloud surface.
 */

import { buildAppSecretLoginPayload, buildLoginPayload, businessHeaders, validateConfig } from './auth.ts'
import { assertSuccess, KdError, toKdError } from './errors.ts'
import { extractKdsvcCookie, joinUrl, parseEnvelope, parseLoginOutcome } from './envelope.ts'
import type { KdBatchSaveParams, KdConfig, KdIdListParams, KdInvokeParams, KdQueryParams, KdSaveParams, KdSubmitParams } from './types.ts'
import type { KdTransport } from './transport.ts'

/** Default K3Cloud WebAPI endpoints. Override individual fields via `KdConfig.endpoints`. */
const DEFAULT_ENDPOINTS = {
  loginService: 'Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser',
  loginByAppSecretService: 'Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret',
  logOutService: 'Kingdee.BOS.WebApi.ServicesStub.AuthService.LogOut',
  dynamicFormService: 'Kingdee.BOS.WebApi.ServicesStub.DynamicFormService',
  // Name is version-specific and not confirmed against a live tenant; override it
  // from Common Settings → Dynamic Service Definition → WebAPI when listing data centers fails.
  listDataCenterService: 'Kingdee.BOS.WebApi.ServicesStub.DataCenterService.List',
  stubSuffix: '.common.kdsvc',
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

  /**
   * Append the documented `.common.kdsvc` stub suffix, tolerating an endpoint
   * override that already carries it.
   */
  private stub(path: string): string {
    const suffix = this.ep.stubSuffix
    return suffix && !path.endsWith(suffix) ? `${path}${suffix}` : path
  }

  /** Build a `DynamicFormService.<operation>` stub path. */
  private form(operation: string): string {
    return this.stub(`${this.ep.dynamicFormService}.${operation}`)
  }

  /**
   * Authenticate and return the session value.
   *
   * Both modes call their login stub and capture the `kdservice-sessionid`
   * cookie; `user` mode calls `ValidateUser`, `app` mode calls
   * `LoginByAppSecret` because Kingdee refuses account/password login on
   * public-cloud tenants opened after 2022-11-29.
   */
  async login(): Promise<string | undefined> {
    validateConfig(this.cfg)
    const mode = this.cfg.authMode ?? 'user'

    const endpoint = mode === 'user' ? this.ep.loginService : this.ep.loginByAppSecretService
    const payload = mode === 'user' ? buildLoginPayload(this.cfg) : buildAppSecretLoginPayload(this.cfg)
    const url = joinUrl(this.baseUrl, this.stub(endpoint))

    const response = await this.transport.request({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json', ...(this.cfg.headers ?? {}) },
      body: payload,
    })

    const cookie = extractKdsvcCookie(response.headers)
    if (cookie) this.sessionCookie = cookie

    // The login services answer with `LoginResultType`, not the business envelope.
    const outcome = parseLoginOutcome(response.body)
    if (!outcome.ok) {
      throw new KdError('kd/auth-failed', outcome.message ?? 'Kingdee Cloud login failed', {
        loginResultType: outcome.loginResultType,
        mode,
      })
    }
    return this.sessionCookie
  }

  /** Log out of the current session and clear the stored session cookie. */
  async logout(): Promise<unknown> {
    await this.ensureSession()
    const url = joinUrl(this.baseUrl, this.stub(this.ep.logOutService))
    const headers = businessHeaders(this.cfg, this.sessionCookie)
    const body: Record<string, unknown> = { acctID: this.cfg.acctId }
    if (this.cfg.userName) body.username = this.cfg.userName
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
    const url = joinUrl(this.baseUrl, this.stub(this.ep.listDataCenterService))
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

  /** Ensure a session exists before a business call. */
  private async ensureSession(): Promise<void> {
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
    return this.post(this.form('ExecuteBillQuery'), queryBody(params))
  }

  /** QueryBusinessData — newer structured query with richer, object-shaped results. */
  async queryBusinessData(params: KdQueryParams): Promise<unknown> {
    return this.post(this.form('QueryBusinessData'), queryBody(params))
  }

  /** Save a form (create or update a bill / base record). */
  async save(params: KdSaveParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId, Data: params.data }
    if (params.interaction !== undefined) body.Interaction = params.interaction
    if (params.isAutoSubmitAndAudit !== undefined) body.IsAutoSubmitAndAudit = params.isAutoSubmitAndAudit
    return this.post(this.form('Save'), body)
  }

  /** Batch-save multiple records in one call. */
  async batchSave(params: KdBatchSaveParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId, Data: params.records }
    if (params.interaction !== undefined) body.Interaction = params.interaction
    if (params.isAutoSubmitAndAudit !== undefined) body.IsAutoSubmitAndAudit = params.isAutoSubmitAndAudit
    return this.post(this.form('Save'), body)
  }

  /** Submit a form. */
  async submit(params: KdSubmitParams): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: params.formId }
    if (params.ids && params.ids.length > 0) body.Ids = params.ids.join(',')
    if (params.numbers && params.numbers.length > 0) body.Numbers = params.numbers.join(',')
    return this.post(this.form('Submit'), body)
  }

  /** Audit a form. */
  async audit(params: KdIdListParams): Promise<unknown> {
    return this.post(this.form('Audit'), idListBody(params))
  }

  /** Un-audit a form. */
  async unaudit(params: KdIdListParams): Promise<unknown> {
    return this.post(this.form('UnAudit'), idListBody(params))
  }

  /** Un-submit a submitted form (name may be version-specific). */
  async unsubmit(params: KdIdListParams): Promise<unknown> {
    return this.post(this.form('UnSubmit'), idListBody(params))
  }

  /** Delete draft records in the draft / created state by id or number. */
  async deleteDraft(params: KdIdListParams): Promise<unknown> {
    return this.post(this.form('DeleteDraft'), idListBody(params))
  }

  /** View a single record by id or bill number. */
  async view(formId: string, id?: string, number?: string): Promise<unknown> {
    const body: Record<string, unknown> = { FormId: formId }
    if (id) body.Id = id
    if (number) body.Number = number
    return this.post(this.form('View'), body)
  }

  /**
   * Delete records by id or bill number.
   *
   * V9.1 corrected the `FNumber` this operation returns; the value in
   * `SuccessEntitys[].Number` can be trusted as-is from 9.1.0.20250807 on, and
   * only older builds need a follow-up query to resolve the number.
   */
  async delete(params: KdIdListParams): Promise<unknown> {
    return this.post(this.form('Delete'), idListBody(params))
  }

  /**
   * Invoke a BOS custom service.
   *
   * A custom stub replaces the dynamic-form segment entirely, so it is posted
   * at `/K3Cloud/{serviceName}.common.kdsvc` rather than under
   * `DynamicFormService`.
   */
  async invokeService(params: KdInvokeParams): Promise<unknown> {
    const body: Record<string, unknown> = { ...(params.payload ?? {}) }
    if (params.formId !== undefined) body.FormId = params.formId
    return this.post(this.stub(params.serviceName), body)
  }
}

/** Build the shared `FormId` + `Ids`/`Numbers` body used by the workflow operations. */
function idListBody(params: KdIdListParams): Record<string, unknown> {
  const body: Record<string, unknown> = { FormId: params.formId }
  if (params.ids && params.ids.length > 0) body.Ids = params.ids.join(',')
  if (params.numbers && params.numbers.length > 0) body.Numbers = params.numbers.join(',')
  return body
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
