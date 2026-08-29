# Releasing Neobrui (readiness only)

This document records the Phase 3 boundary and the Phase 4 no-publish rehearsal; neither authorizes nor executes a release.

## Phase 4: no-publish release rehearsal

The rehearsal validates the exact package payload and installs its local tarball into a fresh offline consumer. It writes only a tarball and stable JSON report to the output directory, then removes the temporary consumer. It never publishes, stages, tags, creates/uploads a GitHub Release, pushes, authenticates to npm, reserves or mutates a registry package, deploys, triggers another workflow, or reads secrets/environments.

Run locally from the repository root (Node 26.x, npm 12.0.2, and pnpm 11.24.0 are required; the tool fails before creating output if these versions differ):

```sh
npm --version  # must print 12.0.2
pnpm --version # must print 11.24.0
node tools/release-rehearsal.mjs --tag v0.1.0-alpha.0 --out .release-rehearsal
```

The rehearsal does not change the installed toolchain. On a machine with another npm version, use an isolated temporary npm 12.0.2 executable (for example, `npx --yes --package=npm@12.0.2 npm --version` for a preflight) or install npm 12.0.2 in a user-managed, non-global prefix before rerunning the checks; do not alter the repository lockfile or add npm as a project dependency.

The command checks the private manifest guard, exact version/tag, `next` prerelease classification, 12-file allowlist, checksums (SHA-256 and SHA-512 SRI), readable CSS and skill payload, and offline consumer installation. `report.json` contains semantic fields (schema, source SHA, expected tag/channel, package metadata, file sizes/modes, archive filename/size/digests, and consumer assertions) plus runner/tool facts. Cross-platform comparison recursively canonicalizes every object and preserves array order; it excludes only these documented informational paths: `runner.platform`, `runner.arch`, `runner.uname`, and `runner.timestamp`. Tool versions and every other field must match exactly. Mismatches report their JSON path.

GitHub’s `.github/workflows/release-rehearsal.yml` repeats the read-only rehearsal on `ubuntu-latest` and `macos-15`, uploads each tarball/report as CI artifacts, and compares them on Ubuntu. The comparison requires byte-identical archive SHA-256/SRI and identical semantic payload/report fields; it does not normalize differences or create release artifacts. The action references are pinned to reviewed SHAs: checkout v7 `3d3c42e5aac5ba805825da76410c181273ba90b1`, setup-node v7 `820762786026740c76f36085b0efc47a31fe5020`, pnpm/action-setup v4 `f40ffcd9367d9f12939873eb1018b921a783ffaa`, upload-artifact v4 `ea165f8d65b6e75b540449e92b4886f43607fa02`, and download-artifact v4 `d3f86a106a0bac45b974a628896c90dbdf5c8093`.

`macos-15` proves native macOS, not a particular CPU architecture. Read `process.arch` in the report: if it is not ARM64, Ryan must later run the same command on a trusted local ARM64 Mac before the first tag. That local command produces only a tarball/report and cannot publish.

## Earlier readiness boundary

- The development manifest is intentionally `private: true`. A separately authorized release PR must remove that guard only after native macOS rehearsal, local ARM64 confirmation, exact tarball review, and all required checks.
- The approved future identity is `@tekgadgt/neobrui`, candidate version `0.1.0-alpha.0`, and intended npm dist-tag `next`. The future tag must be exactly `v0.1.0-alpha.0` and match the manifest version.
- The package is CSS-only and supports personal-use prerelease adoption; it has no runtime JavaScript or dependencies. It is not currently available from the npm registry.
- Future bootstrap and OIDC publishing belong to later, separately approved phases. Do not add long-lived npm tokens or credentials.
- A human-published GitHub Release is the future approval gate. No tag, release, staging, publish, workflow trigger, or deployment is performed by this preparation.

The `private` guard and workflow permissions are safety controls, not release bypasses. Keep `publishConfig.access: public` and the npm registry explicit in any future release review.
