import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { analysisPage } from "../../pageobjects/analysis.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";

test.describe("Add Code Block Test", () => {
  let wsId: string | undefined;
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateEngineeringWorkspace(workspaceName);
  });
  
  test("Verify that Code block execution in Python works @smokeTest @prod @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const analysis = new analysisPage(page);

    // Navigate to analysis section
    await homePage.clickAnalysis();

    // Create and configure code block for plotting
    await analysis.clickCreateCodeBlock();

    // Add matplotlib plotting code
    const plotCode = `import matplotlib.pyplot as plt
fig, ax = plt.subplots()
fruits = ['apple', 'blueberry', 'cherry', 'orange']
counts = [40, 100, 30, 55]
bar_labels = ['red', 'blue', '_red', 'orange']
bar_colors = ['tab:red', 'tab:blue', 'tab:red', 'tab:orange']
ax.bar(fruits, counts, label=bar_labels, color=bar_colors)
ax.set_ylabel('fruit supply')
ax.set_title('Fruit supply by kind and color')
ax.legend(title='Fruit color')
plt.show()
plt.savefig("output.png")`;

    await analysis.enterCode(plotCode);
    await analysis.runCode();

    // Verify artifacts tab is enabled and accessible
    const artifactsTabHeader = page.locator("#bp5-tab-title_analysis-footer-tabs_artifacts");
    await expect(artifactsTabHeader).toBeVisible();
    await expect(artifactsTabHeader).toHaveAttribute("aria-disabled", "false");
    await artifactsTabHeader.click();

    // Verify generated image artifact
    const artifactsTable = page.getByRole("tabpanel", { name: "Artifacts" }).getByRole("table");
    await expect(artifactsTable.getByRole("cell", { name: "image/png" })).toBeVisible();
    await expect(artifactsTable.getByRole("cell", { name: "output.png" })).toBeVisible();

    // Open and verify image in popup
    const imagePopup = page.waitForEvent("popup");
    await page.getByRole("cell", { name: "image/png" }).click();
    const popupPage = await imagePopup;
    await expect(popupPage.getByRole("img")).toBeVisible();
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