import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe.serial("Comments and History section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that Comments are added, copied properly in the discussion section. @prod @smokeTest @featureBranch @prod", async ({
    page,
  }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickDiscussion();

    // Verify that “Add Comment” is working successfully in the “Discussion” tab
    const comment = "b2bSaas is going to make a history in engineering world";
    await b2bSaasHomePage.addComment(comment);
    await expect(await page.getByText("b2bSaas is going to make a history in engineering world")).toBeVisible();

    // Click history and verify that comment is displayed in the history section
    await b2bSaasHomePage.clickHistory();
    await expect(await page.getByText("b2bSaas is going to make a history in engineering world").first()).toBeVisible();

    // Copy the link and verify its copied correctly
    await page.getByTestId("button_toggle-history-and-comments-panel").click();
    await page.getByTestId("button_toggle-programmatics-panel").click();
    await page.getByText("b2bSaas is going to make a history in engineering world").click();
    await page.getByTestId("button_comment-actions-menu").hover();
    await page.getByTestId("button_comment-actions-menu").click();
    await page.getByTestId("menu-item_copy-link").click();

    // @todo add InfinityScroll test
    // we added new function "InfinityScroll" to load more history data when user scroll down and button is visible
  });

  test("Verify that Comments/history expansion is working successfully. @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickDiscussion();

    // Expand comments and history section and verify all history data is there
    await b2bSaasHomePage.clickHistory();
    const tabComments = await page.getByTestId("tab_comments");
    await tabComments.click();
    await page.locator(".comment-editor").click();
    await page.getByTestId("editor-content_comment-editor").fill("test1");
    await page.getByTestId("button_comment-editor-send").click();
    await tabComments.click();

    // Verify that comment is added properly in comments history section
    await expect(await page.getByText("test1")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
