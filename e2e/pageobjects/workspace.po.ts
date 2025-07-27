import { Page } from "@playwright/test";

export class workspacePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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
