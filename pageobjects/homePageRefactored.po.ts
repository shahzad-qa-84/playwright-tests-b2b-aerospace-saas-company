import { faker } from "@faker-js/faker";
import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";
import { apiHelper } from "../apiutils/apiHelper";
import { NAVIGATION, SELECTORS, FORM_FIELDS, TEST_DATA } from "../utilities/constants";

type NewWorkspaceType = "engineering" | "blank";

/**
 * Home Page Object - Refactored Version
 * Main navigation and workspace management functionality
 */
export class HomePage extends BasePage {
  // Navigation Elements
  private readonly settingsMenuItem: Locator;
  private readonly analysisMenuItem: Locator;
  private readonly dataSourcesMenuItem: Locator;
  private readonly dataSinksMenuItem: Locator;
  private readonly hardwareCatalogMenuItem: Locator;
  private readonly bomMenuItem: Locator;
  private readonly importsMenuItem: Locator;
  private readonly modelConfigMenuItem: Locator;
  private readonly modelingMenuItem: Locator;

  // Header Elements
  private readonly downArrowButton: Locator;
  private readonly closeButton: Locator;
  private readonly helpButton: Locator;
  private readonly menuToggleButton: Locator;

  // Workspace Elements
  private readonly workspaceSearchInput: Locator;
  private readonly createWorkspaceButton: Locator;
  private readonly createButton: Locator;
  private readonly workspaceOptions: Locator;

  // Discussion Elements
  private readonly discussionTab: Locator;
  private readonly commentsEditor: Locator;
  private readonly sendCommentButton: Locator;
  private readonly historyButton: Locator;

  // Child Blocks Elements
  private readonly childBlocksTab: Locator;

  // Attachments Elements
  private readonly attachmentsTab: Locator;
  private readonly gridViewButton: Locator;
  private readonly addAttachmentButton: Locator;
  private readonly contextMenuButton: Locator;
  private readonly deleteAttachmentButton: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize navigation locators
    this.settingsMenuItem = this.getByTestId(NAVIGATION.SETTINGS);
    this.analysisMenuItem = this.getByTestId(NAVIGATION.ANALYSIS);
    this.dataSourcesMenuItem = this.getByTestId(NAVIGATION.DATA_SOURCES);
    this.dataSinksMenuItem = this.getByText("Data sinks");
    this.hardwareCatalogMenuItem = this.getByTestId(NAVIGATION.HARDWARE_CATALOG);
    this.bomMenuItem = this.getByTestId(NAVIGATION.BOM);
    this.importsMenuItem = this.getByTestId(NAVIGATION.IMPORTS);
    this.modelConfigMenuItem = this.getByTestId("nav-link_model-configuration");
    this.modelingMenuItem = this.getByTestId(NAVIGATION.MODELING);

    // Initialize header locators
    this.downArrowButton = this.locator(`#app > div.component--bar button > span.${SELECTORS.ICON}.${SELECTORS.ICON}-chevron-down > svg`);
    this.closeButton = this.getByLabel("Close");
    this.helpButton = this.getByRole("button", { name: "Help" });
    this.menuToggleButton = this.getByTestId("button_menu-pane_toggle");

    // Initialize workspace locators
    this.workspaceSearchInput = this.getByPlaceholder("Enter here");
    this.createWorkspaceButton = this.getByText("Create workspace").first();
    this.createButton = this.getByRole("button", { name: "Create", exact: true });
    this.workspaceOptions = this.locator("label");

    // Initialize discussion locators
    this.discussionTab = this.getByText("Discussion");
    this.commentsEditor = this.locator(".tiptap");
    this.sendCommentButton = this.getByTestId("button_comment-editor-send");
    this.historyButton = this.getByTestId("button_toggle-history-and-comments-panel");

    // Initialize child blocks locators
    this.childBlocksTab = this.getByText("Child Blocks");

