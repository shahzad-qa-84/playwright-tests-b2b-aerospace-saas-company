import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";

test.describe("Document functionality and Requirement Details verification test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Verify that Document and Requirement Details verification is working successfully. @prod @smokeTest @featureBranch", async ({
    page,
  }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickRequirements();

    // Create a new requirement
    await page.getByTestId("button_requirements-frame_create").click();
    const btnDocumentView = await page.getByTestId("button_document-view");
    await btnDocumentView.click();
    await page.getByTestId("button_more-options_open-title-options-menu").click();
    await page.locator(".bp5-overlay-backdrop").click();

    // Add a new requirement block
    const btnTableView = await page.getByTestId("button_table-view");
    await btnTableView.click();
    await page.getByTestId("button_new-row").click();
    await page.getByTestId("menu-item_add-requirement-block").click();
    await btnDocumentView.click();
    await page.getByRole("paragraph").click();
    const txtRequirement = "this is test";
    await page.getByTestId("editor-content_text").fill(txtRequirement);

    // Attach a new image
    const actionMenu = await page.getByTestId("button_document-actions-nav_drag");
    await actionMenu.click();
    await page.getByTestId("menu-item_add-image").click();
    await page.getByTestId("button_upload-image").click();
    await page.getByTestId("input_file-drop-zone").setInputFiles("./resources/flower.png", { timeout: 180000 });
    await page
      .locator("div")
      .filter({ hasText: /^Change image$/ })
      .nth(4)
      .click();
    await page.getByTestId("button_remove").click();
    await page.getByTestId("button_upload-image").click();
    await page.getByTestId("button_close-image-uploader").click();
    await expect(page.getByTestId("button_close-image-uploader")).toBeHidden();

    // Add notes to the requirement
    await actionMenu.click();
    await page.getByTestId("menu-item_add-note").click();
    const txtNote = "this is my personal note";
    const txtBxNotetoType = await page.getByTestId("editor-content_rich-text-editor");
    await page.getByTestId("editor-content_rich-text-editor").fill(txtNote);
    await page.getByText(txtNote).click();
    await txtBxNotetoType.press("ControlOrMeta+a");
    await page.getByText(txtNote).click();
    await page.getByText("ROL-1this is").click();
    await page.getByText(txtNote).click();
    await txtBxNotetoType.fill("this is my personal note - edited");
    await expect(page.getByText("this is my personal note - edited")).toBeVisible();

    // Click Table view and verify that
    await btnTableView.click();
    await page.getByText(txtRequirement).click();
    await btnDocumentView.click();
    await page.getByTestId("button_toggle-requirement-details-panel").click();
    await page.getByTestId("button_open-level-dropdown").click();
    await page.getByTestId("menu-item_dropdown-menu-item-2").click();

    // Verify that "2" is displayed in the table view
    await btnTableView.click();
    //await page.getByTestId("button_cell-dropdown_2").click();
    await expect(page.getByRole("gridcell", { name: "2" }).locator("span").nth(2)).toBeVisible();

    // Change the requirement name from Document view
    await btnDocumentView.click();
    await page.locator("#REQUIREMENTS_CONTAINER_ID").getByText("ROL-").click();
    const txtID = await page.getByTestId("input_requirement-id-input");
    await txtID.press("ControlOrMeta+a");
    await txtID.fill("My first requirement");
    await txtID.press("Enter");

    // Verify that the requirement name is changed in the table view
    await btnDocumentView.click();
    await page.getByTestId("side-panel_sliding-panel").getByText("None").click();
    const linkPropertyInput = page.getByTestId("side-panel_sliding-panel").getByPlaceholder("Link property...");
    await linkPropertyInput.click();
    await linkPropertyInput.press("Escape");
    await page.getByTestId("button_open-verification-method-dropdown").click();
    await page.getByTestId("menu-item_dropdown-menu-item-demonstration").click();
    await page.getByText("Success Criteria").click();
    await page.getByTestId("control-option_manual").click();

    // Verify that the verification method is changed in the table view
    await btnDocumentView.click();
    await page.locator("label").filter({ hasText: "Not set" }).locator("span").click();
    await page.getByText("Not Verified").click();
    await expect(page.getByText("Pass")).toBeVisible();

    // Verify that comments are added successfully and displayed in time line
    await page.getByTestId("button_toggle-comments-panel").click();
    await btnTableView.click();
    await page.getByTestId("commentCell").hover();
    await page.getByTestId("button_open-comment-popover").click();
    await page.getByTestId("editor-content_simple-comment-editor").fill("this is new comment");

    await page.getByTestId("button_simple-comment-editor-send").click();
    await page.getByTestId("side-panel_sliding-panel").getByText("just now").click();
    await expect(page.getByTestId("side-panel_sliding-panel").getByText("this is new comment")).toBeVisible();
    await expect(page.locator("span").filter({ hasText: "this is new comment" }).getByRole("paragraph")).toBeVisible();

    // Delete the comment and verify that it is deleted from the side history panel
    await page.getByTestId("button_comment-actions-menu").click();
    await page.getByTestId("menu-item_delete").click();
    await expect(page.getByRole("heading", { name: "No comments yet" })).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
