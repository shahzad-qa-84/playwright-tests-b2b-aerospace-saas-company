import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { propertyPage } from "../../pageobjects/property.po";
import { reportsPage } from "../../pageobjects/reports.po";

test.describe.serial("Reports Title deletion", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
    await b2bSaasHomePage.clickKnowledgebase();
  });
  test("Verify that a person and properties can be reference in a report and later title can be deleted properly. @featureBranch @prod @smokeTest", async ({
    page,
  }) => {
    const b2bSaasHomePage = new homePage(page);
    const report = new reportsPage(page);

    // Create a new Report
    const reportTitle = "Report_" + faker.person.firstName();
    await report.createReport(reportTitle);

    // Click report generated in previous test
    await page.getByText(reportTitle).first().click();

    // Delete the report title
    const txtBxReportTitle = await page.getByPlaceholder("Untitled");
    await txtBxReportTitle.click();
    await txtBxReportTitle.press("Meta+a");
    await txtBxReportTitle.fill("");
    await txtBxReportTitle.press("Enter");

    // Verify title is deleted and report is renamed to "Untitled"
    await expect(await page.getByPlaceholder("Untitled")).toBeVisible();

    await b2bSaasHomePage.clickModelling();
    const property = new propertyPage(page);

    // Add a new property from Blocks section
    const propertyName = "test_reference";
    await property.addPropertyOrGroupLink();
    await property.addNewPropertyFromBlockSection(propertyName);

    // Mention other people name and verify if its properly assigned
    await b2bSaasHomePage.clickKnowledgebase();
    await page.getByText("Getting started", { exact: true }).click();
    await page.getByTestId("button_report-create-empty").click();
    await page.getByRole("paragraph").first().click();
    const txtBxReport = await page.getByTestId("editor-content_text").first();
    await txtBxReport.fill("@test_reference");

    // Mention property and verify if its properly assigned
    await page.getByRole("menuitem", { name: "/:test_reference" }).click();
    const systemProperty = await page.getByText("New System:test_reference");
    await expect(await systemProperty).toBeVisible();

    // Click added property and verify control goes to the system property
    await systemProperty.click();
    await page.getByRole("heading", { name: "New System" }).locator("span").click();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
