import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { DiscussionPage } from "../../pageobjects/discussionRefactored.po";

test.describe("Discussion/Comments Attach File test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Attachment of File to the comment is working successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const discussionPage = new DiscussionPage(page);
    const fileName = "INV-CZE-11701-14275-7.pdf";
    const filePath = `./resources/${fileName}`;

    // Navigate to discussion section
    await homePage.clickDiscussion();
    
    // Upload attachment and submit comment
    await discussionPage.uploadAttachment(filePath);
    await discussionPage.submitComment("test");
    
    // Verify attachment in attachments tab
    await discussionPage.openAttachmentsTab();
    await discussionPage.verifyAttachmentVisible(fileName);
    
    // Open attachment details and rename
    await discussionPage.openAttachmentDetails(fileName);
    await discussionPage.renameAttachment("test-file.pdf");
    
    // Delete attachment
    await discussionPage.deleteAttachment();
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