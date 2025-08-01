import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

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

  test("Verify that Multi select StatusesTable can be added/deleted. @prod @smokeTest @featureBranch", async ({ page }) => {
    const modellingPage = new ModellingPage(page);

    // Navigate to statuses configuration
    await modellingPage.navigateToStatusConfiguration();

    // Create multi-select status with options
    const statusName = "test_status";
    const description = "This is a test status";
    const options = ["test 1", "test 2", "test 3", "test 4"];
    
    await modellingPage.createMultiSelectStatus(statusName, description, options);

    // Navigate back to modelling and test multi-select functionality
    await modellingPage.clickModelling();
    
    // Select all options in multi-select
    await modellingPage.selectMultiSelectOptions(options);

    // Remove all tags one by one
    await modellingPage.removeMultiSelectTags(4);

    // Verify all options are deleted
    await modellingPage.verifyEmptyPlaceholder();

    // Create and select a new status directly
    const directStatusName = "My direct status";
    await modellingPage.createNewStatusDirectly(directStatusName);
    await modellingPage.removeMultiSelectTags(1);
    await modellingPage.selectCreatedStatus(directStatusName);
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