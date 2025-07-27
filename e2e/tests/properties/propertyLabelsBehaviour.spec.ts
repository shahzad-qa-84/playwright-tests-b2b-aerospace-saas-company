import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Property Columns Labels test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName, "engineering");
  });
  test("Verify property window columns functionality works @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickMoreConfigurations();
    await b2bSaasHomePage.clickPropertiesFromMenu();

    await expect(await page.getByRole("link", { name: "Properties" })).toBeVisible();
    await expect(await page.getByText("Label", { exact: true })).toBeVisible();
    await expect(await page.getByText("Group", { exact: true })).toBeVisible();
    await expect(await page.getByText("Default")).toBeVisible();
    await expect(await page.getByText("b2bSaas", { exact: true })).toBeVisible();
    await expect(await page.getByText("Instances")).toBeVisible();

    // Change the type of the property to string and verify if its changed
    await page.getByTestId("button_type_mass").click();
    await page.getByRole("menuitem", { name: "string" }).click();
    await expect(await page.getByRole("button", { name: "string" })).toBeVisible();

    // Expand instances detail and change it and verify control is backed to New system
    await page.getByTestId("ag-cell_instance_mass").click();
    await page.getByText("/:mass").click();
    await page.getByPlaceholder("String value").click();
    await expect(await page.getByRole("heading", { name: "New System" }).getByText("New System")).toBeVisible();

    // Click Dependency graph, add some value and verify if its added
    await page.getByTestId("expandMenuDiv_mass").getByTestId("button_block-property-list-item_more").click();
    await page.getByTestId("menu-item_dependency-graph").click();
    await page.locator("div").filter({ hasText: "Dependency Graph: New System:mass" }).nth(3).click();
    await expect(await page.locator(".react-flow__pane")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
