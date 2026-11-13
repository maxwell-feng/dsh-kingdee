# Upgrade

English | [Chinese](https://github.com/maxwell-feng/dsh-kingdee/blob/main/UPDATE.zh.md)

How to move **dsh-kingdee** to a newer version. The current release is 0.20.0 on DSH baseline 0.2.2-rc.3.

## Before you upgrade

1. Read the [CHANGELOG.md](./CHANGELOG.md) entry for the target version. Breaking changes are marked there.
2. Back up the connection settings in your profile's `cordis.yml` or settings document. Secrets stay in the environment or credential store and are not part of the plugin config.

## Upgrade steps

```sh
# Update the installed bundle (--profile comes before the subcommand)
dsh plugin --profile web update dsh-kingdee

# Or pin the exact version
dsh plugin --profile web add dsh-kingdee@0.20.0

# If you build the host half from source
pnpm install && pnpm run build
```

Restart the DSH host after the update: stop and start the DSH process or relaunch the app. There is no restart verb.

## What changed in 0.20.0

This is a dependency-only release. The version moves to 0.20.0, every `@deepseek-ai/dsh-*` devDependency moves from `0.2.2-rc.2` to `0.2.2-rc.3`, and the lockfile and workspace supply-chain exemption are refreshed. There is no API, configuration or behavior change; DSH 0.2.2-rc.3 has no plugin-facing breaking changes. `engines.dsh` stays `>=0.1.7-alpha.2 <0.3.0`, so the upgrade is optional.

DSH 0.2.2 hosts require Node.js 24.9 or newer. This package's own `engines.node` stays `>=22`.

## Verify

`pnpm typecheck` is clean, `pnpm build` is clean, and `pnpm test` passes 15 tests against DSH 0.2.2-rc.3. No live profile boot and no live Kingdee tenant verification were performed.

## Rollback

```sh
dsh plugin --profile web add dsh-kingdee@<previous-version>
```

Restart the host and re-run a query to verify the connection.

Release history for older versions is in [CHANGELOG.md](./CHANGELOG.md) / [CHANGELOG.zh.md](./CHANGELOG.zh.md).
