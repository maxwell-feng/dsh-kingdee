---
name: Setup or configuration problem
about: Install, credential, network or SSRF allow-list trouble — the plugin never gets as far as a working call.
title: "[Setup] "
labels: ["setup", "question"]
assignees: ""
---

## Summary
> One sentence on what fails during install, configuration or login.

## Where it fails
- [ ] Adding or enabling the plugin in the DSH profile
- [ ] Credential lookup (`dsh-credentials`)
- [ ] Login to the Kingdee tenant
- [ ] First tool call after a login that looked successful
- [ ] Other (explain below)

## Steps to reproduce
1. …
2. …

## Expected vs actual
- **Expected:** …
- **Actual:** …

## Environment
- DSH version:
- Plugin version (v0.x.x / tag / commit):
- DSH profile name:
- Install method (`dsh plugin add` / npm / Git URL / local path):
- Node version:
- OS:
- Kingdee version & tenant:
- Tenant kind (public cloud / private cloud / on-premise):
- Auth mode (`user` / `app`), and whether the app secret is set:
- `mock` enabled (yes/no):
- `baseUrl` in use (redact the tenant id if needed):

## Error
> Paste the exact error text or `kd/*` code (redact secrets).

## Minimal config
```yaml
# The kingdee section of cordis.yml (redact secrets)
```

## What you already checked
- [ ] Credentials are stored under the exact key the config references
- [ ] The tenant host is on the SSRF allow-list (see CONFIG.md)
- [ ] `mock` mode works, so the plugin itself loads
- [ ] DNS and any proxy in front of DSH can reach the tenant host

## Logs
> Relevant log excerpts (redacted).

## Attachments
> Screenshots, packet captures, log files.
