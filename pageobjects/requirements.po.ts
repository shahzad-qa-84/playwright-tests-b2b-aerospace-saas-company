import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";
import { TEST_DATA, SELECTORS } from "../utilities/constants";

/**
 * Requirements Page Object
 * Handles all requirements and document functionality including creation, editing, and verification
 */
export class RequirementsPage extends BasePage {
  // Main action buttons
  private readonly createRequirementButton: Locator;
  private readonly documentViewButton: Locator;
  private readonly tableViewButton: Locator;
  private readonly moreOptionsButton: Locator;
  private readonly newRowButton: Locator;
  private readonly addRequirementBlockButton: Locator;

  // Document editing elements
  private readonly textEditor: Locator;
  private readonly paragraphRole: Locator;
  private readonly documentActionsMenu: Locator;
  private readonly requirementIdInput: Locator;

  // Image upload elements
  private readonly addImageMenuItem: Locator;
  private readonly uploadImageButton: Locator;
  private readonly fileDropZone: Locator;
  private readonly changeImageButton: Locator;
  private readonly removeImageButton: Locator;
  private readonly closeImageUploaderButton: Locator;

  // Notes functionality
  private readonly addNoteMenuItem: Locator;
  private readonly richTextEditor: Locator;

  // Requirements details panel
  private readonly toggleRequirementDetailsButton: Locator;
  private readonly openLevelDropdownButton: Locator;
  private readonly levelMenuItem: Locator;
  private readonly linkPropertyInput: Locator;
  private readonly verificationMethodDropdown: Locator;
  private readonly demonstrationMenuItem: Locator;
  private readonly manualControlOption: Locator;

  // Comments functionality
  private readonly toggleCommentsButton: Locator;
  private readonly commentCell: Locator;
  private readonly openCommentPopoverButton: Locator;
  private readonly simpleCommentEditor: Locator;
  private readonly sendCommentButton: Locator;
  private readonly commentActionsMenu: Locator;
  private readonly deleteCommentMenuItem: Locator;

  // Verification elements
  private readonly notSetOption: Locator;
  private readonly notVerifiedOption: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize main action buttons
    this.createRequirementButton = this.getByTestId("button_requirements-frame_create");
    this.documentViewButton = this.getByTestId("button_document-view");
    this.tableViewButton = this.getByTestId("button_table-view");
    this.moreOptionsButton = this.getByTestId("button_more-options_open-title-options-menu");
    this.newRowButton = this.getByTestId("button_new-row");
    this.addRequirementBlockButton = this.getByTestId("menu-item_add-requirement-block");

    // Initialize document editing elements
    this.textEditor = this.getByTestId("editor-content_text");
    this.paragraphRole = this.getByRole("paragraph");
    this.documentActionsMenu = this.getByTestId("button_document-actions-nav_drag");
    this.requirementIdInput = this.getByTestId("input_requirement-id-input");

    // Initialize image upload elements
    this.addImageMenuItem = this.getByTestId("menu-item_add-image");
    this.uploadImageButton = this.getByTestId("button_upload-image");
    this.fileDropZone = this.getByTestId("input_file-drop-zone");
    this.changeImageButton = this.locator("div").filter({ hasText: /^Change image$/ }).nth(4);
    this.removeImageButton = this.getByTestId("button_remove");
    this.closeImageUploaderButton = this.getByTestId("button_close-image-uploader");

    // Initialize notes functionality
    this.addNoteMenuItem = this.getByTestId("menu-item_add-note");
    this.richTextEditor = this.getByTestId("editor-content_rich-text-editor");

    // Initialize requirements details panel
    this.toggleRequirementDetailsButton = this.getByTestId("button_toggle-requirement-details-panel");
    this.openLevelDropdownButton = this.getByTestId("button_open-level-dropdown");
    this.levelMenuItem = this.getByTestId("menu-item_dropdown-menu-item-2");
    this.linkPropertyInput = this.getByTestId("side-panel_sliding-panel").getByPlaceholder("Link property...");
    this.verificationMethodDropdown = this.getByTestId("button_open-verification-method-dropdown");
    this.demonstrationMenuItem = this.getByTestId("menu-item_dropdown-menu-item-demonstration");
    this.manualControlOption = this.getByTestId("control-option_manual");

