import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { ModellingPage } from "../../pageobjects/modellingRefactored.po";

test.describe.serial("StatusesTable to Configuration Model verification", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that other StatusesTable works as expected. @prod @smokeTest @featureBranch", async ({ page }) => {
    const modellingPage = new ModellingPage(page);

    // Navigate to statuses configuration
    await modellingPage.navigateToStatusConfiguration();

    // Create status with URL type
    await modellingPage.createStatusWithType("test_status_url", "url");

    // Create status with Mention type
    await modellingPage.createStatusWithType("test_mention", "mention");

    // Create status with Single-select type
    await modellingPage.createStatusWithType("test_single_select", "single-select");

    // Create status with Number type
    await modellingPage.createStatusWithType("test_number", "number");

    // Create status with Check type
    await modellingPage.createStatusWithType("test_check", "check");

    // Create status with Date type
    await modellingPage.createStatusWithType("test_date", "date");

    // Go to modeling section to test the created statuses
    await modellingPage.clickModelling();

    // Test date field
    await modellingPage.setDateField("14");

    // Test checkbox field
    await modellingPage.setCheckboxField("test_check");

    // Test number field
    await modellingPage.setNumberField("test_number", "7");

    // Test single select field
    await modellingPage.setSingleSelectField("test_single_select", "test");

    // Test mention field
    await modellingPage.setMentionField("test_mention", "@test");
    await modellingPage.verifyNoMatchVisible();
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