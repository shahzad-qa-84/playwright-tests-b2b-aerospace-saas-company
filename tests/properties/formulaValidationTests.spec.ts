import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { PropertyPage } from "../../pageobjects/propertyRefactored.po";

test.describe("Formula Validation Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Formula validation Plus works expected @featureBranch @smokeTest", async ({ page }) => {
    const propertyPage = new PropertyPage(page);

    // Failed Case-1: Create property without unit and property with unit
    const propertyName1 = "Prop_without_Unit";
    await propertyPage.addPropertyOrGroupLink();
    await propertyPage.addNewPropertyFromBlockSection(propertyName1);
    await propertyPage.addPropertyValue(propertyName1, "3");

    const propertyName2 = "Prop_with_Unit";
    await propertyPage.createPropertyWithValue(propertyName2, "6 kg");

    // Create formula property and verify error for unit mismatch
    const propertyName3 = "Result";
    const formula = `{{${propertyName1}}}+{{${propertyName2}}}`;
    await propertyPage.createFormulaProperty(propertyName3, formula);
    await propertyPage.verifyFormulaError();

    // Failed Case-2: Different units should still show error
    await propertyPage.addPropertyValue(propertyName1, "2 m");
    await propertyPage.verifyFormulaError();

    // Success Case-3: Same units should work
    await propertyPage.addPropertyValue(propertyName1, "2 kg");
    const property4 = "Props_extra";
    await propertyPage.addNewPropertyFromBlockSection(property4);
    await propertyPage.verifyNoFormulaError();
    await propertyPage.verifyFormulaResult("8 kg");

    // Multiplication Case-1: Create multiplication formula
    const multiPropertyName1 = "Multi_Prop_without_Unit";
    await propertyPage.createPropertyWithValue(multiPropertyName1, "9 kg");
    
    const multiPropertyName2 = "Multi_Prop_with_Unit";
    await propertyPage.createPropertyWithValue(multiPropertyName2, "2");
    
    const multiPropertyName3 = "Multi_Result";
    const multiFormula = `{{${multiPropertyName1}}} * {{${multiPropertyName2}}}`;
    await propertyPage.createFormulaProperty(multiPropertyName3, multiFormula);
    
    // Verify multiplication result
    await propertyPage.verifyNoFormulaError();
    await propertyPage.verifyFormulaResult("18 kg");

    // Multiplication Case-2: With different unit
    await propertyPage.addPropertyValue(multiPropertyName2, "2 m");
    await propertyPage.verifyFormulaResult("18 kg m");

    // Multiplication Case-3: With same unit (squared result)
    await propertyPage.addPropertyValue(multiPropertyName2, "3 kg");
    await propertyPage.verifyFormulaResult("27 kg^2");
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