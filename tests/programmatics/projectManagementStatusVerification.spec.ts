import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Project Management section test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName, "engineering");
  });
  test("Verify that Project management various status functionality works successfully. @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    // Verify all Project statuses are displayed
    await expect(await page.getByText("Status", { exact: true })).toBeVisible();
    await expect(await page.getByText("Responsible Engineer")).toBeVisible();
    await expect(await page.getByText("Delvery Date")).toBeVisible();
    await expect(await page.getByText("Inventory Count")).toBeVisible();
    await expect(await page.locator("span").filter({ hasText: "Right-click to insert..." }).first()).toBeVisible();
    await expect(await page.getByText("Empty")).toBeVisible();
    await expect(await page.getByPlaceholder("MM/DD/YYYY").nth(1)).toBeVisible();

    // Verify that clicking "Add new project status" adds new status
    const optionAddNewStatus = await page.getByPlaceholder("Add new status");
    await page.getByText("Add new status").click();
    await optionAddNewStatus.fill("Done");
    await optionAddNewStatus.press("Enter");
    await page.getByTestId("side-panel_sliding-panel").isVisible();
    await expect(await page.getByText("Done")).toBeVisible();
    await expect(await page.getByText("DoneEmpty")).toBeVisible();

    // Add new descriptiom and verify that description is added
    const optionAddDescription = await page.getByText("Add description...");
    await optionAddDescription.click();
    const txtBxDescription = page.getByPlaceholder("Add description...");
    await txtBxDescription.fill("description -1");
    await txtBxDescription.press("Enter");
    await expect(await page.getByText("description -1")).toBeVisible();

    // Change sub-options of status and verify that status is changed appropraitely
    const optionStatus = await page.locator('.status-item-grid > .flex > div > [class*="-popover-target"] > [class*="-button"]').first();
    await optionStatus.click();

    // Change status to 'Text' and verify that text box is displayed
    await page.getByRole("menuitem", { name: "Text" }).click();
    await page.getByText("Empty").first().click();
    await page.locator("textarea").fill("Added Text-description");
    await page.locator("textarea").press("Enter");
    await expect(await page.getByText("Added Text-description")).toBeVisible();

    // Change status to 'Numeric' and verify that numeric value is changed
    await optionStatus.click();
    await page.getByRole("menuitem", { name: "Numeric" }).click();
    await page.getByText("Empty").first().click();
    await page.getByRole("spinbutton").fill("89");
    await page.getByRole("spinbutton").press("Enter");
    await expect(await page.getByText("89", { exact: true })).toBeVisible();

    // Change status to 'Check' and verify that check box is displayed
    await optionStatus.click();
    await page.getByRole("menuitem", { name: "Check" }).click();
    await expect(await page.locator(".component--status-type-check-editor")).toBeVisible();

    // Change status to 'Date' and verify that date is set to Todays date, works with Clear values and Delete status
    await optionStatus.click();
    const txtBxDate = await page.getByPlaceholder("MM/DD/YYYY").first();
    await page.getByRole("menuitem", { name: "Date" }).click();
    await txtBxDate.click();
    await page.getByRole("button", { name: "Today" }).click();

    // Clear value and verify that date is cleared
    await optionStatus.click();
    await page.getByRole("menuitem", { name: "Clear Value" }).click();
    await expect(await txtBxDate.first()).toBeVisible();

    // Change status to 'Single Select' and verify that single select is displayed
    await optionStatus.click();
    await page.getByRole("menuitem", { name: "Single Select" }).click();
    await page.getByPlaceholder("Empty").first().click();
    await page.getByTestId("menu-item_in-progress").click();
    await expect(await page.getByText("In-progress").first()).toBeVisible();

    // Change status to 'Mention' and verify that members details is displayed
    await optionStatus.click();
    await page.getByRole("menuitem", { name: "Mention" }).click();
    await page.getByPlaceholder("Empty").first().click();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
