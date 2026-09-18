# WCAG 2.1 AA self-assessment report

**Website:** [drcriscalayan.com](https://drcriscalayan.com/)  
**Assessment date:** September 17, 2026  
**Prepared by:** Tanglao, Corp  
**Status:** In progress — not a certification or an unconditional conformance claim

## Current result

The complete local build and expanded automated suite passed **92 of 92 tests** on September 17, 2026. GitHub Actions independently ran the build and suite after commit `69836d8` and also passed **92 of 92** before deploying GitHub Pages. After deployment, the production-only accessibility suite passed **90 of 90 tests** against `https://drcriscalayan.com`. The two-test difference is the pair of build-artifact assertions included in the full build suite but not applicable to a remote production target.

Franz Tanglao separately reported successful VoiceOver use in Safari and Chrome and successful observation with the macOS Reduce Motion preference enabled. The human keyboard-only path, actual browser zoom/reflow, text-spacing presentation, and visual-state contrast checks remain open in the manual test matrix.

## Remediation summary

The assessment improved mobile-navigation announcements and keyboard behavior, contact-form structure and guidance, forced-colors focus visibility, and the custom 404 recovery experience. Details and retest status appear in `issue-log.md`.

## Limitations

- Automated tools detect only a subset of accessibility barriers.
- This is a self-assessment, not an independent review, certification, or guarantee that every user will encounter no barrier.
- Third-party services and destinations are excluded after navigation leaves the site.
- The contact-form test did not transmit personal information or submit to FormSubmit.
- The production run verifies the deployed pages and interactions, while the full 92-test CI run additionally verifies the generated build artifact.

## Completion gates

- [x] Local build succeeds.
- [x] Local expanded automated suite passes 92/92.
- [x] VoiceOver in Safari and Chrome reported successful.
- [x] macOS Reduce Motion observation reported successful.
- [x] GitHub Actions full suite passes 92/92 and deploys successfully.
- [x] Production-only suite passes 90/90 against the deployed site.
- [ ] Human keyboard, zoom/reflow, text-spacing, and visual-state checks are explicitly recorded.
- [ ] Client approves the factual project description and reference contact details.
