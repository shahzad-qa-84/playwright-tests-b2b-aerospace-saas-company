import { Page, expect } from "@playwright/test";
import { BasePage } from "./base.po";

export class HoopsViewerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openFirstAttachmentFromGrid() {
    await this.page.getByTestId("button_attachment-view-type-switcher_grid").click();
    await this.page.getByLabel("Attachments1").getByRole("img").first().click();
  }

  async waitUntilLoaded() {
    await this.page.waitForSelector(".ag-row-not-inline-editing", { state: "visible", timeout: 400000 });
  }

  async expectTreeItemsVisible(...items: string[]) {
    for (const item of items) {
      await expect(this.page.getByText(item)).toBeVisible();
    }
  }

  async createAnnotation(text: string) {
    const canvas = this.page.locator("#HoopsWebViewer-canvas-container canvas").first();
    await canvas.click(); // pick a stable clickable element instead of nth(2) div
    await this.page.getByTestId("button_create-annotation").click();
    await canvas.click();
    await this.page.getByTestId("editor-content_simple-comment-editor").fill(text);
    await this.page.getByTestId("button_simple-comment-editor-send").click();
  }

  async verifyAnnotationVisible(text: string) {
    await expect(this.page.getByText("of 1")).toBeVisible();
    await expect(this.page.getByText("just now")).toBeVisible();
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async deleteAnnotation() {
    await this.page.getByTestId("button_comment-actions-menu").click();
    await this.page.getByTestId("menu-item_delete").click();
    await this.page.getByTestId("button_simple-comment-editor-cancel").click();
  }

  async expectNoMarkers() {
    await expect(this.page.locator(".marker > svg > path")).toHaveCount(0);
  }
}
