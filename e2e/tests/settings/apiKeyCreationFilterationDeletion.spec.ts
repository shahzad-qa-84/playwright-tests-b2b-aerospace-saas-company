import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { apiKeyPage } from "../../pageobjects/apiKey.po";
import { homePage } from "../../pageobjects/homePage.po";
import { settingsPage } from "../../pageobjects/settings.po";

test.describe.serial("API Key Tests", () => {
  let workspaceName;
  let apiKeyName;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that a API Key Creation, Deletion, Filteration, and Edit works perfectly. @smokeTest @featureBranch @prod", async ({
    page,
  }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickProfile();

    // Click Settings and Go to API key creation
    const settingPage = new settingsPage(page);
    await settingPage.clickSettings();
    await settingPage.clickApiKeys();

    // Create key
    const apiKey = new apiKeyPage(page);
    await apiKey.clickBtnAddApiKey();
    apiKeyName = "AutomatedTest_apiKey_" + faker.internet.userName();
    await apiKey.enterApiKeyName(apiKeyName);

    // Select the rights
    await apiKey.selectWorkSpacesRights();
    await apiKey.selectBlocksRights();
    await apiKey.selectWebhooksRights();

    // click Create and verify its created successfully
    await apiKey.clickCreate();
    await expect(await page.getByRole("heading", { name: "" + apiKeyName + "" })).toBeVisible();

    // Search API and verify if its searched
    await apiKey.searchApiKey(apiKeyName);
    await expect(await page.getByRole("heading", { name: "" + apiKeyName + "" })).toBeVisible();

    // Expand menu and edit key
    await apiKey.clickThreeDottedIcon();
    const apiKeyNameEdited = "Edited_apiKey_" + faker.internet.userName();
    await apiKey.updateKey(apiKeyNameEdited);
    await apiKey.clearApiKey();
    await apiKey.searchApiKey(apiKeyNameEdited);
    await expect(await page.getByRole("heading", { name: "" + apiKeyNameEdited + "" })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Delete API key
    const apiKey = new apiKeyPage(page);
    await apiKey.clickThreeDottedIcon();
    await apiKey.deleteApiKey();
    await expect(await page.getByText("You don't have any API keys meeting the filter criteria")).toBeVisible();
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
