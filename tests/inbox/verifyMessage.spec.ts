import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { inboxPage } from "../../pageobjects/inbox.po";
import { SettingsPage } from "../../pageobjects/settingsRefactored.po";
import { getUserEmail } from "../../utilities/urlMapper";

test.describe.serial("Message verification", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Verify that message verification in Inbox works. @featureBranch @prod @smokeTest", async ({ page, baseURL }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);
    const inbox = new inboxPage(page);
    const userName = getUserEmail(baseURL);

    // Update user name in settings
    await homePage.clickProfile();
    await settingsPage.clickSettings();
    await settingsPage.enterName(userName);
    await settingsPage.clickSubmit();
    await settingsPage.clickBackFromSettings();

    // Navigate to discussion and create a mention
    const profileName = await page.getByTestId("button_user-menu").textContent();
    await homePage.clickDiscussion();

    // Create mention comment
    await page.waitForTimeout(500);
    await page.waitForSelector(".tiptap.ProseMirror");
    await page.getByRole("paragraph").click();
    await page.waitForTimeout(500);
    await page.locator(".tiptap").fill("@" + profileName);
    await page.getByTestId("menu-item_" + userName).click();
    await page.getByTestId("button_comment-editor-send").click();
    await page.waitForTimeout(1000);

    // Verify message appears in inbox
    await homePage.clickInbox();
    await expect(page.getByText("just now").first()).toBeVisible();
    await expect(page.getByText(workspaceName).nth(1)).toBeVisible();

    // Verify inbox message content
    await inbox.clickInboxTab();
    const comment = "Mentioned by" + userName + "just now";
    await expect(page.getByText(comment).first()).toBeVisible();
    await page.getByText("New System").first().click();

    // Verify inbox interface elements
    await expect(page.getByRole("tab", { name: "Inbox" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Mentioned" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Archive" })).toBeVisible();

    // Test message actions: mark unread and archive
    await page.getByRole("tab", { name: "Inbox" }).click();
    await inbox.clickFirstMessage();
    await inbox.clickSandwichMenu();
    await inbox.clickUnread();
    await inbox.clickSandwichMenu();
    await inbox.archiveMessage();

    // Verify message in archive
    await inbox.clickArchiveTab();
    await expect(page.getByText(comment).first()).toBeVisible();

    // Move message back to inbox and verify
    await page.getByText(comment).first().click();
    await inbox.clickSandwichMenu();
    await inbox.clickMoveToInbox();
    await inbox.clickInboxTab();
    await page.getByText(comment).first().click();

    // Test navigation to source from inbox
    await inbox.clickFirstMessage();
    await inbox.clickGotoSourceLink();

    // Verify navigation to discussion worked
    await expect(page.getByText("New System+")).toBeVisible();
    await expect(page.getByText("just now")).toBeVisible();
    await page
      .locator("p")
      .filter({ hasText: /testing.*@b2bSaas\.ai/ })
      .click();
    await page.getByText("just now").click();
    await expect(page.locator("p").filter({ hasText: "testing" })).toBeVisible();
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