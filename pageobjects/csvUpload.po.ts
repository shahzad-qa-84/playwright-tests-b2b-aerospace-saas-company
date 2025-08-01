import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";
import { FORM_FIELDS, SELECTORS, TEST_DATA } from "../utilities/constants";

/**
 * CSV Upload Page Object
 * Handles all functionality related to CSV file upload and processing
 */
export class CsvUploadPage extends BasePage {
  // Locators
  private readonly csvModeButton: Locator;
  private readonly fileInput: Locator;
  private readonly importingIndicator: Locator;
  private readonly columnDropdowns: Locator;
  private readonly submitButton: Locator;
  private readonly successMessage: Locator;
  private readonly searchInput: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize locators
    this.csvModeButton = this.getByTestId("button_set-catalog-item-dialog-mode_csv");
    this.fileInput = this.getByLabel("Add catalog item").getByRole("textbox");
    this.importingIndicator = this.getByText("Importing file...");
    this.columnDropdowns = this.locator(".bp5-popover-target > .bp5-button");
    this.submitButton = this.getByTestId("button_csv-submit-catalog-item");
    this.successMessage = this.getByText("Successfully started catalog");
    this.searchInput = this.getByPlaceholder(FORM_FIELDS.PLACEHOLDERS.SEARCH);
  }

  /**
   * Switch to CSV mode
   */
  async switchToCsvMode(): Promise<void> {
    await this.safeClick(this.csvModeButton);
  }

  /**
   * Upload CSV file
   */
  async uploadCsvFile(filePath: string = TEST_DATA.FILES.CSV_IMPORT): Promise<void> {
    await this.uploadFile(this.fileInput, filePath);
    await this.waitForElementToHide(this.importingIndicator, TEST_DATA.TIMEOUTS.FILE_UPLOAD);
  }

  /**
   * Configure column mappings for CSV import
   * Maps CSV columns to appropriate database fields
   */
  async configureColumnMappings(): Promise<void> {
    // Map column 2 to label
    await this.safeClick(this.columnDropdowns.nth(1));
    await this.safeClick(this.locator("div").filter({ hasText: /^label$/ }).first());

    // Map column 3 to label (additional configuration)
    await this.safeClick(this.columnDropdowns.nth(2));
    await this.safeClick(this.locator("div").filter({ hasText: /^label$/ }).first());

    // Map column 4 to id
    await this.safeClick(this.columnDropdowns.nth(3));
    await this.safeClick(this.locator("div").filter({ hasText: /^id$/ }).nth(1));

    // Map column 6 to description
    await this.safeClick(this.columnDropdowns.nth(5));
    await this.safeClick(this.getByText("description", { exact: true }).first());
  }

  /**
   * Submit CSV import
   */
  async submitCsvImport(): Promise<void> {
    await this.safeClick(this.submitButton);
  }

  /**
   * Verify successful CSV import
   */
  async verifySuccessfulImport(): Promise<void> {
    await this.verifyElementVisible(this.successMessage);
  }

  /**
   * Search for imported item
   */
  async searchForImportedItem(searchTerm: string): Promise<void> {
    await this.safeClick(this.searchInput);
    await this.safeFill(this.searchInput, searchTerm);
  }

  /**
   * Verify imported item appears in grid
   */
  async verifyImportedItemInGrid(itemName: string): Promise<void> {
    const gridCell = this.getByRole("gridcell", { name: itemName });
    await this.verifyElementVisible(gridCell.first());
  }

  /**
   * Complete CSV upload workflow
   */
  async completeCsvUploadWorkflow(filePath?: string, searchTerm: string = "New Block"): Promise<void> {
    await this.switchToCsvMode();
    await this.uploadCsvFile(filePath);
    await this.configureColumnMappings();
    await this.submitCsvImport();
    await this.verifySuccessfulImport();
    await this.searchForImportedItem(searchTerm);
    await this.verifyImportedItemInGrid(searchTerm);
  }

  /**
   * Configure specific column mapping
   */
  async configureColumnMapping(columnIndex: number, mappingValue: string): Promise<void> {
    await this.safeClick(this.columnDropdowns.nth(columnIndex));
    await this.safeClick(this.getByText(mappingValue, { exact: true }));
  }

  /**
   * Wait for file processing to complete
   */
  async waitForFileProcessing(): Promise<void> {
    await this.waitForElementToHide(this.importingIndicator, TEST_DATA.TIMEOUTS.FILE_UPLOAD);
  }
}