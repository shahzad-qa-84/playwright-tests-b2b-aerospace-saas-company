import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { PropertyPage } from "../../pageobjects/propertyRefactored.po";

test.describe("Properties Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Create new property, set units for property, Pin Property and Un-pin it, Add Group, Add property inside group, remove it @smokeTest @featureBranch", async ({
    page,
  }) => {
    const propertyPage = new PropertyPage(page);

    // Create property with value using the workflow method
    const propertyName = "Property_" + faker.person.firstName();
    const propertyValue = Math.floor(Math.random() * 1000) + 1 + " km";
    await propertyPage.createPropertyWithValue(propertyName, propertyValue);

    // Lock property workflow
    await propertyPage.lockPropertyWorkflow(propertyName, propertyValue);

    // Unlock and edit property workflow
    const newPropertyValue = Math.floor(Math.random() * 1000) + 1 + " km";
    await propertyPage.unlockAndEditPropertyWorkflow(propertyName, newPropertyValue);

    // Pin Property
    await propertyPage.expandPropertyDetails();
    await propertyPage.clickPinProperty();
    await expect(page.getByText("Pinned Properties").first()).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
