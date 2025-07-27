import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";
const attachmentName = "Menger_sponge_sample.stl";
test.describe("Manager Sponge Upload Success File Upload", () => {
  test.setTimeout(480000);
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Manager Sponge Upload file Attachment @smokeTest @prod", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickAttachments();

    // Attach file
    const attachmentPage = new attachmentsPage(page);
    await attachmentPage.uploadAttachment(attachmentName);

    // Verify success cube icon is displayed
    await expect(await page.getByText(attachmentName).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: "" + attachmentName + "" }).first()).toBeVisible();

    // Verify success
    await attachmentPage.verifyProcessingFinished();
    await attachmentPage.verifyConversionSuccess();

    // Click diamond icon and verify the components
    await page.getByTestId("button_view-file").click();
    await expect(await page.locator("#HoopsWebViewer-canvas-container div").nth(2)).toBeVisible();
    await expect(await page.getByText("Models")).toBeVisible({ timeout: 60000 });
    await expect(await page.getByText("Product")).toBeVisible();
    await expect(await page.getByText("Exported from Blender-2.76 (")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
