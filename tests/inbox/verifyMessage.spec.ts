import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { inboxPage } from "../../pageobjects/inbox.po";
import { settingsPage } from "../../pageobjects/settings.po";
import { getUserEmail } from "../../utilities/urlMapper";

test.describe.serial("Message verification", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that message verification in Inbox works. @featureBranch @prod @smokeTest", async ({ page, baseURL }) => {
    const b2bSaasHomePage = new homePage(page);
    const userName = getUserEmail(baseURL);

    // Make sure that the user name is updated
    const userSettingsPage = await new settingsPage(page);
    await b2bSaasHomePage.clickProfile();
    await b2bSaasHomePage.clickSettings();
    await userSettingsPage.enterName(userName);
    await userSettingsPage.clickSubmit();
    await userSettingsPage.clickBackFromSettings();

    // Go to the “Discussion” tab
    const profileName = await page.getByTestId("button_user-menu").textContent();
    await b2bSaasHomePage.clickDiscussion();

    // Verify that “Add Comment” is working successfully in the “Discussion” tab
    await page.waitForTimeout(500);
    await page.waitForSelector(".tiptap.ProseMirror");
    await page.getByRole("paragraph").click();
    await page.waitForTimeout(500);
    await page.locator(".tiptap").fill("@" + profileName);
    await page.getByTestId("menu-item_" + userName).click();
    await page.getByTestId("button_comment-editor-send").click();
    await page.waitForTimeout(1000);

    // Check if its reached to Inbox as "Unread"
    await b2bSaasHomePage.clickInbox();
    await expect(await page.getByText("just now").first()).toBeVisible();
    await expect(await page.getByText(workspaceName).nth(1)).toBeVisible();

    const inbox = new inboxPage(page);
    await inbox.clickInboxTab();
    const comment = "Mentioned by" + userName + "just now";
    await expect(await page.getByText(comment).first()).toBeVisible();
    await page.getByText("New System").first().click();

    // Verify that the message is displayed correctly
    await expect(await page.getByRole("tab", { name: "Inbox" })).toBeVisible();
    await expect(await page.getByRole("tab", { name: "Mentioned" })).toBeVisible();
    await expect(await page.getByRole("tab", { name: "Archive" })).toBeVisible();

    // Mark the inbox as unread and archive it
    await page.getByRole("tab", { name: "Inbox" }).click();
    await inbox.clickFirstMessage();
    await inbox.clickSandwichMenu();
    await inbox.clickUnread();
    await inbox.clickSandwichMenu();
    await inbox.archiveMessage();

    await inbox.clickArchiveTab();
    await expect(await page.getByText(comment).first()).toBeVisible();

    // Move the message to the inbox and verify that it is displayed in the inbox
    await page.getByText(comment).first().click();
    await inbox.clickSandwichMenu();
    await inbox.clickMoveToInbox();
    await inbox.clickInboxTab();
    await page.getByText(comment).first().click();

    // Go to the discussion tab and verify that link is working
    await inbox.clickFirstMessage();

    // Verify that the message is displayed correctly
    await inbox.clickGotoSourceLink();

    // Verify that the control moved to Modelling comments tab
    await expect(await page.getByText("New System+")).toBeVisible();
    await expect(await page.getByText("just now")).toBeVisible();
    await page
      .locator("p")
      .filter({ hasText: /testing.*@b2bSaas\.ai/ })
      .click();
    await page.getByText("just now").click();
    await expect(await page.locator("p").filter({ hasText: "testing" })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
