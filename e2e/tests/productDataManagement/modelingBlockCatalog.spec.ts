import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { hardwareCatalogPage } from "../../pageobjects/hardwareCatalog.po";
import { homePage } from "../../pageobjects/homePage.po";
test.describe.serial("Add Catalog via Modeling block", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Modeling block method for Hardware Catalog works. @prod @featureBranch @smokeTest", async ({ page }) => {
    const hardwareCatalog = new hardwareCatalogPage(page);

    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickHardwareCatalog();

    // Add Catalog Item
    await hardwareCatalog.clickAddNewCatalog();

    // Attach CAD file
    await page.getByTestId("button_set-catalog-item-dialog-mode_block").click();
    await page.getByTestId("button_select-workspace").click();
    await page
      .getByLabel("selectable options")
      .getByText("" + workspaceName + "")
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^new system$/ })
      .nth(2)
      .click();
    await page.getByTestId("button_csv-submit-catalog-item").click();

    // Verify that New Block is displayed
    await expect(await page.getByText("New System").first()).toBeVisible();

    // Expans New System details
    await page.waitForTimeout(1000);
    const searchTxtBx = await page.getByPlaceholder("Search", { exact: true });
    await searchTxtBx.click();
    await searchTxtBx.fill("new system");

    await page.getByTestId("pdmActionsCell").first().hover();
    await page.getByTestId("pdmActionsCell").first().click();

    // Verify data is expanded
    await expect(await page.locator("span").filter({ hasText: "Part number:" }).first()).toBeVisible();
    await expect(await page.getByText("Part name:")).toBeVisible();
    await expect(await page.getByText("Part type:")).toBeVisible();
    await expect(await page.getByText("Made:In-House")).toBeVisible();
    await expect(await page.getByText("Description:")).toBeVisible();
    await expect(await page.getByRole("heading", { name: "Sourcing" })).toBeVisible();
    await expect(await page.getByText("Supplier:")).toBeVisible();
    await expect(await page.getByText("Lead Time:")).toBeVisible();
    await expect(await page.getByText("Inventory:")).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    // Delete Catalog data
    await new hardwareCatalogPage(page).searchAndDeleteCatalogFirstRecordOnly();
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
