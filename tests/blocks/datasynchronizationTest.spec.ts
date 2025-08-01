import { faker } from "@faker-js/faker";
import { chromium, expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { PropertyPage } from "../../pageobjects/propertyRefactored.po";

test.describe("Data Synchronization Test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Create Data Synchronization on two browsers and verify if change of data works on both windows. @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const propertyPage = new PropertyPage(page);

    // Create property with value and verify in first browser
    const propertyName = "Property1_" + faker.person.firstName();
    const propertyValue = Math.floor(Math.random() * 1000) + 1 + " km";
    await propertyPage.createPropertyWithValueAndVerify(propertyName, propertyValue);
    
    // Get current URL for second browser
    const url = await propertyPage.getCurrentUrl();

    // Create a new browser instance
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const newPage = await context.newPage();
    await newPage.goto(url);

    // Switch to new browser and verify property value is synchronized
    await newPage.bringToFront();
    await expect(await newPage.getByText(propertyValue)).toBeVisible();

    // Switch back to original browser and update property value
    await page.bringToFront();
    await propertyPage.addPropertyValue(propertyName, "150 km");

    // Verify updated value appears in second browser
    await newPage.bringToFront();
    await expect(
      await newPage.getByTestId(`editor-content_scalar-expression-editor_${propertyName.toLowerCase()}`).getByText("150 km")
    ).toBeVisible();

    // Update property value from second browser
    const secondBrowserPropertyPage = new PropertyPage(newPage);
    await secondBrowserPropertyPage.editPropertyValue(propertyName, "200 km", newPage);
    await expect(
      await newPage.getByTestId(`editor-content_scalar-expression-editor_${propertyName.toLowerCase()}`).getByText("200 km")
    ).toBeVisible();

    // Verify changes from second browser appear in first browser
    await page.bringToFront();
    await propertyPage.verifyPropertyValueInEditor(propertyName, "200 km");

    // Clean up browser instances
    await newPage.close();
    await context.close();
    await browser.close();
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