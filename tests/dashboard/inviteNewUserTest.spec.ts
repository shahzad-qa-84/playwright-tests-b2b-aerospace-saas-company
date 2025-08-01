import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { mailHelper } from "../../emailutils/gmailHelper";

test.describe("Invite New User test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify invitation to new user works @featureBranch @prod @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);

    // Generate user email and invite user
    const userEmail = "testing+" + faker.internet.userName() + "@b2bSaas.ai";
    await homePage.inviteUser(userEmail);

    // Verify email is received and contains login link
    const currentUrl = page.url();
    let sender;
    let emailSbj = "has invited you to b2bSaas";
    
    if (currentUrl.includes("b2bSaas.b2bSaas.ai")) {
      sender = "login@stytch.com";
    } else {
      sender = "login@test.stytch.com";
      emailSbj = "has invited you to b2bSaas";
    }

    const htmlContent = await mailHelper.readEmail(page, sender, userEmail, emailSbj);
    const url = await mailHelper.getLoginLink(htmlContent);
    
    // Verify that URL is not null
    await expect(url).not.toBeNull();
  });

  test.afterEach(async ({ page }) => {
    // Note: Using original homePage for cleanup until deleteWorkspaceByID is added to refactored version
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    if (wsId) {
      await cleanupHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
