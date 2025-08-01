import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { ModellingPage } from "../../pageobjects/modellingRefactored.po";

test.describe.serial("Add Table rows to Configuration Model", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test.skip("Verify that table rows can be added/updated/deleted. @prod @smokeTest @featureBranch", async ({ page }) => {
    const modellingPage = new ModellingPage(page);

    // Navigate to modelling and table section
    await modellingPage.clickModelling();
    await modellingPage.clickTable();
    await modellingPage.clickTabNav();

    // Duplicate the table entry
    await modellingPage.duplicateTable();

    // Verify that the table entry is duplicated
    await modellingPage.verifyTableDuplicated("Everything");

    // Add a new child block
    const childName = "test";
    await modellingPage.addNewChildBlock(childName);

    // Verify that the child block is added
    await modellingPage.verifyChildBlockAdded(childName);

    // Additional table operations (keeping original complex interactions for now)
    await page
      .locator("div")
      .filter({ hasText: /^Everything$/ })
      .click();
    await page.getByText("Everything", { exact: true }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Everything$/ })
      .getByTestId("button_tab_nav")
      .click();
    
    await modellingPage.duplicateTable();
    
    await page.getByText("Everything (copy)").nth(1).click();
    await page.getByText("Everything (copy)").first().click();
    await page.getByTestId("button_tab_nav").nth(1).click();
    await page.getByRole("gridcell", { name: "x1" }).first().click();
    await page.getByTestId("button_tab_nav").nth(1).click();

    // Rename table and verify
    await modellingPage.renameTable("Everything (copy", "Everything renamed");
    await modellingPage.verifyTableRenamed("Everything renamed");
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