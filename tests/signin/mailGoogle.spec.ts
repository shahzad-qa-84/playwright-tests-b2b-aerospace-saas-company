import { expect, test } from "@playwright/test";

test.describe("b2bSaas Signin using Google", () => {
  const GOOGLE_EMAIL = "testing@b2bSaas.ai";
  const GOOGLE_PASSWORD = process.env.GOOGLE_PASSWORD;

  test.use({
    storageState: { cookies: [], origins: [] },
  });

  test.skip("Verify Google signin is working @prod @smokeTest", async ({ page, baseURL }) => {
    // Navigate to your website
    await page.goto(baseURL);

    // Click on the Google login button
    await page.click('text="Sign in with Google"');

    // Enter the email
    await page.fill('input[type="email"]', GOOGLE_EMAIL);
    await page.click("#identifierNext");

    // Wait for the password input to appear
    await page.waitForSelector('input[type="password"]', { timeout: 60000 });
    await page.fill('input[type="password"]', GOOGLE_PASSWORD);
    await page.click("#passwordNext");

    // Wait for navigation to complete after login
    if (await page.getByRole("button", { name: "Continue" }).isVisible()) {
      await page.getByRole("button", { name: "Continue" }).click();
    }

    // Verify that b2bSaas is logged in properly
    await expect(await page.getByRole("button", { name: "Navigation" })).toBeVisible();
  });
});
