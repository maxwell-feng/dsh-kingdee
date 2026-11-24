---
name: Tenant compatibility report
about: Report the Kingdee tenant, version and API gateway where this plugin works or fails.
title: "[Compatibility] "
labels: ["compatibility"]
assignees: ""
---

## Summary
> One sentence: does the plugin work here, or where does it fail?

## Outcome
- [ ] Everything I tried works
- [ ] Login works, some operations fail
- [ ] Login fails
- [ ] Not attempted — reporting the tenant details for the record

## Tenant details
- Tenant kind (public cloud / private cloud / on-premise):
- Kingdee product & version (e.g. Cloud Starry Sky V9.1):
- Edition (enterprise / standard / other):
- Base URL host in use:
- Does the tenant only expose the OpenAPI gateway (`https://api.kingdee.com/galaxyapi/`) with API signature auth? (yes / no / unknown):

## Auth
- Auth mode (`user` / `app`):
- Any tenant-side switch required to open the classic WebAPI `kdsvc` session? (yes / no / unknown):

## What you ran
```yaml
# The kingdee section of cordis.yml (redact secrets)
```

## Result
> Tools called and results; paste any `kd/*` error code or Kingdee `Message` (redacted).

## Relevant `acctId` / form ids (the login payload key is `acctID`)
> Name any form or base-data entity that behaves differently here.

## Reference
> Related `docs/RELEASE.md` or README known-limitations entries.
