import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";
import { expect } from "@playwright/test";

import { homePage } from "../../pageobjects/homePage.po";
import { reportsPage } from "../../pageobjects/reports.po";

test.describe.serial("Reports Images test", () => {
  let workspaceName;
  let wsId: string | undefined;
  test.beforeEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    workspaceName = "AutomatedTest_" + faker.internet.userName();
    wsId = await b2bSaasHomePage.openUrlAndCreateTestWorkspace(workspaceName);
    await b2bSaasHomePage.clickKnowledgebase();
  });

  test("Verify Upload via Image/Remove/Upload via Link/Change Image works correctly. @smokeTest @prod @featureBranch", async ({ page }) => {
    const report = new reportsPage(page);

    // Create a new Report
    const reportName = "ReportTodelete";
    await report.createReport(reportName);

    // Add Images
    await page.getByRole("button", { name: "Add cover image" }).click();
    const btnUploadFile = await page.getByLabel("Upload").getByRole("textbox");
    await btnUploadFile.setInputFiles("./resources/flower.png");
    const uploadedCover = await page.getByTestId("report-cover-image");
    await expect(await uploadedCover).toBeVisible();

    // Change cover
    const btnChangeCover = await page.getByRole("button", { name: "Change cover" });
    await btnChangeCover.click();
    await btnUploadFile.setInputFiles("./resources//flower2.png");
    await expect(await uploadedCover).toBeVisible();

    // Attach via Link
    await uploadedCover.click();
    await btnChangeCover.click();
    await page.getByRole("tab", { name: "Link" }).click();
    await page.getByPlaceholder("Paste the image link...").fill("www.google.com");
    await page.getByRole("button", { name: "Embed image" }).click();
    await expect(await page.getByText("Invalid image link")).toBeVisible();

    // Remove Image and verify if its deleted
    await page.getByRole("button", { name: "Remove" }).click();
    await expect(await uploadedCover).toBeHidden();
  });

  test.afterEach(async ({ page }) => {
    const b2bSaasHomePage = new homePage(page);
    if (wsId) {
      await b2bSaasHomePage.deleteWorkspaceByID(wsId);
    }
  });
});
