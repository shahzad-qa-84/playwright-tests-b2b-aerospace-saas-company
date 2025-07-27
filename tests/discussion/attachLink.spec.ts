import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { DiscussionPage } from "../../pageobjects/discussionPage.po";

test.describe("Link attachment to Discussion/Comments section", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Attachment of link to a comment works as expected. @prod @smokeTest @featureBranch", async ({ page, context }) => {
    const b2bSaasHomePage = new homePage(page);
    const discussionPage = new DiscussionPage(page);

    await b2bSaasHomePage.clickDiscussion();

    const linkText = "b2bSaas-link";
    const linkURL = "https://app.b2bSaas.ai";

    // Open link modal, then unset link to test cancel flow
    await discussionPage.openLinkEditor();
    await discussionPage.unsetLink();

    // Add the link and submit the comment
    await discussionPage.addLinkWithText(linkText, linkURL);
    await discussionPage.sendComment();

    // Click inserted link and capture new tab
    const [newTab] = await Promise.all([
      context.waitForEvent("page"), // waits for the new tab
      discussionPage.clickInsertedLink(linkText),
    ]);

    // Wait for new tab to load and verify URL
    await newTab.waitForLoadState();
    expect(newTab.url()).toBe(linkURL);

    // Optional: close the tab and return to main page
    await newTab.close();
    await page.bringToFront();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
