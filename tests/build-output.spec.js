import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { expect, test } from "@playwright/test";

const outputPath = path.resolve(process.cwd(), "docs/404.html");

test("the production build contains a root-level 404.html", async () => {
  await expect(access(outputPath)).resolves.toBeUndefined();

  const output = await readFile(outputPath, "utf8");
  expect(output).toContain("<title>Page Not Found | Cris Calayan</title>");
  expect(output).toContain('id="main-content"');
  expect(output).toContain("Page not found");
  expect(output).toContain("Return to the homepage");
});
