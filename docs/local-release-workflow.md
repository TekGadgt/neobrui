# Local release workflow

The canonical local release command is:

```sh
pnpm install --frozen-lockfile
pnpm build:fixtures
pnpm test
pnpm verify:size
pnpm release:local
```

`pnpm release:local` creates `dist/release/neobrui-0.1.0-alpha.0.tgz`, `SHA256SUMS`, `RELEASE_NOTES.md`, and `PROVENANCE.json`. The archive is deterministic (`tar` sorted names, epoch timestamps, numeric uid/gid) and contains CSS, DTCG interchange, README, and MIT license only. It is suitable for a later GitHub Release upload, but this workflow performs no GitHub, npm, registry, network, tag, or deployment operation.

The release package is private and has no `publishConfig`, registry setting, or credentials. `0.x` policy: patch releases correct output or documentation without intended API changes; minor releases may add or change pre-1.0 contracts. No release implies 1.0 stability or public support.

## CI-ready checks (local definition)

1. Frozen install and lockfile policy.
2. Token generation/schema and DTCG round-trip tests.
3. Fixture builds and Chromium/Firefox/WebKit Playwright projects.
4. Seeded QA rehearsal and deterministic size report.
5. Release archive twice; compare SHA-256, file manifest, and runtime graph.
6. Secret, private-path, remote, and publication guard checks.
7. Verify clean tree and owned preview-process teardown.

This is a local workflow definition, not remote CI and carries no CI badge.
