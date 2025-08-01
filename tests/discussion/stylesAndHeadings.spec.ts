import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { DiscussionPage } from "../../pageobjects/discussionRefactored.po";

test.describe("List style applied properly to comments", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that List Styles are applied successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const discussionPage = new DiscussionPage(page);

    // Navigate to discussion section
    await homePage.clickDiscussion();

    // Apply formatting and create list items
    await discussionPage.applyStrike();
    
    const listItems = ["list 1", "list 2", "list 3"];
    await discussionPage.addListItems(listItems);
    
    // Apply ordered list formatting and send comment
    await discussionPage.selectAllText();
    await discussionPage.applyOrderedList();
    await discussionPage.sendComment();

    // Verify list item is visible
    await discussionPage.expectTextVisible("list 1");
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