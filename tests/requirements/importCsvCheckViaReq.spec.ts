import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { requirements } from "../../pageobjects/requirements.po";

test.describe("Import CSV via Requirement", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that Requirement via Import CSV is working successfully. @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickRequirements();

    // Fill the data in the first requirement document name
    const requirementPage = new requirements(page);
    await requirementPage.clickNewDocument();

    // Upload CSV file
    await page.getByTestId("button_create-req-page").click();
    await page.getByTestId("button_import-csv").click();
    await page.getByTestId("input_file-drop-zone").setInputFiles("./resources/requirements.csv");
    await page.getByTestId("button_csv-submit-catalog-item").click();

    // Verify the requirement document
    await expect(page.getByText("Unnamed block")).toBeVisible();
    await expect(page.getByText("This is a sample block")).toBeVisible();
    await expect(page.getByRole("gridcell", { name: "PN-0012345" })).toBeVisible();
    await expect(page.getByText("None")).toBeVisible();
    await expect(page.getByTestId("button_cell-dropdown_automatic")).toBeVisible();
    await expect(page.getByRole("gridcell", { name: "cube" })).toBeVisible();

    // Refresh the page and verify data is persisted
    await page.reload();
    await expect(page.getByText("Unnamed block")).toBeVisible();
    await expect(page.getByText("This is a sample block")).toBeVisible();

    // Edit the fields and verify the data is persisted
    await page.getByText("Unnamed block").click();
    await page.getByTestId("editor-content_rich-text-editor").fill("Unnamed block 0 edited");
    await expect(page.getByText("Unnamed block 0 edited")).toBeVisible();
    await page.getByText("This is a sample block").click();
    await page
      .getByRole("gridcell", { name: "This is a sample block" })
      .getByTestId("editor-content_rich-text-editor")
      .fill("Edited description");
    await expect(await page.getByText("Edited description")).toBeVisible();

    // Add a new field and verify the data is persisted
    const txtBxValue = await page.getByPlaceholder("Value");
    await txtBxValue.click();
    await txtBxValue.fill("10");
    await txtBxValue.press("Enter");
    const txtBxUnit = await page.getByPlaceholder("Unit");
    await txtBxUnit.click();
    await txtBxUnit.fill("kg");
    await txtBxUnit.press("Enter");
    await expect(page.locator('//input[@value="10"]')).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
