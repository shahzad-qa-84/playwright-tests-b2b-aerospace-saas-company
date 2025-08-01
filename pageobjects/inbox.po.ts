import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.po";

export class inboxPage extends BasePage {
  readonly txtBxAddNewProperty: Locator;

  constructor(page: Page) {
    super(page);
    this.txtBxAddNewProperty = this.getByPlaceholder("Add new property");
  }

  async clickInboxTab() {
    await this.page.getByRole("tab", { name: "Inbox" }).click();
  }

  async clickFirstMessage() {
    await this.page.getByText("New System").first().click();
  }

  async clickGotoSourceLink() {
    await this.page.getByTestId("button_go-to-page").click();
  }

  async clickArchiveTab() {
    await this.page.getByRole("tab", { name: "Archive" }).click();
  }

  async clickSandwichMenu() {
    await this.page.getByTestId("button_more").click();
  }

  async clickMoveToInbox() {
    await this.page.getByTestId("menu-item_move-to-inbox").click();
  }

  async archiveMessage() {
    await this.page.waitForTimeout(500);
    await this.page.getByTestId("menu-item_archive").click();
  }

  async clickUnread() {
    await this.page.getByTestId("menu-item_mark-as-unread").click();
  }
}
