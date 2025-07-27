import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { importPage } from "../../pageobjects/import.po";
test.describe.serial("CSV Import without Dryrun", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("CSV Import without Dry run, and Filtering is working. @smokeTest @featureBranch @prod", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickImports();

    // start imports process
    const importsPage = new importPage(page);
    await importsPage.clickCreateImport();

    // click 'Import to Model blocks' option
    await importsPage.clickImporttoModelBlocks();
    await importsPage.uncheckDryRun();
    await importsPage.clickNext();

    // Upload Csv
    await importsPage.uploadImportFile("./resources/importFile.csv");

    // Click Next
    await importsPage.clickNext();

    // Select the "System"
    await page.getByPlaceholder("Select here").waitFor({ state: "visible" });
    await page.getByPlaceholder("Select here").click();
    await page.getByTestId("menu-item_autocomplete-item").click();
    await importsPage.clickNext();

    // Verify the import row is added properly with proper data
    await expect(page.getByRole("cell", { name: "New Block" }).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: "5", exact: true })).toBeVisible();
    await expect(page.getByRole("cell", { name: "PN-" }).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: "This is a sample block" }).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: "a9876b5432c" }).first()).toBeVisible();

    // Submit import
    await page.getByRole("button", { name: "Submit" }).click();

    // Wait for "loading" spinner to disapper and success message is displayed
    await page.waitForSelector(".bp5-spinner-head", {
      state: "hidden",
      timeout: 150000,
    });

    // Verify the import row is added properly
    await expect(await page.getByText("Success", { exact: true })).toBeVisible();

    // Go to Modelling page and verify the blocks are imported
    await b2bSaasHomePage.clickModelling();

    // Verify that Block is present in the Grid tree
    await page.getByText("x5").click();
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^New BlockPN-0012345$/ })
        .first()
    ).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
