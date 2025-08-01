import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { SettingsPage } from "../../pageobjects/settingsRefactored.po";

test.describe("General Settings Update test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  
  test("Verify that Upload Avatar from General Settings works @featureBranch @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);

    // Navigate to profile settings
    await homePage.clickProfile();
    await settingsPage.clickSettings();
    await settingsPage.clickGeneralSettings();

    // Get current avatar source before upload
    const oldAvatarSrc = await settingsPage.getCurrentAvatarSrc();

    // Upload new company logo
    await settingsPage.uploadCompanyLogo("./resources/b2bSaas-logo.png");

    // Get new avatar source and verify it changed
    const newAvatarSrc = await settingsPage.getNewAvatarSrc();
    await settingsPage.verifyAvatarChanged(oldAvatarSrc, newAvatarSrc);

    // Update organization information
    const orgName = `b2bSaas Testing Organization: ${new Date().getTime()}`;
    const orgDesc = "b2bSaas testing team playground org.";
    
    await settingsPage.enterOrganizationName(orgName);
    await settingsPage.enterOrganizationDescription(orgDesc);

    // Add company domain tag
    const domain = "b2bSaas.com";
    await settingsPage.addCompanyDomain(domain);
    await settingsPage.verifyDomainTagVisible(domain);

    // Remove domain tag and submit settings
    await settingsPage.removeCompanyDomain();
    await settingsPage.submitSettings();

    // Verify updates were successful
    await settingsPage.verifyOrganizationInfoUpdated();
    await settingsPage.verifyDomainTagHidden(domain);
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