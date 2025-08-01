import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { DiscussionPage } from "../../pageobjects/discussionRefactored.po";

test.describe.serial("Comments and History section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Verify that Comments are added, copied properly in the discussion section. @prod @smokeTest @featureBranch @prod", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const discussionPage = new DiscussionPage(page);

    // Navigate to discussion section
    await homePage.clickDiscussion();

    // Add comment and verify it's visible
    const comment = "b2bSaas is going to make a history in engineering world";
    await discussionPage.addCommentWithVerification(comment);

    // Verify comment appears in history section
    await discussionPage.verifyCommentInHistoryWorkflow(comment);

    // Copy the comment link
    await discussionPage.copyCommentLinkWorkflow(comment);

    // @todo add InfinityScroll test
    // we added new function "InfinityScroll" to load more history data when user scroll down and button is visible
  });

  test("Verify that Comments/history expansion is working successfully. @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const discussionPage = new DiscussionPage(page);

    // Navigate to discussion section
    await homePage.clickDiscussion();

    // Expand comments and history section and verify all history data is there
    await discussionPage.clickHistory();
    
    // Add comment in comments tab and verify
    await discussionPage.addCommentInTabWorkflow("test1");
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