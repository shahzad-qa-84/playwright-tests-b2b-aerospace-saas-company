import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { childPage } from "../../pageobjects/childBlock.po";
import { homePage } from "../../pageobjects/homePage.po";

test.describe("New Workspace Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Add Child Blocks, Rename Child Block, Delete child block, Add sub child block @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const childBlockPage = new childPage(page);

    // Add the first child and Verify that 1 is added on the top child count
    await childBlockPage.clickChildBlock();
    const child1Name = "Child_" + faker.person.firstName();
    await childBlockPage.createChildBlockFromMainBar(child1Name);
    await expect(await page.getByText("1", { exact: true })).toBeVisible();

    // Add the second child and Verify that 2 is added on the top child count
    const child2Name = "Child_" + faker.person.firstName();
    await childBlockPage.createChildBlockFromMainBar(child2Name);
    await expect(await page.getByText("2", { exact: true })).toBeVisible();

    // Add the third child and Verify that 3 is added on the top child count
    const child3Name = "Child_" + faker.person.firstName();
    await childBlockPage.createChildBlockFromMainBar(child3Name);
    await expect(await page.getByText("3", { exact: true })).toBeVisible();

    // Click the second present child and verify if child does not have further child hierarchy
    await childBlockPage.clickChildByName(child3Name);
    await expect(await page.getByRole("heading", { name: "This block has no children." }).first()).toBeVisible();

    // Rename child details of second child, verify if changes have been taken place
    const childNewName = "Child_Rename_" + faker.person.firstName();
    await page.getByRole("list").getByText("New System").click();
    await childBlockPage.renameChild(2, childNewName);

    // Delete the second child and verify its deleted
    await childBlockPage.deleteChild(2);
    await expect(await page.getByText(child2Name, { exact: true }).first()).toBeHidden();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
