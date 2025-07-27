import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Discussion section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Attachment of Image to the comment is working successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickDiscussion();

    // Verify that User can delete the discussion successfully
    await page.getByTestId("button_comment-editor-action_image").click();
    await page
      .locator(".file-drop-zone--input.cursor-pointer.file-drop-zone--input-active")
      .first()
      .setInputFiles("./resources/flower.png");
    await expect(await page.getByTestId("editor-content_comment-editor").getByRole("img")).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
