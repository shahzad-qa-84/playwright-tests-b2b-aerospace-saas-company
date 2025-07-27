import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";

const attachmentName = "A64-OlinuXino_Rev_G.kicad_pcb";

test.describe("Attachment Tests – KiCad File Upload", () => {
  test.setTimeout(880000);

  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  // Create workspace before each test
  test.beforeEach(async ({ page }) => {
    const home = new homePage(page);
    wsId = await home.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload KiCad file and verify viewer, download, and thumbnail @smokeTest", async ({ page }) => {
    const home = new homePage(page);
    const attachment = new attachmentsPage(page);

    // Step 1: Navigate to Attachments section
    await home.clickAttachments();

    // Step 2: Upload KiCad file
    await attachment.uploadAttachment(attachmentName);

    // Step 3: Verify file is visible in list and in cell
    await expect(page.getByText(attachmentName).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Step 4: Confirm processing and conversion success (custom POM logic)
    await attachment.verifyProcessingFinished();
    await attachment.verifyConversionSuccess();

    // Step 5: Open details and preview
    const contextMenu = page.getByTestId("button_attachment-context-menu");
    const menuItemDetails = page.getByTestId("menu-item_details");

    await contextMenu.click();
    await menuItemDetails.click();

    await page.getByTestId("button_view").click(); // View the attachment
    await page.getByTestId("button_back-button").click(); // Go back from viewer

    // Step 6: Open details again and trigger download
    await contextMenu.click();
    await menuItemDetails.click();

    const [popup, download] = await Promise.all([
      page.waitForEvent("popup"),
      page.waitForEvent("download"),
      page.getByTestId("button_download").click(),
    ]);

    await popup.close(); // Close any tab/window opened
    await download; // Confirm the download event occurred

    // Step 7: Confirm preview image is visible and "View block" is NOT
    await expect(page.getByRole("img", { name: "Preview Image" })).toBeVisible();
    await expect(page.getByText("View block")).toBeHidden();
  });

  // Clean up workspace after each test
  test.afterEach(async ({ page }) => {
    const home = new homePage(page);
    if (wsId) {
      await home.deleteWorkspaceByID(wsId);
    }
  });
});
