import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  assertSafePublicUrl,
  buildLoginPayload,
  buildMockTransport,
  businessHeaders,
  extractKdsvcCookie,
  extractSessionCookie,
  isPrivateOrLocalHost,
  KdClient,
  KdError,
  parseEnvelope,
  validateConfig,
} from '../src/kd-core/index.ts'

const baseUrl = 'http://kingdee.test/K3Cloud'

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

test('buildLoginPayload and validateConfig enforce per-mode requirements and SSRF safety', () => {
  const payload = buildLoginPayload({ baseUrl, acctId: 'A1', userName: 'u', password: 'p' })
  assert.equal(payload.acctID, 'A1')
  assert.equal(payload.userName, 'u')

  assert.throws(() => validateConfig({ baseUrl: '', acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }), /baseUrl/)
  assert.throws(() => validateConfig({ baseUrl, acctId: 'A1', authMode: 'app', appId: 'id' }), /appSecret/)
  // SSRF checks in validateConfig
  assert.throws(() => validateConfig({ baseUrl: 'http://127.0.0.1/K3Cloud', acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }), /SSRF/)
  assert.throws(() => validateConfig({ baseUrl: 'http://localhost/K3Cloud', acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }), /SSRF/)
})

test('businessHeaders sends kdservice-sessionid and kdsvc cookies for user mode and auth header for app mode', () => {
  const user = businessHeaders({ baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }, 'sess')
  assert.match(user.Cookie, /kdservice-sessionid=sess/)
  assert.match(user.Cookie, /kdsvc=sess/)

  const app = businessHeaders({ baseUrl, acctId: 'A1', authMode: 'app', appId: 'id', appSecret: 'secret' })
  assert.ok(app.KDAuthentication)
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
