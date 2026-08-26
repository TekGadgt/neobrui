# GitHub Pages workflow

This repository contains two reviewed workflows. `CI` runs for pull requests and pushes to `main`; it performs the frozen root install, deterministic release/checksum validation, docs preparation, Astro check, root and Pages builds, static output checks, contract tests, and the complete Chromium/Firefox/WebKit Playwright matrix. `Deploy docs to GitHub Pages` runs only after a push to `main` (or an explicit manual dispatch) and deploys the artifact produced by `verify` only after both `verify` and the Pages workflow's complete browser gate succeed.

## Pages deployment gate

The Pages workflow has one required `browsers` matrix with exactly Chromium, Firefox, and WebKit. Each matrix entry installs the matching official Playwright browser, builds the docs with `PUBLIC_SITE_BASE=/neobrui/`, then runs both the root project's browser tests and the docs project's browser tests for that same engine. Matrix failures and cancellations prevent `deploy` because GitHub's matrix job result is required alongside `verify`; `fail-fast: false` lets all engines report their result. Matrix entries run on isolated GitHub-hosted runners, while local rehearsals should run one engine at a time because the declared preview servers use fixed ports.

`verify` remains the sole Pages artifact producer: it runs the release/checksum, docs preparation, checks, builds, static validation, contract tests, and `actions/upload-pages-artifact`. `deploy` only invokes `actions/deploy-pages` and does not check out source, install dependencies, build, configure Pages, or upload another artifact. The browser and verify jobs have `contents: read`; only deploy adds `pages: write` and `id-token: write`. Each browser job performs a fresh frozen root install and browser download, so the first run is expected to spend several minutes on dependency and browser setup; later runs can benefit from the setup-node pnpm cache, but browser setup remains an explicit gate.

## First authorized push

1. Confirm the feature branch is reviewed and the local tree is clean.
2. Push `feat/github-pages-ci` to `TekGadgt/neobrui` and open a pull request to `main`.
3. Wait for the CI checks to pass in all three browser jobs, then merge using the repository's normal review process.
4. In **Settings → Pages**, set **Source** to **GitHub Actions**.
5. Observe the first Pages workflow end-to-end: `verify`, each browser matrix entry, then `deploy`.
6. Confirm the Pages workflow completes and open `https://tekgadgt.github.io/neobrui/`.

The build uses Node 26, pnpm 11.24.0, `PUBLIC_SITE_BASE=/neobrui/`, and `PUBLIC_SITE_URL=https://tekgadgt.github.io/neobrui/`. Actions are official GitHub/Astro ecosystem actions, pinned to maintained major versions: checkout v7, setup-node v7, pnpm/action-setup v4, configure-pages v6, upload-pages-artifact v5, and deploy-pages v5. Major pins receive compatible upstream fixes while avoiding floating action revisions; review and tighten to commit SHAs if the repository's supply-chain policy later requires it.

The CI job has `contents: read`. The deployment job narrows permissions to `contents: read`, `pages: write`, and `id-token: write`, uses the `github-pages` environment, and needs no npm token or long-lived secret. Concurrency cancels superseded runs.

## Rollback and disable

To roll back, redeploy the last known-good `main` commit; do not rewrite history or publish an npm package. To disable deployment, temporarily disable the Pages workflow and change the Pages source away from GitHub Actions only as an explicit operator decision. After the first green deployment, protect `main`, require the CI status checks before merge, and keep deployment restricted to `main`.
