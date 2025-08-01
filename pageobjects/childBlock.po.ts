import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.po";

export class childPage extends BasePage {
  readonly txtBxChildBlock: Locator;
  readonly txtBxChildName: Locator;
  readonly txtBxSubChildBlock: Locator;

  constructor(page: Page) {
    super(page);
    this.txtBxChildBlock = this.getByPlaceholder("Add new child block");
    this.txtBxSubChildBlock = this.getByRole("dialog", { name: "Add new child block" }).getByPlaceholder("Add new child block");
    this.txtBxChildName = this.getByRole("menu").filter({ hasText: "NameAdd child blockMultiplicityDelete" }).getByRole("textbox");
  }

  async clickChildBlock() {
    await this.page.getByText("Child Blocks").click();
  }

  async createChildBlockFromMainBar(childBlockName: string) {
    await this.txtBxChildBlock.click();
    await this.page.waitForTimeout(200);
    await this.txtBxChildBlock.fill(childBlockName);
    await this.page.waitForTimeout(200);
    await this.txtBxChildBlock.press("Enter");
    await this.page.waitForTimeout(200);
  }

  async createSubChildBlockFromSideBar(childBlockName: string) {
    await this.page.getByRole("menuitem", { name: "Add child block" }).click();
    await this.txtBxSubChildBlock.click();
    await this.txtBxSubChildBlock.fill(childBlockName);
    await this.txtBxSubChildBlock.press("Enter");
  }

  async expandChildDetails(child2Name: string) {
    await this.page
      .locator("li")
      .filter({ hasText: "" + child2Name + "" })
      .locator("svg")
      .first()
      .click();
  }

  async deleteChild(childNo: number) {
    await this.page.locator('[data-testid*="button_child-block-list-item-action-menu_"]').nth(childNo).click();
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
  }

  async clickChild(childNo: number) {
    await this.page.locator('[data-testid*="button_child-block-list-item-action-menu_"]').nth(childNo).click();
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
  }

  async clickChildByName(childName: string) {
    await this.page
      .getByText("" + childName + "")
      .nth(1)
      .click();
  }

  async renameChild(childNo: number, newName: string) {
    await this.page.locator('[data-testid*="button_child-block-list-item-action-menu_"]').nth(--childNo).click();
    const nameInput = this.page.getByTestId("input_document-name-input");
    await nameInput.click();
    await nameInput.fill(newName);
    await nameInput.press("Enter");
  }
}
