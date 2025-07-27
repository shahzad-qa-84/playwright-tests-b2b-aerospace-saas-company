import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { DataSinkPage } from "../../pageobjects/dataSinkPage.po";
import { ModelingPage } from "../../pageobjects/modelingPage.po";

test.describe.serial("Data Sink", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify E2E flow of Data Sink @featureBranch @smokeTest @prod", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    const dataSinkPage = new DataSinkPage(page);
    const modelingPage = new ModelingPage(page);

    const dataSinkName = "datasink_test";
    const key1Value = "256";

    await b2bSaasHomePage.clickDataSources();
    await b2bSaasHomePage.clickDataSink();

    await dataSinkPage.createDataSink(dataSinkName, "this is a test", "value1", key1Value, "value2", "350");
    await dataSinkPage.editDataSink(dataSinkName, "this is a test_update", "tag1");

    await b2bSaasHomePage.clickModelling();
    await modelingPage.addPropertyWithDataSink("test1", dataSinkName, key1Value);

    await b2bSaasHomePage.clickDataSources();
    await dataSinkPage.deleteDataSink();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
