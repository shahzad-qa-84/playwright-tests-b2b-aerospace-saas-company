import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { DiscussionPage } from "../../pageobjects/discussionRefactored.po";

test.describe("Discussion/Comments section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Comments add/edit/delete work successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const discussionPage = new DiscussionPage(page);

    const comment = "b2bSaas is the future for many companies to transform their complex processes";
    const editedComment = "Edited_text";

    // Navigate to discussion and verify initial state
    await discussionPage.openDiscussionTab();
    await discussionPage.expectNoCommentsMessage();

    // Add comment and verify it's visible
    await discussionPage.addComment(comment);
    await expect(page.getByText(comment, { exact: true })).toBeVisible();

    // Tag user (email not sent due to missing Enter)
    await discussionPage.tagUser();

    // Edit comment and verify changes
    await discussionPage.editComment(comment, editedComment);
    await expect(page.getByText(editedComment, { exact: true })).toBeVisible();

    // Navigate away and back to test deletion
    await homePage.clickChildBlocks();
    await discussionPage.openDiscussionTab();
    
    // Delete comment and verify it's hidden
    await discussionPage.deleteComment();
    await expect(page.getByText(editedComment, { exact: true })).toBeHidden();
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