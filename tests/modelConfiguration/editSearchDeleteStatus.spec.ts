import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Statuses test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that from Modelling Configuration Add new Status, Edit Status and deletion is working @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickModelling();

    // Click Model configuration
    await b2bSaasHomePage.clickModellConfiguration();

    // Add the new status
    const statusToBeAdded = faker.person.firstName().toLocaleLowerCase();

    // Click Statuses
    await b2bSaasHomePage.clickStatuses();

    // Add new status
    await page.getByTestId("button_add-new-row").click();
    await page.getByPlaceholder("Add new status").fill(statusToBeAdded);
    await page.getByPlaceholder("Add new status").press("Enter");

    // Edit the status
    await page.getByTestId("ag-cell_label_" + statusToBeAdded).click();
    await page
      .getByRole("gridcell", { name: "" + statusToBeAdded + "" })
      .getByRole("textbox")
      .fill(statusToBeAdded + "_edited");
    await page
      .getByRole("gridcell", { name: "" + statusToBeAdded + "" })
      .getByRole("textbox")
      .press("Enter");
    await page.getByTestId("ag-cell_label_" + statusToBeAdded + "_edited").click();

    // Go to Modelling and verify the new added status is there
    await b2bSaasHomePage.clickModelling();
    await expect(page.getByRole("button", { name: statusToBeAdded + "_edited Empty" })).toBeVisible();

    // Delete the status
    await b2bSaasHomePage.clickStatuses();
    await page.getByTestId("button_actions-cell_drag").click();
    await page.getByTestId("menu-item_delete").click();
    await page.locator(".ag-center-cols-viewport").click();

    // Verify that the Status is deleted
    await expect(page.getByText("No Rows To Show")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
