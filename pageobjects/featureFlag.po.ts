import { Page } from "@playwright/test";

export class featureFlag {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async enableFeatureFlagOption(featureName: string) {
    await this.page.getByTestId("button_user-menu").click();
    await this.page.getByTestId("menu-item_settings").click();
    await this.page.getByTestId("menu-item_developer-mode").click();
    await this.page.waitForTimeout(2000);
    const isMac = process.platform === "darwin";
    const commandPopupCombo = isMac ? "Meta+k" : "Control+k";
    await this.page.keyboard.press(commandPopupCombo);
    await this.page.waitForTimeout(2000);
    await this.page.getByLabel("Developer mode").press(commandPopupCombo);
    await this.page.getByPlaceholder("Search for workspaces, blocks").fill("fea");
    await this.page.getByTestId("menu-item_feature-flags-dialog").click();
    await this.page.locator("label").filter({ hasText: featureName }).locator("span").click();
    await this.page.getByTestId("button_close").click();
    await this.page.getByTestId("button_settings-back-button").click();
  }
}
