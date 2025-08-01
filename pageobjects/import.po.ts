import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.po";

export class importPage extends BasePage {
  readonly btnUploadProfilePic: Locator;
  readonly txtBxFullName: Locator;
  readonly txtBxRole: Locator;
  readonly txtDepartment: Locator;

  constructor(page: Page) {
    super(page);
    this.btnUploadProfilePic = this.locator("label").filter({ hasText: "Upload new photo" });
    this.txtBxFullName = this.locator(".name-email-area label:nth-child(1) input:nth-child(1)");
    this.txtBxRole = this.locator(".user-details-area label:nth-child(1) input");
    this.txtDepartment = this.locator(".user-details-area label:nth-child(2) input");
  }

  async uncheckDryRun() {
    await this.page.locator("label").filter({ hasText: "Dry run" }).locator("span").click();
  }

  async clickImportToModelBlocks() {
    await this.page.getByText("Import to Model blocks", { exact: true }).click();
  }

  async searchImportFile(filename: string) {
    const searchBox = this.page.getByPlaceholder("Search for the imports");
    await searchBox.fill(filename);
  }

  async clearSearch() {
    await this.page.getByTestId("button_clear-search").click();
  }
}
