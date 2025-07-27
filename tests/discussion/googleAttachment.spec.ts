import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Google attachement link test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that Google attachment file works. @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickAttachments();

    // Add Google attachment
    await b2bSaasHomePage.clickAddAttachment();
    const fileName = "test presentation";
    await b2bSaasHomePage.clickGoogleAttachment(fileName);

    // Verify that the attachment is visible in the preview
    await page.getByTestId("button_attachment-context-menu").click();

    // Open attachment details and Verify that the attachment is visible in the preview
    await page.getByTestId("menu-item_details").click();
    await expect(
      await page.getByLabel("Attachment details: test presentation").getByText("" + fileName + "", { exact: true })
    ).toBeVisible();
    await expect(await page.getByText("Google")).toBeVisible();
    await expect(await page.locator("img").nth(3)).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
