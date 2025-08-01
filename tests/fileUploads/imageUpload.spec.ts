import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";

const attachmentName = "flower.png";
const attachmentSize = "515.7 kB";

test.describe("Attachment Tests with image upload and thumbnail check", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  // Create a workspace before each test
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload PNG attachment and verify thumbnail + metadata @prod @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const attachmentPage = new attachmentsPage(page);

    // Navigate to attachments and upload image
    await homePage.clickAttachments();
    await attachmentPage.uploadAttachment(attachmentName);

    // Verify attachment is listed
    await expect(page.getByText(attachmentName).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Switch to Grid view and verify thumbnail
    await homePage.clickGridView();
    await homePage.verifyThumbnailVisible();

    // Open attachment details
    await homePage.openAttachmentContextMenu();
    await homePage.clickAttachmentDetails();

    // Verify image preview and metadata
    await homePage.verifyAttachmentDetailsPanel(attachmentName, attachmentSize);

    // Close details panel and verify it's hidden
    await homePage.closeDetailsPanelWithEscape();
    await homePage.verifyDetailsPanelHidden(attachmentName, attachmentSize);

    // Verify "View block" is not shown for images
    await homePage.verifyViewBlockNotShown();
  });

  // Clean up: delete workspace
  test.afterEach(async ({ page }) => {
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});