import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Requirements creation", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test.skip("Verify that rows on new requirement document are created successfully. @smokeTest @featureBranch", async ({ page }) => {
    // Create a new Requirement
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickRequirements();

    // Fill the data in the first requirement document name
    await page.getByTestId("nav-link_menu-pane_requirements").click();
    await page.getByTestId("button_requirements-frame_create").click();

    await page.getByTestId("button_new-row").click();
    await page.getByTestId("menu-item_add-requirement-block").click();
    await page
      .locator('[data-testid*="editor-content_rich-text-cell_"][data-testid*="_description"]')
      .first()
      .getByRole("paragraph")
      .click();
    await page.getByTestId("editor-content_rich-text-editor").fill("this a test description");
    await page.locator('[data-testid*="editor-content_rich-text-cell_"][data-testid*="_rationale"]').first().getByRole("paragraph").click();
    await page.getByTestId("editor-content_rich-text-editor").fill("test");
    await page.getByPlaceholder("Link property...").click();
    await page.getByTestId("button_cell-dropdown_method-cell-dropdown").click();
    await page.getByTestId("menu-item_inspection").click();
    await page.getByTestId("menu-item_simulation").click();
    await page.getByTestId("menu-item_analysis").click();
    await page.getByTestId("menu-item_demonstration").click();
    await page.getByTestId("menu-item_test").click();
    await page.getByTestId("menu-item_sample").click();
    await page.getByText("ROL-1").click();

    // Create H1 heading document
    await page.getByTestId("button_new-row").click();
    await page.getByTestId("menu-item_add-h1-block").click();
    await page.getByPlaceholder("Heading 1").click();
    await page.getByPlaceholder("Heading 1").fill("test");
    await page.getByPlaceholder("Heading 1").press("Enter");

    // Create H2 heading document
    await page.getByTestId("button_new-row").click();
    await page.getByTestId("menu-item_add-h2-block").click();
    await page.getByPlaceholder("Heading 2").click();
    await page.getByPlaceholder("Heading 2").fill("test heading 2");
    await page.getByPlaceholder("Heading 2").press("Enter");
    await page.getByPlaceholder("Heading 2").click();

    // Create H3 heading document
    await page.getByTestId("button_new-row").click();
    await page.getByTestId("menu-item_add-h3-block").click();
    await page.getByPlaceholder("Heading 3").click();
    await page.getByPlaceholder("Heading 3").fill("test heading 3");
    await page.getByPlaceholder("Heading 3").press("Enter");

    // delete all added rows and verify rows are deleted
    const deleteButton = await page.getByTestId("menu-item_delete");
    await page.getByRole("row", { name: "test heading 3" }).getByTestId("button_actions-cell_drag").click();
    await deleteButton.click();
    await page.getByRole("row", { name: "test heading" }).getByTestId("button_actions-cell_drag").click();
    await deleteButton.click();
    await page.getByRole("row", { name: "test", exact: true }).getByTestId("button_actions-cell_drag").click();
    await deleteButton.click();
    await expect(await page.locator(".ag-center-cols-container")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
