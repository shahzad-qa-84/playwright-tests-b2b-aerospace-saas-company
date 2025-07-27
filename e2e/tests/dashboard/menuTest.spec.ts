import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Menu options test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify side menu options works @prod @featureBranch @smokeTest", async ({ page }) => {
    const b2bSaasHomePage = await new homePage(page);

    // Click inbox and see if its opened correctly
    await b2bSaasHomePage.clickInbox();
    await expect(await page.getByRole("tab", { name: "Inbox" })).toBeVisible();
    await expect(await page.getByRole("tab", { name: "Archive" })).toBeVisible();

    // Click Modelling and verify if its opened correctly
    await b2bSaasHomePage.clickModelling();
    await expect(await page.getByRole("listitem").getByText("New System")).toBeVisible();

    // Expand requirements and verify if its expanded properly
    await b2bSaasHomePage.clickRequirements();
    await expect(await page.getByRole("heading", { name: "Requirements Documents" })).toBeVisible();

    // Click Reports and verify if its opened correctly
    await b2bSaasHomePage.clickKnowledgebase();
    await expect(await page.locator("#REPORT_PANE").getByText("Getting started")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
