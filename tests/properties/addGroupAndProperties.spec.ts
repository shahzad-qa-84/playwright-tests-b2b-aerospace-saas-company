import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { ChildBlockPage } from "../../pageobjects/childBlockRefactored.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { PropertyPage } from "../../pageobjects/propertyRefactored.po";

test.describe("Add Group and Properties assign Tests", () => {
  let wsId: string | undefined;
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Set property instances in child-blocks and Add Group @smokeTest @prod @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const childBlockPage = new ChildBlockPage(page);
    const propertyPage = new PropertyPage(page);

    // Navigate to Child Blocks and create a child
    await childBlockPage.clickChildBlocks();
    const child1Name = "Child_" + faker.person.firstName();
    await childBlockPage.createChildBlockFromMainBar(child1Name);

    // Navigate to the created child block
    await homePage.clickChildBlocksSection();
    await homePage.clickChildByName(child1Name);

    // Navigate to Properties tab
    await propertyPage.clickPropertiesTab();

    // Create first property
    const property1Name = "Property1_" + faker.person.firstName();
    await propertyPage.addPropertyOrGroupLink();
    await propertyPage.addNewPropertyFromBlockSection(property1Name);

    // Create second property
    const property2Name = "Property_" + faker.person.firstName();
    await propertyPage.createPropertyWithValue(property2Name, "67");

    // Add values to properties
    await propertyPage.addPropertyValue(property1Name, "45");

    // Create group and verify it's visible
    const groupName = "Group_" + faker.person.firstName();
    await propertyPage.addGroup(groupName);
    await propertyPage.verifyGroupVisible(groupName);

    // Verify group is empty
    await propertyPage.verifyGroupIsEmpty();

    // Navigate to roll-up view and verify property values
    await homePage.clickb2bSaasLogo();
    await homePage.verifyRollUpValues("45", "67");
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