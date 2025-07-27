import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { reportsPage } from "../../pageobjects/reports.po";

test.describe.serial("Reports Headings verification", () => {
  let workspaceName;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
    await b2bSaasHomePage.clickKnowledgebase();
  });

  test("Verify that new report can be created and duplicated successfully with all heading options. @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const report = new reportsPage(page);

    //Create a new Report
    const reportTitle = "Report_" + faker.person.firstName();
    await report.createReport(reportTitle);
    await page.getByRole("paragraph").click();
    await page.locator(".tiptap").fill("test to change headings");

    // Expand menu option
    const menuOption = await page.locator("#REPORT_PAGE_CONTENT").getByRole("button").nth(3);
    await menuOption.click();

    // Verify three options of headings re visible
    await expect(await page.getByRole("menuitem", { name: "header 1" })).toBeVisible();
    await expect(await page.getByRole("menuitem", { name: "header 2" })).toBeVisible();
    await expect(await page.getByRole("menuitem", { name: "header 3" })).toBeVisible();

    // Change to heading H1
    await page.getByRole("menuitem", { name: "header 1" }).click();

    // Expand option and verify H2 and H3 are visible
    await menuOption.click();
    await expect(await page.getByRole("menuitem", { name: "header 2" })).toBeVisible();
    await expect(await page.getByRole("menuitem", { name: "header 3" })).toBeVisible();

    // Change to H2
    await page.getByRole("menuitem", { name: "header 2" }).click();

    // Expand option and verify H1 and H3 are visible
    await menuOption.click();
    await expect(await page.getByRole("menuitem", { name: "header 1" })).toBeVisible();
    await expect(await page.getByRole("menuitem", { name: "header 3" })).toBeVisible();

    // Change to H3
    await page.getByRole("menuitem", { name: "header 3" }).click();

    // Expand option and verify H1 and H2 are visible
    await menuOption.click();
    await expect(await page.getByRole("menuitem", { name: "header 2" })).toBeVisible();
    await expect(await page.getByRole("menuitem", { name: "header 1" })).toBeVisible();
    await page.getByPlaceholder("Untitled").click();
    await page
      .locator("#REPORT_PANE")
      .getByText("" + reportTitle + "", { exact: true })
      .click();

    // Duplicate report
    await page
      .getByRole("gridcell", { name: "📋 " + reportTitle + "" })
      .locator("div")
      .first()
      .click();
    await page
      .getByRole("gridcell", { name: "📋 " + reportTitle + "" })
      .getByTestId("button_report-nav")
      .click();
    await page.getByTestId("menu-item_duplicate").click();

    // Verify the duplicated report is created
    await page.getByText("Copy of " + reportTitle, { exact: true }).click();
    await page.getByText("test to change headings").click();
    await page.getByText("" + reportTitle + "", { exact: true }).click();

    // Delete the heading and verify if its deleted
    await page.getByTestId("button_document-actions-nav_drag").click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await expect(await page.getByText("test to change headings")).toBeHidden();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
