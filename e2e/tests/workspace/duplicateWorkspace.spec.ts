import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { workspacePage } from "../../pageobjects/workspace.po";

test.describe("Duplicate Workspace Test", () => {
  let workspaceName: string;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Verify that Duplicate workspace works perfectly with all nodes copied properly. @featureBranch @smokeTest", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    const workspace = new workspacePage(page);

    // First import a workspace
    await workspace.expandWorkspaceDropdown();
    await workspace.importWorkspace("./resources/demo-launch-vehicle.json");
    await page.waitForTimeout(3000);
    await b2bSaasHomePage.clickInbox();
    await b2bSaasHomePage.clickModelling();

    // Now duplicate the workspace
    await workspace.expandWorkspaceDropdown();
    await workspace.duplicateWorkspaceDropdown();
    await page.waitForTimeout(3000);

    // Verify that the duplicated workspace is created with all nodes
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("heading", { name: "Launch Vehicle (RS-1) System Design" }).locator("span").click();
    await page.getByRole("treegrid").getByText("Vehicle design").click();
    await page.getByRole("heading", { name: "Vehicle design" }).locator("span").click();
    await page.waitForLoadState("domcontentloaded");

    // Verify that all the nodes are present on the Requirements section
    await page.waitForTimeout(1000);
    await page.getByTestId("nav-link_menu-pane_requirements").hover();
    await page.getByTestId("nav-link_menu-pane_requirements").click();
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
    await page.getByText("The launch vehicle shall be capable of lofting 250 kg to Low-Earth Orbit").click();
    await page.getByText("The vehicle shall be capable of lofting 50 kg to Sun-Synchronous Orbit").click();
    await page.getByText("The launch vehicle shall be").click();
    await page.waitForLoadState("domcontentloaded");

    // Verify that all the nodes are present on the Reports section
    await page.waitForTimeout(1000);
    await page.getByTestId("nav-link_menu-pane_knowledgebase").hover();
    await page.getByTestId("nav-link_menu-pane_knowledgebase").click();
    await page.locator("#REPORT_PANE").getByText("Launch Vehicle Payload Users Guide", { exact: true }).click();
    await page.waitForLoadState("domcontentloaded");

    // Delete the duplicated workspace
    const wsIdCurrentlyOpen = await b2bSaasHomePage.getWorkspaceID();
    if (wsIdCurrentlyOpen) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsIdCurrentlyOpen);
    }

    // Refresh the page and verify that the workspace is deleted
    await b2bSaasHomePage.gotoWorkspaces();
    await page.waitForLoadState("domcontentloaded");
    await b2bSaasHomePage.deleteWsFromSettings("AutomatedTest_Launch Vehicle");
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
