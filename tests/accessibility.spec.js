import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const errorRoute = "/accessibility-test-404";
const routes = ["/", "/about/", "/unbroken/", "/services/", "/contact-us/", errorRoute];
const firstPartyInteractive = "a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),textarea:not([disabled]),select:not([disabled])";
const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
  reflow: { width: 320, height: 800 },
};

async function gotoRoute(page, route) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toBeVisible();
}

async function expectNoWcag21Violations(page, label) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => node.target.join(" ")),
  }));
  expect(summary, `${label} has WCAG 2.1 A/AA violations`).toEqual([]);
}

async function expectNoPageOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document, `${label} document overflows horizontally`).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body, `${label} body overflows horizontally`).toBeLessThanOrEqual(dimensions.viewport + 1);
}

for (const [viewportName, viewport] of Object.entries({ desktop: viewports.desktop, mobile: viewports.mobile })) {
  test.describe(`${viewportName} axe scans`, () => {
    test.use({ viewport });
    for (const route of routes) {
      test(`${route} passes WCAG 2.1 A/AA axe checks`, async ({ page }) => {
        await gotoRoute(page, route);
        await expectNoWcag21Violations(page, `${viewportName} ${route}`);
      });
    }
  });
}

test.describe("320 CSS pixel reflow", () => {
  test.use({ viewport: viewports.reflow });
  for (const route of routes) {
    test(`${route} has no page-level horizontal scrolling or lost regions`, async ({ page }) => {
      await gotoRoute(page, route);
      await expectNoPageOverflow(page, `320px ${route}`);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("footer")).toBeVisible();
    });
  }
});

test.describe("200 percent zoom equivalent", () => {
  test.use({ viewport: { width: 720, height: 450 } });
  for (const route of routes) {
    test(`${route} retains content and avoids page-level horizontal scrolling`, async ({ page }) => {
      await gotoRoute(page, route);
      await expectNoPageOverflow(page, `200% zoom equivalent ${route}`);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    });
  }
});

test.describe("WCAG text spacing", () => {
  test.use({ viewport: viewports.mobile });
  for (const route of routes) {
    test(`${route} tolerates text-spacing overrides`, async ({ page }) => {
      await gotoRoute(page, route);
      await page.addStyleTag({
        content: "*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}",
      });
      await expectNoPageOverflow(page, `text spacing ${route}`);
      const clippedText = await page.locator("h1,h2,h3,p,a,button,label,input,textarea").evaluateAll((elements) =>
        elements
          .filter((element) => {
            const style = getComputedStyle(element);
            if (style.display === "none" || style.visibility === "hidden" || element.closest("[hidden]")) return false;
            if (["visible", "clip"].includes(style.overflowY)) return false;
            return element.scrollHeight > element.clientHeight + 2;
          })
          .filter((element) => element.textContent?.trim())
          .map((element) => element.textContent.trim().slice(0, 80))
      );
      expect(clippedText, `text clipping found on ${route}`).toEqual([]);
    });
  }
});

test.describe("keyboard and visible focus", () => {
  test.use({ viewport: viewports.desktop });
  for (const route of routes) {
    test(`${route} exposes every visible first-party control in the tab order`, async ({ page }) => {
      await gotoRoute(page, route);
      const expected = await page.locator(firstPartyInteractive).evaluateAll((elements) =>
        elements
          .filter((element) => {
            const style = getComputedStyle(element);
            return style.display !== "none" && style.visibility !== "hidden" && !element.closest("[hidden]") && element.getClientRects().length > 0 && element.tabIndex >= 0;
          })
          .map((element, index) => {
            element.dataset.a11yTabId = String(index);
            return String(index);
          })
      );
      const reached = new Set();
      for (let index = 0; index < expected.length + 5; index += 1) {
        await page.keyboard.press("Tab");
        const focused = await page.evaluate(() => {
          const element = document.activeElement;
          if (!(element instanceof HTMLElement)) return null;
          const style = getComputedStyle(element);
          return {
            id: element.dataset.a11yTabId || null,
            visibleIndicator:
              (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2) ||
              style.boxShadow !== "none",
          };
        });
        if (focused?.id !== null) {
          reached.add(focused.id);
          expect(focused.visibleIndicator, `${route} focus indicator is not visible`).toBe(true);
        }
        if (reached.size === expected.length) break;
      }
      expect([...reached].sort(), `${route} has unreachable controls`).toEqual(expected.sort());
    });
  }
});

