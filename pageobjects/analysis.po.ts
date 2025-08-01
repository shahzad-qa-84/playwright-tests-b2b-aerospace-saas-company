import { Page } from "@playwright/test";
import { BasePage } from "./base.po";

export class analysisPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickCreateCodeBlock() {
    const isCodeBlockButtonPresent = (await this.page.$('[data-testid="button_create-code-block"]')) !== null;

    if (isCodeBlockButtonPresent) {
      // Directly click the create code block button
      await this.page.getByTestId("button_create-code-block").click();
    } else {
      // Click the create analysis button to open the submenu
      await this.page.getByTestId("button_create-analysis").click();
      await this.page.waitForTimeout(500);
      // Then click the create code block menu item
      await this.page.getByTestId("menu-item_create-code-block").click();
    }

    await this.page.waitForTimeout(500);
  }

  async createCodeBlock(blockName: string) {
    await this.page.getByTestId("button_more-options_open-title-options-menu").click();
    await this.page.getByTestId("input_document-name-input").fill(blockName);
    await this.page.getByTestId("input_document-name-input").press("Enter");
    await this.page.locator(".bp5-overlay-backdrop").click();
    await this.page.getByTestId("button_action-add-new-analysis-input").click();
    await this.page.waitForTimeout(500);
  }

  async addPropertyToCodeBlock(propertyName: string) {
    await this.page.getByText("new_input").click();
    await this.page.getByPlaceholder("Input variable label").fill(propertyName);
    await this.page.getByTestId("button_select-property").click();
    await this.page
      .locator("span")
      .filter({ hasText: "/:" + propertyName })
      .first()
      .click();
    await this.page.locator(".view-line").click();
  }

  async enterCode(codeBlock: string) {
    await this.page.getByLabel("Editor content;Press Alt+F1").fill(codeBlock);
    await this.page.waitForTimeout(1000);
    await this.page.getByLabel("Editor content;Press Alt+F1").press("ArrowRight");
    await this.page.waitForTimeout(1000);
  }

  async runCode() {
    await this.page.waitForTimeout(3000);
    await this.page.getByTestId("button_run-code").click();
    await this.page.waitForTimeout(2000);
  }
}
