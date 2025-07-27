import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { settingsPage } from "../../pageobjects/settings.po";
import { getUserEmail } from "../../utilities/urlMapper";

test.describe("Profile Update test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that Upload Avatar and other Profile updates to user Profile works @featureBranch @smokeTest", async ({ page, baseURL }) => {
    const b2bSaasHomePage = await new homePage(page);

    // Click inbox and see if its opened correctly
    await b2bSaasHomePage.clickProfile();

    // Go to user settings
    const userSettingsPage = await new settingsPage(page);
    await userSettingsPage.clickSettings();

    // Extract the 'src' attribute of the <img> element
    const imgSrcOldValue = await page.getAttribute('img[alt="User avatar"]', "src");
    const extractedUuidValue = imgSrcOldValue?.split(".amazonaws.com/")[1];

    // Upload avatar, update User name, Role and Department
    await userSettingsPage.uploadProfilePic("./resources/b2bSaas-logo.png");
    const imgSrcNewValue = await page.getAttribute('img[alt="User avatar"]', "src");

    // Process the URL to get the UUID after '.amazonaws.com/'
    const extractedNewUuidValue = imgSrcNewValue?.split(".amazonaws.com/")[1];

    // Verify that Avatar Src old and new values are different
    await expect(extractedNewUuidValue).not.toEqual(extractedUuidValue);

    const userName = getUserEmail(baseURL);
    const role = "b2bSaas testing team's playground org.";

    await userSettingsPage.enterName(userName);
    await userSettingsPage.enterRole(role);
    await userSettingsPage.clickSubmit();

    // Verify that Avatar is uploaded and all the provided user information is updaed
    await expect(await page.getByPlaceholder("" + userName + "")).toBeVisible();
    await expect(await page.getByPlaceholder("" + role + "")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
