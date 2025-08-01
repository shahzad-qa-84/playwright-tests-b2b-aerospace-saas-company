import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";

const attachmentName = "INV-CZE-11701-14275-7.pdf";

test.describe("Attachment Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  // Setup: Create a new workspace before each test
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload and verify PDF attachment @prod @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const attachment = new attachmentsPage(page);

    // Step 1: Navigate to the Attachments section
    await homePage.clickAttachments();

    // Step 2: Upload the attachment
    await attachment.uploadAttachment(attachmentName);

    // Step 3: Verify it appears in the list and table cell
    await expect(page.getByText(attachmentName).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Step 4: Open attachment details and verify preview & download options
    await homePage.openAttachmentContextMenuForDetails();
    await homePage.clickAttachmentDetailsFromMenu();
    await homePage.verifyPdfAttachmentDetails();

    // Step 5: Close the detail view
    await homePage.closeAttachmentDetails();

    // Step 6: Delete the attachment and confirm removal
    await attachment.deleteAttachment(attachmentName);
    await expect(page.getByRole("cell", { name: attachmentName })).toBeHidden();
  });

  // Cleanup: Delete workspace after each test
  test.afterEach(async ({ page }) => {
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
