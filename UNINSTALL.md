# Uninstall

English | [中文](UNINSTALL.zh.md)

How to remove **dsh-kingdee** from a DSH profile.

## 1. Disable the plugin

Removing the bundle without losing your config is often the first step; the plugin disappears from the tool set and the settings page.

```sh
dsh plugin disable dsh-kingdee
```

## 2. Remove the bundle

```sh
dsh plugin remove dsh-kingdee
```

This removes the installed npm package and its composition layer.

## 3. Remove your configuration

Connection settings live in the profile's `cordis.yml` / settings document. Delete the `kingdee` plugin row (and any `kingdee.*` config keys) so it does not linger after removal:

```yaml
# remove this row
- id: kingdee
  name: ...
```

## 4. Remove the secrets

Secrets are stored outside the plugin (environment variables or the credentials store). Remove them so no value is left behind:

```sh
unset DSH_KINGDEE_USER DSH_KINGDEE_PASSWORD DSH_KINGDEE_APP_SECRET
# or from the credentials store
dsh credentials unset DSH_KINGDEE_USER
dsh credentials unset DSH_KINGDEE_PASSWORD
dsh credentials unset DSH_KINGDEE_APP_SECRET
```

## 5. Restart

```sh
dsh restart
```

After the restart the `kingdee_*` tools are gone from the agent's tool set.

## What it leaves behind

- System-level logs and any cached session may still record past calls; remove those if your policy requires.
- The `kd-core` library is a separate export (`dsh-kingdee/kd-core`) — if you no longer use it, uninstall the package entirely with `dsh plugin remove`.

## Removing the source checkout

If you installed from a Git checkout, simply delete the repository directory (e.g. `dsh-kingdee/`). Removing the folder does not edit your DSH profile, so complete the steps above first.