test("every route has expected structure, alternatives, and a unique title", async ({ page }) => {
  const titles = [];
  for (const route of routes) {
    await gotoRoute(page, route);
    titles.push(await page.title());
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(1);
    const missingAlt = await page.locator("img").evaluateAll((images) => images.filter((image) => !image.hasAttribute("alt")).map((image) => image.src));
    expect(missingAlt, `${route} has images without alt attributes`).toEqual([]);
  }
  expect(new Set(titles).size, "page titles must be unique").toBe(routes.length);
});

test("navigation identifies the current first-party page", async ({ page }) => {
  for (const route of ["/", "/about/", "/unbroken/", "/services/", "/contact-us/"]) {
    await gotoRoute(page, route);
    await expect(page.locator('.nav-main [aria-current="page"]')).toHaveCount(1);
  }
});

test("mobile navigation announces state, supports Escape, and restores focus", async ({ page }) => {
  await page.setViewportSize(viewports.mobile);
  await gotoRoute(page, "/");
  const toggle = page.locator(".navbar-toggler");
  const menu = page.locator("#nav-main");
  await expect(toggle).toHaveAccessibleName("Open navigation");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(toggle).toHaveAccessibleName("Close navigation");
  await expect(menu).toBeVisible();
  await expectNoWcag21Violations(page, "open mobile navigation");
  await menu.getByRole("link", { name: "About" }).focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toHaveAccessibleName("Open navigation");
  await expect(toggle).toBeFocused();
});

test("skip link is first and moves focus to main", async ({ page }) => {
  await gotoRoute(page, "/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("contact form exposes labels and native validation without transmitting data", async ({ page }) => {
  await gotoRoute(page, "/contact-us/");
  const form = page.locator('form[name="contactform"]');
  await expect(form).toHaveAttribute("aria-describedby", "required-note");
  await expect(page.getByLabel("First Name (required)")).toHaveAttribute("required", "");
  await expect(page.getByLabel("Email Address (required)")).toHaveAttribute("required", "");
  await expect(page.getByLabel("Message (required)")).toHaveAttribute("required", "");
  await page.getByRole("button", { name: "Send email" }).click();
  await expect(page).toHaveURL(/\/contact-us\/$/);
  const invalidFields = await form.locator(":invalid").count();
  expect(invalidFields).toBeGreaterThanOrEqual(3);
  await expect(page.getByLabel("First Name (required)")).toBeFocused();
});

test("contact form success status is announced and focused", async ({ page }) => {
  await page.goto("/contact-us/?sent=1", { waitUntil: "domcontentloaded" });
  const status = page.getByRole("status");
  await expect(status).toContainText("Your message has been sent");
  await expect(status).toBeFocused();
});

test("reduced-motion preference suppresses smooth movement and transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoRoute(page, "/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  const motion = await page.locator(".book-cover").evaluate((element) => {
    const style = getComputedStyle(element);
    return { transition: style.transitionDuration, animation: style.animationDuration, transform: style.transform };
  });
  expect(parseFloat(motion.transition)).toBeLessThanOrEqual(0.001);
  expect(parseFloat(motion.animation)).toBeLessThanOrEqual(0.001);
  expect(motion.transform).toBe("none");
});

test("custom 404 identifies the error and provides keyboard recovery", async ({ page }) => {
  const response = await page.goto(errorRoute, { waitUntil: "domcontentloaded" });
  if (process.env.A11Y_BASE_URL) expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("Page Not Found | Cris Calayan");
  await expect(page.getByRole("heading", { level: 1, name: "Page not found", exact: true })).toHaveCount(1);
  const homeLink = page.getByRole("link", { name: "Return to the homepage" });
  await expect(homeLink).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await homeLink.click();
  await expect(page).toHaveURL(/\/$/);
});

test("404 remains identifiable in forced-colors mode", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await gotoRoute(page, errorRoute);
  const homeLink = page.getByRole("link", { name: "Return to the homepage" });
  await homeLink.focus();
  const outline = await homeLink.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe("none");
  await expectNoWcag21Violations(page, "forced-colors 404 page");
});
