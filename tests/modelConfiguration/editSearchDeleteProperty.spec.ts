import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Property Definitions test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that from Modelling Configuration Add new Property, Edit Property and deletion is working @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickModelling();

    // Click Model configuration
    await b2bSaasHomePage.clickModellConfiguration();

    // Add the property
    const propertyToBeAdded = faker.person.firstName().toLocaleLowerCase();

    // Click Poperties
    await page.getByTestId("nav-link_properties").click();

    // Add new property
    await page.getByTestId("button_add-new-row").click();
    await page.getByPlaceholder("Add new property").fill(propertyToBeAdded);
    await page.getByPlaceholder("Add new property").press("Enter");
    await page.getByTestId("button_type_" + propertyToBeAdded).click();
    await page.getByTestId("menu-item_type-cel_menu-item_string").click();
    await page.getByTestId("button_type_" + propertyToBeAdded).click();

    // Type property type as Scalar
    await page.getByTestId("menu-item_type-cel_menu-item_scalar").click();
    await page.getByTestId("ag-cell_label_" + propertyToBeAdded).click();

    // Edit the type of the property
    await page
      .getByRole("row", { name: propertyToBeAdded + " scalar" })
      .getByRole("textbox")
      .fill(propertyToBeAdded + "_edit");
    await page
      .getByRole("gridcell", { name: propertyToBeAdded + "_edit" })
      .locator("div")
      .nth(1)
      .click();
    await page
      .getByRole("row", { name: propertyToBeAdded + "_edit scalar" })
      .getByRole("textbox")
      .click();

    // Search for the property and delete it
    const txtBxSearch = await page.getByPlaceholder("Search for Definitions");
    await txtBxSearch.click();
    await txtBxSearch.fill(propertyToBeAdded + "_edit");
    await txtBxSearch.press("Enter");

    // Expand the menu
    const menu = await page.getByTestId("button_actions-cell_drag");
    await menu.click();

    // Verify if property is displayed in Properties section
    await b2bSaasHomePage.clickBlocks();
    await page.locator("#bp5-tab-title_block-view-tabs_properties").getByText("Properties").click();
    await page.getByText("property", { exact: true }).click();
    await page.getByPlaceholder("Add new property").click();
    await page.getByTestId("menu-item_" + propertyToBeAdded + "_edit").click();

    // Locate the property element by its attributes
    const inputElement = page.locator('input.bp5-input[placeholder="Name"]');

    // Assert the value of the input element
    await expect(inputElement).toHaveValue(propertyToBeAdded + "_edit");

    // Delete the property
    b2bSaasHomePage.clickPropertiesFromModellConfiguration();
    await page.getByTestId("button_actions-cell_drag").click();
    await page.getByTestId("menu-item_delete").click();

    // Verify that the property is deleted
    await expect(page.getByText("No Rows To Show")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
