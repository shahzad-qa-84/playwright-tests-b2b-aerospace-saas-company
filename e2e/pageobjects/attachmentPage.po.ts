import { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class attachmentsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickBtnUploadAttachment() {
    await this.page.getByRole("button", { name: "Add Attachment" }).click();
  }

  async uploadAttachment(fileName: string) {
    await this.page.getByTestId("input_upload-file-input_upload-attachment").setInputFiles("./resources/" + fileName, { timeout: 180000 });
    await this.page.waitForSelector(
      `.floating-window--content > div > .flex > div:nth-child(2) > .bp5-spinner > .bp5-spinner-animation > svg > .bp5-spinner-head`,
      { state: "hidden", timeout: 120000 }
    );

    if (await this.page.getByLabel("Attachments").getByText("Upload failed").isVisible()) {
      await this.page.getByLabel("Attachments").getByTestId("button_retry-upload-chunks").click();
    }
    await this.page
      .locator("div")
      .filter({ hasText: /^Uploaded 1 file$/ })
      .getByRole("button")
      .nth(1)
      .click();
  }

  async verifyProcessingFinished() {
    await this.page.waitForSelector(`a[data-testid="button_view-file-no-action"]`, { state: "hidden", timeout: 400000 });
    await expect(await this.page.locator('a[data-testid="button_view-file-no-action"]').first()).toBeHidden();
  }

  async verifyConversionSuccess() {
    await this.page.waitForSelector(`[class*="-icon-cub"]`, { state: "visible", timeout: 400000 });
    await expect(await this.page.locator('[class*="-icon-cub"]').first()).toBeVisible();
  }

  async deleteAttachment(attachmentName: string) {
    await this.page
      .getByRole("row", { name: "" + attachmentName + "" })
      .first()
      .locator("button")
      .click();
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
    await this.page.waitForTimeout(4000);
  }
}
