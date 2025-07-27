import { Page } from "@playwright/test";

export class bom {
  static clickCreateNewBom() {
    throw new Error("Method not implemented.");
  }
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createNewBomFromscratch(bomName: string) {
    await this.page.getByTestId("button_create-new-bom").nth(1).click();
    await this.page.getByTestId("menu-item_create-from-scratch").click();
    await this.page.getByPlaceholder("Enter table name...").fill(bomName);
    await this.page.getByText("New System").click();
  }

  async addRow(rowName: string) {
    const addNewRow = await this.page.getByPlaceholder("Add new row");
    await addNewRow.click();
    await addNewRow.fill(rowName);
    await addNewRow.press("Enter");
  }

  async clickMenufirstRow() {
    await this.page.locator('[data-testid*="button_menuexpand_"]').first().click();
  }

  async clickRemoveRow() {
    await this.page.getByTestId("menu-item_remove-row").click();
  }
}
