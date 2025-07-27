import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { requirements } from "../../pageobjects/requirements.po";

test.describe("Requirement docuemnt as an Attachment test", () => {
  const workspaceName = "AutomatedTest_" + faker.internet.userName();
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
  });
  test("Attachment of Reuirement document to the modelling is working successfully. @prod @smokeTest @featureBranch", async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    await b2bSaasHomePage.clickRequirements();

    // Fill the data in the first requirement document name
    const requirementPage = new requirements(page);
    await requirementPage.clickNewDocument();
    await requirementPage.clickNewRequirentBlock();
    const editableTxtBx = page.getByRole("textbox").first();
    await editableTxtBx.fill("this a test description");
    await editableTxtBx.press("Enter");
    await page.locator('[data-testid*="editor-content_rich-text-cell_"][data-testid*="_rationale"]').first().getByRole("paragraph").click();
    await editableTxtBx.fill("test");
    await editableTxtBx.press("Enter");

    // Add the requirement document as an attachment
    await b2bSaasHomePage.clickModelling();
    await b2bSaasHomePage.clickAttachments();
    await b2bSaasHomePage.clickAddAttachment();
    await page.getByTestId("menu-item_requirements").hover();
    await page.getByTestId("menu-item_attach-req-page").click();

    // Verify the attachment
    await b2bSaasHomePage.clickGridView();
    await expect(await page.getByText("New Document")).toBeVisible();

    // Delete the attachment
    await b2bSaasHomePage.clickContextMenuGridView();
    await b2bSaasHomePage.clickDeleteAttachment();

    // Verify that the attachment is deleted
    await expect(await page.getByRole("heading", { name: "No attachments for this block" })).toBeVisible();
  });
  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
