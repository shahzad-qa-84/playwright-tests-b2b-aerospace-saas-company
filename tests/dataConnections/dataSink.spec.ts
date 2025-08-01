import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { DataSinkPage } from "../../pageobjects/dataSinkPage.po";
import { ModelingPage } from "../../pageobjects/modelingPage.po";

test.describe.serial("Data Sink", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify E2E flow of Data Sink @featureBranch @smokeTest @prod", async ({ page }) => {
    const homePage = new HomePage(page);
    const dataSinkPage = new DataSinkPage(page);
    const modelingPage = new ModelingPage(page);

    const dataSinkName = "datasink_test";
    const key1Value = "256";

    // Navigate to data sources and create data sink
    await homePage.clickDataSources();
    await homePage.clickDataSink();

    // Create data sink with test values
    await dataSinkPage.createDataSink(dataSinkName, "this is a test", "value1", key1Value, "value2", "350");
    
    // Edit the data sink
    await dataSinkPage.editDataSink(dataSinkName, "this is a test_update", "tag1");

    // Navigate to modelling and add property with data sink
    await homePage.clickModelling();
    await modelingPage.addPropertyWithDataSink("test1", dataSinkName, key1Value);

    // Navigate back to data sources and clean up
    await homePage.clickDataSources();
    await dataSinkPage.deleteDataSink();
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