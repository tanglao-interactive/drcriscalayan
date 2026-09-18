# Accessibility issue log

| ID | Finding | Remediation | Retest status |
|---|---|---|---|
| DRCRIS-A11Y-001 | Mobile navigation did not expose a changing open/close name or explicitly restore focus after Escape. | Added Bootstrap Collapse state handling, descriptive toggle labels, Escape support, menu closure, and focus restoration. | Closed; full CI and deployed production suites passed September 17, 2026. |
| DRCRIS-A11Y-002 | Contact-form heading hierarchy and required-field guidance could be clearer programmatically. | Promoted “Contact Form” to an H2 and associated the required-fields note with the form. | Closed; axe, heading, label, and validation tests passed in CI and production September 17, 2026. |
| DRCRIS-A11Y-003 | Forced-colors mode did not have an explicit focus outline independent of the normal visual treatment. | Added a `forced-colors: active` focus-visible outline using the system Highlight color. | Closed; forced-colors focus tests passed in CI and production September 17, 2026. |
| DRCRIS-A11Y-004 | Unknown URLs previously lacked a project-specific, understandable recovery page. | Added a semantic custom 404 page with an error heading, site landmarks, skip link, and home-page recovery link. | Closed on production in the earlier 22-test suite; covered again by the expanded local suite. |

No known automated WCAG 2.1 A/AA violation remains in the declared test scope. The full GitHub Actions run passed 92/92, deployment succeeded, and the production-only run passed 90/90. The pending human checks in `manual-test-matrix.md` remain before the assessment is closed.
