import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { RequirementsPage } from "../../pageobjects/requirements.po";

test.describe("Requirement document as an Attachment test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Attachment of Requirement document to the modelling is working successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const requirementsPage = new RequirementsPage(page);

    // Navigate to Requirements and create document
    await homePage.clickRequirements();
    await requirementsPage.clickNewDocument();
    await requirementsPage.clickNewRequirementBlock();

    // Fill requirement description and rationale
    const editableTxtBx = page.getByRole("textbox").first();
    await editableTxtBx.fill("this a test description");
    await editableTxtBx.press("Enter");
    
    await page.locator('[data-testid*="editor-content_rich-text-cell_"][data-testid*="_rationale"]').first().getByRole("paragraph").click();
    await editableTxtBx.fill("test");
    await editableTxtBx.press("Enter");

    // Navigate to Modelling and Attachments
    await homePage.clickModelling();
    await homePage.clickAttachments();

    // Attach requirement document as attachment
    await homePage.clickAddAttachment();
    await homePage.hoverRequirementsMenuItem();
    await homePage.clickAttachRequirementPage();

    // Verify attachment in grid view
    await homePage.clickGridView();
    await homePage.verifyNewDocumentVisible();

    // Delete the attachment
    await homePage.clickContextMenuGridView();
    await homePage.clickDeleteAttachment();

    // Verify attachment is deleted
    await homePage.verifyNoAttachmentsMessage();
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