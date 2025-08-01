import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { DiscussionPage } from "../../pageobjects/discussionRefactored.po";

test.describe("Link attachment to Discussion/Comments section", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Attachment of link to a comment works as expected. @prod @smokeTest @featureBranch", async ({ page, context }) => {
    const homePage = new HomePage(page);
    const discussionPage = new DiscussionPage(page);

    // Navigate to discussion section
    await homePage.clickDiscussion();

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

    // Close the tab and return to main page
    await newTab.close();
    await page.bringToFront();
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