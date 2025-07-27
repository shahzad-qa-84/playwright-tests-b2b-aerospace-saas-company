import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { hardwareCatalogPage } from "../../pageobjects/hardwareCatalog.po";
import { homePage } from "../../pageobjects/homePage.po";
test.describe.serial("Add Catalog Manually", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Hardware Catalog process by adding manually works. @prod @featureBranch @smokeTest", async ({ page }) => {
    const hardwareCatalog = new hardwareCatalogPage(page);

    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickHardwareCatalog();

    // Add Catalog Item
    await hardwareCatalog.clickAddNewCatalog();

    // Enter Part Name
    const partName = faker.internet.userName();
    await hardwareCatalog.enterPartname(partName);

    // Enter Part Number
    await hardwareCatalog.enterPartnumber("testPN");

    // Select Assembly Status

    await hardwareCatalog.selectAssemblyStatus();

    // Enter Cost
    await hardwareCatalog.enterCost("60");

    // Enter Primary Material
    await hardwareCatalog.enterPrimaryMaterial("O002");

    // Enter Supplier
    await hardwareCatalog.enterSupplier("test_supplier");

    // Enter Inventory
    await hardwareCatalog.enterInventory("78");

    // Enter Lead Time Days
    await hardwareCatalog.enterLeadTimeDays("1");

    // Enter Description
    await hardwareCatalog.enterDescription("this is a test description");

    // Upload Attachments as CAD and Image
    await hardwareCatalog.uploadAttachments("./resources/testSolidwork1.sldasm");
    await hardwareCatalog.uploadImage("./resources/b2bSaas-logo.png");

    // Submit Catalog Item
    await hardwareCatalog.clickAdd();

    // Verify Catalog Item
    await page.getByPlaceholder("Search").click();
    await page.getByPlaceholder("Search").fill(partName);
    await page
      .getByRole("treegrid")
      .getByText("" + partName + "")
      .first()
      .click();

    await page.getByTestId("button_catalog-item-action_0").hover();
    await page.getByTestId("button_catalog-item-expand_0").click();
    await page.getByText("Part number:testPN").click();
    await expect(await page.getByText("Part name:" + partName)).toBeVisible();
    await expect(await page.getByText("Part type:assembly")).toBeVisible();
    await expect(await page.getByText("Status:Pending")).toBeVisible();
    await expect(await page.getByText("Part number:testPNPart name:")).toBeVisible();
    await expect(await page.getByText("Made:In-House")).toBeVisible();
    await expect(await page.getByRole("treegrid").getByText("" + partName + "")).toBeVisible();
    await expect(await page.getByText("Inventory: 78")).toBeVisible();

    // Edit Sourcing
    await page.getByTestId("button_edit-sourcing").click();
    await page
      .locator("div")
      .filter({ hasText: /^Lead Time: Days$/ })
      .getByRole("spinbutton")
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Lead Time: Days$/ })
      .getByRole("spinbutton")
      .fill("11");
    await page.getByTestId("button_save-sourcing").click();
    await expect(await page.getByText("Lead Time: 11 days")).toBeVisible();
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
