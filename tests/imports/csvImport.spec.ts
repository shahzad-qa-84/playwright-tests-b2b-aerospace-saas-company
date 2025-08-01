import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { importPage } from "../../pageobjects/import.po";

test.describe.serial("CSV Import Test with Dry Run and Filtering", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("CSV import with dry run, confirmation and filtering works as expected. @smokeTest @featureBranch @prod", async ({ page }) => {
    const homePage = new HomePage(page);
    const importsPage = new importPage(page);

    // Step 1: Navigate to the Imports section
    await homePage.clickImports();

    // Step 2: Start the CSV import flow
    await importsPage.clickCreateImport();
    await importsPage.clickImportToModelBlocks(); // Fixed method name
    await importsPage.clickNext();

    // Step 3: Upload the CSV file
    await importsPage.uploadImportFile("./resources/importFile.csv");
    await importsPage.clickNext();

    // Step 4: Select a system from the dropdown
    await importsPage.selectFirstSystem();
    await importsPage.clickNext();

    // Step 5: Submit the dry run
    await importsPage.submitImport();

    // Step 6: Wait until dry run processing is finished
    await importsPage.waitForDryRunToFinish();

    // Step 7: Confirm and accept the import
    await importsPage.confirmImport();

    // Step 8: Test filtering with incorrect file name
    await importsPage.searchImportFile("abc_random_str");
    await expect(page.getByText("No file names matching search query")).toBeVisible();

    // Step 9: Clear the incorrect search
    await importsPage.clearSearch();
    await expect(page.getByText("No file names matching search query")).toBeHidden();

    // Step 10: Search with the correct file name
    await importsPage.searchImportFile("importFile.csv");

    // Step 11: Validate successful import status
    await expect(page.getByText("Success", { exact: true })).toBeVisible();

    // Step 12: Ensure that the file is listed after successful import
    await expect(page.locator("td").first()).toBeVisible();
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