import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";

const attachmentName = "A64-OlinuXino_Rev_G.kicad_pcb";

test.describe("Attachment Tests – KiCad File Upload", () => {
  test.setTimeout(880000);

  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  // Create workspace before each test
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload KiCad file and verify viewer, download, and thumbnail @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);
    const attachmentPage = new attachmentsPage(page);

    // Navigate to Attachments section
    await homePage.clickAttachments();

    // Upload KiCad file
    await attachmentPage.uploadAttachment(attachmentName);

    // Verify file is visible in list and in cell
    await expect(page.getByText(attachmentName).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Confirm processing and conversion success
    await attachmentPage.verifyProcessingFinished();
    await attachmentPage.verifyConversionSuccess();

    // Open details and preview
    await homePage.openAttachmentContextMenuByTestId();
    await homePage.clickAttachmentDetails();
    await homePage.viewAttachment();
    await homePage.goBackFromViewer();

    // Open details again and trigger download
    await homePage.openAttachmentContextMenuByTestId();
    await homePage.clickAttachmentDetails();
    await homePage.downloadAttachment();

    // Verify preview image and view block status
    await homePage.verifyPreviewAndViewBlock();
  });

  // Clean up workspace after each test
  test.afterEach(async ({ page }) => {
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});