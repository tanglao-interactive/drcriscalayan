# Manual accessibility test matrix

**Test date:** September 17, 2026  
**Tester:** Franz Tanglao  
**Environment:** macOS 26.6.2; Safari 26.6.2; Chrome 153.0.8010.50  
**Status legend:** Pass = human reported no observed failure; Pending = not yet explicitly confirmed

| Check | Result | Evidence or note |
|---|---|---|
| VoiceOver in Safari | Pass | Franz reported that the representative site flows work on September 17, 2026. |
| VoiceOver in Chrome | Pass | Franz reported that the representative site flows work on September 17, 2026. |
| macOS Reduce Motion | Pass | Franz enabled the operating-system preference and reported that the site works on September 17, 2026. |
| Keyboard-only path | Pending | VoiceOver success does not by itself verify a complete Tab/Shift-Tab/Enter/Space/Escape path. |
| Visible focus and focus order | Pending | Automated focus assertions pass; final human visual confirmation remains open. |
| 200% browser zoom | Pending | Automated 200%-equivalent layout checks pass; actual browser zoom needs explicit human confirmation. |
| 400% reflow / 320 CSS pixels | Pending | Automated 320 CSS-pixel reflow checks pass; human observation remains open. |
| WCAG text spacing | Pending | Automated overrides pass; human observation remains open. |
| Hover, focus, selected, and error-state contrast | Pending | axe and forced-colors checks pass; final human visual review remains open. |
| Contact form | Partial | Labels, native required-field validation, and the success state pass automation without submitting data; a real third-party submission was intentionally excluded. |
| Custom 404 and recovery | Pass | Automated checks verify the error heading, explanatory content, and working home-page recovery link. VoiceOver was reported working after the error-page improvement. |

## Human completion procedure

For each pending visual or keyboard check, test the home page, mobile menu, contact form, and 404 page. Record the date and either “Pass — no observed failure” or the exact barrier. A screenshot is useful supporting evidence but is not a substitute for operating the interface.

