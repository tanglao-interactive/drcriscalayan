import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/about/", "/unbroken/", "/services/", "/contact-us/"];

const analyzeAccessibility = async (page) => {
  return new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
};

for (const path of pages) {
  test(`${path} has no automatically detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);

    const results = await analyzeAccessibility(page);

    expect(results.violations).toEqual([]);
  });
}

test.describe("custom 404 page", () => {
  test("an unknown URL has accessible content and returns home", async ({ page }) => {
    await page.goto("/accessibility-test-404");

    await expect(page).toHaveTitle("Page Not Found | Cris Calayan");

    const main = page.getByRole("main");
    await expect(main).toHaveAttribute("id", "main-content");
    await expect(main).toBeVisible();

    const heading = page.getByRole("heading", { level: 1, name: "Page not found" });
    await expect(heading).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByText("The page you requested could not be found.", { exact: true })
    ).toBeVisible();

    const homeLink = page.getByRole("link", { name: "Return to the homepage" });
    await expect(homeLink).toBeVisible();

    const results = await analyzeAccessibility(page);
    expect(results.violations).toEqual([]);

    await homeLink.click();
    await expect(page).toHaveURL("http://127.0.0.1:9090/");
    await expect(page.getByRole("heading", { level: 1, name: "Unbroken" })).toBeVisible();
  });

  test("supports keyboard access through the skip link", async ({ page }) => {
    await page.goto("/accessibility-test-404");

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
  });

  test("reflows at a 320 CSS-pixel viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/accessibility-test-404");

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );

    expect(hasHorizontalOverflow).toBe(false);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Return to the homepage" })).toBeVisible();
  });

  test("remains usable with WCAG text-spacing overrides", async ({ page }) => {
    await page.goto("/accessibility-test-404");
    await page.addStyleTag({
      content: `
        * {
          letter-spacing: 0.12em !important;
          line-height: 1.5 !important;
          word-spacing: 0.16em !important;
        }
        p { margin-bottom: 2em !important; }
      `,
    });

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );

    expect(hasHorizontalOverflow).toBe(false);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Return to the homepage" })).toBeVisible();
  });

  test("honors reduced-motion preferences", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/accessibility-test-404");

    const transitionDuration = await page
      .getByRole("link", { name: "Skip to main content" })
      .evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration));

    expect(transitionDuration).toBeLessThanOrEqual(0.001);
  });
});
