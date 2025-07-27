import { defineConfig, devices } from "@playwright/test";
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 350000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 30000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Limit the number of workers for test consistency once sharding is enabled.
  workers: process.env.CI ? 2 : undefined,
  maxFailures: 10,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { outputFolder: `playwright-report/` }], ["junit", { outputFile: "results.xml" }], ["list"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  globalSetup: resolve(__dirname, "global-setup.ts"),
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    //baseURL: 'http://127.0.0.1:3000',
    baseURL: process.env.BASE_URL || process.env.BASE_URL,

    trace: "on-first-retry",
    actionTimeout: 15000,
    // Tell all tests to load signed-in state from 'storageState.json'.
    storageState: `storageState.json`,
    video: "on-first-retry",
    viewport: { width: 1920, height: 1920 },
    screenshot: "only-on-failure",
    headless: true,
    launchOptions: {
      slowMo: 100,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
