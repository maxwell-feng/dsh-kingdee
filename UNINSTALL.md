# Uninstall

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/UNINSTALL.zh.md)

How to remove **dsh-kingdee** from a DSH profile.

## 1. Remove the bundle

```sh
dsh plugin --profile web remove dsh-kingdee
```

This removes the npm package and its composition layer, unregistering the `kingdee_*` tools. `--profile <name>` must precede `remove`. It also removes the bundle from `dsh.profile.bundles`; no separate disable step is needed.

## 2. Remove your configuration

Connection settings live in `cordis.yml` or a `kingdee` override in `cordis.patch.yml`; delete that row and any `kingdee.*` keys. A row that only set `enabled: false` can be deleted.

## 3. Remove the secrets

Secrets live outside the plugin: in environment variables, or under `refs:` in `$DSH_HOME/.credentials.yaml`. Remove them:

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

If the values are in the DSH credential store, delete the same reference names from `$DSH_HOME/.credentials.yaml`; it has no CLI verb.

## 4. Restart

Stop and start the DSH process (relaunch the app or host); there is no restart verb. After the restart the `kingdee_*` tools are gone.

## What stays

Logs and cached sessions may still record past calls; remove them if policy requires. For a Git checkout, delete the repository directory (e.g. `dsh-kingdee/`) afterwards; this does not edit the DSH profile.
