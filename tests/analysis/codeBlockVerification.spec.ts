import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { analysisPage } from "../../pageobjects/analysis.po";
import { homePage } from "../../pageobjects/homePage.po";

test.describe("Add Code Block Test", () => {
  let wsId: string | undefined;
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateEngineeringWorkspace(workspaceName);
  });
  test("Verify that Code block execution in Python works @smokeTest @prod @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);

    // Add a code block
    await b2bSaasHomePage.clickAnalysis();
    const analysis = new analysisPage(page);

    //  Make another code block to test plotting
    await analysis.clickCreateCodeBlock();

    // Add plot code and run it
    await analysis.enterCode(
      `import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nfruits = ['apple', 'blueberry', 'cherry', 'orange']\ncounts = [40, 100, 30, 55]\nbar_labels = ['red', 'blue', '_red', 'orange']\nbar_colors = ['tab:red', 'tab:blue', 'tab:red', 'tab:orange']\nax.bar(fruits, counts, label=bar_labels, color=bar_colors)\nax.set_ylabel('fruit supply')\nax.set_title('Fruit supply by kind and color')\nax.legend(title='Fruit color')\nplt.show()\nplt.savefig("output.png")`
    );

    await analysis.runCode();

    // Click artifacts tab and verify the image is displayed
    const artifactsTabHeader = page.locator("#bp5-tab-title_analysis-footer-tabs_artifacts");
    // Wait for the artifacts tab to be enabled after running the code
    await expect(artifactsTabHeader).toBeVisible();
    await expect(artifactsTabHeader).toHaveAttribute("aria-disabled", "false");
    await artifactsTabHeader.click();

    // Check filename and mimetype
    const artifactsTable = page.getByRole("tabpanel", { name: "Artifacts" }).getByRole("table");
    await expect(artifactsTable.getByRole("cell", { name: "image/png" })).toBeVisible();
    await expect(artifactsTable.getByRole("cell", { name: "output.png" })).toBeVisible();

    // Click the artifact row to view it
    const imagePopup = page.waitForEvent("popup");
    await page.getByRole("cell", { name: "image/png" }).click();
    const popupPage = await imagePopup;
    await expect(popupPage.getByRole("img")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
