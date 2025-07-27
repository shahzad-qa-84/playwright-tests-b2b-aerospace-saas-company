import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Discussion/Comments section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Comments add/edit/delete along works successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickDiscussion();

    await expect(await page.getByRole("heading", { name: "No comments yet" })).toBeVisible();
    await expect(await page.getByText("Be the first to start the discussion")).toBeVisible();

    // Verify that “Add Comment” is working successfully in the “Discussion” tab
    const comment = "b2bSaas is the future for many companies to transform their complex processes";
    await b2bSaasHomePage.addComment(comment);
    await expect(await page.getByText("" + comment + "", { exact: true })).toBeVisible();

    // Tag a person, as we are not hitting enter, so no email will be sent
    await page.getByRole("paragraph").nth(1).click();
    await page.getByTestId("editor-content_comment-editor").nth(1).fill("@user");
    await page.getByRole("heading", { name: "Users" }).click();

    //Verify that User can edit the discussion successfully
    const editedComment = "Edited_text";
    await b2bSaasHomePage.expandCommentsMenu();
    await b2bSaasHomePage.clickEditFromMenu();
    await page.getByText("" + comment + "").click();
    await page.getByText("b2bSaas is the future for many companies to transform their complex processes").fill(editedComment);
    await page.getByTestId("button_comment-editor-send").nth(0).click();
    await expect(await page.getByText("" + editedComment + "", { exact: true })).toBeVisible();

    // Verify that comment is deleted successfully
    await b2bSaasHomePage.clickChildBlocks();
    await b2bSaasHomePage.clickDiscussion();
    await b2bSaasHomePage.expandCommentsMenu();
    await b2bSaasHomePage.clickDeleteFromMenu();
    await expect(await page.getByText("" + editedComment + "", { exact: true })).toBeHidden();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
