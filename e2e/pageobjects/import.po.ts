import { Locator, Page } from "@playwright/test";

export class importPage {
  readonly page: Page;
  readonly btnUploadProfilePic: Locator;
  readonly txtBxFullName: Locator;
  readonly txtBxRole: Locator;
  readonly txtDepartment: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btnUploadProfilePic = this.page.locator("label").filter({ hasText: "Upload new photo" });
    this.txtBxFullName = this.page.locator(".name-email-area label:nth-child(1) input:nth-child(1)");
    this.txtBxRole = this.page.locator(".user-details-area label:nth-child(1) input");
    this.txtDepartment = this.page.locator(".user-details-area label:nth-child(2) input");
  }

  async clickCreateImport() {
    await this.page.getByTestId("button_create-import").click();
  }

  async clickImporttoModelBlocks() {
    await this.page.getByText("Import to Model Blocks").click();
  }

  async uncheckDryRun() {
    await this.page.locator("label").filter({ hasText: "Dry run" }).locator("span").click();
  }

  async clickNext() {
    await this.page.getByRole("button", { name: "Next" }).click();
  }

  async uploadImportFile(path: string) {
    await this.page.getByLabel("Create import").getByRole("textbox").setInputFiles(path);
  }
}
