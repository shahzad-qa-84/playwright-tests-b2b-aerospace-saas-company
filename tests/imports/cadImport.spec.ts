import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { importPage } from "../../pageobjects/import.po";

test.describe.serial("CAD Import", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that CAD Import with Dry Run is working. @smokeTest @featureBranch @prod", async ({ page }) => {
    const homePage = new HomePage(page);
    const importsPage = new importPage(page);

    // Step 1: Navigate to the Imports section
    await homePage.clickImports();

    // Step 2: Start the import process
    await importsPage.clickCreateImport();

    // Step 3: Select "Import to Model blocks" and continue
    await importsPage.clickImportToModelBlocks();
    await importsPage.clickNext();

    // Step 4: Upload the CAD file (SolidWorks Assembly)
    await importsPage.uploadImportFile("./resources/testSolidwork1.sldasm");
    await importsPage.clickNext();

    // Step 5: Select a system from the dropdown
    await importsPage.selectFirstSystem();

    // Step 6: Submit the import and wait for dry run processing
    await importsPage.submitImport();
    await importsPage.waitForDryRunToFinish();

    // Step 7: Confirm and finalize the import
    await importsPage.confirmImport();
    await importsPage.verifySuccessMessage();

    // Step 8: Navigate to the Modeling section and verify imported blocks
    await homePage.clickModelling();

    // Step 9: Verify that the imported blocks are present in the model tree
    const block = page.getByRole("treegrid");
    await expect(block.getByText("1. Barrel-1")).toBeVisible();
    await expect(block.getByText("2.Piston Rod-1")).toBeVisible();
    await expect(block.getByText("3.Piston-1")).toBeVisible();
    await expect(block.getByText("4.Piston CAP-1")).toBeVisible();
    await expect(block.getByText("6.Barral Cap-1")).toBeVisible();
    await expect(block.getByText("7.Front Cap-1")).toBeVisible();
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