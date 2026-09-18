# Accessibility assessment scope and method

**Assessment date:** September 17, 2026  
**Target:** [drcriscalayan.com](https://drcriscalayan.com/)  
**Standard:** WCAG 2.1 Levels A and AA  
**Assessment type:** Tanglao, Corp self-assessment; not an independent certification

## Declared scope

The assessment covers the site's first-party pages and representative states:

- Home (`/`)
- About (`/about/`)
- Unbroken (`/unbroken/`)
- Services (`/services/`)
- Contact (`/contact-us/`), including native validation and the displayed success state without sending a form
- Custom error page (`/accessibility-test-404`), including recovery to the home page
- Shared navigation, mobile menu, skip link, footer, images, headings, landmarks, links, and focus treatment

External destinations are excluded after the user leaves the site. FormSubmit, Google Analytics, Amazon, LinkedIn, Facebook, GitHub Pages, and the user's browser or assistive technology remain third-party dependencies.

## Test methods

- Playwright tests in desktop Chromium and mobile Chromium emulation
- `@axe-core/playwright` scans using WCAG 2.1 A/AA tags
- Automated checks for keyboard reachability, visible focus, mobile-menu state and Escape behavior, skip-link operation, page titles, language, headings, landmarks, image alternatives, current-page navigation, form labels and native errors, success status, 320 CSS-pixel reflow, 200%-zoom equivalent layout, WCAG text spacing, reduced motion, forced colors, and 404 recovery
- Human VoiceOver review in Safari and Chrome, reported by Franz Tanglao
- Human observation with macOS Reduce Motion enabled, reported by Franz Tanglao

Automated testing cannot prove full WCAG conformance. Human keyboard-only operation and visual review of hover, focus, selected, and error-state contrast remain separate completion gates unless explicitly recorded as passed in the manual matrix.

