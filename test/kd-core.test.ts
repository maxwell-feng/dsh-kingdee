import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildLoginPayload,
  buildMockTransport,
  businessHeaders,
  KdClient,
  KdError,
  parseEnvelope,
  parseEnvelopeFromText,
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

test('parseEnvelopeFromText parses JSON and tolerates garbage', () => {
  assert.equal(parseEnvelopeFromText('{"Result":0,"IsSuccess":true}').IsSuccess, true)
  assert.equal(parseEnvelopeFromText('not json').IsSuccess, false)
  assert.match(parseEnvelopeFromText('not json').Message ?? '', /Failed to parse/)
})

test('buildLoginPayload and validateConfig enforce per-mode requirements', () => {
  const payload = buildLoginPayload({ baseUrl, acctId: 'A1', userName: 'u', password: 'p' })
  assert.equal(payload.acctID, 'A1')
  assert.equal(payload.userName, 'u')

  assert.throws(() => validateConfig({ baseUrl: '', acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }), /baseUrl/)
  assert.throws(() => validateConfig({ baseUrl, acctId: 'A1', authMode: 'app', appId: 'id' }), /appSecret/)
})

test('businessHeaders sends a kdsvc cookie for user mode and an auth header for app mode', () => {
  const user = businessHeaders({ baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' }, 'sess')
  assert.equal(user.Cookie, 'kdsvc=sess')

  const app = businessHeaders({ baseUrl, acctId: 'A1', authMode: 'app', appId: 'id', appSecret: 'secret' })
  assert.ok(app.KDAuthentication)
})

test('client runs the full offline mock flow end to end', async () => {
  const client = new KdClient(
    { baseUrl, acctId: 'A1', authMode: 'user', userName: 'u', password: 'p' },
    buildMockTransport(),
  )

  const rows = (await client.executeBillQuery({ formId: 'SAL_SaleOrder', fieldKeys: ['FBillNo'], topCount: 10 })) as Array<Record<string, unknown>>
  assert.equal(Array.isArray(rows), true)
  assert.ok(rows.length >= 1)
  assert.equal(rows[0]?.FDocumentStatus, 'Z')

  const saved = (await client.save({ formId: 'SAL_SaleOrder', data: { FBillNo: 'SO-1' } })) as Record<string, unknown>
  assert.equal(saved.Id, 'mock-1')

  const submitted = (await client.submit({ formId: 'SAL_SaleOrder', ids: ['mock-1'] })) as Record<string, unknown>
  assert.equal(submitted.submitted, true)

  const audited = (await client.audit({ formId: 'SAL_SaleOrder', ids: ['mock-1'] })) as Record<string, unknown>
  assert.equal(audited.audited, true)

  const unaudited = (await client.unaudit({ formId: 'SAL_SaleOrder', ids: ['mock-1'] })) as Record<string, unknown>
  assert.equal(unaudited.unaudited, true)

  const view = (await client.view('SAL_SaleOrder', 'mock-1')) as Record<string, unknown>
  assert.equal(view.Id, 'mock-1')

  const deleted = (await client.delete({ formId: 'SAL_SaleOrder', ids: ['mock-1'] })) as Record<string, unknown>
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

  const structured = (await client.queryBusinessData({ formId: 'SAL_SaleOrder', fieldKeys: ['FBillNo'] })) as Array<Record<string, unknown>>
  assert.ok(Array.isArray(structured))

  const batch = (await client.batchSave({ formId: 'SAL_SaleOrder', records: [{ FBillNo: 'B1' }, { FBillNo: 'B2' }] })) as unknown as { saved: unknown[] }
  assert.ok(batch.saved.length >= 1)

  const unsub = (await client.unsubmit({ formId: 'SAL_SaleOrder', ids: ['mock-1'] })) as Record<string, unknown>
  assert.equal(unsub.unsubmitted, true)

  const draft = (await client.deleteDraft({ formId: 'SAL_SaleOrder', ids: ['mock-1'] })) as Record<string, unknown>
  assert.equal(draft.draftDeleted, true)

  const loggedOut = (await client.logout()) as Record<string, unknown>
  assert.equal(loggedOut.loggedOut, true)
})
