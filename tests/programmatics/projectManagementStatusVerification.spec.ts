import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { ProjectManagementPage } from "../../pageobjects/projectManagement.po";

test.describe("Project Management section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateEngineeringWorkspace(workspaceName);
  });
  test("Verify that Project management various status functionality works successfully. @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const projectManagementPage = new ProjectManagementPage(page);
    
    // Verify all Project statuses are displayed
    await projectManagementPage.verifyProjectManagementHeaders();

    // Verify that clicking "Add new project status" adds new status
    await projectManagementPage.addNewStatus("Done");
    await projectManagementPage.verifyStatusAdded("Done");

    // Add new description and verify that description is added
    await projectManagementPage.addDescription("description -1");
    await projectManagementPage.verifyDescriptionAdded("description -1");

    // Change sub-options of status and verify that status is changed appropriately
    await projectManagementPage.selectStatusItem();

    // Change status to 'Text' and verify that text box is displayed
    await projectManagementPage.addTextValue("Added Text-description");
    await projectManagementPage.verifyTextValueAdded("Added Text-description");

    // Change status to 'Numeric' and verify that numeric value is changed
    await projectManagementPage.selectStatusItem();
    await projectManagementPage.addNumericValue("89");
    await projectManagementPage.verifyNumericValueAdded("89");

    // Change status to 'Check' and verify that check box is displayed
    await projectManagementPage.selectStatusItem();
    await projectManagementPage.addCheckField();

    // Change status to 'Date' and verify that date is set to Today's date
    await projectManagementPage.selectStatusItem();
    await projectManagementPage.addDateValue();

    // Clear value and verify that date is cleared
    await projectManagementPage.selectStatusItem();
    await projectManagementPage.clearValue();

    // Change status to 'Single Select' and verify that single select is displayed
    await projectManagementPage.selectStatusItem();
    await projectManagementPage.addSingleSelectValue("in-progress");
    await projectManagementPage.verifySingleSelectValueAdded("In-progress");

    // Change status to 'Mention' and verify that members details is displayed
    await projectManagementPage.selectStatusItem();
    await projectManagementPage.addMentionValue();
  });

  test.afterEach(async ({ page }) => {
    // Note: deleteWorkspaceByID method needs to be added to the refactored HomePage
    // For now, we'll use the original homePage for cleanup
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