    // Initialize comments functionality
    this.toggleCommentsButton = this.getByTestId("button_toggle-comments-panel");
    this.commentCell = this.getByTestId("commentCell");
    this.openCommentPopoverButton = this.getByTestId("button_open-comment-popover");
    this.simpleCommentEditor = this.getByTestId("editor-content_simple-comment-editor");
    this.sendCommentButton = this.getByTestId("button_simple-comment-editor-send");
    this.commentActionsMenu = this.getByTestId("button_comment-actions-menu");
    this.deleteCommentMenuItem = this.getByTestId("menu-item_delete");

    // Initialize verification elements
    this.notSetOption = this.locator("label").filter({ hasText: "Not set" }).locator("span");
    this.notVerifiedOption = this.getByText("Not Verified");
  }

  /**
   * Create a new requirement document
   */
  async createNewRequirement(): Promise<void> {
    await this.safeClick(this.createRequirementButton);
  }

  /**
   * Switch to document view
   */
  async switchToDocumentView(): Promise<void> {
    await this.safeClick(this.documentViewButton);
  }

  /**
   * Switch to table view
   */
  async switchToTableView(): Promise<void> {
    await this.safeClick(this.tableViewButton);
  }

  /**
   * Open more options menu and close overlay
   */
  async openAndCloseMoreOptions(): Promise<void> {
    await this.safeClick(this.moreOptionsButton);
    await this.safeClick(this.locator(".bp5-overlay-backdrop"));
  }

  /**
   * Add a new requirement block
   */
  async addRequirementBlock(): Promise<void> {
    await this.switchToTableView();
    await this.safeClick(this.newRowButton);
    await this.safeClick(this.addRequirementBlockButton);
    await this.switchToDocumentView();
  }

  /**
   * Add text content to requirement
   */
  async addRequirementText(text: string): Promise<void> {
    await this.safeClick(this.paragraphRole);
    await this.safeFill(this.textEditor, text);
  }

  /**
   * Complete image upload workflow
   */
  async addImageToRequirement(imagePath: string = "./resources/flower.png"): Promise<void> {
    await this.safeClick(this.documentActionsMenu);
    await this.safeClick(this.addImageMenuItem);
    await this.safeClick(this.uploadImageButton);
    await this.uploadFile(this.fileDropZone, imagePath);
    await this.safeClick(this.changeImageButton);
    await this.safeClick(this.removeImageButton);
    await this.safeClick(this.uploadImageButton);
    await this.safeClick(this.closeImageUploaderButton);
    await this.verifyElementHidden(this.closeImageUploaderButton);
  }

  /**
   * Add and edit a note
   */
  async addAndEditNote(noteText: string, editedText: string): Promise<void> {
    await this.safeClick(this.documentActionsMenu);
    await this.safeClick(this.addNoteMenuItem);
    await this.safeFill(this.richTextEditor, noteText);
    
    // Select all text and edit
    await this.safeClick(this.getByText(noteText));
    await this.richTextEditor.press("ControlOrMeta+a");
    await this.safeClick(this.getByText(noteText));
    await this.safeFill(this.richTextEditor, editedText);
    
    await this.verifyElementVisible(this.getByText(editedText));
  }

  /**
   * Verify requirement text is visible in table view
   */
  async verifyRequirementInTableView(requirementText: string): Promise<void> {
    await this.switchToTableView();
    await this.safeClick(this.getByText(requirementText));
    await this.switchToDocumentView();
  }

  /**
   * Set requirement level
   */
  async setRequirementLevel(): Promise<void> {
    await this.safeClick(this.toggleRequirementDetailsButton);
    await this.safeClick(this.openLevelDropdownButton);
    await this.safeClick(this.levelMenuItem);
  }

  /**
   * Verify level is displayed in table view
   */
  async verifyLevelInTableView(): Promise<void> {
    await this.switchToTableView();
    await this.verifyElementVisible(this.getByRole("gridcell", { name: "2" }).locator("span").nth(2));
  }

  /**
   * Change requirement ID/name
   */
  async changeRequirementId(newId: string): Promise<void> {
    await this.switchToDocumentView();
    await this.safeClick(this.locator("#REQUIREMENTS_CONTAINER_ID").getByText("ROL-"));
    await this.requirementIdInput.press("ControlOrMeta+a");
    await this.safeFill(this.requirementIdInput, newId);
    await this.requirementIdInput.press("Enter");
  }

  /**
   * Configure requirement verification
   */
  async configureVerificationMethod(): Promise<void> {
    await this.switchToDocumentView();
    await this.safeClick(this.getByTestId("side-panel_sliding-panel").getByText("None"));
    await this.safeClick(this.linkPropertyInput);
    await this.linkPropertyInput.press("Escape");
    await this.safeClick(this.verificationMethodDropdown);
    await this.safeClick(this.demonstrationMenuItem);
    await this.safeClick(this.getByText("Success Criteria"));
    await this.safeClick(this.manualControlOption);
  }

  /**
   * Set verification status
   */
  async setVerificationStatus(): Promise<void> {
    await this.switchToDocumentView();
    await this.safeClick(this.notSetOption);
    await this.safeClick(this.notVerifiedOption);
    await this.verifyElementVisible(this.getByText("Pass"));
  }

  /**
   * Add comment to requirement
   */
  async addComment(commentText: string): Promise<void> {
    await this.safeClick(this.toggleCommentsButton);
    await this.switchToTableView();
    await this.commentCell.hover();
    await this.safeClick(this.openCommentPopoverButton);
    await this.safeFill(this.simpleCommentEditor, commentText);
    await this.safeClick(this.sendCommentButton);
  }

  /**
   * Verify comment appears in timeline
   */
  async verifyCommentInTimeline(commentText: string): Promise<void> {
    await this.safeClick(this.getByTestId("side-panel_sliding-panel").getByText("just now"));
    await this.verifyElementVisible(this.getByTestId("side-panel_sliding-panel").getByText(commentText));
    await this.verifyElementVisible(this.locator("span").filter({ hasText: commentText }).getByRole("paragraph"));
  }

  /**
   * Delete comment and verify removal
   */
  async deleteComment(): Promise<void> {
    await this.safeClick(this.commentActionsMenu);
    await this.safeClick(this.deleteCommentMenuItem);
    await this.verifyElementVisible(this.getByRole("heading", { name: "No comments yet" }));
  }

    /**
   * Click new document button
   */
  async clickNewDocument(): Promise<void> {
    await this.safeClick(this.getByTestId("button_new-document"));
  }

  /**
   * Upload CSV file for requirements import
   */
  async uploadCsvFile(filePath: string = "./resources/requirements.csv"): Promise<void> {
    await this.safeClick(this.getByTestId("button_create-req-page"));
    await this.safeClick(this.getByTestId("button_import-csv"));
    await this.uploadFile(this.fileDropZone, filePath);
    await this.safeClick(this.getByTestId("button_csv-submit-catalog-item"));
  }

  /**
   * Verify CSV imported data is visible
   */
  async verifyCsvImportedData(): Promise<void> {
    await this.verifyElementVisible(this.getByText("Unnamed block"));
    await this.verifyElementVisible(this.getByText("This is a sample block"));
    await this.verifyElementVisible(this.getByRole("gridcell", { name: "PN-0012345" }));
    await this.verifyElementVisible(this.getByText("None"));
    await this.verifyElementVisible(this.getByTestId("button_cell-dropdown_automatic"));
    await this.verifyElementVisible(this.getByRole("gridcell", { name: "cube" }));
  }

  /**
   * Verify data persists after page reload
   */
  async verifyDataPersistence(): Promise<void> {
    await this.reloadPage();
    await this.verifyElementVisible(this.getByText("Unnamed block"));
    await this.verifyElementVisible(this.getByText("This is a sample block"));
  }

  /**
   * Edit imported requirement fields
   */
  async editImportedFields(): Promise<void> {
    // Edit the unnamed block
    await this.safeClick(this.getByText("Unnamed block"));
    await this.safeFill(this.richTextEditor, "Unnamed block 0 edited");
    await this.verifyElementVisible(this.getByText("Unnamed block 0 edited"));

    // Edit the description
    await this.safeClick(this.getByText("This is a sample block"));
    const descriptionEditor = this.getByRole("gridcell", { name: "This is a sample block" })
      .getByTestId("editor-content_rich-text-editor");
    await this.safeFill(descriptionEditor, "Edited description");
    await this.verifyElementVisible(this.getByText("Edited description"));
  }

  /**
   * Add value and unit to a field
   */
  async addValueAndUnit(value: string, unit: string): Promise<void> {
    // Add value
    const valueInput = this.getByPlaceholder("Value");
    await this.safeClick(valueInput);
    await this.safeFill(valueInput, value);
    await valueInput.press("Enter");

    // Add unit
    const unitInput = this.getByPlaceholder("Unit");
    await this.safeClick(unitInput);
    await this.safeFill(unitInput, unit);
    await unitInput.press("Enter");

    // Verify value is set
    await this.verifyElementVisible(this.locator(`//input[@value="${value}"]`));
  }



  /**
   * Click new row button
   */
  async clickNewRow(): Promise<void> {
    await this.safeClick(this.getByTestId("button_new-row"));
  }

  /**
   * Add requirement block from menu
   */
  async addRequirementBlockFromMenu(): Promise<void> {
    await this.safeClick(this.getByTestId("menu-item_add-requirement-block"));
  }

  /**
   * Fill requirement description
   */
  async fillRequirementDescription(description: string): Promise<void> {
    const descriptionEditor = this.locator('[data-testid*="editor-content_rich-text-cell_"][data-testid*="_description"]')
      .first()
      .getByRole("paragraph");
    await this.safeClick(descriptionEditor);
    await this.safeFill(this.richTextEditor, description);
  }

  /**
   * Fill requirement rationale
   */
  async fillRequirementRationale(rationale: string): Promise<void> {
    const rationaleEditor = this.locator('[data-testid*="editor-content_rich-text-cell_"][data-testid*="_rationale"]')
      .first()
      .getByRole("paragraph");
    await this.safeClick(rationaleEditor);
    await this.safeFill(this.richTextEditor, rationale);
  }

  /**
   * Set verification method options
   */
  async setVerificationMethods(): Promise<void> {
    await this.safeClick(this.getByPlaceholder("Link property..."));
    await this.safeClick(this.getByTestId("button_cell-dropdown_method-cell-dropdown"));
    
    // Select multiple verification methods
    const methods = ["inspection", "simulation", "analysis", "demonstration", "test", "sample"];
    for (const method of methods) {
      await this.safeClick(this.getByTestId(`menu-item_${method}`));
    }
    
    await this.safeClick(this.getByText("ROL-1"));
  }

  /**
   * Add H1 heading block
   */
  async addH1Heading(headingText: string): Promise<void> {
    await this.safeClick(this.getByTestId("button_new-row"));
    await this.safeClick(this.getByTestId("menu-item_add-h1-block"));
    const h1Input = this.getByPlaceholder("Heading 1");
    await this.safeClick(h1Input);
    await this.safeFill(h1Input, headingText);
    await h1Input.press("Enter");
  }

  /**
   * Add H2 heading block
   */
  async addH2Heading(headingText: string): Promise<void> {
    await this.safeClick(this.getByTestId("button_new-row"));
    await this.safeClick(this.getByTestId("menu-item_add-h2-block"));
    const h2Input = this.getByPlaceholder("Heading 2");
    await this.safeClick(h2Input);
    await this.safeFill(h2Input, headingText);
    await h2Input.press("Enter");
    await this.safeClick(h2Input);
  }

  /**
   * Add H3 heading block
   */
  async addH3Heading(headingText: string): Promise<void> {
    await this.safeClick(this.getByTestId("button_new-row"));
    await this.safeClick(this.getByTestId("menu-item_add-h3-block"));
    const h3Input = this.getByPlaceholder("Heading 3");
    await this.safeClick(h3Input);
    await this.safeFill(h3Input, headingText);
    await h3Input.press("Enter");
  }

  /**
   * Delete a row by row name
   */
  async deleteRowByName(rowName: string): Promise<void> {
    const row = this.getByRole("row", { name: rowName });
    await this.safeClick(row.getByTestId("button_actions-cell_drag"));
    await this.safeClick(this.getByTestId("menu-item_delete"));
  }

  /**
   * Verify rows container is visible
   */
  async verifyRowsContainer(): Promise<void> {
    await this.verifyElementVisible(this.locator(".ag-center-cols-container"));
  }

  /**
   * Complete document verification workflow
   */
  async completeDocumentVerificationWorkflow(): Promise<void> {
   
  }
}