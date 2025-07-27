import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";

const attachmentName = "A64-OlinuXino_Rev_G_gerber.zip";

test.describe("Attachment Tests - Gerber ZIP Upload and Layer Verification", () => {
  test.setTimeout(480000);

  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload and verify ECAD ZIP layers @prod @smokeTest", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    const attachmentPage = new attachmentsPage(page);

    // Go to Attachments tab
    await b2bSaasHomePage.clickAttachments();

    // Upload the Gerber ZIP file
    await attachmentPage.uploadAttachment(attachmentName);

    // Verify the attachment appears in the table
    await expect(page.getByText(attachmentName).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Wait for processing to complete and conversion to succeed
    await attachmentPage.verifyProcessingFinished();
    await attachmentPage.verifyConversionSuccess();

    // Open viewer by clicking diamond/preview button
    await page.getByTestId("button_view-file").click();

    // Optional: click on canvas to ensure viewer is ready
    await page.locator("canvas").click({ position: { x: 200, y: 150 } });

    // Define ECAD layers to click and verify
    const ecadLayers = [
      "F_Cu", "In1_Cu", "In2_Cu", "In3_Cu", "In4_Cu", "B_Cu",
      "B_Paste", "F_Paste", "B_Silkscreen", "F_Silkscreen",
      "B_Mask", "F_Mask", "Edge_Cuts"
    ];

    for (const layer of ecadLayers) {
      const layerButton = page.getByRole("button", { name: layer }).first();
      const layerLabel = page.locator("label").filter({ hasText: layer }).first();

      if (await layerButton.isVisible()) {
        await layerButton.click();
        await expect(layerButton).toHaveClass(/active|checked|selected/); // adjust if needed
      } else if (await layerLabel.isVisible()) {
        await layerLabel.click();
        await expect(layerLabel).toHaveClass(/active|checked|selected/); // adjust if needed
      } else {
        console.warn(`Layer not found in UI: ${layer}`);
      }
    }

    // Optionally close the viewer
    await page.keyboard.press("Escape");
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
