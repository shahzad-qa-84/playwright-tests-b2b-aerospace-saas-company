import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.po";

export class hardwareCatalogPage extends BasePage {
  readonly txtBxFullName: Locator;

  constructor(page: Page) {
    super(page);
    this.txtBxFullName = this.locator(".name-email-area label:nth-child(1) input:nth-child(1)");
  }

  async enterPartname(partName: string) {
    await this.page.getByLabel("Part name").click();
    await this.page.getByLabel("Part name").fill(partName);
  }

  async expandFirstRow() {
    await this.page.getByTestId("button_catalog-item-action_0").hover();
    await this.page.getByTestId("button_catalog-item-expand_0").click();
  }

  async enterPartnumber(partNumber: string) {
    await this.page.getByLabel("Part number").click();
    await this.page.getByLabel("Part number").fill(partNumber);
  }

  async clickAddNewCatalog() {
    await this.page.getByTestId("button_add-catalog-item").first().click();
  }

  async enterCost(cost: string) {
    await this.page.getByLabel("Cost$").click();
    await this.page.getByLabel("Cost$").fill(cost);
  }

  async enterPrimaryMaterial(value: string) {
    await this.page.getByLabel("Primary Material").click();
    await this.page.getByLabel("Primary Material").fill(value);
  }

  async enterSupplier(value: string) {
    await this.page.getByLabel("Supplier").click();
    await this.page.getByLabel("Supplier").fill(value);
  }

  async selectAssemblyStatus() {
    await this.page.getByTestId("button_select-status-button").click();
    await this.page.getByTestId("button_select-part-type-button").click();
    await this.page.getByLabel("selectable options").getByText("assembly").click();
  }

  async enterInventory(value: string) {
    await this.page.getByLabel("Inventory").click();
    await this.page.getByLabel("Inventory").fill(value);
  }

  async enterLeadTimeDays(value: string) {
    await this.page
      .locator("div")
      .filter({ hasText: /^Lead timeDays$/ })
      .getByRole("spinbutton")
      .click();
    await this.page
      .locator("div")
      .filter({ hasText: /^Lead timeDays$/ })
      .getByRole("spinbutton")
      .fill(value);
  }

  async enterDescription(value: string) {
    await this.page.getByLabel("Description").click();
    await this.page.getByLabel("Description").fill(value);
  }

  async uploadAttachments(fileName: string) {
    await this.page.getByLabel("Add catalog item").locator('input[type="file"]').setInputFiles(fileName);
  }

  async searchAndDeleteCatalogFirstRecordOnly() {
    await this.page.locator('[data-testid*="button_catalog-item-action"]').first().isVisible({ timeout: 30000 });
    await this.page.waitForTimeout(1000);
    if (await this.page.locator("[col-id='checkbox']").nth(1).isVisible()) {
      await this.page.locator("[col-id='checkbox']").nth(1).click();
      await this.page.getByTestId("button_catalog-items-delete-btn").click();
      await this.page.getByTestId("button_confirmation-dialog_delete_confirm").click();
    }
  }

  async searchAndDeleteCatalogHardwareValues(hardwareValues: string[]) {
    for (const text of hardwareValues) {
      await this.page.getByPlaceholder("Search").click();
      await this.page.getByPlaceholder("Search").clear();
      await this.page.getByPlaceholder("Search").fill(text);
      await this.page.locator('[data-testid*="button_catalog-item-action"]').first().isVisible({ timeout: 30000 });
      await this.page.waitForTimeout(1000);
      if (await this.page.locator("[col-id='checkbox']").nth(1).isVisible()) {
        await this.page.locator("[col-id='checkbox']").nth(1).click();
        await this.page.getByTestId("button_catalog-items-delete-btn").click();
        await this.page.getByTestId("button_confirmation-dialog_delete_confirm").click();
      }
    }
  }

  async uploadImage(fileName: string) {
    await this.page.getByTestId("button_upload-image").click();
    await this.page.getByLabel("Upload").getByRole("textbox").setInputFiles(fileName);
    await this.page.getByLabel("Add catalog item").getByText("Part name").click();
  }

  async clickAdd() {
    await this.page.getByTestId("button_manual-submit-catalog-item").click();
  }
}
