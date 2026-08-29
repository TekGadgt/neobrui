# GitHub Pages workflow

This repository contains two reviewed workflows. `CI` runs for pull requests and pushes to `main`; it performs the frozen root install, deterministic release/checksum validation, docs preparation, Astro check, root and Pages builds, static output checks, contract tests, and the complete docs-local Chromium/Firefox/WebKit Playwright matrix. `Deploy docs to GitHub Pages` runs only after a push to `main` (or an explicit manual dispatch) and deploys the artifact produced by `build` only after both `build` and its isolated Pages browser matrix succeed.

## Browser verification boundary

All supported browser verification lives in `apps/docs/`: its Playwright config starts the selected docs build, serves that artifact locally, and runs the docs routes, search, and accessibility checks. There is no supported root fixture suite, root Playwright config, QA rehearsal, or production-fixture server.

The CI workflow tests both site variants (`root` and `pages`) across exactly Chromium, Firefox, and WebKit. Each matrix entry installs dependencies and its matching official Playwright browser, builds the current Starlight artifact for its variant, then runs the docs-local selected engine. The Pages workflow applies the same isolated build-before-browser gate to its three-engine Pages matrix before deployment. Matrix failures and cancellations prevent deployment; `fail-fast: false` lets all engines report their result. Local rehearsals should run one engine at a time because the declared preview servers use fixed ports.

`build` remains the sole Pages artifact producer: it runs the release/checksum, docs preparation, checks, Pages build, and uploads `apps/docs/dist`. `deploy` only invokes `actions/deploy-pages` and does not check out source, install dependencies, build, configure Pages, or upload another artifact. Browser and build jobs have `contents: read`; only deploy adds `pages: write` and `id-token: write`.

## First authorized push

1. Confirm the feature branch is reviewed and the local tree is clean.
2. Push the reviewed branch to `TekGadgt/neobrui` and open a pull request to `main`.
3. Wait for the CI checks to pass in all six root/Pages browser variants, then merge using the repository's normal review process.
4. In **Settings → Pages**, set **Source** to **GitHub Actions**.
5. Observe the first Pages workflow end-to-end: `build`, each browser matrix entry, then `deploy`.
6. Confirm the Pages workflow completes and open `https://tekgadgt.github.io/neobrui/`.

The build uses Node 26, pnpm 11.24.0, `PUBLIC_SITE_BASE=/neobrui/`, and `PUBLIC_SITE_URL=https://tekgadgt.github.io/neobrui/` for Pages. Actions are official GitHub/Astro ecosystem actions, pinned to maintained major versions. No npm token or long-lived secret is required.

## Rollback and disable

To roll back, redeploy the last known-good `main` commit; do not rewrite history or publish an npm package. To disable deployment, temporarily disable the Pages workflow and change the Pages source away from GitHub Actions only as an explicit operator decision. After the first green deployment, protect `main`, require the CI status checks before merge, and keep deployment restricted to `main`.
