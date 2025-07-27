import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Search workspace from top header test", () => {
  const workspaceName1 = "AutomatedTest_1_" + faker.internet.userName().substring(0, 5);
  const workspaceName2 = "AutomatedTest_2_" + faker.internet.userName().substring(0, 5);
  let wsId1: string | undefined;
  let wsId2: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId1 = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName1);
    await page.waitForTimeout(3000);
  });
  test("Verify that searching workspace from top header works @featureBranch @prod @smokeTest", async ({ page }) => {
    // Create new workspace
    const b2bSaasHomePage = new homePage(page);
    wsId2 = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName2);

    // Search for workspace
    await page.getByTestId("button_show-command-palette").click();
    await page.getByPlaceholder("Search for workspaces, blocks, or actions...").fill(workspaceName1);
    await page.getByTestId("menu-item_" + workspaceName1.toLowerCase()).click();

    // Verify that workspace is visible
    await expect(await page.getByText("Workspace loaded")).toBeVisible();

    // Error page is there but as workaround click on back to blocks
    await page.getByRole("link", { name: "Back to Blocks" }).click();
    await expect(await page.getByRole("heading", { name: "New System" }).locator("span")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId1) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId1);
    }
    if (wsId2) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId2);
    }
  });
});
