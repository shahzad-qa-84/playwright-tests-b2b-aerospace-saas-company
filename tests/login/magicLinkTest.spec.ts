import { expect, test } from "@playwright/test";

test.describe("Magic link Test", () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test("Magic Link test works @featureBranch @smokeTest", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Email").click();
    await page.getByPlaceholder("Email").fill("testing@b2bSaas.ai");
    await page.getByRole("button", { name: "Get magic link", exact: true }).click();
    await expect(await page.getByText("Link sent to your email")).toBeVisible();

    // // Read token value from email
    // let sender;
    // if (baseURL?.includes(".b2bSaas.ai")) {
    //   sender = "login@stytch.com";
    // } else {
    //   sender = "login@test.stytch.com";
    // }
    // const htmlContent = await mailHelper.readEmail(page, sender, "testing@b2bSaas.ai", "Your login request to");
    // const url = await mailHelper.getLoginLink(htmlContent);

    // // Verify that URl is not null
    // await expect(url).not.toBeNull();
  });
});
