import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { reportsPage } from "../../pageobjects/reports.po";

test.describe.serial("Report as an Attachment to Blocks Icon", () => {
  let workspaceName;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
    await b2bSaasHomePage.clickKnowledgebase();
  });

  test("Verify that reports as an attachment to System blocks is working and attached properly in List and Grid view. @featureBranch @smokeTest", async ({
    page,
  }) => {
    const report = new reportsPage(page);

    // Create a new Report
    const reportName = "ReportAsAnAttachment";
    await report.createReport(reportName);

    // Add image
    await page.getByRole("button", { name: "Add cover image" }).click();
    const btnUploadFile = await page.getByLabel("Upload").getByRole("textbox");
    await btnUploadFile.setInputFiles("./resources/flower.png");
    await page.getByTestId("report-cover-image").waitFor({ state: "visible" });

    // Add the page as an attachment
    await page.getByTestId("button_more-options_report-more-btn").click();
    await page.getByText("Add to AttachmentsOpen sub").hover();
    const attachmentOption = await page.locator('[data-testid*="menu-item_add-to-block-attachments_"]');
    await attachmentOption.first().click();

    // Go to modeling and verify the attachment
    await page.getByTestId("nav-link_menu-pane_modeling").click();
    await page.getByText("Attachments").click();
    await expect(
      page
        .getByTestId("table-row_attachment")
        .locator("div")
        .filter({ hasText: "" + reportName + "" })
        .locator("span")
    ).toBeVisible();
    await page.getByTestId("button_attachment-context-menu").click();

    // Verify the attachment in list view
    await page.getByTestId("menu-item_details").click();
    await expect(await page.getByRole("img", { name: "Preview Image" })).toBeVisible();
    await expect(await page.getByLabel("Attachment details:").getByText("" + reportName + "", { exact: true })).toBeVisible();
    await page.getByLabel("Attachment details:").getByLabel("Close").click();

    // Click grid view
    await page.getByTestId("button_attachment-view-type-switcher_grid").click();
    await expect(await page.getByRole("img", { name: "thumbnail" })).toBeVisible();
    await page.getByTestId("button_more-options_attachment-context-menu").click();
    await page.getByTestId("menu-item_details").click();
    await expect(await page.getByRole("img", { name: "Preview Image" })).toBeVisible();
    await expect(await page.getByLabel("Attachment details:").getByText("" + reportName + "", { exact: true })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
