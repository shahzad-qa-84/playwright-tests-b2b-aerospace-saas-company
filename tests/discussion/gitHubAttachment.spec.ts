import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";

test.describe("GitHub attachment link test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that GitHub attachment file works. @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);

    // Navigate to attachments section
    await homePage.clickAttachments();
    await homePage.clickAddAttachment();

    // Add GitHub attachment
    await homePage.safeClick(homePage.getByText("GitHub"));
    await homePage.safeClick(homePage.getByText("test-repo"));
    await homePage.safeClick(homePage.getByTestId("button_add-attachment"));

    // Verify GitHub attachment was added (specific verification would depend on UI)
    await homePage.verifyElementVisible(homePage.getByText("test-repo"));
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