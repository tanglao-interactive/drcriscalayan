import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.A11Y_BASE_URL;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: externalBaseURL || "http://127.0.0.1:9090",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: "npm run dev:test",
        url: "http://127.0.0.1:9090",
        reuseExistingServer: !process.env.CI,
      },
});
