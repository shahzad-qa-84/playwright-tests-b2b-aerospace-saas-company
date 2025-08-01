import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { PropertyPage } from "../../pageobjects/propertyRefactored.po";

test.describe("Properties Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateEngineeringWorkspace(workspaceName);
  });
  test("Verify Property hints and messages on Activity timeline are displaying properly @smokeTest @featureBranch", async ({ page }) => {
    const propertyPage = new PropertyPage(page);

    // Create property and add volume formula
    const propertyName = "Property_" + faker.person.firstName();
    await propertyPage.addPropertyOrGroupLink();
    await propertyPage.addNewPropertyFromBlockSection(propertyName);
    await propertyPage.addPropertyValueWithFormula(propertyName, "{{vol");

    // Select volume from formula menu
    await propertyPage.selectVolumeFromMenu();

    // Verify property hints are displayed properly
    await propertyPage.verifyPropertyHints();

    // Click on evaluated equation and verify references
    await propertyPage.clickEvaluatedEquation();
    await propertyPage.verifyReferencesSection();

    // Add comment to activity timeline
    const messageActivityTimeLine = "This is a test message for proprty with name " + propertyName;
    await propertyPage.openCommentsPopover();
    await propertyPage.addCommentToActivityTimeline(messageActivityTimeLine);

    // Open property details
    await propertyPage.openPropertyDetails(propertyName);

    // Verify activity log is displayed properly
    await propertyPage.verifyActivityLogComment();

    // Hover on property and verify comment is displayed
    await propertyPage.hoverOnPropertyName();
    await propertyPage.verifyCommentVisible();

    // Close the comment and verify it's hidden
    await propertyPage.closeCommentsAndVerify();
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
