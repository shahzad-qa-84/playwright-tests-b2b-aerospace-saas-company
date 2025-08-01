import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { RequirementsPage } from "../../pageobjects/requirements.po";

test.describe("Requirements creation", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that rows on new requirement document are created successfully. @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const requirementsPage = new RequirementsPage(page);

    // Navigate to Requirements section
    await homePage.clickRequirements();

    // Create a new requirement document
    await requirementsPage.createNewRequirement();

    // Add requirement block with description and rationale
    await requirementsPage.clickNewRow();
    await requirementsPage.addRequirementBlockFromMenu();
    await requirementsPage.fillRequirementDescription("this a test description");
    await requirementsPage.fillRequirementRationale("test");

    // Set verification methods
    await requirementsPage.setVerificationMethods();

    // Create H1 heading document
    await requirementsPage.addH1Heading("test");

    // Create H2 heading document
    await requirementsPage.addH2Heading("test heading 2");

    // Create H3 heading document
    await requirementsPage.addH3Heading("test heading 3");

    // Delete all added rows and verify cleanup
    await requirementsPage.deleteRowByName("test heading 3");
    await requirementsPage.deleteRowByName("test heading");
    await requirementsPage.deleteRowByName("test");

    // Verify rows container is still visible
    await requirementsPage.verifyRowsContainer();
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
