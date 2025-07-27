import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe.serial("StatusesTable to Configuration Model verification", () => {
  let workspaceName;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Multi select StatusesTable can be added/deleted. @prod @smokeTest @featureBranch", async ({ page }) => {
    await page.getByTestId("nav-link_menu-pane_modeling").click();
    await page.getByTestId("nav-link_model-configuration").click();
    await page.getByTestId("nav-link_statuses").click();

    // Add new project status
    await page.getByTestId("button_add-new-row").click();
    await page.getByPlaceholder("Add new status").fill("test_status");
    await page.getByPlaceholder("Add new status").press("Enter");
    await page.getByRole("gridcell").nth(3).click();

    const textboxStatus = await page.getByRole("row", { name: "test_status No options can be applied to this type" }).getByRole("textbox");
    await textboxStatus.fill("This is a test status");

    // Add type "Multi-select" to the added status
    await page.getByTestId("button_type-cell").click();
    await page.getByTestId("menu-item_type-cel_menu-item_multi-select").click();
    await page.getByTestId("button_add-option").click();

    // Add four options to the project status
    const textboxOption = await page.getByRole("row", { name: "test_status This is a test status" }).getByRole("textbox");
    await textboxOption.fill("test 1");
    await textboxOption.press("Enter");
    await textboxOption.fill("test 2");
    await textboxOption.press("Enter");
    await textboxOption.fill("test 3");
    await textboxOption.press("Enter");
    await textboxOption.fill("test 4");
    await textboxOption.press("Enter");

    // Add options to the status and wait is here needed to have stability in test
    await page
      .locator("div")
      .filter({ hasText: /^test_statusThis is a test statustest 1test 2test 3test 4$/ })
      .first()
      .click();
    await page.getByTestId("nav-link_menu-pane_modeling").click();
    await page.getByPlaceholder("Empty").click();
    await page.waitForTimeout(500);
    await page.getByTestId("menu-item_test-1").click();
    await page.waitForTimeout(500);
    await page.getByTestId("menu-item_test-2").click();
    await page.waitForTimeout(500);
    await page.getByTestId("menu-item_test-3").click();
    await page.waitForTimeout(500);
    await page.getByTestId("menu-item_test-4").click();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "test_status" }).click();
    const optionRemoveTag = await page.getByLabel("Remove tag");
    await optionRemoveTag.nth(3).click();
    await optionRemoveTag.nth(2).click();
    await optionRemoveTag.nth(1).click();
    await optionRemoveTag.click();

    // Verify all options are deelted
    await expect(await page.getByPlaceholder("Empty")).toBeVisible();

    // Add status now from the text box directly
    await page.getByRole("heading", { name: "Select an Option or Create a New One" }).click();
    await page.getByPlaceholder("Empty").click();
    await page.getByPlaceholder("Empty").fill("My direct status");
    await page.getByTestId("menu-item_create-new-item").click();
    await page.getByLabel("Remove tag").click();
    await page.getByTestId("menu-item_my-direct-status").click();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
