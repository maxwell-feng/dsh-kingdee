# Upgrade

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/UPDATE.zh.md)

How to move **dsh-kingdee** to a newer version. The current release is 0.22.0 on DSH baseline 0.2.3-alpha.2.

## Before you upgrade

1. Read the [CHANGELOG.md](./CHANGELOG.md) entry for the target version. Breaking changes are marked there.
2. Back up the connection settings in your profile's `cordis.yml` or settings document. Secrets stay in the environment or credential store and are not part of the plugin config.

## Upgrade steps

```sh
# Update the installed bundle (--profile comes before the subcommand)
dsh plugin --profile web update dsh-kingdee

# Or pin the exact version
dsh plugin --profile web add dsh-kingdee@0.22.0

# If you build the host half from source
pnpm install && pnpm run build
```

Restart the DSH host after the update: stop and start the DSH process or relaunch the app. There is no restart verb.

## What changed in 0.22.0

This is a dependency, Node.js-requirement and documentation release. The version moves to 0.22.0; every `@deepseek-ai/dsh-*` devDependency moves to `0.2.3-alpha.2`; cordis moves to `4.2.0-alpha.1` and schemastery to `3.20.0-alpha.1`; the lockfile and workspace supply-chain exemption are refreshed. There is no plugin API or plugin configuration-field change, and normal tenant behavior is unchanged; configuration validation now raises typed `kd/invalid-config` errors. The manifest Node.js and peer ranges do change. `engines.dsh` stays `>=0.1.7-alpha.2 <0.3.0`. The Node.js floor now matches DSH 0.2.3: `^24.22.3 || >=26.13.1`.

DSH 0.2.3 requires Node.js 24.22.3 or newer in the 24.x line, or Node.js 26.13.1 or newer. A 0.2.2 host on Node.js 24.9 can stay on 0.21.0; install 0.22.0 after moving to DSH 0.2.3 or to a host that meets the new Node floor.

## Verify

`pnpm typecheck` is clean, `pnpm build` is clean, and `pnpm test` passes 15 tests against DSH 0.2.3-alpha.2. No live profile boot and no live Kingdee tenant verification were performed.

## Rollback

```sh
dsh plugin --profile web add dsh-kingdee@0.21.0
```

Restart the host and re-run a query to verify the connection.

Release history for older versions is in [CHANGELOG.md](./CHANGELOG.md) / [CHANGELOG.zh.md](./CHANGELOG.zh.md).
