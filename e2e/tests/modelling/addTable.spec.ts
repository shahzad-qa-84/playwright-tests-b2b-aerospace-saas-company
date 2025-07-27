import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe.serial("Add Table rows to Configuration Modell", () => {
  let workspaceName;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test.skip("Verify that table rows can be added/updated/deleted. @prod @smokeTest @featureBranch", async ({ page }) => {
    await page.getByTestId("nav-link_menu-pane_modeling").click();

    // Click on the Table option
    await page.getByTestId("nav-link_menu-pane_table").click();
    await page.getByTestId("button_tab_nav").click();

    // Duplicate the table entry
    await page.getByTestId("menu-item_duplicate").click();

    // Verify that the table entry is duplicated
    await expect(await page.getByText("Everything (copy)")).toBeVisible();

    // Add a new child block
    await page.locator('[data-icon="small-plus"]').first().click();
    await page.getByTestId("menu-item_add-new-child-block").click();
    await page.getByPlaceholder("Name").fill("test");
    await page.getByPlaceholder("Name").press("Enter");

    // Verify that the child block is added
    await expect(await page.getByTestId("input_test_1").getByText("test")).toBeVisible();

    // Duplicate the table entry
    await page
      .locator("div")
      .filter({ hasText: /^Everything$/ })
      .click();
    await page.getByText("Everything", { exact: true }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Everything$/ })
      .getByTestId("button_tab_nav")
      .click();
    await page.getByTestId("menu-item_duplicate").click();
    await page.getByText("Everything (copy)").nth(1).click();
    await page.getByText("Everything (copy)").first().click();
    await page.getByTestId("button_tab_nav").nth(1).click();
    await page.getByRole("gridcell", { name: "x1" }).first().click();
    await page.getByTestId("button_tab_nav").nth(1).click();

    // Update the table entry and verify the update
    const txtBxLocator = page.locator("ul").filter({ hasText: "NameDuplicateDelete" }).getByRole("textbox");
    await txtBxLocator.click();
    await txtBxLocator.press("ArrowRight");
    await txtBxLocator.press("ArrowRight");
    await txtBxLocator.fill("Everything)");
    await txtBxLocator.press("ArrowRight");
    await txtBxLocator.fill("Everything renamed");
    await txtBxLocator.press("Enter");
    await expect(await page.getByText("Everything renamed")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
