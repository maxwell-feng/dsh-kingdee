---
name: Tenant compatibility report
about: Tell us which Kingdee tenant, version and API gateway this plugin does or does not work against.
title: "[Compatibility] "
labels: ["compatibility"]
assignees: ""
---

## Summary
> One sentence: does the plugin work against this tenant, or where does it stop?

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
> Which tools were called, and what came back. Paste any `kd/*` error code or Kingdee `Message` (redacted).

## Relevant `acctID` / form ids
> If a specific form or base-data entity behaves differently on this version, name it here.

## Reference
> Related entries in `docs/RELEASE.md` or the known-limitations section of the README.
