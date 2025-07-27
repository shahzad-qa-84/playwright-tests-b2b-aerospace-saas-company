import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Change Icon Test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Change the Icons on system and verify if it works @featureBranch @prod @smokeTest", async ({ page }) => {
    // Select Brief case and verify if its selected
    await page.getByTestId("button_show-icon-selector-menu").first().click();
    await page.getByTestId("button_icon_briefcase").click();
    await expect((await page.$$('*[data-icon="briefcase"]')).length).toBeGreaterThan(0);
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
