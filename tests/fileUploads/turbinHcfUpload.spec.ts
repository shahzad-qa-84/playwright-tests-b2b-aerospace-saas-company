import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";

const attachmentName = "Turbine.hsf";

test.describe("Turbine.hsf Upload Test", () => {
  test.setTimeout(480000);
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  // Setup: Create a new test workspace
  test.beforeEach(async ({ page }) => {
    const home = new homePage(page);
    wsId = await home.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload and verify Turbine.hsf file attachment @prod @smokeTest", async ({ page }) => {
    const home = new homePage(page);
    const attachment = new attachmentsPage(page);

    // Step 1: Navigate to the Attachments section
    await home.clickAttachments();

    // Step 2: Upload the HSF file
    await attachment.uploadAttachment(attachmentName);

    // Step 3: Verify that the uploaded file appears
    await expect(page.getByText(attachmentName).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Step 4: Wait for backend processing and verify success
    await attachment.verifyProcessingFinished();
    await attachment.verifyConversionSuccess();

    // Step 5: Delete the file and confirm it was removed
    await attachment.deleteAttachment(attachmentName);
    await expect(page.getByRole("cell", { name: attachmentName })).toBeHidden();
  });

  // Teardown: Clean up the workspace
  test.afterEach(async ({ page }) => {
    const home = new homePage(page);
    if (wsId) {
      await home.deleteWorkspaceByID(wsId);
    }
  });
});
