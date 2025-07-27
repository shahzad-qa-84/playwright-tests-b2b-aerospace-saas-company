import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { attachmentsPage } from "../../pageobjects/attachmentPage.po";
import { homePage } from "../../pageobjects/homePage.po";

const attachmentName = "flower.png";
const attachmentSize = "515.7 kB";

test.describe("Attachment Tests with image upload and thumbnail check", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;

  // Create a workspace before each test
  test.beforeEach(async ({ page }) => {
    const home = new homePage(page);
    wsId = await home.openUrlAndCreateTestWorkspace(workspaceName);
  });

  test("Upload PNG attachment and verify thumbnail + metadata @prod @smokeTest @featureBranch", async ({ page }) => {
    const home = new homePage(page);
    const attachment = new attachmentsPage(page);

    // Step 1: Open attachment section and upload image
    await home.clickAttachments();
    await attachment.uploadAttachment(attachmentName);

    // Step 2: Verify attachment is listed
    await expect(page.getByText(attachmentName).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: attachmentName }).first()).toBeVisible();

    // Step 3: Switch to Grid view and verify thumbnail is shown
    await home.clickGridView();
    await expect(page.getByRole("img", { name: "thumbnail" })).toBeVisible();

    // Step 4: Open context menu and view attachment details
    await page.getByTestId("button_more-options_attachment-context-menu").click();
    await page.getByTestId("menu-item_details").click();

    const detailsPanel = page.getByLabel(`Attachment details: ${attachmentName}`);

    // Step 5: Verify image preview and metadata
    await detailsPanel.getByRole("img").first().click();
    await expect(detailsPanel.getByText(attachmentName, { exact: true })).toBeVisible();
    await expect(page.getByText("image/png")).toBeVisible();
    await expect(detailsPanel.getByText(attachmentSize)).toBeVisible();

    // Step 6: Close details panel and verify it’s hidden
    await page.keyboard.press("Escape");
    await expect(detailsPanel.getByText(attachmentSize)).toBeHidden();

    // Step 7: Verify "View block" is not shown
    await page.getByTestId("button_more-options_attachment-context-menu").click();
    await page.getByTestId("menu-item_details").click();
    await expect(page.getByText("View block")).toBeHidden();
  });

  // Clean up: delete workspace
  test.afterEach(async ({ page }) => {
    const home = new homePage(page);
    if (wsId) {
      await home.deleteWorkspaceByID(wsId);
    }
  });
});
