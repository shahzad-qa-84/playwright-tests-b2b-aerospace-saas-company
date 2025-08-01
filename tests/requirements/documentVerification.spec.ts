import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { RequirementsPage } from "../../pageobjects/requirements.po";

test.describe("Document functionality and Requirement Details verification test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that Document and Requirement Details verification is working successfully. @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const requirementsPage = new RequirementsPage(page);
    
    // Navigate to Requirements section
    await homePage.clickRequirements();
    
    // Complete the entire document verification workflow
    const requirementText = "this is test";
    const noteText = "this is my personal note";
    const editedNoteText = "this is my personal note - edited";
    const newRequirementId = "My first requirement";
    const commentText = "this is new comment";

    // Create new requirement and add content
    await requirementsPage.createNewRequirement();
    await requirementsPage.switchToDocumentView();
    await requirementsPage.openAndCloseMoreOptions();

    // Add requirement block and text
    await requirementsPage.addRequirementBlock();
    await requirementsPage.addRequirementText(requirementText);

    // Add image
    await requirementsPage.addImageToRequirement();

    // Add and edit note
    await requirementsPage.addAndEditNote(noteText, editedNoteText);

    // Verify requirement in table view
    await requirementsPage.verifyRequirementInTableView(requirementText);

    // Set requirement level
    await requirementsPage.setRequirementLevel();
    await requirementsPage.verifyLevelInTableView();

    // Change requirement ID
    await requirementsPage.changeRequirementId(newRequirementId);

    // Configure verification
    await requirementsPage.configureVerificationMethod();
    await requirementsPage.setVerificationStatus();

    // Add and manage comments
    await requirementsPage.addComment(commentText);
    await requirementsPage.verifyCommentInTimeline(commentText);
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
