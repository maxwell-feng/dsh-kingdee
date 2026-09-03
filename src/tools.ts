/**
 * dsh-kingdee tool registration.
 *
 * Each tool is a thin typed wrapper over a {@link KdClient} operation. All business
 * logic lives in `./kd-core`; these wrappers only map the model-facing schema to a
 * canonical output value. Compiled inside a DSH profile (peer packages resolve there).
 *
 * Output contract: every Kingdee WebAPI response is an open JSON document, so the
 * tools declare the canonical open-value schema (`type: 'json'`) — the same shape
 * `cordis_inspect_list` uses — and render it as JSON text.
 */

import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { JsonValue } from '@deepseek-ai/dsh-util-values'
import type { KdClient } from './kd-core/index.ts'

/** Render one canonical value as compact JSON text. */
function renderJson(_args: unknown, value: JsonValue): Array<{ type: 'text'; text: string }> {
  return [{ type: 'text', text: JSON.stringify(value) }]
}

/**
 * Normalize one kd-core result to the canonical open-value schema. The WebAPI
 * envelope parser already guarantees lossless JSON; the annotation carries that
 * guarantee into the tool contract.
 */
async function callAsJson(run: Promise<unknown>): Promise<JsonValue> {
  return await run as JsonValue
}

/** Register the complete kingdee_* tool set. `getClient` is re-invoked per call so credentials re-resolve. */
export function registerKingdeeTools(ctx: Context, getClient: () => Promise<KdClient>): void {
  ctx.tools.register(
    defineTool({
      name: 'kingdee_query',
      description: 'Query Kingdee Cloud bills and base data (DynamicFormService.ExecuteBillQuery). Returns matching rows.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id, e.g. SAL_SaleOrder.' },
        fieldKeys: { type: 'array', items: { type: 'string' }, required: true, description: 'Field keys to return, e.g. FBillNo, FDocumentStatus.' },
        filter: { type: 'string', description: `Kingdee filter expression, e.g. FBillNo='SO-20260701'.` },
        topCount: { type: 'number', description: 'Maximum number of rows to return.' },
        organization: { type: 'string', description: 'Optional organization (org) id / FNumber.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).executeBillQuery({
          formId: args.formId,
          fieldKeys: args.fieldKeys,
          filter: args.filter,
          topCount: args.topCount,
          organization: args.organization,
        }))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_save',
      description: 'Save a Kingdee Cloud form (create or update a bill / base record). Returns the created/updated record id and number.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id, e.g. SAL_SaleOrder.' },
        data: { type: 'object', properties: {}, additionalProperties: true, required: true, description: 'Bill payload keyed by Kingdee field keys.' },
        interaction: { type: 'boolean', description: 'Set true to skip platform (form plugin) validation.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).save({ formId: args.formId, data: args.data, interaction: args.interaction }))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_submit',
      description: 'Submit one or more Kingdee Cloud forms.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id.' },
        ids: { type: 'array', items: { type: 'string' }, required: true, description: 'Record ids to submit.' },
        numbers: { type: 'array', items: { type: 'string' }, description: 'Optional bill numbers accompanying the ids.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).submit({ formId: args.formId, ids: args.ids, numbers: args.numbers }))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_audit',
      description: 'Audit (approve) one or more Kingdee Cloud forms.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id.' },
        ids: { type: 'array', items: { type: 'string' }, required: true, description: 'Record ids to audit.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).audit({ formId: args.formId, ids: args.ids }))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_unaudit',
      description: 'Un-audit one or more Kingdee Cloud forms.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id.' },
        ids: { type: 'array', items: { type: 'string' }, required: true, description: 'Record ids to un-audit.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).unaudit({ formId: args.formId, ids: args.ids }))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_view',
      description: 'View a single Kingdee Cloud record by id.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id.' },
        id: { type: 'string', required: true, description: 'Record id to view.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).view(args.formId, args.id))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_delete',
      description: 'Delete one or more Kingdee Cloud records by id.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id.' },
        ids: { type: 'array', items: { type: 'string' }, required: true, description: 'Record ids to delete.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).delete({ formId: args.formId, ids: args.ids }))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_invoke',
      description: 'Invoke a Kingdee Cloud BOS custom service registered via the WebAPI.',
      parameters: {
        serviceName: { type: 'string', required: true, description: 'Custom service name (endpoint suffix after Kingdee.BOS.WebApi.ServicesStub.).' },
        payload: { type: 'object', properties: {}, additionalProperties: true, description: 'Service payload.' },
        formId: { type: 'string', description: 'Optional form id the service acts on.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).invokeService({ serviceName: args.serviceName, payload: args.payload, formId: args.formId }))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_logout',
      description: 'Log out the current Kingdee Cloud session and clear the stored session cookie.',
      parameters: {},
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute() {
        return callAsJson((await getClient()).logout())
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_list_datacenters',
      description: 'List the data centers / tenants reachable at the configured WebAPI base URL.',
      parameters: {},
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute() {
        return callAsJson((await getClient()).listDataCenters())
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_query_business_data',
      description: 'Query Kingdee Cloud bills and base data with the newer structured QueryBusinessData endpoint. Returns object-shaped rows.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id, e.g. SAL_SaleOrder.' },
        fieldKeys: { type: 'array', items: { type: 'string' }, required: true, description: 'Field keys to return, e.g. FBillNo, FDocumentStatus.' },
        filter: { type: 'string', description: `Kingdee filter expression, e.g. FBillNo='SO-20260701'.` },
        topCount: { type: 'number', description: 'Maximum number of rows to return.' },
        organization: { type: 'string', description: 'Optional organization (org) id / FNumber.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).queryBusinessData({
          formId: args.formId,
          fieldKeys: args.fieldKeys,
          filter: args.filter,
          topCount: args.topCount,
          organization: args.organization,
        }))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_unsubmit',
      description: 'Un-submit one or more Kingdee Cloud forms (reverses a submit). Service name may be version-specific.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id.' },
        ids: { type: 'array', items: { type: 'string' }, required: true, description: 'Record ids to un-submit.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).unsubmit({ formId: args.formId, ids: args.ids }))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_delete_draft',
      description: 'Delete draft (暂存/created) Kingdee Cloud records by id.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id.' },
        ids: { type: 'array', items: { type: 'string' }, required: true, description: 'Draft record ids to delete.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).deleteDraft({ formId: args.formId, ids: args.ids }))
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'kingdee_batch_save',
      description: 'Batch-save multiple Kingdee Cloud records in one call.',
      parameters: {
        formId: { type: 'string', required: true, description: 'Kingdee form id, e.g. SAL_SaleOrder.' },
        records: { type: 'array', items: { type: 'object', properties: {}, additionalProperties: true }, required: true, description: 'List of bill payloads keyed by Kingdee field keys.' },
        interaction: { type: 'boolean', description: 'Set true to skip platform (form plugin) validation.' },
      },
      output: {
        schema: { type: 'json' },
        render: renderJson,
      },
      async execute(args) {
        return callAsJson((await getClient()).batchSave({ formId: args.formId, records: args.records, interaction: args.interaction }))
      },
    }),
  )
}
