# Pre-GitHub checklist

This checklist is required before any separately authorized source push or GitHub Release. Phase 4 does not perform those operations.

- [ ] Ryan confirms repository visibility and MIT source posture.
- [ ] Scan current files and history for secrets, private links, personal data, and host/container paths.
- [ ] Confirm `neobrui` package metadata remains `private: true` with no `publishConfig` or registry credentials.
- [ ] Review README, release notes, support wording, and the pre-1.0 policy.
- [ ] Confirm generated provenance and archive checksum are reproducible from a clean tree.
- [ ] Configure and observe authorized CI for frozen install, generation, tests, full browser matrix, QA, size, and archive checks.
- [ ] Choose issue triage, security reporting, contact, and response policy.
- [ ] Re-run the full verification and clean-tree checks immediately before push.

Public source visibility, npm publication, compatibility, accessibility support, and response times are separate decisions. No public support claim is made by this artifact.
