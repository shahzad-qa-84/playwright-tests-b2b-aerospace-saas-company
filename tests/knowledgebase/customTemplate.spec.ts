import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe.serial("Custom Report Template verification", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
    await b2bSaasHomePage.clickKnowledgebase();
  });
  test("Verify that custom report templates works. @featureBranch @prod @smokeTest", async ({ page }) => {
    // Create a new Report
    const templateTitle = "Custom_template_" + faker.person.firstName();

    // Click the Custom Template option
    await page.getByText("Getting started").first().hover();
    await page.getByText("Getting started").first().click();
    await page.getByRole("gridcell", { name: "📋 Getting started" }).getByTestId("button_report-nav").click();
    await page.getByTestId("menu-item_create-template").click();

    // Create a new template
    const txtBxTemplateTitle = await page.getByLabel("Template name");
    await txtBxTemplateTitle.click();
    await txtBxTemplateTitle.click();
    await txtBxTemplateTitle.press("Meta+a");
    await txtBxTemplateTitle.fill(templateTitle);
    await page.getByTestId("button_create-template").click();

    // Select the template and verify that the template is selected
    await page.getByTestId("button_report-templates").click();
    await page.getByRole("menuitem", { name: "📋 " + templateTitle + "" }).click();
    await page.getByTestId("button_use-template-btn").click();
    await expect(page.getByPlaceholder("Untitled").first()).toBeVisible();
    await expect(page.locator('input[value="' + templateTitle + '"]')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
