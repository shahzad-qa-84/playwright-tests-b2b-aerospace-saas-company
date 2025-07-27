import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { requirements } from "../../pageobjects/requirements.po";

test.describe("Add Custom column", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that Addition or deletion of custom column and new row from Document view is working successfully. @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickRequirements();

    // Add a new requirement block
    const requirementPage = new requirements(page);
    await requirementPage.clickNewDocument();
    await requirementPage.clickNewRequirentBlock();

    // Add a custom column
    requirementPage.clickAddColumn();
    await requirementPage.addNewColumn("Custom col1");

    // Verify that the custom column is added
    await expect(page.getByRole("heading", { name: "Custom col1" })).toBeVisible();

    // Add the Checkbox to custom column
    await page.getByTestId("menu-item_multi-select").click();
    const expandOption = await page.getByRole("columnheader", { name: "Custom col1" }).getByTestId("button_header-cell_default");
    await expandOption.click();
    await page.getByTestId("menu-item_check").click();
    const checkBxAddedCustomCol = await page.locator('[data-testid*="_Custom col1_"]').locator("//span").first();
    await checkBxAddedCustomCol.click();

    // Remove the custom column and verify that it is removed
    await expandOption.click();
    await page.getByTestId("menu-item_remove").click();
    await expect(page.getByRole("heading", { name: "Custom col1" })).toBeHidden();

    // Verify that new Row is added and working and displayed in both Document and Table view
    await requirementPage.clickDocumentView();
    await page.getByTestId("button_new-row").click();
    await page.getByTestId("menu-item_add-requirement-block").click();
    await page.getByTestId("button_document-actions-nav_drag").first().click();
    await page.getByTestId("menu-item_delete").click();
    await page.getByRole("paragraph").click();
    const rowName = "direct row from document";
    await page.getByTestId("editor-content_text").fill(rowName);
    await page.getByTestId("button_table-view").click();
    await expect(page.locator('[data-testid*="editor-content_rich-text-cell_"]').getByText(rowName)).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
