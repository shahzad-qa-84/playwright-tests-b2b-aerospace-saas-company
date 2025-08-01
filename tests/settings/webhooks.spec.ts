import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { SettingsPage } from "../../pageobjects/settingsRefactored.po";
import { WebhooksPage } from "../../pageobjects/webhooksRefactored.po";

test.describe.serial("Webhooks Tests", () => {
  let workspaceName;
  let webhookName;
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Webhook Creation, Deletion, Filteration works perfectly. @smokeTest @featureBranch @prod", async ({ page }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);
    const webhooksPage = new WebhooksPage(page);

    // Navigate to profile and webhooks
    await homePage.clickProfile();
    await settingsPage.clickSettings();
    await settingsPage.clickWebhooks();

    // Create new webhook
    webhookName = "Automated_webhook" + faker.internet.userName();
    await webhooksPage.clickAddWebhook();
    await webhooksPage.enterWebhookName(webhookName);
    await webhooksPage.enterWebhookUrl("https://rolup.ai");

    // Select basic webhook events
    await webhooksPage.selectBasicEvents();

    // Configure advanced options
    await webhooksPage.configureAdvancedOptions("new-key", "7979");

    // Submit webhook and verify creation
    await webhooksPage.submitWebhook();
    await webhooksPage.verifyWebhookVisible(webhookName);

    // Search for webhook and verify filtering
    await webhooksPage.searchWebhook(webhookName);
    await webhooksPage.verifyWebhookVisible(webhookName);
  });

  test.afterEach(async ({ page }) => {
    const webhooksPage = new WebhooksPage(page);
    
    // Delete webhook and verify deletion
    await webhooksPage.openActionsMenu();
    await webhooksPage.deleteWebhook();
    await webhooksPage.verifyNoWebhooksMessage();

    // Clean up workspace
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});