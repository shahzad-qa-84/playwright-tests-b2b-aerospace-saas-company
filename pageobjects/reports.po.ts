import { Locator, Page } from "@playwright/test";

export class reportsPage {
  readonly page: Page;
  readonly txtBxAddNewProperty: Locator;

  constructor(page: Page) {
    this.page = page;
    this.txtBxAddNewProperty = page.getByPlaceholder("Add new property");
  }

  async createReport(reportTitle: string) {
    await this.page.getByRole("button", { name: "Add a page" }).click();
    await this.page.getByPlaceholder("Untitled").fill(reportTitle);
    await this.page.getByPlaceholder("Untitled").press("Enter");
  }
}
