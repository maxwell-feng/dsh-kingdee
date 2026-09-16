import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  assertSafePublicUrl,
  buildAppSecretLoginPayload,
  buildLoginPayload,
  buildMockTransport,
  businessHeaders,
  extractKdsvcCookie,
  extractSessionCookie,
  isPrivateOrLocalHost,
  KdClient,
  KdError,
  parseEnvelope,
  parseLoginOutcome,
  validateConfig,
} from '../src/kd-core/index.ts'
import type { KdHttpResponse, KdRequest, KdTransport } from '../src/kd-core/index.ts'

const baseUrl = 'http://kingdee.test/K3Cloud'

/** A transport that records every request and answers with a fixed success envelope. */
function recordingTransport(
  data: unknown = {},
  headers: Record<string, string> = { 'set-cookie': 'kdservice-sessionid=sess' },
): { transport: KdTransport; seen: KdRequest[] } {
  const seen: KdRequest[] = []
  return {
    seen,
    transport: {
      async request(request: KdRequest): Promise<KdHttpResponse> {
        seen.push(request)
        return { status: 200, body: { Result: 0, IsSuccess: true, Message: '', Data: data }, headers }
      },
    },
  }
}

test('parseEnvelope handles a success and a failure envelope', () => {
  assert.deepEqual(parseEnvelope({ Result: 0, IsSuccess: true, Message: '', Data: { ok: true } }), {
    Result: 0,
    IsSuccess: true,
    Message: '',
    Data: { ok: true },
  })

  const failed = parseEnvelope({ Result: 1, IsSuccess: false, Message: 'nope', Data: null })
  assert.equal(failed.IsSuccess, false)
  assert.equal(failed.Message, 'nope')
})

test('login payloads carry the V9.1 named keys and the lcid', () => {
  const user = buildLoginPayload({ baseUrl, acctId: 'A1', userName: 'u', password: 'p' })
  assert.deepEqual(user, { acctID: 'A1', username: 'u', password: 'p', lcid: 2052 })

  const app = buildAppSecretLoginPayload({ baseUrl, acctId: 'A1', userName: 'integ', appId: 'id', appSecret: 'sec', lcid: 1033 })
  assert.deepEqual(app, { acctID: 'A1', username: 'integ', appid: 'id', appsecret: 'sec', lcid: 1033 })
})

test('validateConfig enforces per-mode requirements and SSRF safety', () => {
  assert.throws(() => validateConfig({ baseUrl: '', acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }), /baseUrl/)
  // app mode needs the 集成用户 as well as the application credentials
  assert.throws(() => validateConfig({ baseUrl, acctId: 'A1', authMode: 'app', appId: 'id', appSecret: 'sec' }), /集成用户/)
  assert.throws(() => validateConfig({ baseUrl, acctId: 'A1', authMode: 'app', userName: 'u', appId: 'id' }), /appSecret/)
  assert.doesNotThrow(() => validateConfig({ baseUrl, acctId: 'A1', authMode: 'app', userName: 'u', appId: 'id', appSecret: 'sec' }))

  // SSRF checks in validateConfig
  assert.throws(() => validateConfig({ baseUrl: 'http://127.0.0.1/K3Cloud', acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }), /SSRF/)
  assert.throws(() => validateConfig({ baseUrl: 'http://localhost/K3Cloud', acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }), /SSRF/)
})

test('businessHeaders attaches the session as both a header and a cookie', () => {
  const headers = businessHeaders({ baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }, 'sess')
  assert.equal(headers['kdservice-sessionid'], 'sess')
  assert.match(headers.Cookie, /kdservice-sessionid=sess/)
  assert.match(headers.Cookie, /kdsvc=sess/)

  // No session yet: nothing is fabricated, in either mode.
  assert.equal(businessHeaders({ baseUrl, acctId: 'A1', authMode: 'user' }).Cookie, undefined)
  assert.equal(businessHeaders({ baseUrl, acctId: 'A1', authMode: 'app' })['kdservice-sessionid'], undefined)
})

test('stub URLs follow the documented .common.kdsvc convention', async () => {
  const { transport, seen } = recordingTransport([{ FBillNo: 'SO-1' }])
  const client = new KdClient({ baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }, transport)

  await client.executeBillQuery({ formId: 'SAL_SaleOrder', fieldKeys: ['FBillNo'] })

  // The session is established first, then reused for the business stub.
  assert.equal(seen[0]?.url, `${baseUrl}/Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser.common.kdsvc`)
  assert.equal(
    seen[1]?.url,
    `${baseUrl}/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.ExecuteBillQuery.common.kdsvc`,
  )
  assert.equal(seen[1]?.headers['kdservice-sessionid'], 'sess')
})

