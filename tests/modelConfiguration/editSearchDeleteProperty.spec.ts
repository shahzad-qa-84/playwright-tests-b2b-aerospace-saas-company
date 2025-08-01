import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { ModelConfigurationPage } from "../../pageobjects/modelConfigurationRefactored.po";

test.describe("Property Definitions test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Verify that from Modelling Configuration Add new Property, Edit Property and deletion is working @prod @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const modelConfigPage = new ModelConfigurationPage(page);

    // Navigate to modelling and model configuration
    await homePage.clickModelling();
    await homePage.clickModellConfiguration();

    // Generate property name
    const propertyToBeAdded = faker.person.firstName().toLowerCase();

    // Navigate to properties section
    await modelConfigPage.clickProperties();

    // Create and configure property with type changes
    await modelConfigPage.createProperty(propertyToBeAdded, "string");
    await modelConfigPage.setPropertyType(propertyToBeAdded, "scalar");

    // Edit the property name
    const editedPropertyName = propertyToBeAdded + "_edit";
    await modelConfigPage.editPropertyName(propertyToBeAdded, editedPropertyName);

    // Search for the edited property
    await modelConfigPage.searchProperty(editedPropertyName);
    await modelConfigPage.openActionsMenu();

    // Verify property is displayed in Properties section
    await homePage.clickBlocks();
    await modelConfigPage.verifyPropertyInBlocksSection(editedPropertyName);

    // Delete the property from model configuration
    await homePage.clickPropertiesFromModellConfiguration();
    await modelConfigPage.deleteProperty();

    // Verify that the property is deleted
    await modelConfigPage.verifyNoRowsToShow();
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