import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";

const attachmentName = "Turbine.hsf";

test.describe("Turbine.hsf Upload Test", () => {
  test.setTimeout(480000);
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  // Setup: Create a new test workspace
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload and verify Turbine.hsf file attachment @prod @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);
    const attachmentPage = new attachmentsPage(page);

    // Navigate to the Attachments section
    await homePage.clickAttachments();

    // Upload the HSF file
    await attachmentPage.uploadAttachment(attachmentName);

    // Verify that the uploaded file appears
    await expect(page.getByText(attachmentName).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Wait for backend processing and verify success
    await attachmentPage.verifyProcessingFinished();
    await attachmentPage.verifyConversionSuccess();

    // Delete the file and confirm it was removed
    await attachmentPage.deleteAttachment(attachmentName);
    await expect(page.getByRole("cell", { name: attachmentName })).toBeHidden();
  });

  // Teardown: Clean up the workspace
  test.afterEach(async ({ page }) => {
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});