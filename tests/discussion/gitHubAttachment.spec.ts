import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Github Attachment test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test.skip("Verify that Github attachment file works. @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickAttachments();

    // Add Google attachment
    await b2bSaasHomePage.clickAddAttachment();
    const fileName = "test presentation";
    await b2bSaasHomePage.clickGithubAttachment(fileName);

    // Request to Angus for Github attachment connectivity
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
