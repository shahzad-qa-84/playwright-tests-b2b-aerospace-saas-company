import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { SettingsPage } from "../../pageobjects/settingsRefactored.po";
import { getUserEmail } from "../../utilities/urlMapper";

test.describe("Profile Update test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Verify that Upload Avatar and other Profile updates to user Profile works @featureBranch @smokeTest", async ({ page, baseURL }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);

    // Navigate to profile settings
    await homePage.clickProfile();
    await settingsPage.clickSettings();

    // Get current avatar source before upload
    const oldAvatarSrc = await page.getAttribute('img[alt="User avatar"]', "src");
    const extractedOldUuid = oldAvatarSrc?.split(".amazonaws.com/")[1];

    // Upload new profile picture
    await settingsPage.uploadProfilePic("./resources/b2bSaas-logo.png");

    // Get new avatar source and verify it changed
    const newAvatarSrc = await page.getAttribute('img[alt="User avatar"]', "src");
    const extractedNewUuid = newAvatarSrc?.split(".amazonaws.com/")[1];

    // Verify that avatar changed
    await expect(extractedNewUuid).not.toEqual(extractedOldUuid);

    // Update user profile information
    const userName = getUserEmail(baseURL);
    const role = "b2bSaas testing team's playground org.";

    await settingsPage.enterName(userName);
    await settingsPage.enterRole(role);
    await settingsPage.clickSubmit();

    // Verify that profile information was updated
    await expect(page.getByPlaceholder(userName)).toBeVisible();
    await expect(page.getByPlaceholder(role)).toBeVisible();
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