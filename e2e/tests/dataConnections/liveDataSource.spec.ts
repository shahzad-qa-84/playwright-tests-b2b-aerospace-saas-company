import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { dataSource } from "../../pageobjects/datasource.po";
import { homePage } from "../../pageobjects/homePage.po";
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

    // Create Data Source
    const dataSourcePage = new dataSource(page);
    await b2bSaasHomePage.clickDataSources();
    await dataSourcePage.createDataSource("Test data source");
    await dataSourcePage.clickIntegration();
    await dataSourcePage.clickSpreadsheet();
    await dataSourcePage.clickContinue();
    await dataSourcePage.selectGoogleSheet();
    await dataSourcePage.clickContinue();

    // Attach file
    await dataSourcePage.clickTestSheet("e2e-testing-sheet");
    await dataSourcePage.clickSubmitDataSource();

    // Verify Data Source
    await dataSourcePage.enterTestAreaData("A1:B1");
    await expect(await page.getByText("10 kg")).toBeVisible();

    // Finish Data Source
    await dataSourcePage.clickFinish();

    // Query Data
    await dataSourcePage.clickThreeDots();
    await dataSourcePage.clickQueryData();

    // Verify Data Source on the sheet
    await expect(await page.getByRole("gridcell", { name: "10" }).first()).toBeVisible();
    await expect(await page.getByRole("gridcell", { name: "20" })).toBeVisible();
    await expect(await page.getByRole("gridcell", { name: "30kg" })).toBeVisible();
    await expect(await page.getByRole("gridcell", { name: "kg", exact: true })).toBeVisible();
    await page.getByLabel("Close").click();

    // Paste Link in property
    await b2bSaasHomePage.clickModelling();
    const property = new propertyPage(page);
    const propertyName = "mass";
    await property.addPropertyOrGroupLink();
    await property.addNewPropertyFromBlockSection(propertyName);

    await page.waitForTimeout(1000);

    const txtBxProperty = page.getByTestId("editor-content_scalar-expression-editor_mass").getByRole("paragraph");
    await txtBxProperty.click();
    await page.getByTestId("button_show-data-source-overlay").click();
    await page.getByPlaceholder("Enter query string").fill("A1:B1");
    await page.getByTestId("button_add-data-source").click();
    await page.waitForTimeout(1000);
    await txtBxProperty.press("Enter");

    // Verify Data value 10kg  in property
    await expect(await page.getByTestId("editor-content_scalar-expression-editor_mass").getByText("10 kg")).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
