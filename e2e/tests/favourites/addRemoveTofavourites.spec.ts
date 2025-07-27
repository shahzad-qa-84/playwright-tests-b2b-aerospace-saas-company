import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Add/Remove Components to Favourites Test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test.skip("Verify that if adding/removing template to Favourites works @featureBranch @prod @smokeTest", async ({ page }) => {
    // Add Report template
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickKnowledgebase();

    // Add the predefined template
    await page.getByTestId("button_reports-teamplates-btn").click();

    // Select template from displayed list and hit 'Use Template' button
    const templateName = "🔔 Project Status Update";
    await page.getByRole("menuitem", { name: "" + templateName + "" }).click();
    await page.getByTestId("button_use-template-btn").click();

    // Verify just heading and few content of the selected template
    await expect(page.getByPlaceholder("Untitled").first()).toBeVisible();
    await expect(page.getByRole("treegrid").getByText("Copy of Project Status Update")).toBeVisible();

    // Add the template to favourites
    await page.getByRole("row", { name: "Copy of Project Status Update" }).getByTestId("button_add-favorite").click();

    // Verify if the template is added to favourites
    await page.getByTestId("nav-link_favorites").locator("svg").nth(1).click();
    await expect(page.getByTestId("nav-link_favorite-copy-of-project-status-update")).toBeVisible();

    // Remove the template from favourites
    await page.getByTestId("nav-link_favorite-copy-of-project-status-update").hover();
    await page.getByTestId("button_remove-favorite-copy-of-project-status-update").click();

    // Verify if the template is removed from favourites and 'Empty' is displayed
    await expect(page.getByText("Empty")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
