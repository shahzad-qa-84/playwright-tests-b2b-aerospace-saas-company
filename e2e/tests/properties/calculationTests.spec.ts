import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { propertyPage } from "../../pageobjects/property.po";

test.describe("Calculation Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Calculation test Addition @smokeTest @featureBranch", async ({ page }) => {
    // Add property 1 and assign value "2"
    const property = new propertyPage(page);
    const propertyName1 = faker.person.firstName() + "_Value1";
    await property.addPropertyOrGroupLink();
    await property.addNewPropertyFromBlockSection(propertyName1);
    const propertyValue = "3 kg";
    await property.addPropertyValue(propertyName1, propertyValue);

    // Add property 2 and assign value "6"
    const propertyName2 = faker.person.firstName() + "_Value2";
    await property.addNewPropertyFromBlockSection(propertyName2);
    const propertyValue2 = "6 kg";
    await property.addPropertyValue(propertyName2, propertyValue2);

    const propertyName3 = faker.person.firstName() + "_Result";
    await property.addNewPropertyFromBlockSection(propertyName3);
    const propertyValue3 = "{{" + propertyName1 + "}}+{{" + propertyName2 + "}}";
    await property.addPropertyValue(propertyName3, propertyValue3);

    // Verify 6+3 is added and in result is 9 displayed
    await expect(
      await page.getByTestId("editor-content_scalar-expression-editor_" + propertyName3.toLowerCase()).getByText("9 kg")
    ).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
