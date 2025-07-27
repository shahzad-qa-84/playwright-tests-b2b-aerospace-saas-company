import { Page, expect } from "@playwright/test";

export class DiscussionPage {
  constructor(private page: Page) {}

  async openDiscussionTab() {
    await this.page.getByText("Discussion").click();
  }

  async expectNoCommentsMessage() {
    await expect(this.page.getByRole("heading", { name: "No comments yet" })).toBeVisible();
    await expect(this.page.getByText("Be the first to start the discussion")).toBeVisible();
  }

  async addComment(text: string) {
    await this.page.getByRole("paragraph").click();
    await this.page.getByTestId("editor-content_comment-editor").fill(text);
    await this.page.getByTestId("button_comment-editor-send").click();
  }

  async tagUser(username = "user") {
    await this.page.getByRole("paragraph").nth(1).click();
    await this.page.getByTestId("editor-content_comment-editor").nth(1).fill(`@${username}`);
    await this.page.getByRole("heading", { name: "Users" }).click();
  }

  async editComment(originalText: string, updatedText: string) {
    await this.expandCommentsMenu();
    await this.page.getByText("Edit").click();
    await this.page.getByText(originalText).click();
    await this.page.getByText(originalText).fill(updatedText);
    await this.page.getByTestId("button_comment-editor-send").nth(0).click();
  }

  async deleteComment() {
    await this.expandCommentsMenu();
    await this.page.getByText("Delete").click();
  }

  async expandCommentsMenu() {
    await this.page.getByTestId("button_comment-context-menu").click();
  }

  async goToChildBlocks() {
    await this.page.getByTestId("button_expand-block-tree").click();
  }

  async uploadAttachment(filePath: string) {
    await this.page.getByTestId("input_upload-file-input_upload-comment-attachment")
      .setInputFiles(filePath);
    await this.page.waitForSelector(
      `.floating-window--content > div > .flex > div:nth-child(2) > .bp5-spinner > .bp5-spinner-animation > svg > .bp5-spinner-head`,
      { state: "hidden", timeout: 120000 }
    );
    await this.page.getByText("Uploaded", { exact: true }).click();
    await expect(this.page.getByText(filePath.split("/").pop()!)).toBeVisible();
  }

  async submitComment(text: string) {
    await this.page.getByRole("paragraph").click();
    await this.page.getByTestId("editor-content_comment-editor").fill(text);
    await this.page.getByTestId("button_comment-editor-send").click();
  }

  async openAttachmentsTab() {
    await this.page.getByText("Attachments", { exact: true }).click();
  }

  async verifyAttachmentVisible(fileName: string) {
    await expect(this.page.getByText("Uploaded 1 file")).toBeVisible();
    await expect(this.page.getByText(fileName).nth(2)).toBeVisible();
  }

  async openAttachmentDetails(fileName: string) {
    await this.page.getByTestId("table-row_attachment").click();
    await expect(this.page.getByTestId("button_download")).toBeVisible();
    await this.page.getByLabel(`Attachment details: ${fileName}`).getByLabel("Close").click();
  }

  async renameAttachment(newName: string) {
    await this.page.getByTestId("button_attachment-context-menu").click();
    await this.page.getByTestId("menu-item_edit-label").click();
    const input = await this.page.getByPlaceholder("Name", { exact: true });
    await input.press("ArrowLeft");
    await input.fill(newName);
    await input.press("Enter");
    await expect(this.page.getByText(newName)).toBeVisible();
  }

  async deleteAttachment() {
    await this.page.getByTestId("button_attachment-context-menu").click();
    await this.page.getByTestId("menu-item_delete").click();
    await expect(this.page.getByRole("heading", { name: "No attachments for this block" })).toBeVisible();
  }
}
