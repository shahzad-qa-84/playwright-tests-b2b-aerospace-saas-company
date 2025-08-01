import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { importPage } from "../../pageobjects/import.po";

test.describe.serial("CAD Import without Dry Run", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that CAD Import is working without Dry Run. @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);
    const importsPage = new importPage(page);

    // Step 1: Navigate to the Imports section
    await homePage.clickImports();

    // Step 2: Start the import process and disable dry run
    await importsPage.clickCreateImport();
    await importsPage.clickImportToModelBlocks();
    await importsPage.uncheckDryRun();
    await importsPage.clickNext();

    // Step 3: Upload the CAD file (SolidWorks Assembly)
    await importsPage.uploadImportFile("./resources/testSolidwork1.sldasm");
    await importsPage.clickNext();

    // Step 4: Select the system from dropdown
    await page.getByPlaceholder("Select here").waitFor({ state: "visible" });
    await page.getByPlaceholder("Select here").click();
    await page.getByTestId("menu-item_autocomplete-item").click();

    // Step 5: Submit the import without dry run
    await page.getByRole("button", { name: "Submit" }).click();

    // Step 6: Wait for processing to complete
    await page.waitForSelector(".bp5-spinner-head", {
      state: "hidden",
      timeout: 150000,
    });
    await expect(page.getByText("Success")).toBeVisible();

    // Step 7: Allow time for data to be displayed
    await page.waitForTimeout(5000);

    // Step 8: Navigate to modelling and verify import results
    await homePage.clickModelling();

    // Step 9: Verify that 24 blocks/children were imported
    await expect(page.getByText("24", { exact: true })).toBeVisible();

    // Step 10: Verify specific blocks are visible in the model tree
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