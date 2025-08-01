import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { ModelConfigurationPage } from "../../pageobjects/modelConfigurationRefactored.po";

test.describe("Statuses test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Verify that from Modelling Configuration Add new Status, Edit Status and deletion is working @prod @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const modelConfigPage = new ModelConfigurationPage(page);

    // Navigate to modelling and model configuration
    await homePage.clickModelling();
    await homePage.clickModellConfiguration();

    // Generate status name
    const statusToBeAdded = faker.person.firstName().toLowerCase();

    // Navigate to statuses section and create status
    await homePage.clickStatuses();
    await modelConfigPage.createStatus(statusToBeAdded);

    // Edit the status name
    const editedStatusName = statusToBeAdded + "_edited";
    await modelConfigPage.editStatusName(statusToBeAdded, editedStatusName);

    // Verify the edited status is available in modelling
    await homePage.clickModelling();
    await modelConfigPage.verifyStatusInModelling(editedStatusName);

    // Delete the status and verify deletion
    await homePage.clickStatuses();
    await modelConfigPage.deleteStatusAndVerify();
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