    // Initialize attachments locators
    this.attachmentsTab = this.getByText("Attachments");
    this.gridViewButton = this.getByTestId("button_attachment-view-type-switcher_grid");
    this.addAttachmentButton = this.locator("span").filter({ hasText: "Add Attachment" }).first();
    this.contextMenuButton = this.getByTestId("button_more-options_attachment-context-menu");
    this.deleteAttachmentButton = this.getByTestId("menu-item_delete");
  }

  // Navigation Methods
  async clickSettings(): Promise<void> {
    await this.safeClick(this.settingsMenuItem);
  }

  async clickAnalysis(): Promise<void> {
    await this.safeClick(this.analysisMenuItem);
  }

  async clickDataSources(): Promise<void> {
    await this.safeClick(this.dataSourcesMenuItem);
  }

  async clickDataSink(): Promise<void> {
    await this.safeClick(this.dataSinksMenuItem);
  }

  async clickBillOfMaterials(): Promise<void> {
    await this.safeClick(this.hardwareCatalogMenuItem);
    await this.safeClick(this.bomMenuItem);
  }

  async clickHardwareCatalog(): Promise<void> {
    await this.safeClick(this.hardwareCatalogMenuItem);
  }

  async clickImports(): Promise<void> {
    await this.safeClick(this.importsMenuItem);
  }

  async clickModelling(): Promise<void> {
    await this.safeClick(this.modelingMenuItem);
  }

  async clickMoreConfigurations(): Promise<void> {
    await this.safeClick(this.modelConfigMenuItem);
  }

  // Header Actions
  async expandModellingMenu(): Promise<void> {
    await this.safeClick(this.menuToggleButton);
  }

  async clickHelp(): Promise<void> {
    await this.safeClick(this.helpButton);
  }

  async clickClose(): Promise<void> {
    await this.safeClick(this.closeButton);
  }

  async clickDownArrowFromTopBar(): Promise<void> {
    await this.safeClick(this.downArrowButton);
  }

  // Workspace Management
  async createNewWorkSpaceFromSearchBar(workspaceName: string, newWorkspaceType: NewWorkspaceType = "blank"): Promise<string | undefined> {
    const workspaceText = newWorkspaceType === "blank" ? "Blank Workspace" : "Engineering Workspace";
    
    await this.safeClick(this.workspaceSearchInput);
    await this.safeFill(this.workspaceSearchInput, workspaceName);
    await this.safeClick(this.workspaceOptions.filter({ hasText: workspaceText }).locator("span").first());
    await this.wait(1000);
    await this.safeClick(this.createButton);
    
    return this.getWorkspaceID();
  }

  async createNewWorkSpaceFromMainMenu(workspaceName: string): Promise<void> {
    await this.safeClick(this.createWorkspaceButton);
    await this.safeClick(this.workspaceSearchInput);
    await this.safeFill(this.workspaceSearchInput, workspaceName);
    await this.safeClick(this.workspaceOptions.filter({ hasText: "Blank Workspace" }).locator("span").first());
    await this.safeClick(this.createButton);
    await this.wait(1000);
  }

  async getWorkspaceID(): Promise<string | undefined> {
    const workspaceRegex = /.*workspaces\/(?<workspaceId>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12})\/.*/;
    await this.page.waitForURL(workspaceRegex, { timeout: 20000 });
    const currentUrl = this.getCurrentUrl();
    const match = currentUrl.match(workspaceRegex);
    return match?.groups?.workspaceId;
  }

  // High-level workspace creation methods
  async openUrlAndCreateTestWorkspace(workspaceName?: string, workspaceType: NewWorkspaceType = "blank"): Promise<string | undefined> {
    const wsName = workspaceName || "AutomatedTest_" + faker.internet.userName();
    await this.navigateTo(process.env.BASE_URL || "");
    return await this.createNewWorkSpaceFromSearchBar(wsName, workspaceType);
  }

  async openUrlAndCreateEngineeringWorkspace(workspaceName?: string): Promise<string | undefined> {
    return await this.openUrlAndCreateTestWorkspace(workspaceName, "engineering");
  }

  // Discussion Methods
  async clickDiscussion(): Promise<void> {
    await this.page.waitForLoadState();
    await this.safeClick(this.discussionTab);
  }

  async addComment(message: string): Promise<void> {
    await this.wait(500);
    await this.page.waitForSelector(".tiptap.ProseMirror");
    await this.safeClick(this.getByRole("paragraph"));
    await this.wait(500);
    await this.safeFill(this.commentsEditor, message);
    await this.wait(500);
    await this.safeClick(this.sendCommentButton);
  }

  async clickHistory(): Promise<void> {
    await this.safeClick(this.historyButton);
  }

  // Child Blocks Methods
  async clickChildBlocks(): Promise<void> {
    await this.safeClick(this.childBlocksTab);
  }

  // Attachments Methods
  async clickAttachments(): Promise<void> {
    await this.safeClick(this.attachmentsTab);
  }

  async clickGridView(): Promise<void> {
    await this.safeClick(this.gridViewButton);
  }

  async clickAddAttachment(): Promise<void> {
    await this.safeClick(this.addAttachmentButton);
  }

  async clickContextMenuGridView(): Promise<void> {
    await this.safeClick(this.contextMenuButton);
  }

  async clickDeleteAttachment(): Promise<void> {
    await this.safeClick(this.deleteAttachmentButton);
  }

  // Icon Management
  async changeSystemIcon(iconCategory: string, iconName: string): Promise<void> {
    await this.safeClick(this.getByTestId("button_show-icon-selector-menu").first());
    await this.page.getByText(iconCategory).first().hover();
    await this.safeClick(this.getByRole("menuitem", { name: iconName }));
  }

  // Project Management
  async clickProjectManagement(): Promise<void> {
    await this.safeClick(this.getByTestId("button_toggle-side-panel").nth(1));
  }

  // Workspace Navigation
  async openUrlAndGoToWorkspace(): Promise<void> {
    await this.navigateTo("/settings/workspaces");
  }

  // Search and Filter
  async searchForWorkspace(workspaceName: string): Promise<void> {
    await this.safeFill(this.getByPlaceholder(FORM_FIELDS.PLACEHOLDERS.SEARCH), workspaceName);
  }
}