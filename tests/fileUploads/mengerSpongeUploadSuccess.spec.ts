import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";

const attachmentName = "Menger_sponge_sample.stl";

test.describe("Manager Sponge Upload Success File Upload", () => {
  test.setTimeout(480000);
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Manager Sponge Upload file Attachment @smokeTest @prod", async ({ page }) => {
    const homePage = new HomePage(page);
    const attachmentPage = new attachmentsPage(page);

    // Navigate to attachments and upload file
    await homePage.clickAttachments();
    await attachmentPage.uploadAttachment(attachmentName);

    // Verify file appears in the list
    await expect(await page.getByText(attachmentName).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Verify processing and conversion success
    await attachmentPage.verifyProcessingFinished();
    await attachmentPage.verifyConversionSuccess();

    // Open 3D viewer and verify components
    await homePage.clickViewFile();
    await homePage.verify3DViewerComponents();
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