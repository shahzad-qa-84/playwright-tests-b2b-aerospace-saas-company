import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { PropertyPage } from "../../pageobjects/propertyRefactored.po";

test.describe("Calculation Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Calculation test Addition @smokeTest @featureBranch", async ({ page }) => {
    const propertyPage = new PropertyPage(page);

    // Create first property with value "3 kg"
    const propertyName1 = faker.person.firstName() + "_Value1";
    await propertyPage.addPropertyOrGroupLink();
    await propertyPage.addNewPropertyFromBlockSection(propertyName1);
    await propertyPage.addPropertyValue(propertyName1, "3 kg");

    // Create second property with value "6 kg"
    const propertyName2 = faker.person.firstName() + "_Value2";
    await propertyPage.createPropertyWithValue(propertyName2, "6 kg");

    // Create result property with formula
    const propertyName3 = faker.person.firstName() + "_Result";
    const formulaValue = `{{${propertyName1}}}+{{${propertyName2}}}`;
    await propertyPage.createPropertyWithValue(propertyName3, formulaValue);

    // Verify the calculation result (3 kg + 6 kg = 9 kg)
    await propertyPage.verifyPropertyValueInEditor(propertyName3, "9 kg");
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