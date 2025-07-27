import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { importPage } from "../../pageobjects/import.po";

test.describe.serial("CSV Import Test with Dry Run and Filtering", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    // Create a test workspace before each test
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("CSV import with dry run, confirmation and filtering works as expected. @smokeTest @featureBranch @prod", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    const importsPage = new importPage(page);

    // Navigate to the Imports section
    await b2bSaasHomePage.clickImports();

    // Start the CSV import flow
    await importsPage.clickCreateImport();
    await importsPage.clickImporttoModelBlocks();
    await importsPage.clickNext();

    // Upload the CSV file
    await importsPage.uploadImportFile("./resources/importFile.csv");
    await importsPage.clickNext();

    // Select a system from the dropdown
    await importsPage.selectFirstSystem();
    await importsPage.clickNext();

    // Submit the dry run
    await importsPage.submitImport();

    // Wait until dry run processing is finished
    await importsPage.waitForDryRunToFinish();

    // Confirm and accept the import
    await importsPage.confirmImport();

    // Filter imports list using correct and incorrect file names
    await importsPage.searchImportFile("abc_random_str");
    await expect(page.getByText("No file names matching search query")).toBeVisible();

    // Clear the incorrect search
    await importsPage.clearSearch();
    await expect(page.getByText("No file names matching search query")).toBeHidden();

    // Search with the correct file name
    await importsPage.searchImportFile("importFile.csv");

    // Validate that the import row appears with status "Success"
    await expect(page.getByText("Success", { exact: true })).toBeVisible();

    // Ensure that the file is listed after successful import
    await expect(page.locator("td").first()).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Clean up: delete the test workspace
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
