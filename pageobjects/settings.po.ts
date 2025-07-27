import { Locator, Page } from "@playwright/test";

export class settingsPage {
  readonly page: Page;
  readonly btnUploadProfilePic: Locator;
  readonly txtBxFullName: Locator;
  readonly txtBxRole: Locator;
  readonly txtDepartment: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btnUploadProfilePic = page.getByTestId("button_upload-file-button_upload-profile-photo");
    this.txtBxFullName = this.page.locator(".name-email-area label:nth-child(1) input:nth-child(1)");
    this.txtBxRole = this.page.locator(
      "#app > div.settings-layout > div.settings-layout--content-pane > div > div:nth-child(5) > div > label:nth-child(1) > div > input"
    );
    this.txtDepartment = this.page.locator(".user-details-area label:nth-child(2) input");
  }

  async clickSettings() {
    await this.page.getByTestId("menu-item_settings").click();
  }

  async clickOAuthApplication() {
    await this.page.getByRole("link", { name: "OAuth Applications" }).click();
  }

  async clickGeneralSettings() {
    await this.page.getByTestId("nav-link_settings_menu_general").click();
  }

  async clickApiKeys() {
    await this.page.getByRole("link", { name: "API keys" }).click();
  }

  async clickWebhooks() {
    await this.page.getByRole("link", { name: "Webhooks" }).click();
  }

  async clickSubmit() {
    await this.page.getByTestId("button_settings-account_submit").click();
  }

  async clickBackFromSettings() {
    await this.page.getByTestId("button_settings-back-button").click();
  }

  async uploadProfilePic(picturePath: string) {
    await this.page.getByTestId("input_upload-file-input_upload-profile-photo").setInputFiles(picturePath);
    await this.page.reload();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async enterName(fullname: string) {
    await this.txtBxFullName.click();
    await this.txtBxFullName.press("Meta+a");
    await this.txtBxFullName.fill(fullname);
  }

  async enterRole(role: string) {
    await this.txtBxRole.click();
    await this.txtBxRole.press("Meta+a");
    await this.txtBxRole.fill(role);
  }

  async enterDepartment(deptValue: string) {
    await this.txtDepartment.click();
    await this.txtDepartment.press("Meta+a");
    await this.txtDepartment.fill(deptValue);
  }
}
