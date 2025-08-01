import { expect, test } from "@playwright/test";

test.describe("Magic link Test", () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test("Magic Link test works @featureBranch @smokeTest", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Email").click();
    await page.getByPlaceholder("Email").fill("testing@b2bSaas.ai");
    await page.getByRole("button", { name: "Get magic link", exact: true }).click();
    await expect(await page.getByText("Link sent to your email")).toBeVisible();
  });
});
