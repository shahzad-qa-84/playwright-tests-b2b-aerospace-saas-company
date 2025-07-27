import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { homePage } from "../../pageobjects/homePage.po";
import { DiscussionPage } from "../../pageobjects/discussionPage.po";

test.describe("Discussion/Comments Attach File test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const home = new homePage(page);
    wsId = await home.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Attachment of File to the comment is working successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const home = new homePage(page);
    const discussion = new DiscussionPage(page);
    const fileName = "INV-CZE-11701-14275-7.pdf";
    const filePath = `./resources/${fileName}`;

    await home.clickDiscussion();
    await discussion.uploadAttachment(filePath);
    await discussion.submitComment("test");
    await discussion.openAttachmentsTab();
    await discussion.verifyAttachmentVisible(fileName);
    await discussion.openAttachmentDetails(fileName);
    await discussion.renameAttachment("test-file.pdf");
    await discussion.deleteAttachment();
  });

  test.afterEach(async ({ page }) => {
    const home = new homePage(page);
    if (wsId) {
      await home.deleteWorkspaceByID(wsId);
    }
  });
});
