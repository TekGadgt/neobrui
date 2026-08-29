# Releasing Neobrui (readiness only)

This document records the Phase 5 release-candidate boundary. It does not authorize or execute a release.

## Phase 5: publishable release candidate

The candidate is `@tekgadgt/neobrui@0.1.0-alpha.0` for the npm `next` channel and intended Git tag `v0.1.0-alpha.0`. Its manifest is publishable (`private` is absent) and explicitly targets the public npm registry with `publishConfig.access: public` and `publishConfig.tag: next`. Publication, tagging, GitHub Release creation, authentication, staging, deployment, and workflow triggering remain separate human-approved actions.

The payload remains exactly the authored CSS, README/LICENSE, and `skills/neobrui/**`: no runtime JavaScript, assets, dependencies, or internal documentation.

## Exact final no-publish rehearsal

Run from the repository root with Node 26.x, npm 12.0.2, and pnpm 11.24.0:

```sh
npm --version  # must print 12.0.2
pnpm --version # must print 11.24.0
node tools/release-rehearsal.mjs --tag v0.1.0-alpha.0 --out .release-rehearsal
node tools/release-rehearsal.mjs --tag v0.1.0-alpha.0 --out .release-rehearsal-output
node tools/compare-release-rehearsal.mjs .release-rehearsal/report.json .release-rehearsal-output/report.json
```

The rehearsal performs real `npm pack`, strict npm 11/npm 12 pack-result parsing, exact 12-file allowlist validation, SHA-256/SHA-512 SRI recording, and a fresh offline `--ignore-scripts` consumer install. It verifies the installed manifest is publishable with the exact `next` tag, and checks every CSS export and AI skill file. It writes only output artifacts and removes its temporary consumer; it never publishes, authenticates, tags, pushes, creates a release, deploys, reads credentials, or triggers a workflow.

Reports use schema v2 and encode `private: null` plus `publishable: true` deterministically. Cross-platform comparison permits only runner platform, architecture, uname, and timestamp to differ; tool versions, metadata, payload, archive, and consumer semantics must match exactly. The archive checksum, SRI, and size are expected to change from Phase 4 because `package.json` changed.

The GitHub rehearsal workflow remains a read-only `pull_request`/manual `workflow_dispatch` matrix on SHA-pinned Ubuntu and `macos-15`, with artifact comparison on Ubuntu. `macos-15` is not proof of ARM64; a trusted local Darwin ARM64 rehearsal is required before any tag or bootstrap.

## Manual preflight and approval boundary

Before bootstrap, a human may perform this read-only registry preflight (expected current result: HTTP 404; do not make automated tests depend on this mutable fact):

```sh
npm view @tekgadgt/neobrui@0.1.0-alpha.0 version --registry=https://registry.npmjs.org/
```

After all remote matrix checks and trusted ARM64 evidence are reviewed, a human must explicitly approve both the exact Git tag and the initial interactive 2FA bootstrap. Future bootstrap must pass `--access public --tag next`; no token, OIDC credential, environment secret, write permission, reservation, or publish command belongs in this preparation.

## Previous readiness phases

Phase 4 established the private no-publish rehearsal. Phase 5 converts the approved candidate manifest to the publishable contract while retaining the no-publish boundary. The source remains usable through reviewed Git refs and local/workspace dependencies until publication is deliberately completed.
