import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { TemplateManagerPage } from "../../pageobjects/templateManagerRefactored.po";

test.describe("Add/Remove Components to Favourites Test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  // Create a new workspace before each test
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that adding/removing template to/from Favourites works. @featureBranch @prod @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);
    const templatePage = new TemplateManagerPage(page);

    const originalTemplateName = "Project Status Update";
    const copiedTemplateName = "Copy of Project Status Update";
    const templateId = "copy-of-project-status-update"; // used for testIDs

    // Navigate to the Knowledgebase
    await homePage.clickKnowledgebase();

    // Select and use template
    await templatePage.openTemplateList();
    await templatePage.selectTemplateByName(originalTemplateName);
    await templatePage.useSelectedTemplate();

    // Verify template is loaded correctly
    await templatePage.verifyTemplateLoaded(copiedTemplateName);

    // Add template to favorites
    await templatePage.addTemplateToFavorites(copiedTemplateName);

    // Verify template appears in favorites
    await templatePage.openFavoritesTab();
    await templatePage.verifyTemplateInFavorites(templateId);

    // Remove template from favorites
    await templatePage.removeTemplateFromFavorites(templateId);

    // Verify favorites is empty again
    await templatePage.verifyFavoritesEmpty();
  });

  // Clean up: Delete the test workspace after each run
  test.afterEach(async ({ page }) => {
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});