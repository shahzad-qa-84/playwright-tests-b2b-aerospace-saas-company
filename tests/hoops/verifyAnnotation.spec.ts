import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";
import { HoopsViewerPage } from "../../pageobjects/hoopsViewer.po";

test.describe.serial("Hoops viewer - Annotation test", () => {
  const ATTACHMENT = "CATIA-WORKING.CATPart";
  const ANNOTATION_TEXT = "Front part";

  let workspaceName: string;
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const home = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await home.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify annotation add & delete @featureBranch @prod @smokeTest", async ({ page }) => {
    const home = new homePage(page);
    const attachment = new attachmentsPage(page);
    const viewer = new HoopsViewerPage(page);

    // 1) Upload attachment
    await home.clickAttachments();
    await attachment.uploadAttachment(ATTACHMENT);

    await expect(page.getByText(ATTACHMENT).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: ATTACHMENT }).first()).toBeVisible();

    await attachment.verifyProcessingFinished();
    await attachment.verifyConversionSuccess();

    // 2) Open in grid viewer and verify components loaded
    await viewer.openFirstAttachmentFromGrid();
    await viewer.waitUntilLoaded();
    await viewer.expectTreeItemsVisible("NIST PMI FTC 08 ASME1", "MechanicalTool.1");

    // 3) Add annotation
    await viewer.createAnnotation(ANNOTATION_TEXT);
    await viewer.verifyAnnotationVisible(ANNOTATION_TEXT);

    // 4) Delete annotation
    await viewer.deleteAnnotation();
    await viewer.expectNoMarkers();
  });

  test.afterEach(async ({ page }) => {
    const home = new homePage(page);
    if (wsId) {
      await home.deleteWorkspaceByID(wsId);
    }
  });
});
