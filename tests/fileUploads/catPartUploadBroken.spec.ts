import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";
const attachmentName = "CATIA-BROKEN.CATPart";
test.describe.serial("CATPart Upload Broken File Upload @prod @smokeTest", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload Broken CAT file Attachment", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickAttachments();

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
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
