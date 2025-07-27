import { Page } from "@playwright/test";

export class requirements {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickNewDocument() {
    await this.page.getByTestId("nav-link_menu-pane_requirements").click();
    await this.page.getByTestId("button_requirements-frame_create").click();
  }

  async clickNewRequirentBlock() {
    await this.page.getByTestId("button_new-row").click();
    await this.page.getByTestId("menu-item_add-requirement-block").click();
    await this.page
      .locator('[data-testid*="editor-content_rich-text-cell_"][data-testid*="_description"]')
      .first()
      .getByRole("paragraph")
      .click();
  }

  async clickDocumentView() {
    await this.page.getByTestId("button_document-view").click();
  }

  async clickAddColumn() {
    await this.page.getByTestId("button_open-add-column-menu").click();
  }

  async addNewColumn(columnName: string) {
    await this.page.getByTestId("menu-item_add-new-status").click();
    await this.page.getByRole("heading", { name: "New Status" }).click();
    await this.page.getByRole("heading", { name: "New Status" }).click();
    await this.page.getByRole("columnheader", { name: "New Status" }).getByTestId("button_header-cell_default").click();
    const txtBxColumnName = await this.page.locator("ul").filter({ hasText: "NameData" }).getByRole("textbox");
    await txtBxColumnName.press("ControlOrMeta+a");
    await txtBxColumnName.fill(columnName);
    await txtBxColumnName.press("Enter");
  }
}
