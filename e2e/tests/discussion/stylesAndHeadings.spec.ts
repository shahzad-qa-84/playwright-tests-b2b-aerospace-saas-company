import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("List style applied properly to comments", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that List Styles are applied successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickDiscussion();

    // Check Strike, Bold, Italic and Underline functionality
    await page.getByTestId("button_comment-editor-action_strike").click();
    const txtBxToAddcomment = await page.locator(".ProseMirror").first();

    // Verify that Ordered list functionality works
    await txtBxToAddcomment.fill("list 1");
    await txtBxToAddcomment.press("Enter");
    await txtBxToAddcomment.fill("list 1\n\nlist 2");
    await txtBxToAddcomment.press("Enter");
    await page.getByText("list 1list 2").fill("list 1\n\nlist 2\n\nlist 3");
    await page.getByText("list 1list 2").press("Enter");
    await page.getByText("list 1list 2list 3").press("Meta+a");
    await page.getByTestId("button_comment-editor-action_orderedlist").click();
    const sendComment = await page.getByTestId("button_comment-editor-send");
    await sendComment.click();

    // Verify that added text is available
    await expect(await page.getByText("list 1")).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
