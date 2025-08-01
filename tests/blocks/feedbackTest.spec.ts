import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";

test.describe("Feedback Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Add Feedback works @featureBranch @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);

    // Open Help menu and navigate to feedback
    await homePage.clickHelp();
    await homePage.clickLeaveFeedback();

    // Verify feedback window is opened correctly
    await homePage.verifyFeedbackWindow();

    // Perform actions on "Problem" Tab
    await homePage.selectProblemTab();
    await homePage.fillFeedbackSubject("test subject");
    await homePage.fillFeedbackBody("I am test only");

    // Verify submit button is enabled
    await homePage.verifySubmitButtonEnabled();
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