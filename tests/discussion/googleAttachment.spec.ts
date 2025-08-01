import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";

test.describe("Google attachment link test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Google attachment file works. @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const fileName = "test presentation";

    // Navigate to attachments and add Google attachment
    await homePage.clickAttachments();
    await homePage.clickAddAttachment();
    await homePage.clickGoogleAttachment(fileName);

    // Open attachment context menu and details
    await homePage.openAttachmentContextMenuForDetails();
    await homePage.clickAttachmentDetailsFromMenu();

    // Verify Google attachment details
    await homePage.verifyGoogleAttachmentDetails(fileName);
  });

  test.afterEach(async ({ page }) => {
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});