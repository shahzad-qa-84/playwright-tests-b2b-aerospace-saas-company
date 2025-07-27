import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { DiscussionPage } from "../../pageobjects/discussionPage.po";

test.describe("List style applied properly to comments", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that List Styles are applied successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    const discussionPage = new DiscussionPage(page);

    await b2bSaasHomePage.clickDiscussion();
    await discussionPage.applyStrike();

    const listItems = ["list 1", "list 2", "list 3"];
    await discussionPage.addListItems(listItems);
    await discussionPage.selectAllText();
    await discussionPage.applyOrderedList();
    await discussionPage.sendComment();

    await discussionPage.expectTextVisible("list 1");
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
