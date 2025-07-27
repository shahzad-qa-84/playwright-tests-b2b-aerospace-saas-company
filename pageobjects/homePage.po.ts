import { faker } from "@faker-js/faker";
import { Page } from "@playwright/test";

import { apiHelper } from "../apiutils/apiHelper";

type NewWorkspaceType = "engineering" | "blank";

// BlueprintJS classes used in the application.
// We hardcode these values here to avoid importing all of BlueprintJS
const Classes = {
  BUTTON: "bp5-button",
  ICON: "bp5-icon",
  MENU_ITEM: "bp5-menu-item",
  POPOVER_DISMISS: "bp5-popover-dismiss",
};

export class homePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickSettings() {
    await this.page.getByTestId("menu-item_settings").click();
  }

  async clickAnalysis() {
    await this.page.getByTestId("nav-link_menu-pane_analysis").click();
  }

  async clickDataSources() {
    await this.page.getByTestId("nav-link_data-sources").click();
  }

  async clickDataSink() {
    await this.page.getByText("Data sinks").click();
  }

  async clickBillOfMaterials() {
    await this.page.getByTestId("nav-link_menu-pane_hardware-catalog").click();
    await this.page.getByTestId("nav-link_menu-pane_bom").click();
  }

  async clickDownArrowFromTopBar() {
    await this.page.locator(`#app > div.component--bar button > span.${Classes.ICON}.${Classes.ICON}-chevron-down > svg`).click();
  }

  async clickClose() {
    await this.page.getByLabel("Close").click();
  }

  async clickImports() {
    await this.page.getByTestId("nav-link_imports").click();
  }

  async clickMoreConfigurations() {
    await this.page.getByTestId("nav-link_model-configuration").click();
  }

  async expandModellingMenu() {
    await this.page.getByTestId("button_menu-pane_toggle").click();
  }

  async clickHelp() {
    await this.page.getByRole("button", { name: "Help" }).click();
  }

  async changeSystemIcon(iconCategory: string, iconName: string) {
    await this.page.getByTestId("button_show-icon-selector-menu").first().click();
    await this.page
      .getByText("" + iconCategory + "")
      .first()
      .hover();
    await this.page.getByRole("menuitem", { name: "" + iconName + "" }).click();
  }

  async clickAttachments() {
    await this.page.getByText("Attachments").click();
  }

  async clickHardwareCatalog() {
    await this.page.getByTestId("nav-link_menu-pane_hardware-catalog").click();
  }

  async clickGridView() {
    await this.page.getByTestId("button_attachment-view-type-switcher_grid").click();
  }

  async clickAddAttachment() {
    await this.page.locator("span").filter({ hasText: "Add Attachment" }).first().click();
  }

  async clickContextMenuGridView() {
    await this.page.getByTestId("button_more-options_attachment-context-menu").click();
  }

  async clickDeleteAttachment() {
    await this.page.getByTestId("menu-item_delete").click();
  }
  async clickGoogleAttachment(fileName: string) {
    await this.page.getByTestId("menu-item_google-integration").hover();
    await this.page.getByPlaceholder("Search for documents, slides or spreadsheets").fill(fileName);
    await this.page.getByTestId("menu-item_filter-menu-item_slides_test-presentation").click();
  }

  async clickGithubAttachment() {
    // Further implementation needed
    await this.page.getByTestId("menu-item_github-integration").click();
    await this.page.getByPlaceholder("Search for repos, issues,").click();
    await this.page.getByPlaceholder("Search for repos, issues,").fill("this.");
  }

  async clickChildBlocks() {
    await this.page.getByText("Child Blocks").click();
  }

  async clickDiscussion() {
    await this.page.waitForLoadState();
    await this.page.getByText("Discussion").click();
  }

  async clickProjectManagement() {
    await this.page.getByTestId("button_toggle-side-panel").nth(1).click();
  }

  async addComment(message: string) {
    await this.page.waitForTimeout(500);
    await this.page.waitForSelector(".tiptap.ProseMirror");
    await this.page.getByRole("paragraph").click();
    await this.page.waitForTimeout(500);
    await this.page.locator(".tiptap").fill(message);
    await this.page.waitForTimeout(500);
    await this.page.getByTestId("button_comment-editor-send").click();
  }

  async clickHistory() {
    await this.page.getByTestId("button_toggle-history-and-comments-panel").click();
  }

  async expandCommentsAndHistorySection(expandMenu: string) {
    await this.page.hover(".feed-panel--header.justify-between span svg");
    await this.page
      .locator("span")
      .filter({ hasText: "" + expandMenu + "" })
      .locator("svg")
      .click();
  }

  async expandHistorySection() {
    await this.page.locator("span").filter({ hasText: "History" }).locator("svg").click();
  }

  async expandCommentsSection() {
    await this.page.locator("span").filter({ hasText: "History" }).locator("svg").click();
  }

  async expandCommentsMenu() {
    await this.page.locator(".tiptap").first().click();
    await this.page.getByTestId("button_comment-actions-menu").click();
  }

  async clickEditFromMenu() {
    await this.page.getByRole("menuitem", { name: "Edit" }).click();
  }

  async clickDeleteFromMenu() {
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
  }

  async createNewWorkSpaceFromSearchBar(workspaceName: string, newWorkspaceType: NewWorkspaceType) {
    const workspaceText = newWorkspaceType === "blank" ? "Blank Workspace" : "Engineering Workspace";
    await this.page.getByPlaceholder("Enter here").click();
    await this.page.getByPlaceholder("Enter here").fill(workspaceName);
    await this.page.locator("label").filter({ hasText: workspaceText }).locator("span").first().click();
    await this.page.waitForTimeout(1000);
    await this.page.getByRole("button", { name: "Create", exact: true }).click();
    return this.getWorkspaceID();
  }

  async getWorkspaceID() {
    const workspaceRegex = /.*workspaces\/(?<workspaceId>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12})\/.*/;
    await this.page.waitForURL(workspaceRegex, { timeout: 20000 });
    const currentUrl = this.page.url();
    const match = currentUrl.match(workspaceRegex);
    return match?.groups?.workspaceId;
  }

  async createNewWorkSpaceFromMainMenu(workspaceName: string) {
    await this.page.getByText("Create workspace").first().click();
    await this.page.getByPlaceholder("Enter here").click();
    await this.page.getByPlaceholder("Enter here").fill(workspaceName);
    await this.page.locator("label").filter({ hasText: "Blank Workspace" }).locator("span").first().click();
    await this.page.getByRole("button", { name: "Create", exact: true }).click();
    await this.page.waitForTimeout(1000);
  }

  async openUrlAndGoToWorkspace() {
    await this.page.goto("/settings/workspaces");
  }

  async openUrlAndCreateTestWorkspace(workspaceName: string, newWorkspaceType: NewWorkspaceType = "blank") {
    await this.openUrlNew();
    const b2bSaasHomePage = new homePage(this.page);
    // If generated name is longer than the maximum allowed length, truncate it
    const workspaceNameMaxLength = 32;
    if (workspaceName.length > workspaceNameMaxLength) {
      workspaceName = workspaceName.slice(0, workspaceNameMaxLength);
    }
    return await b2bSaasHomePage.createNewWorkSpaceFromSearchBar(workspaceName, newWorkspaceType);
  }

  getCurrentWorkspaceID(): string | undefined {
    const workspaceRegex = /.*workspaces\/(?<workspaceId>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12})\/.*/;
    const currentUrl = this.page.url();
    const match = currentUrl.match(workspaceRegex);
    return match?.groups?.workspaceId;
  }

  async openUrlAndCreateEngineeringWorkspace(workspaceName: string, newWorkspaceType: NewWorkspaceType = "engineering") {
    await this.openUrlNew();
    const b2bSaasHomePage = new homePage(this.page);
    return await b2bSaasHomePage.createNewWorkSpaceFromSearchBar(workspaceName, newWorkspaceType);
  }

  async gotoReports() {
    await this.page.getByRole("menu").getByRole("link").nth(3).click();
  }

  async gotoWorkspaces() {
    await this.page.goto("/settings/workspaces", {
      waitUntil: "load",
      timeout: 60000,
    });
    await this.page.setViewportSize({ width: 1700, height: 900 });
  }
  async openUrlNew() {
    this.gotoWorkspaces();
    await this.page.getByTestId("button_add-new-workspace").first().waitFor({ state: "visible", timeout: 120000 });
    await this.page.getByTestId("button_add-new-workspace").first().click();
  }

  async clickIfOpenExists() {
    await this.page.waitForTimeout(3000);
    const openBtn = await this.page.$('[class*="organizations-list--button"]');
    if (await openBtn?.isVisible()) {
      await this.page.getByRole("button", { name: "Open" }).click();
    }
  }

  async clickIfOkayExists() {
    await this.page.waitForTimeout(3000);
    const openBtn = await this.page.$('[class*="organizations-list--button"]');
    if (await openBtn?.isVisible()) {
      await this.page.getByRole("button", { name: "Okay" }).click();
    }
  }

  async clickBackToWorkspacesIfExists() {
    const spinner = ".bp5-spinner-head";
    await this.page.waitForSelector("text=Loading organizationWorkspace.", { state: "hidden", timeout: 15000 });
    await this.page.waitForSelector("" + spinner + "", { state: "hidden", timeout: 15000 });
    try {
      await this.page.waitForSelector("#app > div.bp5-non-ideal-state.bp5-non-ideal-state-vertical > a > span", {
        state: "visible",
        timeout: 15000,
      });
    } catch (error) {
      // We can safely ignore this error
    }

    let backToWorkspaceBtn = false;
    for (let i = 0; i < 3; i++) {
      if (
        (await this.page.locator("#app > div.bp5-non-ideal-state.bp5-non-ideal-state-vertical > a > span").isVisible()) &&
        !backToWorkspaceBtn
      ) {
        await this.page.getByRole("link", { name: "Back to Workspaces" }).click();
        backToWorkspaceBtn = true;
        await this.page.waitForTimeout(2000);
        await this.page.getByRole("button", { name: "Create workspace" }).first().click();
        break;
      }
    }
    if (!backToWorkspaceBtn) {
      if (
        await this.page
          .locator(
            "#app > div.component--pane-group.flex.flex-1.overflow-hidden.component--workspaces-layout div.flex.gap-2.items-center > div:nth-child(3) > button"
          )
          .isVisible()
      ) {
        this.clickIfOpenExists;
        await this.page.getByRole("button", { name: "Create workspace" }).first().click();
      } else {
        await this.page.waitForTimeout(2000);
        await this.page.getByTestId("button_workspace").click();
        await this.page.getByRole("menuitem", { name: "New Workspace" }).click();
      }
    }
  }

  async searchAndclickTestWorkspace() {
    //
    await this.searchWorkspace("AutomatedTest_");

    if (await this.page.getByRole("heading", { name: 'Can\'t find workspace for "AutomatedTest_"' }).isVisible()) {
      await this.page.getByRole("button", { name: "Create workspace" }).nth(1).click();
      await this.page.getByPlaceholder("Enter here").fill("Automated_test");
      await this.page.getByText("Engineering WorkspaceThese workspaces come pre-populated with common attributes.").click();
      await this.page.getByPlaceholder("Enter here").click();
      await this.page.getByPlaceholder("Enter here").fill("AutomatedTest_" + faker.internet.userName());
      await this.page.getByRole("button", { name: "Create", exact: true }).click();
      await this.page.getByRole("link", { name: "Modeling" }).click();
    } else {
      await this.page.locator(`.${Classes.MENU_ITEM}.${Classes.POPOVER_DISMISS}`).first().click();
    }
  }

  async openUrl() {
    await this.openUrlNew();
  }

  async clickProfile() {
    await this.page.getByTestId("button_user-menu").click();
  }

  async clickSignout() {
    await this.page.getByRole("menuitem", { name: "Sign Out" }).click();
  }

  async clickb2bSaas() {
    await this.page.getByRole("link", { name: "b2bSaas logo" });
  }

  async clickInbox() {
    await this.page.getByTestId("nav-link_menu-pane_inbox").click();
  }

  async clickRequirements() {
    await this.page.getByTestId("nav-link_menu-pane_requirements").click();
  }

  async clickKnowledgebase() {
    await this.page.getByTestId("nav-link_menu-pane_knowledgebase").click();
  }

  async clickModelling() {
    await this.page.getByTestId("nav-link_menu-pane_modeling").click();
  }

  async clickModellConfiguration() {
    await this.page.getByTestId("nav-link_model-configuration").locator("div").first().click();
  }

  async clickPropertiesFromModellConfiguration() {
    await this.page.getByTestId("nav-link_properties").click();
  }

  async clickBlocks() {
    await this.page.getByTestId("nav-link_menu-pane_blocks").click();
  }

  async clickStatuses() {
    await this.page.getByTestId("nav-link_statuses").click();
  }

  async clickPropertiesFromMenu() {
    await this.page.getByRole("link", { name: "Properties" }).click();
  }

  async clickAccountInfoIconFromToprightCorner() {
    await this.page.getByRole("button", { name: "User avatar b2bSaas Testing" }).click();
    await this.page.getByRole("heading", { name: "Account" }).click();
  }

  async clickWorkspace() {
    await this.page.getByRole("button", { name: "Workspace" }).click();
  }

  async expandWorkspaceOptions() {
    await this.page.locator(`.h-\\[42px\\] > .${Classes.BUTTON}`).first().click();
  }

  async hideWorkspaceOptions() {
    await this.page.getByRole("button", { name: "Workspace" }).click();
  }

  async clickWorkspaces() {
    await this.page.getByText("Workspaces").click();
  }

  async deleteTestWorkspaces() {
    const len = (await this.page.$$(".workspace-list-row td")).length;
    let textContent;
    for (let i = 0; i < len - 1; i++) {
      const element = (await this.page.$$(".workspace-list-row td"))[i];
      if (element) {
        textContent = await element.textContent();
        if (textContent?.includes("AutomatedTest_") && !textContent?.includes("(current)")) {
          const row = await this.page.getByRole("row", { name: "" + textContent }).first();
          const button = await row.getByRole("button", { name: "Actions" });
          await button.click();
          await this.page.waitForTimeout(1000);
          await this.page.getByRole("menuitem", { name: "Delete" }).first().click();
          await this.page.waitForTimeout(1000);
        }
      }
    }
  }

  async deleteWsFromSettings(workspaceName: string) {
    await this.page.getByPlaceholder("Search for workspace").fill(workspaceName);
    await this.page.getByPlaceholder("Search for workspace").click();
    await this.page.getByTestId("button_show-menu").first().click();
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
    await this.confirmDeleteWorkspace();
  }

  async deleteWorkspace(workspaceName: string) {
    await this.page.waitForTimeout(3000);

    if (await this.page.getByLabel("Close").isVisible()) {
      await this.page.getByLabel("Close").click();
    }

    if (await this.page.getByRole("link", { name: "" + workspaceName + "" }).isVisible()) {
      await this.page.getByRole("link", { name: "" + workspaceName + "" }).click();
    }

    await this.page.getByRole("button", { name: "" + workspaceName + "" }).click();
    await this.page.waitForTimeout(2000);
    await this.page.getByTestId("menu-item_delete-workspace").click();
    await this.confirmDeleteWorkspace(workspaceName);
  }

  async deleteWorkspaceByID(workspaceId: string) {
    const apiContext = await apiHelper.prepareRequest();
    const response = await apiContext.delete(`v1/workspace/${workspaceId}`);
    const status = response.status();
    if (status !== 200 && status !== 204) {
      console.warn(`Problem deleting workspace ${workspaceId}: ${status}`);
    }
  }

  async confirmDeleteWorkspace(workspaceName?: string) {
    const workspaceNameConfirmation = await this.page.getByTestId("input_name-confirmation");
    const workspaceNameText = await this.page.getByTestId("text_workspace-name").textContent();
    await workspaceNameConfirmation.click();
    await workspaceNameConfirmation.fill((workspaceName || workspaceNameText) ?? "");
    await workspaceNameConfirmation.click();
    await this.page.getByTestId("button_delete").click();
  }

  async deleteCurrentOpenWorkspace(workspaceName: string) {
    await this.page.getByTestId("button_user-menu").click();
    await this.page.getByTestId("menu-item_settings").click();
    await this.page.getByTestId("nav-link_settings_menu_workspaces").click();
    await this.page.getByPlaceholder("Search for workspace").click();
    await this.page.getByPlaceholder("Search for workspace").fill(workspaceName);
    await this.page.getByTestId("button_show-menu").first().click();
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
    await this.page.getByTestId("input_name-confirmation").click();
    await this.confirmDeleteWorkspace(workspaceName);
  }
  async clickUserTeamAndSettings() {
    await this.page.getByRole("menuitem", { name: "Settings" }).click();
  }

  async closeOpenDialog() {
    await this.page.getByRole("dialog", { name: "Settings" }).getByRole("button", { name: "Close" }).click();
  }

  async searchWorkspace(workspaceName: string) {
    await this.page.getByPlaceholder("Search for workspace").click();
    await this.page.getByPlaceholder("Search for workspace").fill(workspaceName);
  }

  async searchWorkspaceAndGoToWorkspace(workspaceName: string) {
    await this.page.getByPlaceholder("Search for workspace").click();
    await this.page.getByPlaceholder("Search for workspace").fill(workspaceName);
    await this.page.locator(`.${Classes.MENU_ITEM}.${Classes.POPOVER_DISMISS}`).first().click();
  }

  async switchToPreviousTab(page: Page) {
    // Get all open pages within the current context
    const pages = await page.context().pages();

    // Find the index of the current page in the list
    const currentPageIndex = pages.indexOf(page);

    // Switch to the previous tab
    const previousPageIndex = currentPageIndex - 1;
    if (previousPageIndex >= 0) {
      const previousPage = pages[previousPageIndex];
      await previousPage.bringToFront();
    }
  }
  
}
