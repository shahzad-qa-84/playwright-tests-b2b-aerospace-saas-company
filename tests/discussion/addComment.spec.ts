import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { DiscussionPage } from "../../pageobjects/discussionPage.po";

test.describe("Discussion/Comments section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Comments add/edit/delete work successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const discussionPage = new DiscussionPage(page);
    const b2bSaasHomePage = new homePage(page);

    const comment = "b2bSaas is the future for many companies to transform their complex processes";
    const editedComment = "Edited_text";

    await discussionPage.openDiscussionTab();
    await discussionPage.expectNoCommentsMessage();

    // Add comment
    await discussionPage.addComment(comment);
    await expect(page.getByText(comment, { exact: true })).toBeVisible();

    // Tag user (email not sent due to missing Enter)
    await discussionPage.tagUser();

    // Edit comment
    await discussionPage.editComment(comment, editedComment);
    await expect(page.getByText(editedComment, { exact: true })).toBeVisible();

    // Delete comment
    await b2bSaasHomePage.clickChildBlocks();
    await discussionPage.openDiscussionTab();
    await discussionPage.deleteComment();
    await expect(page.getByText(editedComment, { exact: true })).toBeHidden();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
