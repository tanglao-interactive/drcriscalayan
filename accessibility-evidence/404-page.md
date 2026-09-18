# Custom 404 accessibility evidence

Date: 2026-09-17

## Issue

GitHub Pages did not have a project-specific error document, so unknown URLs could not present the site's navigation, content structure, or a clearly named recovery link. The Pages API reported `custom_404: false`, and the repository did not contain a root-level `docs/404.html` build artifact.

## Remediation

- Added a semantic `404.html` source template using the site's existing header, footer, typography, colors, skip link, focus treatment, and responsive components.
- Added a descriptive title, one visible H1, concise explanatory text, a main landmark at `#main-content`, and a “Return to the homepage” link.
- Configured webpack to generate `docs/404.html` at the root of the GitHub Pages artifact.
- Added a development-server fallback so automated tests exercise a genuinely unknown path without an automatic redirect.
- Added a GitHub Actions Pages workflow that builds and tests the site before uploading `docs/` and deploying it.
- Added desktop and mobile Playwright coverage for semantics, keyboard skip-link behavior, the recovery link, 320 CSS-pixel reflow, text-spacing overrides, reduced motion, and axe-core WCAG 2.1 A/AA rules.

## Automated retest results

Command: `npm test`

Result: 22 tests passed in desktop Chromium and mobile Chromium emulation. The tests verified:

- `/accessibility-test-404` displays the custom error view without redirecting.
- The title is `Page Not Found | Cris Calayan`.
- The page has one H1 named “Page not found,” a main landmark, explanatory text, and a clearly named homepage link.
- The homepage link navigates successfully.
- The skip link is first in the keyboard sequence and moves focus to the main landmark.
- No horizontal overflow occurs at a 320 CSS-pixel viewport or with WCAG text-spacing overrides.
- Reduced-motion preferences reduce transition duration.
- axe-core reports no automatically detectable WCAG 2.1 A/AA violations.
- The production build contains root-level `docs/404.html` with the required content.

A separate browser inspection confirmed meaningful rendered content, the expected accessibility tree, no browser console warnings or errors, no framework error overlay, and successful return-home navigation.

## Manual VoiceOver procedure

Run this procedure after deployment in both Safari and Chrome on macOS:

1. Turn on VoiceOver with Command-F5.
2. Open `https://drcriscalayan.com/accessibility-test-404`.
3. Confirm VoiceOver announces the page title and that the rotor lists one H1, “Page not found.”
4. Navigate by landmarks and confirm the primary navigation, main content, and footer are distinguishable.
5. Use Tab to focus “Skip to main content,” activate it, and confirm focus moves to the main content.
6. Navigate to “Return to the homepage,” confirm its name and role are announced, and activate it.
7. Confirm the homepage loads and focus/navigation remain usable.
8. Repeat at 200% browser zoom and at the narrowest practical window width; confirm text is readable and no two-dimensional scrolling is required for the error content.

## Limitations

- Automated checks cannot establish accessibility conformance, certification, usability with every assistive technology, or the absence of all accessibility barriers.
- VoiceOver was not automated. The procedure above requires a human retest in Safari and Chrome.
- The live nonexistent URL was not retested because this change has not been committed, pushed, or deployed.
- At the time of implementation, GitHub Pages was still configured for the legacy `main:/docs` source. The repository now contains an Actions deployment workflow, but Pages must be switched to “GitHub Actions” when deployment is authorized.
