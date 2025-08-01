import { Page } from "@playwright/test";
import { BasePage } from "./base.po";

export class workspacePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async importWorkspace(filePath: string) {
    await this.page.getByTestId("menu-item_import-workspace").hover();
    await this.page.getByTestId("workspace-import-input").setInputFiles(filePath);
    await this.page.waitForTimeout(2000);
  }

  async expandWorkspaceDropdown() {
    await this.page.getByTestId("button_workspace").click();
  }

  async searchWorkspaceFromSearchBar(workspaceName: string) {
    await this.page.getByPlaceholder("Search for workspace").click();
    await this.page.getByPlaceholder("Search for workspace").fill(workspaceName);
  }

  async duplicateWorkspaceDropdown() {
    this.page.getByTestId("menu-item_duplicate-workspace").hover();
    await this.page.getByTestId("menu-item_duplicate-workspace").click();
  }
}
