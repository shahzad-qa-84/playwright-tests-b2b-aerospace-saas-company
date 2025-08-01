import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { ModellingPage } from "../../pageobjects/modellingRefactored.po";

test.describe("Property to Modelling configuration", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateEngineeringWorkspace(workspaceName);
  });
  
  test("Verify that test for adding/deleting property with various configuration in the 'Model configuration' works. @prod @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const modellingPage = new ModellingPage(page);

    // Navigate to modelling section
    await homePage.clickModelling();

    // Navigate to properties configuration
    await modellingPage.clickModelConfiguration();
    await modellingPage.clickProperties();

    // Add first property
    await modellingPage.addNewProperty();
    await modellingPage.enterPropertyName("mass");
    
    // Click actions for the mass property
    const massRow = page.getByRole("row", { name: "mass Intrinsic scalar kg 1" });
    await massRow.getByTestId("button_actions-cell_drag").click();

    // Add multiple properties at once
    await modellingPage.addNewProperty();
    await modellingPage.enterPropertyName("mass");
    await modellingPage.submitPropertyName();
    await modellingPage.enterPropertyName("@mass");
    await modellingPage.submitPropertyName();
    await modellingPage.enterPropertyName("@power");
    await modellingPage.submitPropertyName();
    await modellingPage.blurPropertyInput();

    // Delete power property
    await modellingPage.deleteProperty("power");

    // Click on unit cells
    await modellingPage.clickUnitCell("volume");
    await page.locator(".ag-center-cols-container > div:nth-child(4) > div:nth-child(3)").click();

    // Verify properties are visible
    await modellingPage.verifyPropertyVisible("mass");
    await modellingPage.verifyPropertyVisible("volume");
    await modellingPage.verifyPropertyVisible("cost");

    // Work with @power and @mass properties
    await page.getByTestId("ag-cell_label_@power").click();
    await page.getByTestId("ag-cell_group_@mass").click();

    // Set group value for @mass
    await modellingPage.setPropertyGroup("@mass", "test");

    // Set property type to string for @mass
    await modellingPage.setPropertyType("@mass", "string");
    
    // Click on specific cell
    await page.locator("div:nth-child(4) > div:nth-child(6)").click();

    // Set unit for @mass property
    await modellingPage.setPropertyUnit("@mass", "EUR");

    // Verify EUR unit is visible
    await modellingPage.verifyUnitVisible("EUR");
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