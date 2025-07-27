import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { settingsPage } from "../../pageobjects/settings.po";

test.describe("General Settings Update test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that Upload Avatar from General Settings works @featureBranch @smokeTest", async ({ page }) => {
    const b2bSaasHomePage = await new homePage(page);

    await b2bSaasHomePage.clickProfile();

    // Go to user settings
    const userSettingsPage = await new settingsPage(page);
    await userSettingsPage.clickSettings();

    await userSettingsPage.clickGeneralSettings();

    // Extract the 'src' attribute of the <img> element
    const imgSrcOldValue = await page.getAttribute('img[class="org-profile-area--avatar-image"]', "src");
    const extractedOoldSrcValue = imgSrcOldValue?.split(".amazonaws.com/")[1];

    // Upload Logo
    await page.getByTestId("input_upload-file-input_upload-company-logo").setInputFiles("./resources/b2bSaas-logo.png");
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    const imgSrcNewValue = await page.getAttribute('img[alt="User avatar"]', "src");
    const extractedNewSrcValue = imgSrcNewValue?.split(".amazonaws.com/")[1];

    // Verify that Avatar Src old and new values are different
    await expect(extractedOoldSrcValue).not.toEqual(extractedNewSrcValue);

    // Update Org. info
    const orgName = `b2bSaas Testing Organization: ${new Date().getTime()}`;
    const orgDesc = "b2bSaas testing team playground org.";
    await page.getByPlaceholder("Enter organization name...").click();
    await page.getByPlaceholder("Enter organization name...").fill(orgName);

    // Update Org. description
    const txtBxDescription = await page.getByPlaceholder("Enter organization description...");
    await txtBxDescription.click();
    await txtBxDescription.press("Meta+a");
    await txtBxDescription.fill(orgDesc);

    // Add Tag and verify if its added
    const addTag = page.getByTestId("input_company-domains");
    await addTag.getByRole("textbox").fill("b2bSaas.com");
    await addTag.getByRole("textbox").press("Enter");
    await expect(await page.getByText("b2bSaas.com")).toBeVisible();

    // Remove Tag and verify if its deleted along with updated information icon
    await page.getByLabel("Remove tag").nth(1).click();
    const btnSubmit = await page.getByTestId("button_settings_submit");
    await btnSubmit.click();
    await expect(await page.getByText("Organization info updated")).toBeVisible();
    await expect(await page.getByText("b2bSaas.com")).toBeHidden();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
