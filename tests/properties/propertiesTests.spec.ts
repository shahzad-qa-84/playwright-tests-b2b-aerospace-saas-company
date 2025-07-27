import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { propertyPage } from "../../pageobjects/property.po";

test.describe("Properties Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test.skip("Create new property, set units for property, Pin Property and Un-pin it, Add Group, Add property inside group, remove it @smokeTest @featureBranch", async ({
    page,
  }) => {
    const property = new propertyPage(page);

    // Add a new property from Blocks section and verify if its added properly
    const propertyName = "Property_" + faker.person.firstName();
    await property.addPropertyOrGroupLink();
    await property.addNewPropertyFromBlockSection(propertyName);
    await expect(await page.getByText(propertyName)).toBeVisible();

    // Add the property value bettween 1-1000 km and verify if its properly assigned
    const propertyValue = Math.floor(Math.random() * 1000) + 1 + " km";
    await property.addPropertyValue(propertyName, propertyValue);
    await expect(await page.getByText(propertyValue, { exact: true }).first()).toBeVisible();

    // Lock property and verify its locked
    const lockIcon = page.locator('svg[data-icon="lock"]').first();
    await property.lockProperty();
    await expect(await lockIcon).toBeVisible();

    // UnLock property and verify its unlocked by editing the value
    await property.unlockProperty();
    const newPropertyValue = Math.floor(Math.random() * 1000) + 1 + " km";
    await property.addPropertyValue(propertyName, newPropertyValue);
    await expect(await page.getByText(newPropertyValue, { exact: true }).first()).toBeVisible();

    // Pin Property
    await property.expandPropertyDetails();
    await property.clickPinProperty();
    await expect(await page.getByText("Pinned Properties").first()).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
