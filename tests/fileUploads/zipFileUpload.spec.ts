import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";

const attachmentName = "A64-OlinuXino_Rev_G_gerber.zip";

test.describe("Attachment Tests - Gerber ZIP Upload and Layer Verification", () => {
  test.setTimeout(480000);

  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload and verify ECAD ZIP layers @prod @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);
    const attachmentPage = new attachmentsPage(page);

    // Navigate to attachments and upload file
    await homePage.clickAttachments();
    await attachmentPage.uploadAttachment(attachmentName);

    // Verify the attachment appears in the table
    await expect(page.getByText(attachmentName).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Wait for processing to complete and conversion to succeed
    await attachmentPage.verifyProcessingFinished();
    await attachmentPage.verifyConversionSuccess();

    // Open viewer by clicking diamond/preview button
    await homePage.clickViewFile();

    // Click on canvas to ensure viewer is ready
    await homePage.clickCanvasToActivateViewer();

    // Verify all ECAD layers functionality
    await homePage.verifyAllEcadLayers();

    // Close the viewer
    await homePage.closeViewerWithEscape();
  });

  test.afterEach(async ({ page }) => {
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});