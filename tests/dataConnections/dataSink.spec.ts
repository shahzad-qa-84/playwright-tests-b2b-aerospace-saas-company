import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe.serial("Data Sink ", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that E2E flow of Data sink test works @featureBranch @smokeTest @prod", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);

    // Go to Data source page and click data sink
    await b2bSaasHomePage.clickDataSources();
    await b2bSaasHomePage.clickDataSink();

    // Add data sink
    const dataSinkName = "datasink_test";
    await page.getByTestId("button_add-data-connection").click();
    await page.locator("label:nth-child(2) > .bp5-control-indicator").click();
    await page.getByTestId("button_continue").click();
    const txtBxDataSink = await page.getByRole("textbox");
    await txtBxDataSink.nth(1).click();
    await txtBxDataSink.nth(1).fill(dataSinkName);

    // Enter Data sink description
    await page.locator("textarea").click();
    await page.locator("textarea").fill("this is a test");

    // Verify that information toolbar is displayed
    await expect(page.getByText("If you change the data type,")).toBeVisible();

    // Add property key1 and its respective value
    const key1Value = "256";
    await txtBxDataSink.nth(3).click();
    await txtBxDataSink.nth(3).fill("value1");
    await txtBxDataSink.nth(4).click();
    await txtBxDataSink.nth(4).fill(key1Value);

    // Add property key2 and its respective value
    await page.getByTestId("button_add-property").click();
    const txtBxValue = await page.locator('input[type="text"]');
    await txtBxValue.nth(3).click();
    await txtBxValue.nth(3).fill("value2");
    await txtBxValue.nth(4).click();
    await txtBxValue.nth(4).fill("350");

    // Click Submit button
    const btnSubmit = await page.getByTestId("button_add-data-sink");
    await btnSubmit.click();

    // Verify that Data sink is created successfully
    const threeDots = await page.getByLabel("Data sinks1").locator(".bp5-button.bp5-minimal").first();
    await threeDots.click();
    await page.getByText("Edit").click();

    // Verify that Data sink can be edited successfully with Tags and edited description
    await page.getByTestId("button_show-icon-selector-menu").click();
    await page.getByTestId("button_icon_airplane").click();

    const txtBxTag = await page.getByRole("combobox").getByRole("textbox");
    await txtBxTag.click();
    await txtBxTag.fill("tag1");
    await page.getByTestId("menu-item_create-new-item").click();

    const txtBxDescription = page.getByTestId("side-panel_sliding-panel").getByText("this is a test");
    await txtBxDescription.click();
    await txtBxDescription.fill("this is a test_update");
    await btnSubmit.click();

    // Verify that information is edited successfully
    await expect(page.getByLabel("Data sinks1").getByText(dataSinkName)).toBeVisible();
    await expect(page.getByRole("cell", { name: "this is a test_update" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "tag1" }).locator("span").first()).toBeVisible();

    // Now go to Modeling page and add a property with the data sink
    await b2bSaasHomePage.clickModelling();
    await page.getByText("property", { exact: true }).click();
    const txtBxAddNewProperty = await page.getByPlaceholder("Add new property");
    await txtBxAddNewProperty.fill("test1");
    await txtBxAddNewProperty.press("Enter");

    // Hover the txtBxAddNewProperty and click on the data sink
    await page.getByTestId("editor-content_scalar-expression-editor_test1").hover();
    await page.getByTestId("button_open-data-source-dropdown").click();

    // Select the Data sink
    await page
      .locator("label")
      .filter({ hasText: "" + dataSinkName + "" })
      .click();
    await page.getByTestId("button_add-data-source").click();

    // Verify that Data sink value is properly displayed in the property
    await expect(page.getByText(key1Value).first()).toBeVisible();

    // Delete the Data sink
    await b2bSaasHomePage.clickDataSources();
    await expect(page.getByText("All connections1")).toBeVisible();
    await expect(page.getByText("Data sinks1")).toBeVisible();
    await page.getByText("Data sources").click();
    await expect(page.getByText("You don't have any data")).toBeVisible();

    // Click on the Data sink and delete it
    await page.getByText("Data sinks1").click();
    await threeDots.click();
    await page.getByText("Delete").click();

    // Verify that Data sink is deleted successfully
    await expect(page.getByLabel("Data sinks").getByText("You don't have any data")).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
