import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";
import { TEST_DATA, SELECTORS } from "../utilities/constants";

/**
 * Product Data Management (PDM) Page Object
 * Handles CAD file upload, component details editing, and specifications management
 */
export class PdmPage extends BasePage {
  // CAD upload elements
  private readonly cadModeButton: Locator;
  private readonly fileUploadInput: Locator;
  private readonly importingIndicator: Locator;
  private readonly filePanel: Locator;
  private readonly submitCadButton: Locator;
  private readonly successMessage: Locator;

  // Component overview elements
  private readonly addAttachmentButton: Locator;
  private readonly overviewCardImage: Locator;
  private readonly editOverviewButton: Locator;
  private readonly saveOverviewButton: Locator;

  // Part details form elements
  private readonly partNumberInput: Locator;
  private readonly partNameInput: Locator;
  private readonly statusButton: Locator;
  private readonly statusOptions: Locator;
  private readonly madeSourcedOption: Locator;
  private readonly descriptionInput: Locator;

  // Specifications elements
  private readonly specificationsHeading: Locator;
  private readonly editSpecificationButton: Locator;
  private readonly primaryMaterialInput: Locator;
  private readonly costButton: Locator;
  private readonly currencyEurOption: Locator;
  private readonly costInput: Locator;
  private readonly weightInput: Locator;
  private readonly saveSpecificationButton: Locator;

  // Sourcing elements
  private readonly editSourcingButton: Locator;
  private readonly leadTimeInput: Locator;
  private readonly minimumOrderInput: Locator;
  private readonly saveSourcingButton: Locator;

  // Tree view elements
  private readonly treeViewButton: Locator;
  private readonly componentTreeGrid: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize CAD upload elements
    this.cadModeButton = this.getByTestId("button_set-catalog-item-dialog-mode_cad");
    this.fileUploadInput = this.getByLabel("Add catalog item").getByRole("textbox");
    this.importingIndicator = this.getByText("Importing file...");
    this.filePanel = this.locator(".file-panel--file");
    this.submitCadButton = this.getByTestId("button_cad-submit-catalog-item");
    this.successMessage = this.getByText("Successfully started catalog");

    // Initialize component overview elements
    this.addAttachmentButton = this.getByTestId("button_add-attachment");
    this.overviewCardImage = this.locator('[class*="overviewCardImage-"]');
    this.editOverviewButton = this.getByTestId("button_edit-overview");
    this.saveOverviewButton = this.getByTestId("button_save-overview");

    // Initialize part details form elements
    this.partNumberInput = this.getByLabel("Part number");
    this.partNameInput = this.getByLabel("Part name");
    this.statusButton = this.getByTestId("button_select-status-button");
    this.statusOptions = this.getByLabel("selectable options");
    this.madeSourcedOption = this.getByText("Sourced");
    this.descriptionInput = this.getByPlaceholder("Enter a description...");

    // Initialize specifications elements
    this.specificationsHeading = this.getByRole("heading", { name: "Specifications" });
    this.editSpecificationButton = this.getByTestId("button_edit-specification");
    this.primaryMaterialInput = this.getByLabel("Primary material");
    this.costButton = this.getByTestId("button_cost-button");
    this.currencyEurOption = this.locator("span").filter({ hasText: "EUR" }).first();
    this.costInput = this.getByLabel("Cost€");
    this.weightInput = this.getByLabel("Weightkg");
    this.saveSpecificationButton = this.getByTestId("button_save-specification");

    // Initialize sourcing elements
    this.editSourcingButton = this.getByTestId("button_edit-sourcing");
    this.leadTimeInput = this.getByRole("spinbutton");
    this.minimumOrderInput = this.getByRole("spinbutton");
    this.saveSourcingButton = this.getByTestId("button_save-sourcing");

