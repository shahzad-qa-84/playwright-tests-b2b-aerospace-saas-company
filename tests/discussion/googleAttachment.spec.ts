import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Google attachment link test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Google attachment file works. @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    const fileName = "test presentation";

    await b2bSaasHomePage.clickAttachments();
    await b2bSaasHomePage.clickAddAttachment();
    await b2bSaasHomePage.clickGoogleAttachment(fileName);

    // Open context menu for attachment
    await page.getByTestId("button_attachment-context-menu").click();
    await page.getByTestId("menu-item_details").click();

    // Verify attachment details
    const attachmentDetails = page.getByLabel(`Attachment details: ${fileName}`);
    await expect(attachmentDetails.getByText(fileName, { exact: true })).toBeVisible();
    await expect(page.getByText("Google")).toBeVisible();
    await expect(page.locator("img").nth(3)).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
