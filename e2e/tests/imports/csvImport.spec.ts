import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { importPage } from "../../pageobjects/import.po";
test.describe.serial("CSV Import", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("CSV Import with Dry run, and Filtering is working. @smokeTest @featureBranch @prod", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickImports();

    // start imports process
    const importsPage = new importPage(page);
    await importsPage.clickCreateImport();

    // click 'Import to Model blocks' option
    await importsPage.clickImporttoModelBlocks();
    await importsPage.clickNext();

    // Upload Csv
    await importsPage.uploadImportFile("./resources/importFile.csv");
    await importsPage.clickNext();

    // Select the "System"
    await page.getByPlaceholder("Select here").waitFor({ state: "visible" });
    await page.getByPlaceholder("Select here").click();
    await page.getByTestId("menu-item_autocomplete-item").click();
    await importsPage.clickNext();
    await page.getByRole("button", { name: "Submit" }).click();

    // Wait for "loading" spinner to disapper and success message is displayed
    await page.waitForSelector(".bp5-spinner-head", {
      state: "hidden",
      timeout: 150000,
    });

    // Accept the import
    await page.getByTestId("button_confirm-import").click();
    await page.getByTestId("button_confirm").click();
    await page.getByPlaceholder("Search for the imports").fill("abc_random_str");
    await page.getByTestId("button_clear-search").click();
    await page.getByPlaceholder("Search for the imports").fill("importFile.csv");

    // Verify the import row is added properly
    await expect(await page.getByText("Success", { exact: true })).toBeVisible();

    // Search for any invalid string
    const btnSearchImport = await page.getByPlaceholder("Search for the imports");
    await btnSearchImport.click();
    await btnSearchImport.fill("abc_random_str");
    await expect(await page.getByText("No file names matching search query")).toBeVisible();

    // Clear search and verify search is cleared
    const btnClearSearch = await page.getByTestId("button_clear-search");
    await btnClearSearch.click();
    await expect(await page.getByText("No file names matching search query")).toBeHidden();

    // Search for the file
    await btnSearchImport.click();
    await btnSearchImport.fill("importFile.csv");
    await expect(await page.locator("td").first()).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
