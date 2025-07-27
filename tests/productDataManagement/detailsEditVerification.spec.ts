import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { hardwareCatalogPage } from "../../pageobjects/hardwareCatalog.po";
import { homePage } from "../../pageobjects/homePage.po";
test.describe.serial("Component and Tree Details to Catalog", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that PDM various sections details and edits are working. @smokeTest", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickHardwareCatalog();

    // Attach CAD file
    const hardwareCatalog = new hardwareCatalogPage(page);
    await hardwareCatalog.clickAddNewCatalog();
    await page.getByTestId("button_set-catalog-item-dialog-mode_cad").click();
    await page.getByLabel("Add catalog item").getByRole("textbox").setInputFiles("./resources/Cube.SLDASM");
    await page.waitForSelector("text=Importing file...", { state: "hidden", timeout: 60000 });
    await expect(page.locator(".file-panel--file").getByText("Cube.SLDASM")).toBeVisible();
    await page.getByTestId("button_cad-submit-catalog-item").click();
    await expect(await page.getByText("Successfully started catalog")).toBeVisible();

    // Verify that 'Add' button is visible
    await hardwareCatalog.expandFirstRow();
    await page.getByRole("heading", { name: "Attachments" }).hover();
    await expect(page.getByTestId("button_add-attachment")).toBeVisible();

    // Verify "Cube" thumbnail is visible
    await expect(page.locator('[class*="overviewCardImage-"]').first()).toBeVisible({ timeout: 60000 });

    // Verify Overiew card detail is editable
    await page.getByTestId("button_edit-overview").click();

    // Edit the part number and part name
    const partNumber = await page.getByLabel("Part number");
    await partNumber.click();
    await partNumber.fill("test");
    const partName = await page.getByLabel("Part name");
    await partName.click();
    const partNameValue = "Test Part";
    await partName.fill(partNameValue);
    await page.getByTestId("button_select-status-button").click();
    await page.getByLabel("selectable options").getByText("Active").click();
    await page.getByText("Sourced").click();
    const description = await page.getByPlaceholder("Enter a description...");
    await description.click();
    await description.fill("Test\n");
    await page.getByTestId("button_save-overview").click();

    // Verify that Overview details are edited properly
    await expect(page.getByText("Part number:test")).toBeVisible();
    await expect(page.getByText("Test Part").nth(1)).toBeVisible();
    const status = await page
      .getByTestId("button_cell-dropdown_catalog-item-status")
      .first()
      .locator(".status-tag.status-tag--active")
      .locator("span")
      .first();
    const textContent = await status.textContent();
    expect(textContent?.trim()).toBe("Active");
    await expect(page.getByText("Made:Sourced")).toBeVisible();
    await expect(page.getByText("Description:Test")).toBeVisible();

    // Verify that Specifications details are edited properly
    await page.getByRole("heading", { name: "Specifications" }).click();
    await page.getByTestId("button_edit-specification").click();
    const primaryMaterial = await page.getByLabel("Primary material");
    await primaryMaterial.click();
    await primaryMaterial.fill("45");
    await page.getByTestId("button_cost-button").click();
    await page.locator("span").filter({ hasText: "EUR" }).first().click();
    await page.getByLabel("Cost€").click();
    await page.getByLabel("Weightkg").click();
    await page.getByLabel("Weightkg").fill("78");
    const fileName = "Cube.SLDASM";
    await page
      .getByRole("textbox")
      .nth(4)
      .setInputFiles("./resources/" + fileName);
    await page.locator("label").filter({ hasText: "Add revision" }).locator("span").click();
    await page.getByRole("button", { name: "Update", exact: true }).click();
    await page.locator('[class*="overviewCardImage-"] ').first().isVisible();

    // Verify that Specifications details are edited properly
    await expect(page.getByText("Primary Material:45")).toBeVisible();
    await expect(page.getByText("Cost:€")).toBeVisible();
    await expect(page.getByText("Weight:78 kg")).toBeVisible();
    await expect(page.locator("div").filter({ hasText: /^Comment:$/ })).toBeVisible();

    // Edit Sourcing details
    await page.getByRole("heading", { name: "Sourcing" }).hover();
    await page.getByTestId("button_edit-sourcing").click();
    await page.getByRole("textbox").nth(2).click();
    await page.getByRole("textbox").nth(2).fill("supllier_sample");
    await page
      .locator("div")
      .filter({ hasText: /^Lead Time: Days$/ })
      .getByRole("spinbutton")
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Lead Time: Days$/ })
      .getByRole("spinbutton")
      .fill("45");
    await page.getByRole("spinbutton").nth(1).click();
    await page.getByRole("spinbutton").nth(1).fill("23");
    await page.getByTestId("button_save-sourcing").click();

    // Verify that Sourcing details are edited properly
    await expect(await page.getByText("Supplier: supllier_sample")).toBeVisible();
    await expect(await page.getByText("Lead Time: 45 Days")).toBeVisible();
    await expect(await page.getByText("Inventory: 23")).toBeVisible();

    // Verify that Attachments details are displayed properly
    await page
      .locator("span")
      .filter({ hasText: "" + fileName + "" })
      .first()
      .click();
    await expect(await page.getByLabel("Attachment details:").getByText("" + fileName + "", { exact: true })).toBeVisible();
    await expect(await page.getByText("model/solidworks")).toBeVisible();
    await expect(await page.getByRole("heading", { name: "Attachment details:" })).toBeVisible();
    await page.getByLabel("Attachment details: Cube.").getByLabel("Close").click();

    // Verify the Versions and Relations details
    await page.getByRole("heading", { name: "Versions" }).click();
    await page.getByText("Versions1").click();
    await page.getByRole("heading", { name: "Relations" }).click();
    await expect(page.getByTestId("rf__wrapper").locator("div").filter({ hasText: "Test Part" }).nth(1)).toBeVisible();

    // Delete the hardware catalog enteries generated by test
    const textValues = [partNameValue, "front-2", "right2-3", "right2-4", "front-4", "top-2", "top-3"];
    await hardwareCatalog.searchAndDeleteCatalogHardwareValues(textValues);
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
