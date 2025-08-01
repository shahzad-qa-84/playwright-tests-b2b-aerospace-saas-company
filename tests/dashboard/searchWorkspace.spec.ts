import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";

test.describe("Search workspace from top header test", () => {
  const workspaceName1 = "AutomatedTest_1_" + faker.internet.userName().substring(0, 5);
  const workspaceName2 = "AutomatedTest_2_" + faker.internet.userName().substring(0, 5);
  let wsId1: string | undefined;
  let wsId2: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId1 = await homePage.openUrlAndCreateTestWorkspace(workspaceName1);
    await page.waitForTimeout(3000);
  });
  
  test("Verify that searching workspace from top header works @featureBranch @prod @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);

    // Create second workspace
    wsId2 = await homePage.openUrlAndCreateTestWorkspace(workspaceName2);

    // Open command palette and search for workspace
    await homePage.openCommandPalette();
    await homePage.searchWorkspaceInPalette(workspaceName1);

    // Verify workspace is loaded
    await homePage.verifyWorkspaceLoaded();

    // Navigate back to blocks view
    await homePage.clickBackToBlocks();
    await homePage.verifyNewSystemHeading();
  });

  test.afterEach(async ({ page }) => {
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId1) {
      await cleanupHomePage.deleteWorkspaceByID(wsId1);
    }
    if (wsId2) {
      await cleanupHomePage.deleteWorkspaceByID(wsId2);
    }
  });
});