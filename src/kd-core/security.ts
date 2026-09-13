/**
 * Security validation and SSRF defenses for Kingdee Cloud connections.
 *
 * Implements strict host and protocol validation:
 * - Only http and https protocols are permitted.
 * - Rejects localhost, loopback, private, and reserved addresses.
 */

import { KdError } from './errors.ts'

/**
 * Validates that the provided URL uses http or https, and does not target
 * localhost, loopback, private, or reserved network addresses.
 *
 * Throws a {@link KdError} with code `kd/invalid-config` on violation.
 */
export function assertSafePublicUrl(rawUrl: string): URL {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new KdError('kd/invalid-config', 'Target URL is required')
  }

  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch (err) {
    throw new KdError('kd/invalid-config', `Invalid URL: ${rawUrl}`, {}, { cause: err })
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new KdError(
      'kd/invalid-config',
      `Forbidden protocol "${parsed.protocol}". Only http: and https: are allowed.`,
    )
  }

  const hostname = parsed.hostname.trim()
  if (!hostname) {
    throw new KdError('kd/invalid-config', 'URL hostname cannot be empty')
  }

  if (isPrivateOrLocalHost(hostname)) {
    throw new KdError(
      'kd/invalid-config',
      `SSRF protection: host "${hostname}" is localhost, loopback, private, or reserved address.`,
    )
  }

  return parsed
}

/**
 * Checks whether a hostname or IP address resolves to localhost, loopback,
 * private network, link-local, or reserved address space.
 */
export function isPrivateOrLocalHost(rawHostname: string): boolean {
  let host = rawHostname.toLowerCase().trim()
  // Strip IPv6 square brackets if present
  if (host.startsWith('[') && host.endsWith(']')) {
    host = host.slice(1, -1)
  }

  // Common named local/internal domains
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host === 'local' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.lan') ||
    host.endsWith('.corp') ||
    host === '0.0.0.0'
  ) {
    return true
  }

  // IPv4 dotted-decimal validation
  const parts = host.split('.')
  if (parts.length === 4 && parts.every((p) => /^\d{1,3}$/.test(p))) {
    const o1 = Number(parts[0])
    const o2 = Number(parts[1])
    const o3 = Number(parts[2])
    const o4 = Number(parts[3])

    if (o1 > 255 || o2 > 255 || o3 > 255 || o4 > 255) {
      return true
    }

    // 0.0.0.0/8 (Current network)
    if (o1 === 0) return true
    // 10.0.0.0/8 (Private-Use)
    if (o1 === 10) return true
    // 100.64.0.0/10 (Shared Address Space / CGNAT)
    if (o1 === 100 && o2 >= 64 && o2 <= 127) return true
    // 127.0.0.0/8 (Loopback)
    if (o1 === 127) return true
    // 169.254.0.0/16 (Link Local)
    if (o1 === 169 && o2 === 254) return true
    // 172.16.0.0/12 (Private-Use)
    if (o1 === 172 && o2 >= 16 && o2 <= 31) return true
    // 192.168.0.0/16 (Private-Use)
    if (o1 === 192 && o2 === 168) return true
    // 192.0.0.0/24 (IETF Protocol Assignments)
    if (o1 === 192 && o2 === 0 && o3 === 0) return true
    // 198.18.0.0/15 (Benchmarking)
    if (o1 === 198 && (o2 === 18 || o2 === 19)) return true
    // 224.0.0.0/4 (Multicast)
    if (o1 >= 224 && o1 <= 239) return true
    // 240.0.0.0/4 (Reserved for Future Use)
    if (o1 >= 240) return true

    return false
  }

  // IPv6 checks
  if (host.includes(':')) {
    // Loopback ::1
    if (host === '::1' || host === '0:0:0:0:0:0:0:1') return true
    // Unspecified ::
    if (host === '::' || host === '0:0:0:0:0:0:0:0') return true

    // IPv4-mapped IPv6 ::ffff:192.168.1.1
    if (host.startsWith('::ffff:')) {
      const mappedIpv4 = host.slice(7)
      return isPrivateOrLocalHost(mappedIpv4)
    }

    // Link-local fe80::/10
    if (/^fe[89ab]/i.test(host)) return true

    // Unique Local Address fc00::/7
    if (/^f[cd]/i.test(host)) return true

    // IPv6 loopback variants
    if (host.endsWith('::1') && /^0*(::1|:0*:1)$/.test(host)) return true
  }

  return false
}
