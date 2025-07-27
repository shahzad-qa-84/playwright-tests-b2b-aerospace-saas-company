import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { DiscussionPage } from "../../pageobjects/discussionPage.po";

test.describe("Discussion section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Attachment of image to the comment works successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    const discussionPage = new DiscussionPage(page);

    await b2bSaasHomePage.clickDiscussion();
    await discussionPage.attachImage("./resources/flower.png");
    await discussionPage.expectImageVisibleInEditor();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
