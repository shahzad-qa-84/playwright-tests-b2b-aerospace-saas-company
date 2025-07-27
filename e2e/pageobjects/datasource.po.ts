import { Page } from "@playwright/test";

export class dataSource {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createDataSource(dataSourceName: string) {
    await this.page.getByTestId("button_add-data-connection").click();
    await this.page.getByTestId("button_continue").click();
    await this.page.locator('input[type="text"]').click();
    await this.page.locator('input[type="text"]').fill(dataSourceName);
    await this.page.locator("textarea").click();
    await this.page.locator("textarea").fill(dataSourceName);
  }

  async clickIntegration() {
    await this.page.getByText("Select an Integration").click();
  }

  async clickSpreadsheet() {
    await this.page.getByText("Select a Spreadsheet").click();
  }

  async clickContinue() {
    await this.page.getByTestId("button_continue").click();
  }

  async selectGoogleSheet() {
    await this.page.getByTestId("button_open-integration-provider-dropdown").click();
    await this.page.getByTestId("menu-item_dropdown-menu-item-googlesheets").click();
  }

  async clickTestSheet(sheetName: string) {
    await this.page.getByPlaceholder("Search...").click();
    await this.page.getByPlaceholder("Search...").fill(sheetName);
    await this.page.locator('[data-testid*="menu-item_select-sheet-"]').first().click();
  }

  async clickQueryData() {
    await this.page.getByText("Query data").click();
  }

  async enterQueryData(datavalue: string) {
    const textBxData = await this.page.getByPlaceholder("Enter query string");
    await textBxData.fill("");
    await textBxData.press("CapsLock");
    await textBxData.fill(datavalue);
  }

  async clickSubmitDataSource() {
    await this.page.getByTestId("button_submit-data-source").click();
  }

  async clickFinish() {
    await this.page.getByTestId("button_finish").click();
  }

  async clickCopyLink() {
    await this.page.getByTestId("button_copy-link").click();
  }

  async clickThreeDots() {
    await this.page.locator("button[data-testid^='button_data-source-action_']").first().click();
  }

  async enterTestAreaData(value: string) {
    const textArea = await this.page
      .locator("div")
      .filter({ hasText: /^Test Area =$/ })
      .getByRole("textbox");
    await textArea.click();
    await textArea.fill(value);
  }
}
