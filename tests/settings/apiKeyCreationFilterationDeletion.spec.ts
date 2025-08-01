import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { ApiKeyPage } from "../../pageobjects/apiKeyRefactored.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { SettingsPage } from "../../pageobjects/settingsRefactored.po";

test.describe.serial("API Key Tests", () => {
  let workspaceName;
  let apiKeyName;
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that a API Key Creation, Deletion, Filteration, and Edit works perfectly. @smokeTest @featureBranch @prod", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);
    const apiKeyPage = new ApiKeyPage(page);

    // Navigate to profile and settings
    await homePage.clickProfile();
    await settingsPage.clickSettings();
    await settingsPage.clickApiKeys();

    // Create new API key
    apiKeyName = "AutomatedTest_apiKey_" + faker.internet.userName();
    await apiKeyPage.clickAddApiKey();
    await apiKeyPage.enterApiKeyName(apiKeyName);

    // Set permissions for the API key
    await apiKeyPage.selectWorkspacesRights();
    await apiKeyPage.selectBlocksRights();
    await apiKeyPage.selectWebhooksRights();

    // Create the API key and verify it's created
    await apiKeyPage.clickCreate();
    await apiKeyPage.verifyApiKeyVisible(apiKeyName);

    // Search for the API key and verify it's found
    await apiKeyPage.searchApiKey(apiKeyName);
    await apiKeyPage.verifyApiKeyVisible(apiKeyName);

    // Edit the API key name
    await apiKeyPage.openActionsMenu();
    const apiKeyNameEdited = "Edited_apiKey_" + faker.internet.userName();
    await apiKeyPage.editApiKeyName(apiKeyNameEdited);

    // Clear search and search for the edited key
    await apiKeyPage.clearApiKeySearch();
    await apiKeyPage.searchApiKey(apiKeyNameEdited);
    await apiKeyPage.verifyApiKeyVisible(apiKeyNameEdited);
  });

  test.afterEach(async ({ page }) => {
    const apiKeyPage = new ApiKeyPage(page);
    
    // Delete the API key
    await apiKeyPage.openActionsMenu();
    await apiKeyPage.deleteApiKey();
    await apiKeyPage.verifyNoApiKeysMessage();

    // Clean up workspace
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});