import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Feedback Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Add Feedback works @featureBranch @smokeTest", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);

    await b2bSaasHomePage.clickHelp();
    await page.getByRole("menuitem", { name: "Leave feedback" }).click();

    // Verify feedback window is opened correctly
    await expect(await page.getByRole("button", { name: "Problem" })).toBeVisible();
    await expect(await page.getByRole("button", { name: "Feedback & Request" })).toBeVisible();
    await expect(await page.getByText("You can always email us at support+product@b2bSaas.ai")).toBeVisible();

    // Perofrm actions on "Problem" Tab
    await page.getByRole("button", { name: "Problem" }).click();
    const txtBxSubject = await page.getByPlaceholder("Something is wrong with");
    await txtBxSubject.click();
    await txtBxSubject.fill("test subject");

    const txtBxBody = page.getByPlaceholder("When I click the…");
    await txtBxBody.click();
    await txtBxBody.fill("I am test only");
    await expect(await page.getByRole("button", { name: "Submit" })).toBeEnabled();

    // // Perform actions on "Feedback & Request" Tab
    // await page.getByTestId("button_feedback-dialog_question").click();
    // await page.getByPlaceholder("How do I …?").click();
    // await page.getByPlaceholder("How do I …?").fill("I am test only. How to contact sales team?");
    // await page.getByTestId("button_feedback-dialog_feedback-&-request").click();
    // await page.getByPlaceholder("New feature").click();
    // await page.getByPlaceholder("New feature").fill("test subject - test feedback");
    // await page.getByTestId("button_feedback-dialog_submit").click();
    // await expect(
    //   await page
    //     .locator("div")
    //     .filter({ hasText: /^New SystemAdd part number$/ })
    //     .first()
    // ).toBeEnabled();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
