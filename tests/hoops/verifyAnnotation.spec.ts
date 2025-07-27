import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";

test.describe.serial("Hoops viewer - Annotation test", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that annotation addition and deletion works. @featureBranch @prod @smokeTest", async ({ page }) => {
    const attachmentName = "CATIA-WORKING.CATPart";
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickAttachments();

    const attachmentPage = new attachmentsPage(page);

    // Upload attachment CAD file
    await attachmentPage.uploadAttachment(attachmentName);
    await expect(await page.getByText(attachmentName).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: "" + attachmentName + "" }).first()).toBeVisible();

    // Verify success cube icon is displayed
    await expect(await page.getByText(attachmentName).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: "" + attachmentName + "" }).first()).toBeVisible();

    // Verify success
    await attachmentPage.verifyProcessingFinished();
    await attachmentPage.verifyConversionSuccess();

    // Verify some componets are loaded in the viewer
    await page.getByTestId("button_attachment-view-type-switcher_grid").click();
    await page.getByLabel("Attachments1").getByRole("img").first().click();

    // Wait for the viewer to load
    await page.waitForSelector(".ag-row-not-inline-editing", { state: "visible", timeout: 400000 });
    await expect(await page.getByText("NIST PMI FTC 08 ASME1")).toBeVisible();
    await expect(await page.getByText("MechanicalTool.1")).toBeVisible();

    // Add the Annotation
    await page.locator("#HoopsWebViewer-canvas-container div").nth(2).click();
    await page.getByTestId("button_create-annotation").click();
    await page.locator("#HoopsWebViewer-canvas-container div").nth(2).click();
    await page.getByTestId("editor-content_simple-comment-editor").fill("Front part");
    await page.getByTestId("button_simple-comment-editor-send").click();

    // Verify some labels on the created annotation are visible
    await expect(await page.getByText("of 1")).toBeVisible();
    await expect(await page.getByText("just now")).toBeVisible();
    await expect(await page.getByText("@b2bSaas.ai").nth(1)).toBeVisible();
    await expect(await page.getByText("Front part")).toBeVisible();

    // Verify deleting the annotation is displayed
    await page.getByTestId("button_comment-actions-menu").click();
    await page.getByTestId("menu-item_delete").click();
    await page.getByTestId("button_simple-comment-editor-cancel").click();
    await expect(await page.locator(".marker > svg > path")).toBeHidden();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
