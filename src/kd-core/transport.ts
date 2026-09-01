/**
 * Transport seam between the Kingdee client and the network.
 *
 * The client only depends on {@link KdTransport}; swapping in {@link MockTransport}
 * lets the whole pipeline run offline with canned Kingdee envelopes.
 */

import type { KdHttpResponse, KdRequest } from './types.ts'

/** Boundary the Kingdee client talks to. Implement it with a real fetch or a mock. */
export interface KdTransport {
  request(request: KdRequest): Promise<KdHttpResponse>
}

/** A transport that performs real HTTP through the global `fetch` with JSON encoding and timeout. */
export class HttpTransport implements KdTransport {
  private readonly timeoutMs: number

  constructor(timeoutMs = 30_000) {
    this.timeoutMs = timeoutMs
  }

  async request(request: KdRequest): Promise<KdHttpResponse> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...request.headers }
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)

    let response: Response
    try {
      response = await (globalThis as { fetch?: typeof fetch }).fetch?.(request.url, {
        method: request.method,
        headers,
        body: request.method === 'POST' ? JSON.stringify(request.body ?? {}) : undefined,
        signal: controller.signal,
      }) as Response
      if (!response) throw new Error('fetch is not available in this runtime')
    } catch (error) {
      clearTimeout(timer)
      throw error
    } finally {
      clearTimeout(timer)
    }

    const text = await response.text()
    let body: unknown
    try {
      body = text ? JSON.parse(text) : undefined
    } catch {
      body = text
    }

    return {
      status: response.status,
      body,
      headers: Object.fromEntries(
        [...response.headers.entries()].map(([k, v]) => [k.toLowerCase(), v]) as [string, string][],
      ) as Record<string, string | string[] | undefined>,
    }
  }
}
