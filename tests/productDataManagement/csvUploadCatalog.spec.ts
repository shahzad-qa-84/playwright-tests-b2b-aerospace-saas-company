import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { hardwareCatalogPage } from "../../pageobjects/hardwareCatalog.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { CsvUploadPage } from "../../pageobjects/csvUpload.po";
test.describe.serial("Add Catalog via CSV file", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that CSV upload method for Hardware Catalog works. @prod @featureBranch @smokeTest", async ({ page }) => {
    const hardwareCatalog = new hardwareCatalogPage(page);
    const homePage = new HomePage(page);
    const csvUploadPage = new CsvUploadPage(page);

    // Navigate to Hardware Catalog
    await homePage.clickHardwareCatalog();

    // Add Catalog Item
    await hardwareCatalog.clickAddNewCatalog();

    // Complete CSV upload workflow
    await csvUploadPage.completeCsvUploadWorkflow();
  });
  test.afterEach(async ({ page }) => {
    const hardwareCatalog = new hardwareCatalogPage(page);
    await hardwareCatalog.searchAndDeleteCatalogFirstRecordOnly();
    
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
