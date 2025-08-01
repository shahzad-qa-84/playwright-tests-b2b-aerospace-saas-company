import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { RequirementsPage } from "../../pageobjects/requirements.po";

test.describe("Import CSV via Requirement", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that Requirement via Import CSV is working successfully. @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const requirementsPage = new RequirementsPage(page);

    // Navigate to Requirements section
    await homePage.clickRequirements();

    // Create new document and upload CSV
    await requirementsPage.clickNewDocument();
    await requirementsPage.uploadCsvFile();

    // Verify imported data is visible
    await requirementsPage.verifyCsvImportedData();

    // Verify data persists after page reload
    await requirementsPage.verifyDataPersistence();

    // Edit the imported fields
    await requirementsPage.editImportedFields();

    // Add value and unit to fields
    await requirementsPage.addValueAndUnit("10", "kg");
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
