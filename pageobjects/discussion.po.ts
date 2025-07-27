// pageobjects/discussionPage.po.ts
import { Page, expect } from "@playwright/test";

export class DiscussionPage {
  constructor(private page: Page) {}

  async openLinkEditor() {
    await this.page.getByTestId("button_comment-editor-action_link").first().click();
    await expect(this.page.getByRole("heading", { name: "Add link" })).toBeVisible();
  }

  async unsetLink() {
    await this.page.getByPlaceholder("Text").fill("b2bSaas link");
    await this.page.getByPlaceholder("example.com").fill("https://app.b2bSaas.ai");
    await this.page.getByRole("button", { name: "Unset" }).click();
    await expect(this.page.getByRole("heading", { name: "Add link" })).toBeHidden();
  }

  async addLinkWithText(text: string, url: string) {
    await this.page.getByTestId("button_comment-editor-action_link").first().click();
    await this.page.getByPlaceholder("Text").fill(text);
    await this.page.getByPlaceholder("example.com").fill(url);
    await this.page.getByRole("button", { name: "Save" }).click();
  }

  async sendComment() {
    await this.page.getByTestId("button_comment-editor-send").first().click();
  }

  async clickInsertedLink(linkText: string) {
    await this.page.getByRole("link", { name: linkText }).click();
  }

  async openDiscussionSection() {
    await this.page.getByText("Discussion").click();
  }

  async applyStrike() {
    await this.page.getByTestId("button_comment-editor-action_strike").click();
  }

  async addListItems(items: string[]) {
    const commentBox = this.page.locator(".ProseMirror").first();
    for (const item of items) {
      await commentBox.type(item);
      await commentBox.press("Enter");
    }
  }

  async selectAllText() {
    const content = this.page.locator(".ProseMirror").first();
    await content.press("Meta+a"); // for macOS; use "Control+a" on Windows
  }

  async applyOrderedList() {
    await this.page.getByTestId("button_comment-editor-action_orderedlist").click();
  }

  async expectTextVisible(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async attachImage(imagePath: string) {
    await this.page.getByTestId("button_comment-editor-action_image").click();
    await this.page
      .locator(".file-drop-zone--input.cursor-pointer.file-drop-zone--input-active")
      .first()
      .setInputFiles(imagePath);
  }

  async expectImageVisibleInEditor() {
    const editor = this.page.getByTestId("editor-content_comment-editor");
    await expect(editor.getByRole("img")).toBeVisible();
  }
}
