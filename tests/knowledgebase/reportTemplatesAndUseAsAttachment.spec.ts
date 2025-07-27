import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { reportsPage } from "../../pageobjects/reports.po";

test.describe.serial("Reports Template verification", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
    await b2bSaasHomePage.clickKnowledgebase();
  });
  test.skip("Verify that report templates works, attach it as an attachment. @featureBranch @prod @smokeTest", async ({ page }) => {
    const report = new reportsPage(page);

    // Create a new Report
    const reportTitle = "Report_" + faker.person.firstName();
    await report.createReport(reportTitle);

    // Add various templates and verify if they are properly added
    const searchBoxTemplate = await page.getByTestId("button_reports-teamplates-btn");
    await searchBoxTemplate.first().click();
    await page.getByRole("menuitem", { name: "ℹ️ Generic Report Cover sheet" }).click();
    const btnUseTemplate = await page.getByTestId("button_use-template-btn");
    await btnUseTemplate.click();
    await expect(page.locator(".report-templates--backdrop")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Report’s title:" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Order reference:" })).toBeVisible();

    // Add team shift schedule report template and verify if its properly added
    await page.getByTestId("editor-content_report-editor").first().click();
    await searchBoxTemplate.click();
    await page.getByRole("menuitem", { name: "📅 Team Shift Schedule Sheet" }).click();
    await btnUseTemplate.click();
    await expect(page.locator(".report-templates--backdrop")).toHaveCount(0);
    await expect(page.getByText("Project/Machine Assigned")).toBeVisible();

    // Add meeting minute notes report template and verify if its properly added
    await searchBoxTemplate.click();
    await page.getByRole("menuitem", { name: "📆 Meeting Minute Notes" }).click();
    await btnUseTemplate.click();
    await expect(page.locator(".report-templates--backdrop")).toHaveCount(0);
    await page.locator("#app").click();
    await expect(page.getByRole("heading", { name: "Agenda" })).toBeVisible();

    // Add the requirement document as an attachment
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickModelling();
    await b2bSaasHomePage.clickAttachments();
    await b2bSaasHomePage.clickAddAttachment();
    await page.getByTestId("menu-item_report").click();
    await page.getByRole("menuitem", { name: "" + reportTitle + "" }).click();

    // Verify the attachment
    await b2bSaasHomePage.clickGridView();
    await expect(page.locator(".attachment-actions").getByText(reportTitle)).toBeVisible();

    // Delete the attachment
    await b2bSaasHomePage.clickContextMenuGridView();
    await b2bSaasHomePage.clickDeleteAttachment();

    // Verify that the attachment is deleted
    await expect(await page.getByRole("heading", { name: "No attachments for this block" })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