    // Initialize tree view elements
    this.treeViewButton = this.getByTestId("button_tree-view");
    this.componentTreeGrid = this.getByRole("treegrid");
  }

  /**
   * Switch to CAD upload mode
   */
  async switchToCadMode(): Promise<void> {
    await this.safeClick(this.cadModeButton);
  }

  /**
   * Upload CAD file
   */
  async uploadCadFile(filePath: string = TEST_DATA.FILES.CUBE_ASSEMBLY): Promise<void> {
    await this.uploadFile(this.fileUploadInput, filePath);
    await this.waitForElementToHide(this.importingIndicator, TEST_DATA.TIMEOUTS.FILE_UPLOAD);
  }

  /**
   * Verify CAD file is uploaded
   */
  async verifyCadFileUploaded(fileName: string): Promise<void> {
    await this.verifyElementVisible(this.filePanel.getByText(fileName));
  }

  /**
   * Submit CAD upload
   */
  async submitCadUpload(): Promise<void> {
    await this.safeClick(this.submitCadButton);
    await this.verifyElementVisible(this.successMessage);
  }

  /**
   * Verify component overview elements
   */
  async verifyComponentOverview(): Promise<void> {
    const attachmentsHeading = this.getByRole("heading", { name: "Attachments" });
    await attachmentsHeading.hover();
    await this.verifyElementVisible(this.addAttachmentButton);
    await this.verifyElementVisible(this.overviewCardImage.first(), TEST_DATA.TIMEOUTS.LONG);
  }

  /**
   * Edit component overview details
   */
  async editOverviewDetails(partNumber: string, partName: string, description: string): Promise<void> {
    await this.safeClick(this.editOverviewButton);
    
    // Edit part number
    await this.safeFill(this.partNumberInput, partNumber);
    
    // Edit part name
    await this.safeFill(this.partNameInput, partName);
    
    // Set status to Active
    await this.safeClick(this.statusButton);
    await this.safeClick(this.statusOptions.getByText("Active"));
    
    // Set made option to Sourced
    await this.safeClick(this.madeSourcedOption);
    
    // Add description
    await this.safeFill(this.descriptionInput, description);
    
    // Save changes
    await this.safeClick(this.saveOverviewButton);
  }

  /**
   * Verify overview details are saved
   */
  async verifyOverviewDetails(partNumber: string, partName: string, description: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(`Part number:${partNumber}`));
    await this.verifyElementVisible(this.getByText(partName).nth(1));
    
    // Verify status
    const statusElement = this.getByTestId("button_cell-dropdown_catalog-item-status")
      .first()
      .locator(".status-tag.status-tag--active")
      .locator("span")
      .first();
    await this.verifyTextContent(statusElement, "Active");
    
    await this.verifyElementVisible(this.getByText("Made:Sourced"));
    await this.verifyElementVisible(this.getByText(`Description:${description}`));
  }

  /**
   * Edit specifications
   */
  async editSpecifications(primaryMaterial: string, weight: string): Promise<void> {
    await this.safeClick(this.specificationsHeading);
    await this.safeClick(this.editSpecificationButton);
    
    // Set primary material
    await this.safeFill(this.primaryMaterialInput, primaryMaterial);
    
    // Set currency to EUR
    await this.safeClick(this.costButton);
    await this.safeClick(this.currencyEurOption);
    
    // Set weight
    await this.safeClick(this.weightInput);
    await this.safeFill(this.weightInput, weight);
    
    // Save specifications
    await this.safeClick(this.saveSpecificationButton);
  }

  /**
   * Verify specifications are saved
   */
  async verifySpecifications(primaryMaterial: string, weight: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(`Primary material:${primaryMaterial}`));
    await this.verifyElementVisible(this.getByText(`Weight:${weight} kg`));
  }

  /**
   * Edit sourcing information
   */
  async editSourcing(leadTime: string, minimumOrder: string): Promise<void> {
    await this.safeClick(this.editSourcingButton);
    
    // Set lead time
    await this.safeFill(this.leadTimeInput.first(), leadTime);
    
    // Set minimum order quantity
    await this.safeFill(this.minimumOrderInput.nth(1), minimumOrder);
    
    // Save sourcing information
    await this.safeClick(this.saveSourcingButton);
  }

  /**
   * Verify sourcing information
   */
  async verifySourcing(leadTime: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(`Lead Time: ${leadTime} days`));
  }

  /**
   * Switch to tree view
   */
  async switchToTreeView(): Promise<void> {
    await this.safeClick(this.treeViewButton);
  }

  /**
   * Verify component tree structure
   */
  async verifyComponentTree(fileName: string): Promise<void> {
    await this.verifyElementVisible(this.componentTreeGrid);
    await this.verifyElementVisible(this.getByText(fileName));
  }

  /**
   * Complete CAD upload and editing workflow
   */
  async completeCadUploadAndEditWorkflow(
    fileName: string = "Cube.SLDASM",
    partNumber: string = "test",
    partName: string = "Test Part", 
    description: string = "Test",
    primaryMaterial: string = "45",
    weight: string = "78",
    leadTime: string = "11",
    minimumOrder: string = "100"
  ): Promise<void> {
    
    // Upload CAD file
    await this.switchToCadMode();
    await this.uploadCadFile();
    await this.verifyCadFileUploaded(fileName);
    await this.submitCadUpload();

    // Verify and edit overview
    await this.verifyComponentOverview();
    await this.editOverviewDetails(partNumber, partName, description);
    await this.verifyOverviewDetails(partNumber, partName, description);

    // Edit and verify specifications
    await this.editSpecifications(primaryMaterial, weight);
    await this.verifySpecifications(primaryMaterial, weight);

    // Edit and verify sourcing
    await this.editSourcing(leadTime, minimumOrder);
    await this.verifySourcing(leadTime);

    // Verify tree view
    await this.switchToTreeView();
    await this.verifyComponentTree(fileName);
  }

  /**
   * Quick CAD upload workflow (minimal steps)
   */
  async quickCadUpload(filePath?: string): Promise<void> {
    await this.switchToCadMode();
    await this.uploadCadFile(filePath);
    await this.submitCadUpload();
  }
}