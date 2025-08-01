import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { PropertyPage } from "../../pageobjects/propertyRefactored.po";

test.describe("Property window test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Verify creation and deletion of property from window works @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const propertyPage = new PropertyPage(page);

    // Navigate to property configuration window
    await homePage.clickMoreConfigurations();
    await homePage.clickPropertiesFromMenu();

    // Create new property from main window
    const propertyToBeAdded = faker.person.firstName();
    await propertyPage.addNewPropertyFromMainWindow(propertyToBeAdded);

    // Verify property is visible
    await propertyPage.verifyPropertyInMainWindow(propertyToBeAdded);

    // Delete the created property
    await propertyPage.deletePropertyFromMainWindow();
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