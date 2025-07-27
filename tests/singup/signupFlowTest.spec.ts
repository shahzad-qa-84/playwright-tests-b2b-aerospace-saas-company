import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { apiHelper } from "../../apiutils/apiHelper";
import { mailHelper } from "../../emailutils/gmailHelper";

test.describe("Signup flow test", () => {
  test.use({
    storageState: { cookies: [], origins: [] },
  });
  test("Verify that Signup flow is working and user is able to attach an Organization. @smokeTest", async ({ page, baseURL }) => {
    await page.goto(baseURL);
    const userEmail = "testing+" + faker.internet.userName() + "@b2bSaas.ai";

    await page.getByRole("button", { name: "Sign up" }).click();
    await page.getByPlaceholder("John.Doe@Company.com").click();
    await page.getByPlaceholder("John.Doe@Company.com").fill(userEmail);
    await page.locator("label").filter({ hasText: "By confirming your email, you" }).locator("span").click();
    await page.getByTestId("sign-up-btn").click();

    // Verify that the email is received
    const sender = "login@b2bSaas.ai";
    const emailSbj = "Welcome to b2bSaas! Please confirm your email address.";

    const htmlContent = await mailHelper.readEmail(page, sender, userEmail, emailSbj);
    const magicLinkUrl = (await mailHelper.getConfirmLink(htmlContent)) || "";

    // Verify that URl is not null
    const urlObj = new URL(magicLinkUrl);

    // Extract the required query parameters
    const stytchTokenType = urlObj.searchParams.get("stytch_token_type");
    const token = urlObj.searchParams.get("token");

    const apiEndpoint = await apiHelper.getAPIEndpoint();
    const finalSignupUrl = `${apiEndpoint}/auth/callback?stytch_token_type=${stytchTokenType}&token=${token}`;

    await page.goto(finalSignupUrl);

    await page.getByRole("heading", { name: "Organizations connected to" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^b2bSaas Testing Organization: / })
      .getByRole("button")
      .click();
    await expect(await page.getByRole("heading", { name: "Workspaces" })).toBeVisible();
  });
});
