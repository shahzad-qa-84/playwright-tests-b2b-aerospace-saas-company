import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";
const attachmentName = "INV-CZE-11701-14275-7.pdf";
test.describe("Attachment Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Upload Successful Attachment of Pdf file @prod @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickAttachments();

    const attachmentPage = new attachmentsPage(page);
    await attachmentPage.uploadAttachment(attachmentName);

    await expect(await page.getByText(attachmentName).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: "" + attachmentName + "" }).first()).toBeVisible();

    // Expect the attachment to be visible in the grid view
    await page.getByTestId("button_attachment-context-menu").click();
    await page.getByTestId("menu-item_details").click();

    // Verify the details of the image, Download button is visible and view block button is hidden
    await expect(await page.getByRole("img", { name: "Preview Image" })).toBeVisible();
    await expect(page.getByTestId("button_download")).toBeVisible();
    await expect(page.getByText("View block")).toBeHidden();
    await page.keyboard.press("Escape");

    // Delete the attachment
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
