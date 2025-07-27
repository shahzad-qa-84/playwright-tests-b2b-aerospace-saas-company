import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { settingsPage } from "../../pageobjects/settings.po";

test.describe.serial("OAuth Apllicatio Tests", () => {
  let workspaceName;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Add/serach/Delete 'OAuth application' works perfectly. @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickProfile();

    // Click Settings and Go to API key creation
    const settingPage = new settingsPage(page);
    await settingPage.clickSettings();
    await settingPage.clickOAuthApplication();

    // Create a new OAuth application
    await page.getByTestId("button_add-new-oauth-application").click();
    const txtBxFullName = await page.getByPlaceholder("Enter application name...");
    await txtBxFullName.click();
    const oauthName = "oathu_" + faker.internet.userName();
    await txtBxFullName.fill(oauthName);

    // Enter logo URL
    const txtBxLogo = await page.getByPlaceholder("Enter logo URL...");
    await txtBxLogo.click();
    await txtBxLogo.fill("https://b2bSaas-avatars-dev.s3.us-west-1.amazonaws.com/b2bSaas-logo.png");

    // Enter developer name
    const txtBxFullName1 = await page.getByPlaceholder("Enter developer name...");
    await txtBxFullName1.click();
    await txtBxFullName1.fill("testing");

    // Enter description
    const txtBxDescription = await page.getByPlaceholder("Enter description name...");
    await txtBxDescription.click();
    await txtBxDescription.fill("testing decription");

    // Enter developer URL
    const txtBxUrl = await page.getByPlaceholder("Enter developer URL...");
    await txtBxUrl.click();
    await txtBxUrl.fill("https://b2bSaas.ai");

    // Add more Callback URL and delete
    await page.getByTestId("button_add-callback").click();
    await page.getByTestId("button_delete-url").first().click();
    await page.getByTestId("button_delete-url").click();

    // Enter callback URL
    const txtBxCallback = await page.getByPlaceholder("Enter callback URL...");
    await txtBxCallback.click();
    await txtBxCallback.fill("https://b2bSaas.ai");

    // Enter Webhook URL
    await page.getByRole("heading", { name: "Webhook" }).click();

    // Create a new webhook
    await page.getByTestId("button_update-create").nth(1).click();

    // Verify that webhook is created
    await expect(await page.getByRole("heading", { name: "" + oauthName + "" })).toBeVisible();

    // Search for the created OAuth application
    const txtBxOauthSearch = await page.getByPlaceholder("Search for OAuth application...");
    await txtBxOauthSearch.click();
    await txtBxOauthSearch.fill(oauthName);
    await page.getByRole("heading", { name: "" + oauthName + "" }).click();
  });

  test.afterEach(async ({ page }) => {
    // Delete the created OAuth application
    await page.getByTestId("button_show-menu").first().click();
    await page.getByTestId("menu-item_delete").click();
    await page.getByTestId("button_confirmation-dialog_delete_confirm").click();
    await expect(await page.getByText("You don't have any OAuth applications meeting the filter criteria")).toBeVisible();
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
