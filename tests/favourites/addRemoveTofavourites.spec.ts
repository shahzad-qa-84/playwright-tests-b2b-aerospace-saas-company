import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { TemplateManagerPage } from "../../pageobjects/templateManagerPage.po";

test.describe("Add/Remove Components to Favourites Test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  // Create a new workspace before each test
  test.beforeEach(async ({ page }) => {
    const home = new homePage(page);
    wsId = await home.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that adding/removing template to/from Favourites works. @featureBranch @prod @smokeTest", async ({ page }) => {
    const home = new homePage(page);
    const templatePage = new TemplateManagerPage(page);

    const originalTemplateName = "Project Status Update";
    const copiedTemplateName = "Copy of Project Status Update";
    const templateId = "copy-of-project-status-update"; // used for testIDs

    // Step 1: Navigate to the Knowledgebase
    await home.clickKnowledgebase();

    // Step 2: Open the template menu and select a predefined template
    await templatePage.openTemplateList();
    await templatePage.selectTemplateByName(originalTemplateName);
    await templatePage.useSelectedTemplate();

    // Step 3: Verify that the template is opened and displayed correctly
    await templatePage.verifyTemplateLoaded(copiedTemplateName);

    // Step 4: Mark the opened template as a favorite
    await templatePage.addTemplateToFavorites(copiedTemplateName);

    // Step 5: Navigate to Favorites tab and confirm the template is listed
    await templatePage.openFavoritesTab();
    await templatePage.verifyTemplateInFavorites(templateId);

    // Step 6: Remove the template from Favorites
    await templatePage.removeTemplateFromFavorites(templateId);

    // Step 7: Confirm Favorites list is empty again
    await templatePage.verifyFavoritesEmpty();
  });

  // Clean up: Delete the test workspace after each run
  test.afterEach(async ({ page }) => {
    const home = new homePage(page);
    if (wsId) {
      await home.deleteWorkspaceByID(wsId);
    }
  });
});
