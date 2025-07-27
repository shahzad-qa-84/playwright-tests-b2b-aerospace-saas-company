import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";
const attachmentName1 = "A64-OlinuXino_Rev_G.kicad_pcb";
test.describe("Attachment Tests KiCad File upload", () => {
  test.setTimeout(880000);
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Upload Successful Attachment of KiCad file @smokeTest", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickAttachments();

    const attachmentPage = new attachmentsPage(page);

    // Upload attachment Kicad file
    await attachmentPage.uploadAttachment(attachmentName1);
    await expect(await page.getByText(attachmentName1).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: "" + attachmentName1 + "" }).first()).toBeVisible();

    // Verify success cube icon is displayed
    await expect(await page.getByText(attachmentName1).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: "" + attachmentName1 + "" }).first()).toBeVisible();

    // Verify success
    await attachmentPage.verifyProcessingFinished();
    await attachmentPage.verifyConversionSuccess();

    //  Verify the KiCad file is opened in the viewer, view block is not displayed
    const contextMenu = await page.getByTestId("button_attachment-context-menu");
    await contextMenu.click();
    const menuItem = await page.getByTestId("menu-item_details");
    await menuItem.click();
    await page.getByTestId("button_view").click();
    await page.getByTestId("button_back-button").click();
    await contextMenu.click();
    await menuItem.click();
    const page1Promise = page.waitForEvent("popup");
    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("button_download").click();
    const page1 = await page1Promise;
    await downloadPromise;
    await page1.close();
    await expect(page.getByRole("img", { name: "Preview Image" })).toBeVisible();
    await expect(page.getByText("View block")).toBeHidden();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