test('app mode logs in through LoginByAppSecret and reuses its session', async () => {
  const { transport, seen } = recordingTransport({ Id: 'mock-1' })
  const client = new KdClient(
    { baseUrl, acctId: 'A1', authMode: 'app', userName: 'integ', appId: 'id', appSecret: 'sec' },
    transport,
  )

  await client.save({ formId: 'SAL_SaleOrder', data: { FBillNo: 'SO-1' } })

  assert.equal(seen[0]?.url, `${baseUrl}/Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret.common.kdsvc`)
  assert.deepEqual(seen[0]?.body, { acctID: 'A1', username: 'integ', appid: 'id', appsecret: 'sec', lcid: 2052 })
  // Second call is the business stub, and no KDAuthentication header is invented.
  assert.equal(seen[1]?.url, `${baseUrl}/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Save.common.kdsvc`)
  assert.equal(seen[1]?.headers.KDAuthentication, undefined)
})

test('a custom BOS stub replaces the dynamic-form URL segment', async () => {
  const { transport, seen } = recordingTransport({ ok: true })
  const client = new KdClient(
    { baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' },
    transport,
  )

  await client.invokeService({ serviceName: 'GetCust.GetCust.ExecuteService,GetCust', payload: { arg: 1 } })

  assert.equal(seen[1]?.url, `${baseUrl}/GetCust.GetCust.ExecuteService,GetCust.common.kdsvc`)
  assert.deepEqual(seen[1]?.body, { arg: 1 })
})

test('parseLoginOutcome reads the login-specific shape, not the business envelope', () => {
  // The real login services answer with LoginResultType; without this the
  // absent IsSuccess would report a successful login as a failure.
  assert.deepEqual(parseLoginOutcome({ LoginResultType: 1 }), { ok: true, message: null, loginResultType: 1 })
  assert.equal(parseLoginOutcome({ LoginResultType: -1, Message: 'bad password' }).ok, false)
  assert.equal(parseLoginOutcome({ LoginResultType: -1, Message: 'bad password' }).message, 'bad password')
  // Deployments (and the mock) that answer with the business envelope still work.
  assert.equal(parseLoginOutcome({ Result: 0, IsSuccess: true, Message: '', Data: '' }).ok, true)
  assert.equal(parseLoginOutcome({ Result: 1, IsSuccess: false, Message: 'x', Data: null }).ok, false)
  assert.equal(parseLoginOutcome(null).ok, false)
})

test('a login failure surfaces as kd/auth-failed rather than a business envelope error', async () => {
  const transport: KdTransport = {
    async request(): Promise<KdHttpResponse> {
      return { status: 200, body: { LoginResultType: -1, Message: '账套或用户名密码错误' }, headers: {} }
    },
  }
  const client = new KdClient({ baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }, transport)

  await assert.rejects(
    () => client.login(),
    (error: unknown) => error instanceof KdError && error.code === 'kd/auth-failed',
  )
})

test('a successful LoginResultType establishes the session from its Set-Cookie', async () => {
  const transport: KdTransport = {
    async request(): Promise<KdHttpResponse> {
      return {
        status: 200,
        body: { LoginResultType: 1 },
        headers: { 'set-cookie': 'kdservice-sessionid=real-session; path=/;' },
      }
    },
  }
  const client = new KdClient({ baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }, transport)
  assert.equal(await client.login(), 'real-session')
})

test('SSRF defenses reject localhost, loopback, private and reserved networks', () => {
  // Protocol restrictions
  assert.throws(() => assertSafePublicUrl('ftp://kingdee.test/K3Cloud'), /Forbidden protocol/)
  assert.throws(() => assertSafePublicUrl('file:///etc/passwd'), /Forbidden protocol/)
  assert.throws(() => assertSafePublicUrl('gopher://kingdee.test'), /Forbidden protocol/)

  // Localhost & Loopback
  assert.equal(isPrivateOrLocalHost('localhost'), true)
  assert.equal(isPrivateOrLocalHost('api.localhost'), true)
  assert.equal(isPrivateOrLocalHost('127.0.0.1'), true)
  assert.equal(isPrivateOrLocalHost('127.255.255.254'), true)
  assert.equal(isPrivateOrLocalHost('::1'), true)
  assert.equal(isPrivateOrLocalHost('0.0.0.0'), true)

  // Private RFC1918
  assert.equal(isPrivateOrLocalHost('10.0.1.25'), true)
  assert.equal(isPrivateOrLocalHost('172.16.0.1'), true)
  assert.equal(isPrivateOrLocalHost('172.31.255.255'), true)
  assert.equal(isPrivateOrLocalHost('192.168.1.100'), true)
  assert.equal(isPrivateOrLocalHost('169.254.169.254'), true)

  // IPv6 Link-Local / ULA
  assert.equal(isPrivateOrLocalHost('fe80::1'), true)
  assert.equal(isPrivateOrLocalHost('fc00::1'), true)
  assert.equal(isPrivateOrLocalHost('fd12:3456::1'), true)

  // Safe public hosts
  assert.equal(isPrivateOrLocalHost('kingdee.test'), false)
  assert.equal(isPrivateOrLocalHost('open.kingdee.com'), false)
  assert.equal(isPrivateOrLocalHost('8.8.8.8'), false)
  assert.doesNotThrow(() => assertSafePublicUrl('https://open.kingdee.com/K3Cloud'))
})

test('extractSessionCookie handles both kdservice-sessionid and kdsvc', () => {
  const stdHeader = { 'set-cookie': 'kdservice-sessionid=std-session-123; path=/;' }
  assert.equal(extractSessionCookie(stdHeader), 'std-session-123')
  assert.equal(extractKdsvcCookie(stdHeader), 'std-session-123')

  const legacyHeader = { 'set-cookie': 'kdsvc=legacy-session-456; path=/;' }
  assert.equal(extractSessionCookie(legacyHeader), 'legacy-session-456')
})

test('client runs the full offline mock flow end to end', async () => {
  const client = new KdClient(
    { baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' },
    buildMockTransport(),
  )

  const rows = (await client.executeBillQuery({
    formId: 'SAL_SaleOrder',
    fieldKeys: ['FBillNo'],
    orderString: 'FCreateDate DESC',
    limit: 50,
    startRow: 0,
    topCount: 10,
  })) as Array<Record<string, unknown>>
  assert.equal(Array.isArray(rows), true)
  assert.ok(rows.length >= 1)
  assert.equal(rows[0]?.FDocumentStatus, 'Z')

  const saved = (await client.save({
    formId: 'SAL_SaleOrder',
    data: { FBillNo: 'SO-1' },
    isAutoSubmitAndAudit: true,
  })) as Record<string, unknown>
  assert.equal(saved.Id, 'mock-1')

  const submitted = (await client.submit({ formId: 'SAL_SaleOrder', numbers: ['SO-1'] })) as Record<string, unknown>
  assert.equal(submitted.submitted, true)

  const audited = (await client.audit({ formId: 'SAL_SaleOrder', numbers: ['SO-1'] })) as Record<string, unknown>
  assert.equal(audited.audited, true)

  const unaudited = (await client.unaudit({ formId: 'SAL_SaleOrder', numbers: ['SO-1'] })) as Record<string, unknown>
  assert.equal(unaudited.unaudited, true)

  const viewById = (await client.view('SAL_SaleOrder', 'mock-1')) as Record<string, unknown>
  assert.equal(viewById.Id, 'mock-1')

  const viewByNumber = (await client.view('SAL_SaleOrder', undefined, 'SO-1')) as Record<string, unknown>
  assert.equal(viewByNumber.Id, 'mock-1')

  const deleted = (await client.delete({ formId: 'SAL_SaleOrder', numbers: ['SO-1'] })) as Record<string, unknown>
  assert.equal(deleted.deleted, true)

  const invoked = (await client.invokeService({ serviceName: 'MyCustomService', payload: { arg: 1 } })) as Record<string, unknown>
  assert.equal(invoked.ok, true)
})

test('client maps a fake failure envelope to a KdError', async () => {
  const client = new KdClient(
    { baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' },
    buildMockTransport({ failingFormIds: ['SAL_Rejected'] }),
  )

  await assert.rejects(
    () => client.save({ formId: 'SAL_Rejected', data: {} }),
    (error: unknown) => error instanceof KdError && error.code === 'kd/business-error',
  )
})

test('client runs the extended mock operations (data center, structured query, batch, un-submit, draft delete, logout)', async () => {
  const client = new KdClient(
    { baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' },
    buildMockTransport(),
  )

  const dc = (await client.listDataCenters()) as unknown as { dataCenters: Array<Record<string, unknown>> }
  assert.ok(Array.isArray(dc.dataCenters))

  const structured = (await client.queryBusinessData({
    formId: 'SAL_SaleOrder',
    fieldKeys: ['FBillNo'],
    orderString: 'FBillNo ASC',
  })) as Array<Record<string, unknown>>
  assert.ok(Array.isArray(structured))

  const batch = (await client.batchSave({
    formId: 'SAL_SaleOrder',
    records: [{ FBillNo: 'B1' }, { FBillNo: 'B2' }],
    isAutoSubmitAndAudit: true,
  })) as unknown as { saved: unknown[] }
  assert.ok(batch.saved.length >= 1)

  const unsub = (await client.unsubmit({ formId: 'SAL_SaleOrder', numbers: ['SO-1'] })) as Record<string, unknown>
  assert.equal(unsub.unsubmitted, true)

  const draft = (await client.deleteDraft({ formId: 'SAL_SaleOrder', numbers: ['SO-1'] })) as Record<string, unknown>
  assert.equal(draft.draftDeleted, true)

  const loggedOut = (await client.logout()) as Record<string, unknown>
  assert.equal(loggedOut.loggedOut, true)
})
