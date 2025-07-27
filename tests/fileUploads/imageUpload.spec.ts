import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";
const attachmentName = "flower.png";
test.describe("Attachment Tests with image upload and Thumbnail check", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Upload Successful Attachment of PNG file and verify thumbnail works @prod @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickAttachments();

    const attachmentPage = new attachmentsPage(page);
    await attachmentPage.uploadAttachment(attachmentName);

    await expect(await page.getByText(attachmentName).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: "" + attachmentName + "" }).first()).toBeVisible();

    // Click Grid view
    await b2bSaasHomePage.clickGridView();

    // Verify thumbnail is displayed
    await expect(await page.getByRole("img", { name: "thumbnail" })).toBeVisible();

    // Verify the details of the image
    const contextMenu = await page.getByTestId("button_more-options_attachment-context-menu");
    await contextMenu.click();
    const menuDetails = await page.getByTestId("menu-item_details");
    await menuDetails.click();
    await page.getByLabel("Attachment details: flower.png").getByRole("img").first().click();
    await expect(await page.getByLabel("Attachment details: flower.png").getByText("flower.png", { exact: true })).toBeVisible();
    await expect(await page.getByText("image/png")).toBeVisible();
    await expect(await page.getByLabel("Attachment details: flower.png").getByText("515.7 kB")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(await page.getByLabel("Attachment details: flower.png").getByText("515.7 kB")).toBeHidden();

    // Button view block is not displayed
    await contextMenu.click();
    await menuDetails.click();
    await expect(page.getByText("View block")).toBeHidden();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
