# Upgrade

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/UPDATE.zh.md)

How to move **dsh-kingdee** to a newer version. The current release is 0.22.0 on DSH baseline 0.2.3-alpha.2.

## Before you upgrade

1. Read the target version's [CHANGELOG.md](./CHANGELOG.md) entry; breaking changes are marked.
2. Back up connection settings in `cordis.yml` or the settings document. Secrets stay in the environment or credential store, outside plugin config.

## Upgrade steps

```sh
# Update the installed bundle (--profile comes before the subcommand)
dsh plugin --profile web update dsh-kingdee

# Or pin the exact version
dsh plugin --profile web add dsh-kingdee@0.22.0

# If you build the host half from source
pnpm install && pnpm run build
```

Restart DSH after updating: stop/start the process or relaunch the app; there is no restart verb.

## What changed in 0.22.0

This release updates dependencies, the Node.js requirement and documentation. Version 0.22.0 moves every `@deepseek-ai/dsh-*` devDependency to `0.2.3-alpha.2`; cordis moves to `4.2.0-alpha.1`, schemastery to `3.20.0-alpha.1`; the lockfile and supply-chain exemption are refreshed. Plugin API, configuration fields and normal tenant behavior are unchanged; configuration validation now raises typed `kd/invalid-config` errors. The manifest Node.js and peer ranges change: `engines.dsh` stays `>=0.1.7-alpha.2 <0.3.0`, and `engines.node` matches DSH 0.2.3 (`^24.22.3 || >=26.13.1`).

DSH 0.2.3 needs Node.js 24.22.3+ on 24.x, or 26.13.1+. A DSH 0.2.2 host on Node.js 24.9 can stay on 0.21.0; move to DSH 0.2.3 or meet the new Node floor before installing 0.22.0.

## Verify

Typecheck, build and 15 tests pass against DSH 0.2.3-alpha.2. No live profile boot or Kingdee tenant verification was performed.

## Rollback

```sh
dsh plugin --profile web add dsh-kingdee@0.21.0
```

Restart the host and re-run a query to verify the connection. Older releases are in [CHANGELOG.md](./CHANGELOG.md) / [CHANGELOG.zh.md](./CHANGELOG.zh.md).
