import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Link attachment to Discussion/Comments section", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Attachment of Link to the comment is working successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickDiscussion();

    // Add link and verify that its opened correctly
    const linkComment = "https://app.b2bSaas.ai";
    await page.getByTestId("button_comment-editor-action_link").first().click();
    await expect(await page.getByRole("heading", { name: "Add link" })).toBeVisible();

    // Click Unset and verify if its gone
    await page.getByPlaceholder("Text").click();
    await page.getByPlaceholder("Text").fill("b2bSaas link");
    await page.getByPlaceholder("example.com").fill(linkComment);
    await page.getByRole("button", { name: "Unset" }).click();
    await expect(await page.getByRole("heading", { name: "Add link" })).toBeHidden();

    // verify that Link can be added to the text and added link works
    await page.getByTestId("button_comment-editor-action_link").first().click();
    await page.getByPlaceholder("Text").click();
    await page.getByPlaceholder("Text").fill("b2bSaas-link");
    await page.getByPlaceholder("example.com").click();
    await page.getByPlaceholder("example.com").fill(linkComment);
    await page.getByRole("button", { name: "Save" }).click();
    const sendComment = await page.getByTestId("button_comment-editor-send");
    await sendComment.first().click();
    await page.getByRole("link", { name: "b2bSaas-link" }).click();

    // Check Strike, Bold, Italic and Underline functionality
    await page.bringToFront();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
