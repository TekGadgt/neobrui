# GitHub Pages workflow

This repository contains two reviewed workflows. `CI` runs for pull requests and pushes to `main`; it performs the frozen install, deterministic release/checksum validation, docs preparation, Astro check, static and package contracts, and the complete docs-local Chromium/Firefox/WebKit Playwright matrix against the production Pages configuration. `Deploy docs to GitHub Pages` runs only after a push to `main` (or an explicit manual dispatch) and deploys the artifact produced by `build` only after both `build` and its isolated Pages browser matrix succeed.

## Browser verification boundary

All supported browser verification lives in `apps/docs/`: its Playwright config starts the selected docs build, serves that artifact locally, and runs the docs routes, search, and accessibility checks. There is no supported root fixture suite, root Playwright config, QA rehearsal, or production-fixture server.

The CI workflow tests exactly three production-mode jobs: Chromium, Firefox, and WebKit against `https://tekgadgt.github.io/neobrui/`, with `PUBLIC_SITE_BASE=/neobrui/`. Each isolated job installs dependencies and its matching official Playwright browser, builds the Pages artifact, then runs the docs-local selected engine with the same base and canonical URL. The Pages workflow retains its separate three-engine build-before-browser gate before deployment. Matrix failures and cancellations prevent deployment; `fail-fast: false` lets all engines report their result. Local rehearsals should run one engine at a time because the declared preview servers use fixed ports.

The optional `build:root` and `preview:root` scripts remain available for local or future custom-domain verification. Root mode is not a required pull-request gate.

`build` remains the sole Pages artifact producer: it runs the release/checksum, docs preparation, checks, Pages build, and uploads `apps/docs/dist`. `deploy` only invokes `actions/deploy-pages` and does not check out source, install dependencies, build, configure Pages, or upload another artifact. Browser and build jobs have `contents: read`; only deploy adds `pages: write` and `id-token: write`.

## First authorized push

1. Confirm the feature branch is reviewed and the local tree is clean.
2. Push the reviewed branch to `TekGadgt/neobrui` and open a pull request to `main`.
3. Wait for the CI checks to pass in all three Pages browser jobs, then merge using the repository's normal review process.
4. In **Settings → Pages**, set **Source** to **GitHub Actions**.
5. Observe the first Pages workflow end-to-end: `build`, each browser matrix entry, then `deploy`.
6. Confirm the Pages workflow completes and open `https://tekgadgt.github.io/neobrui/`.

The build uses Node 26, pnpm 11.24.0, `PUBLIC_SITE_BASE=/neobrui/`, and `PUBLIC_SITE_URL=https://tekgadgt.github.io/neobrui/` for Pages. Actions are official GitHub/Astro ecosystem actions, pinned to maintained major versions. No npm token or long-lived secret is required.

## Rollback and disable

To roll back, redeploy the last known-good `main` commit; do not rewrite history or publish an npm package. To disable deployment, temporarily disable the Pages workflow and change the Pages source away from GitHub Actions only as an explicit operator decision. After the first green deployment, protect `main`, require the CI status checks before merge, and keep deployment restricted to `main`.
