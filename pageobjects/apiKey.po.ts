import { Locator, Page } from "@playwright/test";

export class apiKeyPage {
  readonly page: Page;
  readonly txtBxAddNewKey: Locator;
  readonly txtBxSearch: Locator;

  constructor(page: Page) {
    this.page = page;
    this.txtBxAddNewKey = this.page.getByPlaceholder("Enter API key label...");
    this.txtBxSearch = this.page.getByPlaceholder("Search for API key...");
  }

  async clickBtnAddApiKey() {
    await this.page.getByTestId("button_new-api-keu").click();
  }

  async enterApiKeyName(name: string) {
    await this.txtBxAddNewKey.click();
    await this.txtBxAddNewKey.fill(name);
  }

  async selectWorkSpacesRights() {
    await this.page
      .locator("label")
      .filter({ hasText: /^workspaces$/ })
      .locator("span")
      .click();
  }

  async selectPropertyInstancesRights() {
    await this.page
      .locator("label")
      .filter({ hasText: /^properties-instances$/ })
      .locator("span")
      .click();
  }

  async selectBlocksRights() {
    await this.page
      .locator("label")
      .filter({ hasText: /^blocks$/ })
      .locator("span")
      .click();
  }

  async selectPropertydeifinitionsRights() {
    await this.page
      .locator("label")
      .filter({ hasText: /^properties-definitions$/ })
      .locator("span")
      .click();
  }

  async selectAttachmentsRights() {
    await this.page
      .locator("label")
      .filter({ hasText: /^attachments$/ })
      .locator("span")
      .click();
  }

  async selectDiscussionRights() {
    await this.page
      .locator("label")
      .filter({ hasText: /^discussions$/ })
      .locator("span")
      .click();
  }

  async selectWebhooksRights() {
    await this.page
      .locator("label")
      .filter({ hasText: /^webhooks$/ })
      .locator("span")
      .click();
  }

  async clickCreate() {
    await this.page
      .locator("div")
      .filter({ hasText: /^Create API keyCreate$/ })
      .getByTestId("button_update-create")
      .click();
  }

  async searchApiKey(name: string) {
    await this.txtBxSearch.click();
    await this.page
      .locator("div")
      .filter({ hasText: /^API keysAdd API key$/ })
      .locator("span")
      .first()
      .click();
    await this.txtBxSearch.fill(name);
  }

  async clearApiKey() {
    await this.txtBxSearch.click();
    await this.txtBxSearch.press("Meta+a");
    await this.txtBxSearch.fill("");
  }

  async clickThreeDottedIcon() {
    await this.page.getByTestId("button_show-menu").first().click();
  }

  async updateKey(name: string) {
    await this.page.getByTestId("menu-item_edit").click();
    await this.txtBxAddNewKey.click();
    await this.txtBxAddNewKey.press("Meta+a");
    await this.txtBxAddNewKey.press("Meta+c");
    await this.txtBxAddNewKey.fill(name);
    await this.page
      .locator("div")
      .filter({ hasText: /^Edit API keyUpdate$/ })
      .getByTestId("button_update-create")
      .click();
  }

  async deleteApiKey() {
    await this.page.getByTestId("menu-item_delete").click();
    await this.page.getByTestId("button_confirmation-dialog_delete_confirm").click();
  }
}
