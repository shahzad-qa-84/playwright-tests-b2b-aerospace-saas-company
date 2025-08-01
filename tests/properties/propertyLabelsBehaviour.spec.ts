import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";

test.describe("Property Columns Labels test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateEngineeringWorkspace(workspaceName);
  });
  
  test("Verify property window columns functionality works @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);

    // Navigate to property configuration
    await homePage.clickMoreConfigurations();
    await homePage.clickPropertiesFromMenu();

    // Verify property configuration elements
    await homePage.verifyPropertyConfigElements();

    // Change property type to string and verify
    await homePage.changePropertyTypeToString();

    // Open property instance and verify navigation
    await homePage.openPropertyInstanceAndVerify();

    // Open dependency graph and verify
    await homePage.openDependencyGraph();
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