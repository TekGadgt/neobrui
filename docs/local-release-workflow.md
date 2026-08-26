# Local release workflow

The canonical local release command is:

```sh
pnpm install --frozen-lockfile
pnpm build:fixtures
pnpm test
pnpm verify:size
pnpm release:local
```

Verify the generated archive from repository root:

```sh
(cd dist/release && sha256sum -c SHA256SUMS)
```

`pnpm release:local` creates `dist/release/neobrui-0.1.0-alpha.0.tgz`, `SHA256SUMS`, `RELEASE_NOTES.md`, and `PROVENANCE.json`. Archive creation uses the pinned in-repository `tar@7.5.22` package, not a system `tar`, so the same Node/pnpm command works on macOS (BSD tools) and Linux without GNU tar or Homebrew `gtar`. Members are explicitly sorted, prefixed with `package/` for package-manager installation, use epoch timestamps, portable gzip headers, normalized modes, and omit host uid/gid/name metadata. The archive contains CSS, DTCG interchange, README, and MIT license only. It is suitable for a later GitHub Release upload, but this workflow performs no GitHub, npm, registry, network, tag, or deployment operation.

The release and size archive generators never invoke `tar` to create archives. System `tar -tzf`/`-xOf` commands in validation are read-only and use flags supported by both BSD and GNU tar. `gzip -9 -n -c` remains the size-report diagnostic formula; the archive gzip stream is produced by `tar@7.5.22` with portable headers. The root Linux `node_modules` and pnpm store are container-only installation state; do not copy them to macOS.

The checksum command is intentionally run from the repository root: the subshell changes into `dist/release`, where the manifest's archive filename is relative to the manifest itself.

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
