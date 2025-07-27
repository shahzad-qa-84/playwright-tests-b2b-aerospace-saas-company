import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { propertyPage } from "../../pageobjects/property.po";

test.describe("Formula Validation Tests", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Formula validation Plus works expected @featureBranch @smokeTest", async ({ page }) => {
    // Failed Case-1 (Plus)
    // Add property 1 and assign value "2" without unit
    const property = new propertyPage(page);
    const propertyName1 = "Prop_without_Unit";
    await property.addPropertyOrGroupLink();
    await property.addNewPropertyFromBlockSection(propertyName1);
    const propertyValue = "3";
    await property.addPropertyValue(propertyName1, propertyValue);
    // Add property 2 and assign value "6"
    const propertyName2 = "Prop_with_Unit";
    await property.addNewPropertyFromBlockSection(propertyName2);
    const propertyValue2 = "6 kg";
    await property.addPropertyValue(propertyName2, propertyValue2);
    const propertyName3 = "Result";
    await property.addNewPropertyFromBlockSection(propertyName3);
    const propertyValue3 = "{{" + propertyName1 + "}}+{{" + propertyName2 + "}}";
    await property.addPropertyValue(propertyName3, propertyValue3);
    // Verify error message is displayed
    const errorMessage = await page.getByTestId("icon_expression-warning").locator("svg");
    await expect(errorMessage).toBeVisible();

    // Failed Case-2 (Plus with differnt Units)
    await property.addPropertyValue(propertyName1, "2 m");
    await expect(errorMessage).toBeVisible();

    // Success case 3 (Plus with same Units)
    await property.addPropertyValue(propertyName1, "2 kg");
    const property4 = "Props_extra";
    await property.addNewPropertyFromBlockSection(property4);
    // Verify error message is not displayed
    await expect(errorMessage).toBeHidden();
    await expect(await page.getByText("8 kg")).toBeVisible();

    // Multiplication Case-1
    // Add property 1 for multiplication case
    const mutlipropertyName1 = "Multi_Prop_without_Unit";
    await property.addNewPropertyFromBlockSection(mutlipropertyName1);
    await property.addPropertyValue(mutlipropertyName1, "9 kg");
    //Add property 2 for multiplication case
    const multipropertyName2 = "Multi_Prop_with_Unit";
    await property.addNewPropertyFromBlockSection(multipropertyName2);
    await property.addPropertyValue(multipropertyName2, "2");
    const multipropertyName3 = "Multi_Result";
    await property.addNewPropertyFromBlockSection(multipropertyName3);
    const multipropertyValue3 = "{{" + mutlipropertyName1 + "}} * {{" + multipropertyName2 + "}}";
    await property.addPropertyValue(multipropertyName3, multipropertyValue3);
    // Verify error message is not displayed
    await expect(errorMessage).toBeHidden();
    await expect(await page.getByText("18 kg").first()).toBeVisible();

    // Multiplication Case-2
    await property.addPropertyValue(multipropertyName2, "2 m");
    await expect(await page.getByText("18 kg m")).toBeVisible();

    // Multiplication Case-3
    await property.addPropertyValue(multipropertyName2, "3 kg");
    await expect(await page.getByText("27 kg^2")).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
