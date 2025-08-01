import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { HoopsViewerPage } from "../../pageobjects/hoopsViewer.po";

test.describe.serial("Hoops viewer - Annotation test", () => {
  const ATTACHMENT = "CATIA-WORKING.CATPart";
  const ANNOTATION_TEXT = "Front part";

  let workspaceName: string;
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify annotation add & delete @featureBranch @prod @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);
    const attachment = new attachmentsPage(page);
    const viewer = new HoopsViewerPage(page);

    // Step 1: Upload attachment
    await homePage.clickAttachments();
    await attachment.uploadAttachment(ATTACHMENT);

    // Step 2: Verify attachment is visible and processed
    await expect(page.getByText(ATTACHMENT).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: ATTACHMENT }).first()).toBeVisible();

    await attachment.verifyProcessingFinished();
    await attachment.verifyConversionSuccess();

    // Step 3: Open in grid viewer and verify components loaded
    await viewer.openFirstAttachmentFromGrid();
    await viewer.waitUntilLoaded();
    await viewer.expectTreeItemsVisible("NIST PMI FTC 08 ASME1", "MechanicalTool.1");

    // Step 4: Add annotation and verify it's visible
    await viewer.createAnnotation(ANNOTATION_TEXT);
    await viewer.verifyAnnotationVisible(ANNOTATION_TEXT);

    // Step 5: Delete annotation and verify removal
    await viewer.deleteAnnotation();
    await viewer.expectNoMarkers();
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