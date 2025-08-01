import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { analysisPage } from "../../pageobjects/analysis.po";
import { childPage } from "../../pageobjects/childBlock.po";
import { HomePage } from "../../pageobjects/homePageRefactored.po";
import { propertyPage } from "../../pageobjects/property.po";

test.describe("Input/Output Value check Test", () => {
  let wsId: string | undefined;
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    wsId = await homePage.openUrlAndCreateEngineeringWorkspace(workspaceName);
  });
  
  test("Verify that Code block Input/output value in Python works @smokeTest @prod @featureBranch", async ({ page }) => {
    const homePage = new HomePage(page);
    const property = new propertyPage(page);
    const childBlockPage = new childPage(page);
    const analysis = new analysisPage(page);

    // Set up initial property value
    await property.addPropertyValue("mass", "100");
    await childBlockPage.clickChildBlock();

    // Create child blocks and assign values
    const child1Name = "Child1";
    const child2Name = "Child2";
    await childBlockPage.createChildBlockFromMainBar(child1Name);
    await childBlockPage.createChildBlockFromMainBar(child2Name);

    // Configure child1 mass value
    await page.getByTestId("ag-cell_block_child1").getByText("Child1").click();
    await page.getByText("Properties").click();
    const massEditor = page.getByTestId("editor-content_scalar-expression-editor_mass").getByRole("paragraph");
    await massEditor.click();
    await massEditor.fill("50");

    // Configure child2 mass value
    await page.getByText("Child2").click();
    await massEditor.click();
    await massEditor.fill("50");
    await page.getByTestId("ag-cell_block_new-system").getByText("New System").click();

    // Verify total mass (rollup) displays correctly
    await expect(page.getByText("200 kg")).toBeVisible();

    // Navigate to analysis and create code block
    await homePage.clickAnalysis();
    await analysis.clickCreateCodeBlock();

    // Configure code block with input/output
    await analysis.createCodeBlock("my_code_block");
    await analysis.addPropertyToCodeBlock("mass");

    // Enter code to read input and verify output
    await analysis.enterCode("import b2bSaas\nprint(b2bSaas.inputs.mass)");
    await analysis.runCode();

    // Verify output displays correct value
    const outputTabHeader = page.locator("#bp5-tab-title_analysis-footer-tabs_output");
    await expect(outputTabHeader).toBeVisible();
    await expect(outputTabHeader).toHaveAttribute("aria-disabled", "false");
    await outputTabHeader.click();
    await expect(page.getByRole("tabpanel", { name: "Output log" }).getByText("200.0")).toBeVisible();

    // Add output to code block
    await page.getByTestId("button_action-add-new-analysis-output").click();
    
    // Configure output unit
    const unitInput = page.getByPlaceholder("Set Unit");
    await unitInput.click();
    await unitInput.fill("KG");
    await unitInput.press("Enter");

    // Update code to include output calculation
    await page
      .locator("div")
      .filter({ hasText: /^print\(b2bSaas\.inputs\.mass\)$/ })
      .click();
    
    const updatedCode = `import b2bSaas
print(b2bSaas.inputs.mass)
b2bSaas.outputs.new_output = b2bSaas.inputs.mass + 10

print(b2bSaas.outputs.new_output)`;
    
    await page
      .getByLabel("Editor content;Press Alt+F1")
      .fill(updatedCode);

    // Run updated code and verify new output
    await analysis.runCode();
    await page.getByRole("tab", { name: "Output log" }).click();
    await expect(page.getByText("210.0")).toBeVisible();

    // Verify output value in parent block
    await expect(page.locator('//input[@value="210"]')).toBeVisible();

    // Test persistence after page reload
    await page.reload();
    await expect(page.getByTestId("button_select-property")).toBeVisible();
    await expect(page.getByText("mass", { exact: true })).toBeVisible();
    await expect(page.locator("div").filter({ hasText: /^print\(b2bSaas\.outputs\.new_output\)$/ })).toBeVisible();
    await page.locator('//input[@value="210"]').isVisible();
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