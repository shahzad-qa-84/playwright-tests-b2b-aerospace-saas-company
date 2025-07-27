import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
test.describe("Property to Modelling configuration", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateEngineeringWorkspace(workspaceName);
  });
  test("Verify that test for adding/deleting property with various configuration in the 'Model configuration' works. @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickModelling();

    // Click Project Management and verify that "Upload Image" option is displayed
    await page.getByTestId("nav-link_model-configuration").click();
    await page.getByTestId("nav-link_properties").click();
    await page.getByTestId("button_add-new-row").click();
    const txtBxAddNewProperty = page.getByPlaceholder("Add new property");
    await txtBxAddNewProperty.fill("mass");
    await page.getByRole("row", { name: "mass Intrinsic scalar kg 1" }).getByTestId("button_actions-cell_drag").click();
    await page.getByTestId("button_add-new-row").click();
    await txtBxAddNewProperty.fill("mass");
    await txtBxAddNewProperty.press("Enter");
    await txtBxAddNewProperty.fill("@mass");
    await txtBxAddNewProperty.press("Enter");
    await txtBxAddNewProperty.fill("@power");
    await txtBxAddNewProperty.press("Enter");
    await txtBxAddNewProperty.blur();

    // Delete Power property and verify if its deleted
    await page.getByRole("row", { name: "power Electrical scalar W" }).getByTestId("button_actions-cell_drag").click();
    await page.getByTestId("menu-item_delete").click();
    await page.getByTestId("ag-cell_unit_volume").click();
    await page.locator(".ag-center-cols-container > div:nth-child(4) > div:nth-child(3)").click();

    // Verify the properties are added
    await expect(await page.getByTestId("ag-cell_label_mass")).toBeVisible();
    await expect(await page.getByTestId("ag-cell_label_volume")).toBeVisible();
    await expect(await page.getByTestId("ag-cell_label_cost")).toBeVisible();
    await page.getByTestId("ag-cell_label_@power").click();
    await page.getByTestId("ag-cell_group_@mass").click();
    await page.getByRole("row", { name: "@mass scalar" }).getByRole("textbox").fill("test");
    await page.getByRole("row", { name: "@mass test scalar" }).getByRole("textbox").press("Enter");

    // Assign different Types to Properties
    await page.getByTestId("button_type_@mass").click();
    await page.getByTestId("menu-item_type-cel_menu-item_string").click();
    await page.locator("div:nth-child(4) > div:nth-child(6)").click();
    await page.getByRole("row", { name: "@mass test string" }).getByRole("textbox").fill("EUR");
    await page.getByRole("row", { name: "@mass test string" }).getByRole("textbox").press("Enter");
    await expect(await page.getByRole("gridcell", { name: "EUR" })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
