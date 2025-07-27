import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
test.describe("Project Management section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that Image upload/remove/Link add works successfully. @smokeTest @featureBranch @prod", async ({ page }) => {
    // Verify that "Upload Image" option is displayed on Project Management page
    const optionUploadImage = page.getByRole("button", { name: "Upload image" }).first();
    await optionUploadImage.click();
    const labelUploadWidget = page.getByText("You can drag and drop attachments directly to this block").first();
    await expect(await labelUploadWidget).toBeVisible();

    // Upload image and verify that image is displayed
    const optionUploadFile = await page.getByRole("tabpanel", { name: "Upload" }).getByRole("textbox").first();
    await optionUploadFile.setInputFiles("./resources/flower.png");
    await expect(await page.locator('div[style*="background-image: url"]')).toBeVisible({ timeout: 120000 });

    // Click Change Image and verify upload widget is displayed
    await page.getByTestId("button_change-image").click();
    await expect(await labelUploadWidget).toBeVisible();

    // Click Remove and verify widget is displayed
    await page.getByRole("button", { name: "Remove" }).click();
    await page.getByTestId("button_upload-image").click();

    // Click Embed Image and verify that "Embed Image" option is displayed and error message appears if link is invalid
    await page.getByRole("tab", { name: "Link" }).click();
    const textboxImageLink = page.getByPlaceholder("Paste the image link...");
    await textboxImageLink.click();
    await textboxImageLink.fill("https://abc.com");
    await page.getByRole("button", { name: "Embed image" }).click();
    await expect(await page.getByText("Invalid image link")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
