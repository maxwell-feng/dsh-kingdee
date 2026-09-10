/**
 * Offline mock transport for dsh-kingdee.
 *
 * Returns canned Kingdee envelopes per operation so the full tool pipeline can be
 * exercised without a reachable Kingdee Cloud tenant. Use it in tests and in a
 * `mock: true` DSH configuration to demo the workflow.
 */
/** Build a kingdee mock transport that never touches the network. */
export function buildMockTransport(options = {}) {
    const sessionCookie = options.sessionCookie ?? 'mocksession';
    return {
        async request(request) {
            const operation = operationOf(request.url);
            if (operation === 'LoginService.ValidateUser') {
                return {
                    status: 200,
                    body: { Result: 0, IsSuccess: true, Message: '', Data: '' },
                    headers: { 'set-cookie': `kdsvc=${sessionCookie}` },
                };
            }
            const body = request.body;
            const formId = extractFormId(body);
            if (options.failingFormIds?.includes(formId ?? '')) {
                return {
                    status: 200,
                    body: { Result: 1, IsSuccess: false, Message: `mock failure for ${formId}`, Data: null },
                };
            }
            if (options.overrides?.[operation]) {
                return { status: 200, body: options.overrides[operation] };
            }
            return { status: 200, body: envelopeFor(operation, body) };
        },
    };
}
function operationOf(url) {
    const service = /Kingdee\.BOS\.WebApi\.ServicesStub\.([^/?]+)/.exec(url);
    return service ? service[1] : 'UnknownService';
}
function extractFormId(body) {
    const form = body?.FormId;
    return typeof form === 'string' ? form : undefined;
}
function envelopeFor(operation, body) {
    const formId = extractFormId(body);
    const isBatch = Array.isArray(body?.Data);
    if (operation === 'LoginService.LogOut') {
        return { Result: 0, IsSuccess: true, Message: '', Data: { loggedOut: true } };
    }
    if (operation === 'DataCenterService.List') {
        return {
            Result: 0,
            IsSuccess: true,
            Message: '',
            Data: { dataCenters: [{ id: 'A1', number: 'd1', name: 'Mock Tenancy' }] },
        };
    }
    if (operation === 'DynamicFormService.ExecuteBillQuery' || operation === 'DynamicFormService.QueryBusinessData') {
        return {
            Result: 0,
            IsSuccess: true,
            Message: '',
            Data: [
                { FID: '1', FBillNo: `SO-MOCK-1-${formId ?? ''}`, FDocumentStatus: 'Z' },
                { FID: '2', FBillNo: `SO-MOCK-2-${formId ?? ''}`, FDocumentStatus: 'Z' },
            ],
        };
    }
    if (operation === 'DynamicFormService.Save') {
        if (isBatch) {
            return { Result: 0, IsSuccess: true, Message: '', Data: { saved: [{ Id: 'mock-1', Number: `SO-MOCK-b-${formId ?? ''}` }] } };
        }
        return { Result: 0, IsSuccess: true, Message: '', Data: { Id: 'mock-1', Number: `SO-MOCK-${formId ?? ''}`, FormId: formId ?? '' } };
    }
    if (operation === 'DynamicFormService.Submit') {
        return { Result: 0, IsSuccess: true, Message: '', Data: { submitted: true } };
    }
    if (operation === 'DynamicFormService.Audit') {
        return { Result: 0, IsSuccess: true, Message: '', Data: { audited: true } };
    }
    if (operation === 'DynamicFormService.UnAudit') {
        return { Result: 0, IsSuccess: true, Message: '', Data: { unaudited: true } };
    }
    if (operation === 'DynamicFormService.UnSubmit') {
        return { Result: 0, IsSuccess: true, Message: '', Data: { unsubmitted: true } };
    }
    if (operation === 'DynamicFormService.DeleteDraft') {
        return { Result: 0, IsSuccess: true, Message: '', Data: { draftDeleted: true } };
    }
    if (operation === 'DynamicFormService.View') {
        return { Result: 0, IsSuccess: true, Message: '', Data: { Id: 'mock-1', FBillNo: 'SO-MOCK-1' } };
    }
    if (operation === 'DynamicFormService.Delete') {
        return { Result: 0, IsSuccess: true, Message: '', Data: { deleted: true } };
    }
    // Generic custom-service response.
    return { Result: 0, IsSuccess: true, Message: '', Data: { ok: true, service: operation, result: 'OK' } };
}
//# sourceMappingURL=mock.js.map