import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { settingsPage } from "../../pageobjects/settings.po";

test.describe.serial("Webhooks Tests", () => {
  let workspaceName;
  let webhookName;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Webhook Creation, Deletion, Filteration works perfectly. @smokeTest @featureBranch @prod", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickProfile();

    // Click Settings and Go to API key creation
    const settingPage = new settingsPage(page);
    await settingPage.clickSettings();
    await settingPage.clickWebhooks();

    // Create Web hook
    await page.getByTestId("button_add-new-webhook").click();

    // Enter webhook name
    const txtBxWebhookName = await page.getByPlaceholder("Enter webhook label...");
    await txtBxWebhookName.click();
    webhookName = "Automated_webhook" + faker.internet.userName();
    await txtBxWebhookName.fill(webhookName);

    // Enter webhook URL
    const txtBxWebhookUrl = await page.getByPlaceholder("Enter URL...");
    await txtBxWebhookUrl.click();
    await txtBxWebhookUrl.fill("https://rolup.ai");

    // Select events
    await page.locator("label").filter({ hasText: "workspace" }).locator("span").click();
    await page.locator("label").filter({ hasText: "block" }).locator("span").click();
    await page.getByText("bom-table", { exact: true }).click();
    await page.locator("label").filter({ hasText: "attachment" }).locator("span").click();
    await page.locator("label").filter({ hasText: "comment" }).locator("span").click();
    await page.getByRole("heading", { name: "Advanced options" }).click();
    await page.locator("label").filter({ hasText: "bom-table-cell" }).locator("span").click();
    await page
      .locator("div")
      .filter({ hasText: /^Advanced options$/ })
      .locator("label span")
      .click();

    // Select advanced options and enter key and value
    const txtBxKey = await page.getByPlaceholder("Enter key...");
    await txtBxKey.click();
    await txtBxKey.fill("new-key");
    await page.getByPlaceholder("Enter value...").fill("7979");

    // Click submit button and verify that webhook is created
    await page.getByTestId("button_submit").nth(1).click();
    await expect(await page.getByRole("heading", { name: "" + webhookName + "" })).toBeVisible();

    // Verify that webhook is filtered
    await page.getByPlaceholder("Search for webhook...").fill(webhookName);
    await expect(await page.getByRole("heading", { name: "" + webhookName + "" })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Delete webhook and verify that webhook is deleted
    await page.getByTestId("button_show-menu").first().click();
    await page.getByTestId("menu-item_delete").click();
    await page.getByTestId("button_confirmation-dialog_delete_confirm").click();
    await expect(await page.getByText("You don't have any webhooks meeting the filter criteria")).toBeVisible();
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
