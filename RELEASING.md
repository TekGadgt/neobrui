# Releasing Neobrui (readiness only)

This document records the Phase 3 boundary; it does not authorize or execute a release.

- The development manifest is intentionally `private: true`. A separately authorized release PR must remove that guard only after native macOS rehearsal, local ARM64 confirmation, exact tarball review, and all required checks.
- The approved future identity is `@tekgadgt/neobrui`, candidate version `0.1.0-alpha.0`, and intended npm dist-tag `next`. The future tag must be exactly `v0.1.0-alpha.0` and match the manifest version.
- The package is CSS-only and supports personal-use prerelease adoption; it has no runtime JavaScript or dependencies. It is not currently available from the npm registry.
- Future bootstrap is a single local interactive 2FA setup using explicit public access, followed by direct trusted publishing through OIDC. Do not add long-lived npm tokens or credentials.
- A human-published GitHub Release is the future approval gate. No tag, release, staging, publish, workflow trigger, or deployment is performed by this preparation.

The `private` guard and workflow permissions are safety controls, not release bypasses. Keep `publishConfig.access: public` and the npm registry explicit in any future release review.
