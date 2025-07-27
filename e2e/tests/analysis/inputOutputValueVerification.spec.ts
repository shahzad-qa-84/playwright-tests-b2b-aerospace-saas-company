import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { analysisPage } from "../../pageobjects/analysis.po";
import { childPage } from "../../pageobjects/childBlock.po";
import { homePage } from "../../pageobjects/homePage.po";
import { propertyPage } from "../../pageobjects/property.po";

test.describe("Input/Output Value check Test", () => {
  let wsId: string | undefined;
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateEngineeringWorkspace(workspaceName);
  });
  test("Verify that Code block Input/output value in Python works @smokeTest @prod @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);

    // Add the property "mass" to the workspace
    const property = new propertyPage(page);
    await property.addPropertyValue("mass", "100");
    const childBlockPage = new childPage(page);
    await childBlockPage.clickChildBlock();

    // Add two children
    const child1Name = "Child1";
    const child2Name = "Child2";
    await childBlockPage.createChildBlockFromMainBar(child1Name);
    await childBlockPage.createChildBlockFromMainBar(child2Name);

    // Put some values in Child blocks
    await page.getByTestId("ag-cell_block_child1").getByText("Child1").click();
    await page.getByText("Properties").click();
    const txtBxMass = await page.getByTestId("editor-content_scalar-expression-editor_mass").getByRole("paragraph");
    await txtBxMass.click();
    await txtBxMass.fill("50");

    await page.getByText("Child2").click();
    await txtBxMass.click();
    await txtBxMass.fill("50");
    await page.getByTestId("ag-cell_block_new-system").getByText("New System").click();

    // Verify 200 kg is displayed in the parent block
    await expect(await page.getByText("200 kg")).toBeVisible();

    // Add a code block
    await b2bSaasHomePage.clickAnalysis();

    const analysis = new analysisPage(page);
    await analysis.clickCreateCodeBlock();

    // Add an input to the code block called mass
    await analysis.createCodeBlock("my_code_block");
    await analysis.addPropertyToCodeBlock("mass");

    // set the import to reference a property
    await analysis.enterCode("import b2bSaas\nprint(b2bSaas.inputs.mass)");

    // Run python code to print out the input value, make sure it matches the actual block value
    await analysis.runCode();
    const outputTabHeader = page.locator("#bp5-tab-title_analysis-footer-tabs_output");
    // Wait for the output tab to be enabled after running the code
    await expect(outputTabHeader).toBeVisible();
    await expect(outputTabHeader).toHaveAttribute("aria-disabled", "false");
    await outputTabHeader.click();
    // Wait for stdout to be fetched from S3 and displayed
    await expect(page.getByRole("tabpanel", { name: "Output log" }).getByText("200.0")).toBeVisible();

    // Add output to the code block
    await page.getByTestId("button_action-add-new-analysis-output").click();

    // Set the Unit to KG
    const txtBxSetUnit = await page.getByPlaceholder("Set Unit");
    await txtBxSetUnit.click();
    await txtBxSetUnit.fill("KG");
    await txtBxSetUnit.press("Enter");

    // Add a new output to the code block
    await page
      .locator("div")
      .filter({ hasText: /^print\(b2bSaas\.inputs\.mass\)$/ })
      .click();
    await page
      .getByLabel("Editor content;Press Alt+F1")
      .fill(
        "import b2bSaas\nprint(b2bSaas.inputs.mass)\nb2bSaas.outputs.new_output = b2bSaas.inputs.mass + 10\n\nprint(b2bSaas.outputs.new_output)"
      );

    // Run the code block
    await analysis.runCode();
    await page.getByRole("tab", { name: "Output log" }).click();
    await expect(await page.getByText("210.0")).toBeVisible();

    // Verify the output value in the parent block
    await expect(page.locator('//input[@value="210"]')).toBeVisible();

    // Refresh the page and check if the Input and output values are still the same
    await page.reload();
    await expect(page.getByTestId("button_select-property")).toBeVisible();
    await expect(page.getByText("mass", { exact: true })).toBeVisible();
    await expect(page.locator("div").filter({ hasText: /^print\(b2bSaas\.outputs\.new_output\)$/ })).toBeVisible();
    await page.locator('//input[@value="210"]').isVisible();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
