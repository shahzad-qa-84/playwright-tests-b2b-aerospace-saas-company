import { faker } from "@faker-js/faker";
import { chromium, expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { propertyPage } from "../../pageobjects/property.po";

test.describe("Data Synchronization Test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Create Data Synchronization on two browsers and verify if change of data works on both windows. @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    // Add a new property from Blocks section and assign the property value
    const property = new propertyPage(page);
    const propertyName = "Property1_" + faker.person.firstName();
    await property.addPropertyOrGroupLink();
    await property.addNewPropertyFromBlockSection(propertyName);
    const propertyValue = Math.floor(Math.random() * 1000) + 1 + " km";
    await property.addPropertyValue(propertyName, propertyValue);
    await expect(
      await page.getByTestId("editor-content_scalar-expression-editor_" + propertyName.toLowerCase()).getByText("" + propertyValue + "")
    ).toBeVisible();
    const url = await page.url();

    // Create a new browser instance
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const newPage = await context.newPage();
    await newPage.goto(url);

    // Switch to the new browser tab and verify if the property added in the old window is visible
    await newPage.bringToFront();
    await expect(await newPage.getByText("" + propertyValue + "")).toBeVisible();

    // Switch back to the original tab and change the value of the property to 150 km
    await page.bringToFront();
    await property.addPropertyValue(propertyName, "150 km");

    // Switch back to the second opened window and verify if 150 km is updated
    await newPage.bringToFront();
    await expect(
      await newPage.getByTestId("editor-content_scalar-expression-editor_" + propertyName.toLowerCase()).getByText("150 km")
    ).toBeVisible();

    // Now change the property value to 200 km on the current second opened browser
    await property.editPropertyValue(propertyName, "200 km", newPage);
    await expect(
      await newPage.getByTestId("editor-content_scalar-expression-editor_" + propertyName.toLowerCase()).getByText("200 km")
    ).toBeVisible();

    // Switch to the first opened browser window and verify changes from the second browser have been reflected
    await page.bringToFront();
    await expect(
      await page.getByTestId("editor-content_scalar-expression-editor_" + propertyName.toLowerCase()).getByText("200 km")
    ).toBeVisible();

    // Close the new page, context, and browser when done
    await newPage.close();
    await context.close();
    await browser.close();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
