import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";
const attachmentName = "CATIA-BROKEN.CATPart";
test.describe.serial("CATPart Upload Broken File Upload @prod @smokeTest", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload Broken CAT file Attachment", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickAttachments();

    // Attach file
    const attachmentPage = new attachmentsPage(page);
    await attachmentPage.uploadAttachment(attachmentName);

    // Verify if file is broken
    await expect(await page.getByText(attachmentName).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: "" + attachmentName + "" }).first()).toBeVisible();

    // Wait for the "Conversion failed" element to appear
    await page.waitForSelector('svg[data-icon="error"]', { timeout: 60000 });
    await page.hover('svg[data-icon="error"]');
    await expect(await page.locator("text=Conversion failed").first()).toBeVisible();

    // Delete attachment
    await attachmentPage.deleteAttachment(attachmentName);
    await expect(await page.getByRole("cell", { name: "" + attachmentName + "" })).toBeHidden();
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
