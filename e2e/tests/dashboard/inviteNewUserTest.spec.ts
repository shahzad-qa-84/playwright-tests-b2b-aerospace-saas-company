import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Invite New User test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify invitation to new user works @featureBranch @prod @smokeTest", async ({ page }) => {
    // Invite a new user
    await page.getByTestId("button_menu-pane_show-invite-new-user").click();

    const userEmail = "testing+" + faker.internet.userName() + "@b2bSaas.ai";
    const txtBxEmail = await page.getByPlaceholder("john@space.co jane@space.co");
    await txtBxEmail.click();
    await txtBxEmail.fill(userEmail);

    // Verify that default role is User
    await expect(page.getByTestId("button_open-menu")).toContainText("User");

    // Click on Invite button
    await page.getByTestId("button_submit-invite-users").click();

    // Verify that user notification is displayed
    await expect(await page.getByText("Users invited successfully")).toBeVisible();

    // // Verify that the email is received
    // let sender;
    // let emailSbj = "has invited you to b2bSaas";
    // if (baseURL?.includes("b2bSaas.b2bSaas.ai")) {
    //   sender = "login@stytch.com";
    // } else {
    //   sender = "login@test.stytch.com";
    //   emailSbj = "has invited you to b2bSaas";
    // }

    // const htmlContent = await mailHelper.readEmail(page, sender, userEmail, emailSbj);
    // const url = await mailHelper.getLoginLink(htmlContent);
    // // Verify that URl is not null
    // await expect(url).not.toBeNull();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
