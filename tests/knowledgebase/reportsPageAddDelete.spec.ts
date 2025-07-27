import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { reportsPage } from "../../pageobjects/reports.po";

test.describe.serial("Reports Icon Addition", () => {
  let workspaceName;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
    await b2bSaasHomePage.clickKnowledgebase();
  });

  test("Verify that Icons and new page can be added and deleted from a report. @featureBranch @smokeTest", async ({ page }) => {
    const report = new reportsPage(page);

    // Create a new Report
    const reportName = "ReportTodelete";
    await report.createReport(reportName);

    // Icon 'Add/Delete' test conditions
    await page.locator("#REPORT_PAGE_CONTENT").getByRole("button").nth(2).click();
    await page.getByRole("paragraph").nth(1).click();

    // Add a page to report, duplicate it, expand the folder, add a child to it and verify that it is added
    await page.getByTestId("button_reports-add-new-page-btn").click();
    await page.getByPlaceholder("Untitled").fill("Page added");
    await page.getByPlaceholder("Untitled").press("Enter");
    await page.getByTestId("editor-content_text").fill("test page");
    await page.locator("#REPORT_PANE").getByText("Page added", { exact: true }).click();

    // Expand the report menu and delete the report
    await page.getByRole("gridcell", { name: "📋 ReportTodelete" }).getByTestId("button_report-nav").click();
    await page.getByTestId("menu-item_delete").first().click();
    await page.getByTestId("button_confirmation-dialog_delete_confirm").click();

    // verify that report is deleted properly
    await page.waitForTimeout(2000);
    await expect(await page.getByRole("link", { name: "" + reportName + "" })).toBeHidden();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
