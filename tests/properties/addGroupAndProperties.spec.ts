import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { childPage } from "../../pageobjects/childBlock.po";
import { homePage } from "../../pageobjects/homePage.po";
import { propertyPage } from "../../pageobjects/property.po";

test.describe("Add Group and Properties assign Tests", () => {
  let wsId: string | undefined;
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Set property instances in child-blocks and Add Group @smokeTest @prod @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    const childBlockPage = new childPage(page);
    await childBlockPage.clickChildBlock();

    // Add the first child and Verify that 1 is added on the top child count
    const child1Name = "Child_" + faker.person.firstName();
    await childBlockPage.createChildBlockFromMainBar(child1Name);
    await page.getByText("Child Blocks").click();
    await page.getByLabel("Child Blocks1").getByText(child1Name).click();

    // Add Property 1
    const property1Name = "Property1_" + faker.person.firstName();
    const property1 = new propertyPage(page);
    await page.getByRole("tab", { name: "Properties" }).getByText("Properties").click();
    await property1.addPropertyOrGroupLink();
    await property1.addNewPropertyFromBlockSection(property1Name);

    // Add Property 2
    const property2Name = "Property_" + faker.person.firstName();
    const property2 = new propertyPage(page);
    await property2.addNewPropertyFromBlockSection(property2Name);

    // Add Property Value
    const property = new propertyPage(page);
    await property.addPropertyValue(property1Name, "45");
    await property.addPropertyValue(property2Name, "67");

    // Add group
    const groupName = "Group_" + faker.person.firstName();
    await property.addGroup(groupName);
    await expect(await page.getByRole("heading", { name: "" + groupName + "" }).getByText("" + groupName + "")).toBeVisible();

    // Add property to group
    await expect(await page.getByText("This group is empty")).toBeVisible();

    // Click Roll-up logo
    await b2bSaasHomePage.clickb2bSaas();
    await expect(await page.getByText("45", { exact: true }).nth(0)).toBeVisible();
    await expect(await page.getByText("67", { exact: true }).nth(0)).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
