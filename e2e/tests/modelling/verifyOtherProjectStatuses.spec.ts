import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe.serial("StatusesTable to Configuration Model verification", () => {
  let workspaceName;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that other StatusesTable works as expected. @prod @smokeTest @featureBranch", async ({ page }) => {
    await page.getByTestId("nav-link_menu-pane_modeling").click();
    await page.getByTestId("nav-link_model-configuration").click();
    await page.getByTestId("nav-link_statuses").click();

    // Add new project status
    await page.getByTestId("button_add-new-row").click();
    await page.getByPlaceholder("Add new status").fill("test_status_url");
    await page.getByPlaceholder("Add new status").press("Enter");
    await page.getByRole("gridcell").nth(3).click();

    // Add type "url" to the added status
    await page.getByTestId("button_type-cell").click();
    await page.getByTestId("menu-item_type-cel_menu-item_url").click();

    // Add new project status with type "Mention"
    const btnAddNewProperty = await page.getByTestId("button_add-new-row");
    await btnAddNewProperty.click();
    const txtBxAddNewProperty = await page.getByPlaceholder("Add new status");
    await txtBxAddNewProperty.fill("test_mention");
    await txtBxAddNewProperty.press("Enter");
    await page.getByRole("row", { name: "test_mention No options can be applied to this type" }).getByTestId("button_type-cell").click();
    await page.getByTestId("menu-item_type-cel_menu-item_mention").click();

    // Add new project status with type "Single-select"
    await btnAddNewProperty.click();
    await txtBxAddNewProperty.fill("test_single_select");
    await txtBxAddNewProperty.press("Enter");
    await page
      .getByRole("row", { name: "test_single_select No options can be applied to this type" })
      .getByTestId("button_type-cell")
      .click();
    await page.getByTestId("menu-item_type-cel_menu-item_single-select").click();

    // Add new project status with type "Number"
    await btnAddNewProperty.click();
    await txtBxAddNewProperty.fill("test_number");
    await txtBxAddNewProperty.press("Enter");
    await page.getByRole("row", { name: "test_number No options can be applied to this type" }).getByTestId("button_type-cell").click();
    await page.getByTestId("menu-item_type-cel_menu-item_number").click();

    // Add new project status with type "Check"
    await btnAddNewProperty.click();
    await txtBxAddNewProperty.fill("test_check");
    await txtBxAddNewProperty.press("Enter");
    await page.getByRole("row", { name: "test_check No options can be applied to this type" }).getByTestId("button_type-cell").click();
    await page.getByTestId("menu-item_type-cel_menu-item_check").click();

    // Add new project status with type "Date"
    await btnAddNewProperty.click();
    await txtBxAddNewProperty.fill("test_date");
    await txtBxAddNewProperty.press("Enter");
    await page.getByRole("row", { name: "test_date No options can be applied to this type" }).getByTestId("button_type-cell").click();
    await page.getByTestId("menu-item_type-cel_menu-item_date").click();

    // Go to modeling
    await page.getByTestId("nav-link_menu-pane_modeling").click();

    // check Date field
    await page.getByPlaceholder("MM/DD/YYYY").click();
    await page.getByText("14", { exact: true }).click();

    // check the checkbox
    await page.getByRole("button", { name: "test_check" }).click();
    await page.getByPlaceholder("Click to Edit").press("Tab");
    await page.getByTestId("checkbox_test_check").press("Enter");

    // Add number
    await page.getByRole("button", { name: "test_number Empty" }).click();
    await page.getByPlaceholder("Click to Edit").press("Tab");
    await page.getByRole("button", { name: "test_number" }).getByPlaceholder("Empty").fill("7");

    // use single select option
    await page.getByRole("button", { name: "test_single_select" }).click();
    await page.getByPlaceholder("Click to Edit").press("Tab");
    await page.getByRole("button", { name: "test_single_select" }).getByPlaceholder("Empty").fill("test");
    await page.getByRole("button", { name: "test_single_select" }).getByPlaceholder("Empty").press("Enter");

    // use mention
    await page.getByRole("button", { name: "test_mention" }).click();
    await page.getByPlaceholder("Click to Edit").press("Tab");
    await page.getByPlaceholder("Empty").fill("@test");
    await page.getByTestId("menu-item_no-match").isVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
