import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { DiscussionPage } from "../../pageobjects/discussionRefactored.po";

test.describe("Discussion section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Attachment of image to the comment works successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const discussionPage = new DiscussionPage(page);

    // Navigate to discussion section
    await homePage.clickDiscussion();
    
    // Attach image to comment
    await discussionPage.attachImage("./resources/flower.png");
    
    // Verify image is visible in editor
    await discussionPage.expectImageVisibleInEditor();
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