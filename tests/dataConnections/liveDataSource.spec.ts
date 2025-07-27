import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { dataSource } from "../../pageobjects/datasource.po";
import { propertyPage } from "../../pageobjects/property.po";

test.describe.serial("Data Sources @featureBranch @smokeTest", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Live Data source works fine by adding directly from link in the property.", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    const dataSourcePage = new dataSource(page);
    const property = new propertyPage(page);

    const sheetName = "e2e-testing-sheet";
    const range = "A1:B1";
    const expectedValue = "10 kg";
    const propertyName = "mass";

    // Data Source creation flow
    await b2bSaasHomePage.clickDataSources();
    await dataSourcePage.createDataSource("Test data source");
    await dataSourcePage.clickIntegration();
    await dataSourcePage.clickSpreadsheet();
    await dataSourcePage.clickContinue();
    await dataSourcePage.selectGoogleSheet();
    await dataSourcePage.clickContinue();
    await dataSourcePage.clickTestSheet(sheetName);
    await dataSourcePage.clickSubmitDataSource();
    await dataSourcePage.enterTestAreaData(range);
    await expect(page.getByText(expectedValue)).toBeVisible();
    await dataSourcePage.clickFinish();

    // Query data from source
    await dataSourcePage.clickThreeDots();
    await dataSourcePage.clickQueryData();
    await expect(page.getByRole("gridcell", { name: "10" }).first()).toBeVisible();
    await expect(page.getByRole("gridcell", { name: "20" })).toBeVisible();
    await expect(page.getByRole("gridcell", { name: "30kg" })).toBeVisible();
    await expect(page.getByRole("gridcell", { name: "kg", exact: true })).toBeVisible();
    await page.getByLabel("Close").click();

    // Modeling: Link data source to property
    await b2bSaasHomePage.clickModelling();
    await property.addPropertyOrGroupLink();
    await property.addNewPropertyFromBlockSection(propertyName);
    await page.waitForTimeout(1000);

    const txtBxProperty = page.getByTestId(`editor-content_scalar-expression-editor_${propertyName}`).getByRole("paragraph");
    await txtBxProperty.click();
    await page.getByTestId("button_show-data-source-overlay").click();
    await page.getByPlaceholder("Enter query string").fill(range);
    await page.getByTestId("button_add-data-source").click();
    await page.waitForTimeout(1000);
    await txtBxProperty.press("Enter");

    // Final check
    await expect(page.getByTestId(`editor-content_scalar-expression-editor_${propertyName}`).getByText(expectedValue)).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
