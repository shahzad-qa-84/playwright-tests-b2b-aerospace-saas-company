import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { propertyPage } from "../../pageobjects/property.po";

test.describe("Properties Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName, "engineering");
  });
  test("Verify Property hints and messages on Activity timeline are displaying properly @smokeTest @featureBranch", async ({ page }) => {
    const property = new propertyPage(page);

    // Type Volume in the search box and verify if its added properly
    const propertyName = "Property_" + faker.person.firstName();
    await property.addPropertyOrGroupLink();
    await property.addNewPropertyFromBlockSection(propertyName);
    await property.addPropertyValue(propertyName, "{{vol");
    await page.getByText("{{vol").click();
    await page.getByTestId("menu-item_volume").click();

    // Verify if hints are displayed properly
    await expect(await page.getByText("Evaluated Equation")).toBeVisible();
    await expect(await page.getByText("{{/Parent/Child:property}}")).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: /^Evaluated Equation$/ })
      .first()
      .click();
    await page.getByText("0 m^3").click();
    await expect(
      await page
        .locator("div")
        .filter({ hasText: /^References$/ })
        .first()
    ).toBeVisible();

    // verify if activity log is displayed properly
    const messageActivityTimeLine = "This is a test message for proprty with name " + propertyName;
    await page.getByTestId("button_open-comments-popover").first().click();
    const commentEditor = await page.getByTestId("editor-content_simple-comment-editor");
    await commentEditor.getByRole("paragraph").click();
    await commentEditor.fill(messageActivityTimeLine);
    await page.getByTestId("button_simple-comment-editor-send").click();
    await page
      .getByTestId("expandMenuDiv_" + propertyName)
      .getByTestId("button_block-property-list-item_more")
      .click();
    await page.getByTestId("menu-item_property-details").click();

    // Verify if activity log is displayed properly
    const addedComment = page.getByTestId("editor-content_simple-comment-editor").getByText("This is a test message for");
    await expect(await page.locator("span").filter({ hasText: "You commented just now" }).locator("span").nth(4)).toBeVisible();

    // Hover on property and verify if comment is displayed
    await page.getByPlaceholder("Name").first().hover();
    await expect(addedComment).toBeVisible();

    // Close the comment and verify if its closed
    await page.getByTestId("button_close").click();
    await expect(addedComment).toBeHidden();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
