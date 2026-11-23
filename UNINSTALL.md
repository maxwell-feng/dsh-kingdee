# Uninstall

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/UNINSTALL.zh.md)

How to remove **dsh-kingdee** from a DSH profile.

## 1. Remove the bundle

```sh
dsh plugin --profile web remove dsh-kingdee
```

This removes the installed npm package and its composition layer, so the `kingdee_*` tools stop being registered. `--profile <name>` must precede `remove`. The command also removes the bundle from `dsh.profile.bundles`; you do not need a separate disable step.

## 2. Remove your configuration

Connection settings live in the profile's `cordis.yml` or in a `kingdee` override in `cordis.patch.yml`. Delete that row and any `kingdee.*` config keys. A row that only set `enabled: false` can be deleted outright.

## 3. Remove the secrets

Secrets live outside the plugin: in environment variables, or under `refs:` in the DSH credential store at `$DSH_HOME/.credentials.yaml`. Remove them:

```sh
# Linux / macOS
unset DSH_KINGDEE_USER DSH_KINGDEE_PASSWORD DSH_KINGDEE_APP_SECRET
```

```powershell
# Windows PowerShell
Remove-Item Env:\DSH_KINGDEE_USER -ErrorAction SilentlyContinue
Remove-Item Env:\DSH_KINGDEE_PASSWORD -ErrorAction SilentlyContinue
Remove-Item Env:\DSH_KINGDEE_APP_SECRET -ErrorAction SilentlyContinue
```

```bat
REM Windows Command Prompt
set DSH_KINGDEE_USER=
set DSH_KINGDEE_PASSWORD=
set DSH_KINGDEE_APP_SECRET=
```

If the values are in the DSH credential store, delete the same reference names from `$DSH_HOME/.credentials.yaml`. The store has no CLI verb.

## 4. Restart

Stop and start the DSH process (relaunch the `dsh` app or your host). There is no restart verb. After the restart the `kingdee_*` tools are gone from the agent's tool set.

## What stays

System logs and any cached session may still record past calls; remove them if your policy requires it. If you installed from a Git checkout, delete the repository directory (e.g. `dsh-kingdee/`) after the steps above. Removing the folder does not edit your DSH profile.
