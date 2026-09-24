# Uninstall

English | [Chinese](UNINSTALL.zh.md)

> Verified against deepseek-harness **0.1.7-rc.2** (`pnpm run typecheck` clean, **15** unit tests passing via `pnpm test`, and the bundle patch applying as a `# == dsh-kingdee` layer in a real `0.1.7-rc.2` profile) and adapted for **Kingdee Cloud Starry Sky V9.1 Enterprise Edition** (backward-compatible with V9.0 / V8.x). **No live-tenant verification was performed.**

How to remove **dsh-kingdee** from a DSH profile.

## 1. Disable the plugin

Removing the bundle without losing your config is often the first step; the plugin disappears from the tool set and the settings page. There is no disable verb — flip the row's `enabled` flag to `false` in your profile's `cordis.patch.yml` (the shipped bundle patch sets it to `true`):

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: false
```

Stop and start the DSH process for the change to take effect.

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

Secrets are stored outside the plugin (environment variables, or the DSH credential store at `$DSH_HOME/.credentials.yaml` / the write-only fields in the settings UI). Remove them so no value is left behind:

```sh
unset DSH_KINGDEE_USER DSH_KINGDEE_PASSWORD DSH_KINGDEE_APP_SECRET
```

If you stored the values in the DSH credential store instead of the shell environment, remove the same reference names there — the store has no CLI verb, so delete the entries in the settings UI or edit `$DSH_HOME/.credentials.yaml`.

## 5. Restart

Stop and start the DSH process (relaunch the `dsh` app / your DSH host); there is no restart verb.

After the restart the `kingdee_*` tools are gone from the agent's tool set.

## What it leaves behind

- System-level logs and any cached session may still record past calls; remove those if your policy requires.
- The `kd-core` library is a separate export (`dsh-kingdee/kd-core`) — if you no longer use it, uninstall the package entirely with `dsh plugin remove`.

## Removing the source checkout

If you installed from a Git checkout, simply delete the repository directory (e.g. `dsh-kingdee/`). Removing the folder does not edit your DSH profile, so complete the steps above first.
