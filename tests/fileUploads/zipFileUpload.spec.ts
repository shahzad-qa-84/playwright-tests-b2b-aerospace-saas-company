import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";
const attachmentName1 = "A64-OlinuXino_Rev_G_gerber.zip";
test.describe("Attachment Tests Zip File upload", () => {
  test.setTimeout(480000);
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("To verify that ECAD files zip works and coversion is successful. @prod @smokeTest", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickAttachments();

    const attachmentPage = new attachmentsPage(page);

    // Upload attachment Zip file
    await attachmentPage.uploadAttachment(attachmentName1);
    await expect(await page.getByText(attachmentName1).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: "" + attachmentName1 + "" }).first()).toBeVisible();

    // Verify success cube icon is displayed
    await expect(await page.getByText(attachmentName1).first()).toBeVisible();
    await expect(await page.getByRole("cell", { name: "" + attachmentName1 + "" }).first()).toBeVisible();

    // Verify success
    await attachmentPage.verifyProcessingFinished();
    await attachmentPage.verifyConversionSuccess();

    // Clicking Diamond icon and verifying components are there
    await page.getByTestId("button_view-file").click();
    await page.locator("canvas").click({
      position: {
        x: 632,
        y: 110,
      },
    });
    await page.locator("label").filter({ hasText: "F_Cu" }).click();
    await page.getByRole("button", { name: "In1_Cu" }).click();
    await page.getByRole("button", { name: "In2_Cu" }).click();
    await page.locator("canvas").click({
      position: {
        x: 210,
        y: 162,
      },
    });
    await page.getByRole("button", { name: "In3_Cu" }).click();
    await page.getByRole("button", { name: "In4_Cu" }).click();
    await page.getByRole("button", { name: "B_Cu" }).click();
    await page.getByRole("button", { name: "B_Paste" }).click();
    await page.getByRole("button", { name: "F_Paste" }).click();
    await page.getByRole("button", { name: "B_Silkscreen" }).click();
    await page.getByRole("button", { name: "F_Silkscreen" }).click();
    await page.locator("label").filter({ hasText: "B_Mask" }).click();
    await page.locator("label").filter({ hasText: "F_Mask" }).click();
    await page.getByRole("button", { name: "Edge_Cuts" }).click();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
