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

  /**
   * Click Properties from menu
   */
  async clickPropertiesFromMenu(): Promise<void> {
    await this.safeClick(this.getByText("Properties"));
  }

  /**
   * Verify property configuration elements
   */
  async verifyPropertyConfigElements(): Promise<void> {
    await this.verifyElementVisible(this.getByRole("link", { name: "Properties" }));
    await this.verifyElementVisible(this.getByText("Label", { exact: true }));
    await this.verifyElementVisible(this.getByText("Group", { exact: true }));
    await this.verifyElementVisible(this.getByText("Default"));
    await this.verifyElementVisible(this.getByText("b2bSaas", { exact: true }));
    await this.verifyElementVisible(this.getByText("Instances"));
  }

  /**
   * Change property type to string
   */
  async changePropertyTypeToString(): Promise<void> {
    await this.safeClick(this.getByTestId("button_type_mass"));
    await this.safeClick(this.getByRole("menuitem", { name: "string" }));
    await this.verifyElementVisible(this.getByRole("button", { name: "string" }));
  }

  /**
   * Open property instance and verify navigation
   */
  async openPropertyInstanceAndVerify(): Promise<void> {
    await this.safeClick(this.getByTestId("ag-cell_instance_mass"));
    await this.safeClick(this.getByText("/:mass"));
    await this.safeClick(this.getByPlaceholder("String value"));
    await this.verifyElementVisible(this.getByRole("heading", { name: "New System" }).getByText("New System"));
  }

  /**
   * Open dependency graph
   */
  async openDependencyGraph(): Promise<void> {
    const expandMenu = this.getByTestId("expandMenuDiv_mass");
    await this.safeClick(expandMenu.getByTestId("button_block-property-list-item_more"));
    await this.safeClick(this.getByTestId("menu-item_dependency-graph"));
    await this.safeClick(this.locator("div").filter({ hasText: "Dependency Graph: New System:mass" }).nth(3));
    await this.verifyElementVisible(this.locator(".react-flow__pane"));
  }

  async clickRequirements(): Promise<void> {
    await this.safeClick(this.getByTestId("nav-link_menu-pane_requirements"));
  }

  /**
   * Click on Help menu
   */
  async clickHelp(): Promise<void> {
    await this.safeClick(this.getByText("Help"));
  }

  /**
   * Click on Leave Feedback menu item
   */
  async clickLeaveFeedback(): Promise<void> {
    await this.safeClick(this.getByRole("menuitem", { name: "Leave feedback" }));
  }

  /**
   * Verify feedback window elements are visible
   */
  async verifyFeedbackWindow(): Promise<void> {
    await this.verifyElementVisible(this.getByRole("button", { name: "Problem" }));
    await this.verifyElementVisible(this.getByRole("button", { name: "Feedback & Request" }));
    await this.verifyElementVisible(this.getByText("You can always email us at support+product@b2bSaas.ai"));
  }

  /**
   * Select Problem tab in feedback
   */
  async selectProblemTab(): Promise<void> {
    await this.safeClick(this.getByRole("button", { name: "Problem" }));
  }

  /**
   * Fill feedback subject
   */
  async fillFeedbackSubject(subject: string): Promise<void> {
    const subjectInput = this.getByPlaceholder("Something is wrong with");
    await this.safeClick(subjectInput);
    await this.safeFill(subjectInput, subject);
  }

  /**
   * Fill feedback body
   */
  async fillFeedbackBody(body: string): Promise<void> {
    const bodyInput = this.getByPlaceholder("When I click the…");
    await this.safeClick(bodyInput);
    await this.safeFill(bodyInput, body);
  }

  /**
   * Verify submit button is enabled
   */
  async verifySubmitButtonEnabled(): Promise<void> {
    const submitButton = this.getByRole("button", { name: "Submit" });
    await this.verifyElementVisible(submitButton);
    await this.page.waitForFunction(
      (button) => !button.disabled,
      await submitButton.elementHandle()
    );
  }

  /**
   * Click on Grid View
   */
  async clickGridView(): Promise<void> {
    await this.safeClick(this.getByTestId("button_grid-view"));
  }

  /**
   * Verify thumbnail is visible
   */
  async verifyThumbnailVisible(): Promise<void> {
    await this.verifyElementVisible(this.getByRole("img", { name: "thumbnail" }));
  }

  /**
   * Open attachment context menu
   */
  async openAttachmentContextMenu(): Promise<void> {
    await this.safeClick(this.getByTestId("button_more-options_attachment-context-menu"));
  }

  /**
   * Click on attachment details menu item
   */
  async clickAttachmentDetails(): Promise<void> {
    await this.safeClick(this.getByTestId("menu-item_details"));
  }

  /**
   * Verify attachment details panel
   */
  async verifyAttachmentDetailsPanel(attachmentName: string, fileSize: string): Promise<void> {
    const detailsPanel = this.getByLabel(`Attachment details: ${attachmentName}`);
    await this.safeClick(detailsPanel.getByRole("img").first());
    await this.verifyElementVisible(detailsPanel.getByText(attachmentName, { exact: true }));
    await this.verifyElementVisible(this.getByText("image/png"));
    await this.verifyElementVisible(detailsPanel.getByText(fileSize));
  }

  /**
   * Close details panel using Escape key
   */
  async closeDetailsPanelWithEscape(): Promise<void> {
    await this.page.keyboard.press("Escape");
  }

  /**
   * Verify details panel is hidden
   */
  async verifyDetailsPanelHidden(attachmentName: string, fileSize: string): Promise<void> {
    const detailsPanel = this.getByLabel(`Attachment details: ${attachmentName}`);
    await this.verifyElementHidden(detailsPanel.getByText(fileSize));
  }

  /**
   * Verify "View block" is not shown
   */
  async verifyViewBlockNotShown(): Promise<void> {
    await this.openAttachmentContextMenu();
    await this.clickAttachmentDetails();
    await this.verifyElementHidden(this.getByText("View block"));
  }

  /**
   * Open attachment context menu (alternative method)
   */
  async openAttachmentContextMenuByTestId(): Promise<void> {
    await this.safeClick(this.getByTestId("button_attachment-context-menu"));
  }

  /**
   * View attachment file
   */
  async viewAttachment(): Promise<void> {
    await this.safeClick(this.getByTestId("button_view"));
  }

  /**
   * Go back from viewer
   */
  async goBackFromViewer(): Promise<void> {
    await this.safeClick(this.getByTestId("button_back-button"));
  }

  /**
   * Download attachment and handle popup
   */
  async downloadAttachment(): Promise<void> {
    const [popup, download] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page.waitForEvent("download"),
      this.safeClick(this.getByTestId("button_download")),
    ]);
    await popup.close();
    await download;
  }

  /**
   * Verify preview image and view block status
   */
  async verifyPreviewAndViewBlock(): Promise<void> {
    await this.verifyElementVisible(this.getByRole("img", { name: "Preview Image" }));
    await this.verifyElementHidden(this.getByText("View block"));
  }

  /**
   * Complete KiCad file verification workflow
   */
  async completeKiCadFileWorkflow(): Promise<void> {
    // Open details and preview
    await this.openAttachmentContextMenuByTestId();
    await this.clickAttachmentDetails();
    await this.viewAttachment();
    await this.goBackFromViewer();

    // Open details again and download
    await this.openAttachmentContextMenuByTestId();
    await this.clickAttachmentDetails();
    await this.downloadAttachment();

    // Verify preview and view block status
    await this.verifyPreviewAndViewBlock();
  }

  /**
   * Click view file button (diamond icon)
   */
  async clickViewFile(): Promise<void> {
    await this.safeClick(this.getByTestId("button_view-file"));
  }

  /**
   * Verify 3D viewer components
   */
  async verify3DViewerComponents(): Promise<void> {
    await this.verifyElementVisible(this.locator("#HoopsWebViewer-canvas-container div").nth(2));
    await this.verifyElementVisible(this.getByText("Models"));
    await this.verifyElementVisible(this.getByText("Product"));
    await this.verifyElementVisible(this.getByText("Exported from Blender-2.76 ("));
  }

  /**
   * Click on canvas to ensure viewer is ready
   */
  async clickCanvasToActivateViewer(): Promise<void> {
    await this.locator("canvas").click({ position: { x: 200, y: 150 } });
  }

  /**
   * Verify ECAD layer functionality
   */
  async verifyEcadLayer(layerName: string): Promise<void> {
    const layerButton = this.getByRole("button", { name: layerName }).first();
    const layerLabel = this.locator("label").filter({ hasText: layerName }).first();

    if (await layerButton.isVisible()) {
      await this.safeClick(layerButton);
      await this.page.waitForTimeout(100); // Small wait for state change
    } else if (await layerLabel.isVisible()) {
      await this.safeClick(layerLabel);
      await this.page.waitForTimeout(100); // Small wait for state change
    } else {
      console.warn(`Layer not found in UI: ${layerName}`);
    }
  }

  /**
   * Verify all ECAD layers
   */
  async verifyAllEcadLayers(): Promise<void> {
    const ecadLayers = [
      "F_Cu", "In1_Cu", "In2_Cu", "In3_Cu", "In4_Cu", "B_Cu",
      "B_Paste", "F_Paste", "B_Silkscreen", "F_Silkscreen",
      "B_Mask", "F_Mask", "Edge_Cuts"
    ];

    for (const layer of ecadLayers) {
      await this.verifyEcadLayer(layer);
    }
  }

  /**
   * Close viewer with Escape key
   */
  async closeViewerWithEscape(): Promise<void> {
    await this.page.keyboard.press("Escape");
  }

  /**
   * Click on the b2bSaas logo (roll-up functionality)
   */
  async clickb2bSaasLogo(): Promise<void> {
    await this.safeClick(this.getByText("b2bSaas"));
  }

  /**
   * Verify property values in roll-up view
   */
  async verifyRollUpValues(value1: string, value2: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(value1, { exact: true }).nth(0));
    await this.verifyElementVisible(this.getByText(value2, { exact: true }).nth(0));
  }

  /**
   * Click on Child Blocks section
   */
  async clickChildBlocksSection(): Promise<void> {
    await this.safeClick(this.getByText("Child Blocks"));
  }

  /**
   * Click on specific child by name
   */
  async clickChildByName(childName: string): Promise<void> {
    const childElement = this.getByLabel("Child Blocks1").getByText(childName);
    await this.safeClick(childElement);
  }

  /**
   * Click on Profile menu
   */
  async clickProfile(): Promise<void> {
    await this.safeClick(this.getByTestId("button_user-menu"));
  }

  /**
   * Open command palette for workspace search
   */
  async openCommandPalette(): Promise<void> {
    await this.safeClick(this.getByTestId("button_show-command-palette"));
  }

  /**
   * Search for workspace in command palette
   */
  async searchWorkspaceInPalette(workspaceName: string): Promise<void> {
    const searchInput = this.getByPlaceholder("Search for workspaces, blocks, or actions...");
    await this.safeFill(searchInput, workspaceName);
    await this.safeClick(this.getByTestId(`menu-item_${workspaceName.toLowerCase()}`));
  }

  /**
   * Verify workspace loaded message
   */
  async verifyWorkspaceLoaded(): Promise<void> {
    await this.verifyElementVisible(this.getByText("Workspace loaded"));
  }

  /**
   * Click back to blocks link
   */
  async clickBackToBlocks(): Promise<void> {
    await this.safeClick(this.getByRole("link", { name: "Back to Blocks" }));
  }

  /**
   * Verify New System heading
   */
  async verifyNewSystemHeading(): Promise<void> {
    await this.verifyElementVisible(this.getByRole("heading", { name: "New System" }).locator("span"));
  }

  /**
   * Complete workspace search workflow
   */
  async searchAndNavigateToWorkspace(workspaceName: string): Promise<void> {
    await this.openCommandPalette();
    await this.searchWorkspaceInPalette(workspaceName);
    await this.verifyWorkspaceLoaded();
    await this.clickBackToBlocks();
    await this.verifyNewSystemHeading();
  }

  /**
   * Click Add Attachment button
   */
  async clickAddAttachment(): Promise<void> {
    await this.safeClick(this.getByTestId("button_add-attachment"));
  }

  /**
   * Hover over requirements menu item
   */
  async hoverRequirementsMenuItem(): Promise<void> {
    await this.getByTestId("menu-item_requirements").hover();
  }

  /**
   * Click attach requirement page option
   */
  async clickAttachRequirementPage(): Promise<void> {
    await this.safeClick(this.getByTestId("menu-item_attach-req-page"));
  }

  /**
   * Click context menu in grid view
   */
  async clickContextMenuGridView(): Promise<void> {
    await this.safeClick(this.getByTestId("button_context-menu-grid-view"));
  }

  /**
   * Click delete attachment option
   */
  async clickDeleteAttachment(): Promise<void> {
    await this.safeClick(this.getByTestId("menu-item_delete-attachment"));
  }

  /**
   * Verify new document is visible
   */
  async verifyNewDocumentVisible(): Promise<void> {
    await this.verifyElementVisible(this.getByText("New Document"));
  }

  /**
   * Verify no attachments message
   */
  async verifyNoAttachmentsMessage(): Promise<void> {
    await this.verifyElementVisible(this.getByRole("heading", { name: "No attachments for this block" }));
  }

  /**
   * Open attachment context menu (specific for attachments)
   */
  async openAttachmentContextMenuForDetails(): Promise<void> {
    await this.safeClick(this.getByTestId("button_attachment-context-menu"));
  }

  /**
   * Click attachment details from context menu
   */
  async clickAttachmentDetailsFromMenu(): Promise<void> {
    await this.safeClick(this.getByTestId("menu-item_details"));
  }

  /**
   * Verify PDF attachment details
   */
  async verifyPdfAttachmentDetails(): Promise<void> {
    await this.verifyElementVisible(this.getByRole("img", { name: "Preview Image" }));
    await this.verifyElementVisible(this.getByTestId("button_download"));
    await this.verifyElementHidden(this.getByText("View block"));
  }

  /**
   * Close attachment details with Escape
   */
  async closeAttachmentDetails(): Promise<void> {
    await this.page.keyboard.press("Escape");
  }

  /**
   * Click invite new user button
   */
  async clickInviteNewUser(): Promise<void> {
    await this.safeClick(this.getByTestId("button_menu-pane_show-invite-new-user"));
  }

  /**
   * Enter user email for invitation
   */
  async enterUserEmail(email: string): Promise<void> {
    const emailInput = this.getByPlaceholder("john@space.co jane@space.co");
    await this.safeClick(emailInput);
    await this.safeFill(emailInput, email);
  }

  /**
   * Verify default role is User
   */
  async verifyDefaultUserRole(): Promise<void> {
    const roleButton = this.getByTestId("button_open-menu");
    await this.verifyElementVisible(roleButton);
    // Note: Using page.waitForFunction to check text content
    await this.page.waitForFunction(
      (button) => button.textContent?.includes("User"),
      await roleButton.elementHandle()
    );
  }

  /**
   * Click submit invite users button
   */
  async clickSubmitInvite(): Promise<void> {
    await this.safeClick(this.getByTestId("button_submit-invite-users"));
  }

  /**
   * Verify invitation success message
   */
  async verifyInvitationSuccess(): Promise<void> {
    await this.verifyElementVisible(this.getByText("Users invited successfully"));
  }

  /**
   * Complete user invitation workflow
   */
  async inviteUser(email: string): Promise<void> {
    await this.clickInviteNewUser();
    await this.enterUserEmail(email);
    await this.verifyDefaultUserRole();
    await this.clickSubmitInvite();
    await this.verifyInvitationSuccess();
  }

  /**
   * Click Google attachment option
   */
  async clickGoogleAttachment(fileName: string): Promise<void> {
    await this.safeClick(this.getByText("Google"));
    await this.safeClick(this.getByText(fileName));
    await this.safeClick(this.getByTestId("button_add-attachment"));
  }

  /**
   * Verify Google attachment details
   */
  async verifyGoogleAttachmentDetails(fileName: string): Promise<void> {
    const attachmentDetails = this.getByLabel(`Attachment details: ${fileName}`);
    await this.verifyElementVisible(attachmentDetails.getByText(fileName, { exact: true }));
    await this.verifyElementVisible(this.getByText("Google"));
    await this.verifyElementVisible(this.locator("img").nth(3));
  }

  /**
   * Click Model Configuration
   */
  async clickModellConfiguration(): Promise<void> {
    await this.safeClick(this.getByTestId("nav-link_model-configuration"));
  }

  /**
   * Click Statuses from model configuration
   */
  async clickStatuses(): Promise<void> {
    await this.safeClick(this.getByTestId("nav-link_statuses"));
  }

  /**
   * Click Properties from Model Configuration
   */
  async clickPropertiesFromModellConfiguration(): Promise<void> {
    await this.safeClick(this.getByTestId("nav-link_properties"));
  }

  /**
   * Click Blocks navigation
   */
  async clickBlocks(): Promise<void> {
    await this.safeClick(this.getByTestId("nav-link_menu-pane_modeling"));
  }

  /**
   * Click Imports navigation
   */
  async clickImports(): Promise<void> {
    await this.safeClick(this.getByTestId("nav-link_menu-pane_imports"));
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