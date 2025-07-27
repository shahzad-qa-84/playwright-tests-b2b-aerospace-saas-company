import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";

const attachmentName = "INV-CZE-11701-14275-7.pdf";

test.describe("Attachment Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  // Setup: Create a new workspace before each test
  test.beforeEach(async ({ page }) => {
    const home = new homePage(page);
    wsId = await home.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload and verify PDF attachment @prod @smokeTest @featureBranch", async ({ page }) => {
    const home = new homePage(page);
    const attachment = new attachmentsPage(page);

    // Step 1: Navigate to the Attachments section
    await home.clickAttachments();

    // Step 2: Upload the attachment
    await attachment.uploadAttachment(attachmentName);

    // Step 3: Verify it appears in the list and table cell
    await expect(page.getByText(attachmentName).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Step 4: Open attachment details and verify preview & download options
    await page.getByTestId("button_attachment-context-menu").click();
    await page.getByTestId("menu-item_details").click();

    await expect(page.getByRole("img", { name: "Preview Image" })).toBeVisible();
    await expect(page.getByTestId("button_download")).toBeVisible();
    await expect(page.getByText("View block")).toBeHidden();

    // Step 5: Close the detail view
    await page.keyboard.press("Escape");

    // Step 6: Delete the attachment and confirm removal
    await attachment.deleteAttachment(attachmentName);
    await expect(page.getByRole("cell", { name: attachmentName })).toBeHidden();
  });

  // Cleanup: Delete workspace after each test
  test.afterEach(async ({ page }) => {
    const home = new homePage(page);
    if (wsId) {
      await home.deleteWorkspaceByID(wsId);
    }
  });
});
