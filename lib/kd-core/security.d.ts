/**
 * Security validation and SSRF defenses for Kingdee Cloud connections.
 *
 * Implements strict host and protocol validation:
 * - Only http and https protocols are permitted.
 * - Rejects localhost, loopback, private, and reserved addresses.
 */
/**
 * Validates that the provided URL uses http or https, and does not target
 * localhost, loopback, private, or reserved network addresses.
 *
 * Throws a {@link KdError} with code `kd/invalid-config` on violation.
 */
export declare function assertSafePublicUrl(rawUrl: string): URL;
/**
 * Checks whether a hostname or IP address resolves to localhost, loopback,
 * private network, link-local, or reserved address space.
 */
export declare function isPrivateOrLocalHost(rawHostname: string): boolean;
//# sourceMappingURL=security.d.ts.map