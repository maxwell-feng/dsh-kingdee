---
name: Bug report
about: Report a defect so we can diagnose and fix it.
title: "[Bug] "
labels: ["bug"]
assignees: ""
---

## Summary
> One sentence describing the issue. If the plugin never loads or cannot log in at all, use the setup template instead.

## Steps to reproduce
1. …
2. …

## Isolation
- [ ] Reproduced with `mock` enabled — so it is not a tenant-side problem
- [ ] Reproduced against a live tenant
- [ ] Fails in mock only
- [ ] Fails on the live tenant only

## Expected vs actual
- **Expected:** …
- **Actual:** …

## Environment
- DSH version:
- Plugin version (v0.x.x / tag / commit):
- Kingdee version & tenant:
- OS:
- Auth mode (`user` / `app`):
- `mock` enabled (yes/no):

## Error
> Paste any `kd/*` error code or Kingdee `Message` (redacted).

## Minimal config
```yaml
# The kingdee section of cordis.yml (redact secrets)
```

## Logs
> Relevant log excerpts (redacted).

## Attachments
> Screenshots, packet captures, log files.
