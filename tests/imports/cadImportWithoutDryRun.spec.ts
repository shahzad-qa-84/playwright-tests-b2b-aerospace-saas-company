import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { importPage } from "../../pageobjects/import.po";
test.describe.serial("CAD Import without Dry run", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that CAD Import is working without Dry run. @smokeTest", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickImports();

    // start imports process
    const importsPage = new importPage(page);
    await importsPage.clickCreateImport();

    // click 'Import to Model blocks' option
    await importsPage.clickImporttoModelBlocks();
    await importsPage.uncheckDryRun();
    await importsPage.clickNext();

    // Upload CAD file
    await importsPage.uploadImportFile("./resources/testSolidwork1.sldasm");
    await importsPage.clickNext();

    // Select the "System"
    await page.getByPlaceholder("Select here").waitFor({ state: "visible" });
    await page.getByPlaceholder("Select here").click();
    await page.getByTestId("menu-item_autocomplete-item").click();

    await page.getByRole("button", { name: "Submit" }).click();

    // Wait for "loading" spinner to disapper and success message is displayed
    await page.waitForSelector(".bp5-spinner-head", {
      state: "hidden",
      timeout: 150000,
    });

    // Verify the import row is added properly
    await expect(page.getByText("Success")).toBeVisible();

    // Wait a bit, so that Data is displayed on Modelling page
    await page.waitForTimeout(5000);

    // Go to Modelling page and verify the blocks are imported
    await b2bSaasHomePage.clickModelling();

    // Verify that 24 childs are present
    await expect(page.getByText("24", { exact: true })).toBeVisible();

    // Verify that the blocks are present in the Grid tree
    const block = await page.getByRole("treegrid");
    await expect(block.getByText("1. Barrel-1")).toBeVisible();
    await expect(block.getByText("2.Piston Rod-1")).toBeVisible();
    await expect(block.getByText("3.Piston-1")).toBeVisible();
    await expect(block.getByText("4.Piston CAP-1")).toBeVisible();
    await expect(block.getByText("6.Barral Cap-1")).toBeVisible();
    await expect(block.getByText("7.Front Cap-1")).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
