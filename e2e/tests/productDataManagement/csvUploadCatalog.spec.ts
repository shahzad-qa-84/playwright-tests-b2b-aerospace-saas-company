import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { hardwareCatalogPage } from "../../pageobjects/hardwareCatalog.po";
import { homePage } from "../../pageobjects/homePage.po";
test.describe.serial("Add Catalog via CSV file", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that CSV upload method for Hardware Catalog works. @prod @featureBranch @smokeTest", async ({ page }) => {
    const hardwareCatalog = new hardwareCatalogPage(page);

    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickHardwareCatalog();

    // Add Catalog Item
    await hardwareCatalog.clickAddNewCatalog();

    // Attach CAD file
    await page.getByTestId("button_set-catalog-item-dialog-mode_csv").click();
    await page.getByLabel("Add catalog item").getByRole("textbox").setInputFiles("./resources/importFile.csv");
    await page.waitForSelector("text=Importing file...", { state: "hidden", timeout: 60000 });
    await page.locator("td:nth-child(2) > .bp5-popover-target > .bp5-button").first().click();
    await page.locator("td:nth-child(3) > .bp5-popover-target > .bp5-button").first().click();
    await page
      .locator("div")
      .filter({ hasText: /^label$/ })
      .first()
      .click();
    await page.locator("td:nth-child(4) > .bp5-popover-target > .bp5-button").first().click();
    await page.locator("div").filter({ hasText: /^id$/ }).nth(1).click();
    await page.locator("td:nth-child(6) > .bp5-popover-target > .bp5-button").first().click();
    await page.getByText("description", { exact: true }).first().click();
    await page.getByTestId("button_csv-submit-catalog-item").click();

    // Verify that success message is displayed
    await expect(await page.getByText("Successfully started catalog")).toBeVisible();

    // Search for the new block and verify the import is successful
    await page.getByPlaceholder("Search").click();
    await page.getByPlaceholder("Search").fill("New Block");
    await expect(await page.getByRole("gridcell", { name: "New Block" }).first()).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const hardwareCatalog = new hardwareCatalogPage(page);
    await hardwareCatalog.searchAndDeleteCatalogFirstRecordOnly();
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
