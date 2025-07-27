import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { propertyPage } from "../../pageobjects/property.po";

test.describe("Property window test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify creation and deletion of property from window works @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickMoreConfigurations();
    await b2bSaasHomePage.clickPropertiesFromMenu();

    // Add the property
    const propertyToBeAdded = faker.person.firstName();
    const property = new propertyPage(page);
    await property.addNewPropertyFromMainWindow(propertyToBeAdded);

    // Verify that property is added
    await expect(await page.getByText(propertyToBeAdded)).toBeVisible();

    // Delete the added property
    await page.locator(".formatted-table").click();
    await page.getByTestId("button_actions-cell_drag").click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
