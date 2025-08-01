import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { dataSource } from "../../pageobjects/datasource.po";
import { PropertyPage } from "../../pageobjects/propertyRefactored.po";
import { TEST_DATA } from "../../utilities/constants";

test.describe.serial("Data Sources @featureBranch @smokeTest", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Live Data source works fine by adding directly from link in the property.", async ({ page }) => {
    const homePage = new HomePage(page);
    const dataSourcePage = new dataSource(page);
    const propertyPage = new PropertyPage(page);

    const sheetName = TEST_DATA.GOOGLE_SHEETS.TEST_SHEET.name;
    const range = TEST_DATA.GOOGLE_SHEETS.TEST_SHEET.range;
    const expectedValue = TEST_DATA.GOOGLE_SHEETS.TEST_SHEET.expectedValue;
    const propertyName = "mass";

    // Data Source creation flow
    await homePage.clickDataSources();
    await dataSourcePage.createDataSource("Test data source");
    await dataSourcePage.clickIntegration();
    await dataSourcePage.clickSpreadsheet();
    await dataSourcePage.clickContinue();
    await dataSourcePage.selectGoogleSheet();
    await dataSourcePage.clickContinue();
    await dataSourcePage.clickTestSheet(sheetName);
    await dataSourcePage.clickSubmitDataSource();
    await dataSourcePage.enterTestAreaData(range);
    
    // Verify expected value is visible
    await expect(page.getByText(expectedValue)).toBeVisible();
    await dataSourcePage.clickFinish();

    // Query data from source
    await dataSourcePage.clickThreeDots();
    await dataSourcePage.clickQueryData();
    
    // Verify grid data
    await expect(page.getByRole("gridcell", { name: "10" }).first()).toBeVisible();
    await expect(page.getByRole("gridcell", { name: "20" })).toBeVisible();
    await expect(page.getByRole("gridcell", { name: "30kg" })).toBeVisible();
    await expect(page.getByRole("gridcell", { name: "kg", exact: true })).toBeVisible();
    
    // Close query dialog
    await page.getByLabel("Close").click();

    // Navigate to modelling and link data source to property
    await homePage.clickModelling();
    await propertyPage.addPropertyOrGroupLink();
    await propertyPage.addNewPropertyFromBlockSection(propertyName);
    await page.waitForTimeout(1000);

    // Link data source to property
    const propertyEditor = page.getByTestId(`editor-content_scalar-expression-editor_${propertyName}`).getByRole("paragraph");
    await propertyEditor.click();
    await page.getByTestId("button_show-data-source-overlay").click();
    await page.getByPlaceholder("Enter query string").fill(range);
    await page.getByTestId("button_add-data-source").click();
    await page.waitForTimeout(1000);
    await propertyEditor.press("Enter");

    // Verify final result
    await expect(page.getByTestId(`editor-content_scalar-expression-editor_${propertyName}`).getByText(expectedValue)).toBeVisible();
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