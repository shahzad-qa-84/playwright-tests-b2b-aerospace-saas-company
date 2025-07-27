import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Discussion/Comments Attach File test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Attachment of File to the comment is working successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickDiscussion();

    // Upload attachment and verify if its uploaded
    await page.getByTestId("input_upload-file-input_upload-comment-attachment").setInputFiles("./resources/INV-CZE-11701-14275-7.pdf");
    await page.waitForSelector(
      `.floating-window--content > div > .flex > div:nth-child(2) > .bp5-spinner > .bp5-spinner-animation > svg > .bp5-spinner-head`,
      { state: "hidden", timeout: 120000 }
    );
    await page.getByText("Uploaded", { exact: true }).click();
    await expect(await page.getByText("INV-CZE-11701-14275-7.pdf")).toBeVisible();
    await page.getByRole("paragraph").click();
    await page.getByTestId("editor-content_comment-editor").fill("test");
    await page.getByTestId("button_comment-editor-send").click();

    // Click Attachments and see if the file is there
    await page.getByText("Attachments", { exact: true }).click();
    await expect(await page.getByText("Uploaded 1 file")).toBeVisible();
    await expect(await page.getByText("INV-CZE-11701-14275-7.pdf").nth(2)).toBeVisible();

    // click on row to open the attachemnt details
    await page.getByTestId("table-row_attachment").click();
    await expect(await page.getByTestId("button_download")).toBeVisible();

    // Close the open Preview of uploaded file
    await page.getByLabel("Attachment details: INV-CZE-11701-14275-7.pdf").getByLabel("Close").click();

    // Try to change the attachment name
    const threeDottedIcon = await page.getByTestId("button_attachment-context-menu");
    await threeDottedIcon.click();
    await page.getByTestId("menu-item_edit-label").click();
    const txtBxEdit = await page.getByPlaceholder("Name", { exact: true });
    await txtBxEdit.press("ArrowLeft");
    await txtBxEdit.fill("test-file.pdf");
    await txtBxEdit.press("Enter");

    // Verify file name is changed
    await expect(await page.getByText("test-file.pdf")).toBeVisible();

    // Delete the attachment and verify if its deleted properly
    await page.getByTestId("button_attachment-context-menu").click();
    await page.getByTestId("menu-item_delete").click();
    await expect(await page.getByRole("heading", { name: "No attachments for this block" })).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
