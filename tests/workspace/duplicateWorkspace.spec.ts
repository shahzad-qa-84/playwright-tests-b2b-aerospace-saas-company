import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { workspacePage } from "../../pageobjects/workspace.po";

test.describe("Duplicate Workspace Test", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await homePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Duplicate workspace works perfectly with all nodes copied properly. @featureBranch @smokeTest", async ({ page }) => {
    const homePage = new HomePage(page);
    const workspace = new workspacePage(page);

    // Import workspace for duplication test
    await workspace.expandWorkspaceDropdown();
    await workspace.importWorkspace("./resources/demo-launch-vehicle.json");
    await page.waitForTimeout(3000);
    
    // Navigate to verify import success
    await homePage.clickInbox();
    await homePage.clickModelling();

    // Duplicate the workspace
    await workspace.expandWorkspaceDropdown();
    await workspace.duplicateWorkspaceDropdown();
    await page.waitForTimeout(3000);

    // Verify duplicated workspace structure
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("heading", { name: "Launch Vehicle (RS-1) System Design" }).locator("span").click();
    await page.getByRole("treegrid").getByText("Vehicle design").click();
    await page.getByRole("heading", { name: "Vehicle design" }).locator("span").click();
    await page.waitForLoadState("domcontentloaded");

    // Verify requirements section nodes
    await page.waitForTimeout(1000);
    await page.getByTestId("nav-link_menu-pane_requirements").hover();
    await page.getByTestId("nav-link_menu-pane_requirements").click();
    
    // Navigate through requirements structure
    await page.getByText("Fracture Drawing markings").click();
    await page.getByRole("link", { name: "QMS Checklist" }).click();
    await page.getByText("ROL-1").click();
    await page.getByRole("link", { name: "New Document" }).click();
    await page.getByText("ROL-1").click();
    await page.getByText("ROL-2").click();
    await page.getByRole("link", { name: "Ground Handling Requirements" }).click();
    await page.getByText("Write a requirement").click();
    await page.getByRole("link", { name: "Structure Requirements" }).click();
    await page.getByRole("link", { name: "Launch Vehicle System Requirements" }).click();
    
    // Verify specific requirements content
    await page.getByText("The launch vehicle shall be capable of lofting 250 kg to Low-Earth Orbit").click();
    await page.getByText("The vehicle shall be capable of lofting 50 kg to Sun-Synchronous Orbit").click();
    await page.getByText("The launch vehicle shall be").click();
    await page.waitForLoadState("domcontentloaded");

    // Verify reports/knowledgebase section
    await page.waitForTimeout(1000);
    await page.getByTestId("nav-link_menu-pane_knowledgebase").hover();
    await page.getByTestId("nav-link_menu-pane_knowledgebase").click();
    await page.locator("#REPORT_PANE").getByText("Launch Vehicle Payload Users Guide", { exact: true }).click();
    await page.waitForLoadState("domcontentloaded");

    // Clean up duplicated workspace
    const currentWorkspaceId = await page.url().split('/workspace/')[1]?.split('/')[0];
    if (currentWorkspaceId) {
      // Note: Using original homePage for cleanup methods
      const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
      const cleanupHomePage = new originalHomePage(page);
      await cleanupHomePage.deleteWorkspaceByID(currentWorkspaceId);
    }

    // Verify workspace deletion and cleanup imported workspace
    await page.goto('/'); // Navigate to workspaces
    await page.waitForLoadState("domcontentloaded");
    
    // Delete the original imported workspace if it exists
    const { homePage: originalHomePage } = await import("../../pageobjects/homePage.po");
    const cleanupHomePage = new originalHomePage(page);
    await cleanupHomePage.deleteWsFromSettings("AutomatedTest_Launch Vehicle");
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