import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { OAuthApplicationPage } from "../../pageobjects/oauthApplicationRefactored.po";
import { SettingsPage } from "../../pageobjects/settingsRefactored.po";

test.describe.serial("OAuth Application Tests", () => {
  let workspaceName;
  let oauthName;
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Add/search/Delete 'OAuth application' works perfectly. @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);
    const oauthPage = new OAuthApplicationPage(page);

    // Navigate to profile and OAuth applications
    await homePage.clickProfile();
    await settingsPage.clickSettings();
    await settingsPage.clickOAuthApplications();

    // Create new OAuth application
    oauthName = "oauth_" + faker.internet.userName();
    await oauthPage.clickAddOAuthApplication();
    
    // Fill basic application information
    await oauthPage.fillBasicApplicationInfo(oauthName, "testing", "testing description");
    
    // Configure callback URLs
    await oauthPage.configureCallbackUrls("https://b2bSaas.ai");
    
    // Complete OAuth application creation
    await oauthPage.completeOAuthApplicationCreation(oauthName);

    // Search for the created OAuth application
    await oauthPage.searchOAuthApplication(oauthName);
  });

  test.afterEach(async ({ page }) => {
    const oauthPage = new OAuthApplicationPage(page);
    
    // Delete the OAuth application
    await oauthPage.openActionsMenu();
    await oauthPage.deleteOAuthApplication();
    await oauthPage.verifyNoOAuthApplicationsMessage();

    // Clean up workspace
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});