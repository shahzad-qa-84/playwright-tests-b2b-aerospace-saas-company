import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { ChildBlockPage } from "../../pageobjects/childBlockRefactored.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";

test.describe("New Workspace Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Add Child Blocks, Rename Child Block, Delete child block, Add sub child block @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const childBlockPage = new ChildBlockPage(page);

    // Navigate to Child Blocks section
    await childBlockPage.clickChildBlocks();

    // Add the first child and verify count
    const child1Name = "Child_" + faker.person.firstName();
    await childBlockPage.createChildBlockWithVerification(child1Name, "1");

    // Add the second child and verify count
    const child2Name = "Child_" + faker.person.firstName();
    await childBlockPage.createChildBlockWithVerification(child2Name, "2");

    // Add the third child and verify count
    const child3Name = "Child_" + faker.person.firstName();
    await childBlockPage.createChildBlockWithVerification(child3Name, "3");

    // Click the third child and verify no sub-children message
    await childBlockPage.clickChildByName(child3Name);
    await childBlockPage.verifyNoChildrenMessage();

    // Navigate back and rename the second child
    const childNewName = "Child_Rename_" + faker.person.firstName();
    await childBlockPage.clickNewSystem();
    await childBlockPage.renameChild(2, childNewName);

    // Delete the second child and verify it's removed
    await childBlockPage.deleteChild(2);
    await childBlockPage.verifyChildDeleted(child2Name);
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
