# Uninstall

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/UNINSTALL.zh.md)

How to remove **dsh-kingdee** from a DSH profile.

## 1. Disable the plugin

There is no disable verb. Set the row's `enabled` flag to `false` in your profile's `cordis.patch.yml` (the shipped bundle patch sets it to `true`), then restart DSH:

```yaml
- insert:
    - id: kingdee
      name: dsh-kingdee
      enabled: false
```

## 2. Remove the bundle

```sh
dsh plugin --profile web remove dsh-kingdee
```

This removes the installed npm package and its composition layer. `--profile <name>` must precede `remove`.

## 3. Remove your configuration

Connection settings live in the profile's `cordis.yml` or settings document. Delete the `kingdee` row inserted in step 1 and any `kingdee.*` config keys.

## 4. Remove the secrets

Secrets live outside the plugin: in environment variables, or in the DSH credential store at `$DSH_HOME/.credentials.yaml` / the write-only fields in the settings UI. Remove them:

```sh
unset DSH_KINGDEE_USER DSH_KINGDEE_PASSWORD DSH_KINGDEE_APP_SECRET
```

If the values are in the DSH credential store, delete the same reference names there. The store has no CLI verb; use the settings UI or edit `$DSH_HOME/.credentials.yaml`.

## 5. Restart

Stop and start the DSH process (relaunch the `dsh` app or your host). There is no restart verb. After the restart the `kingdee_*` tools are gone from the agent's tool set.

## What stays

System logs and any cached session may still record past calls; remove them if your policy requires it. If you installed from a Git checkout, delete the repository directory (e.g. `dsh-kingdee/`) after the steps above. Removing the folder does not edit your DSH profile.
