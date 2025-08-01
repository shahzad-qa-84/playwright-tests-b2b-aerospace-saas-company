import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { workspacePage } from "../../pageobjects/workspace.po";

test.describe.serial("Import Export Workspace Tests", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Import works perfectly. @smokeTest @featureBranch @prod", async ({ page }) => {
    const homePage = new HomePage(page);
    const workspace = new workspacePage(page);
    
    // Import workspace
    await workspace.expandWorkspaceDropdown();
    await workspace.importWorkspace("./resources/demo-launch-vehicle.json");
    await page.waitForTimeout(3000);

    // Verify modelling section nodes
    await homePage.clickInbox();
    await homePage.clickModelling();
    await page.getByRole("heading", { name: "Launch Vehicle (RS-1) System Design" }).locator("span").click();
    await page.getByRole("treegrid").getByText("Vehicle design").click();
    await page.getByRole("heading", { name: "Vehicle design" }).locator("span").click();

    // Verify requirements section nodes
    await page.getByTestId("nav-link_menu-pane_requirements").click();
    await page.getByRole("link", { name: "NDT Requirements" }).click();
    await page.getByRole("link", { name: "QMS Checklist" }).click();
    await page.getByText("ROL-1").click();
    await page.getByTestId("button_cell-dropdown_functional").click();
    await page.getByRole("link", { name: "New Document" }).click();
    await page.getByText("ROL-1").click();
    await page.getByRole("link", { name: "Ground Handling Requirements" }).click();
    await page.getByText("ROL-2").click();
    await page.getByRole("link", { name: "Structure Requirements" }).click();
    await page.getByRole("link", { name: "Launch Vehicle System Requirements" }).click();
    await page.getByText("The launch vehicle shall be").click();

    // Verify reports/knowledgebase section nodes
    await page.getByTestId("nav-link_menu-pane_knowledgebase").click();
    await page.locator("#REPORT_PANE").getByText("Launch Vehicle Payload Users Guide", { exact: true }).click();
    await page.getByText("How to write GOOD requirements").click();
    await page.getByText("Some Document").click();
    await page.getByText("RVTM").click();

    // Clean up imported workspace
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    await cleanupHomePage.deleteCurrentOpenWorkspace("AutomatedTest_Launch Vehicle");
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