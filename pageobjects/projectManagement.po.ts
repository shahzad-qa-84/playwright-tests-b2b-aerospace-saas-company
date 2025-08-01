import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";
import { FORM_FIELDS, SELECTORS } from "../utilities/constants";

/**
 * Project Management Page Object
 * Handles all functionality related to project management status and configuration
 */
export class ProjectManagementPage extends BasePage {
  // Locators
  private readonly statusHeader: Locator;
  private readonly responsibleEngineerHeader: Locator;
  private readonly deliveryDateHeader: Locator;
  private readonly inventoryCountHeader: Locator;
  private readonly rightClickPrompt: Locator;
  private readonly emptyField: Locator;
  private readonly addNewStatusInput: Locator;
  private readonly addNewStatusText: Locator;
  private readonly addDescriptionOption: Locator;
  private readonly descriptionInput: Locator;
  private readonly statusItemDropdown: Locator;
  private readonly sidePanelSliding: Locator;
  private readonly dateInput: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize locators
    this.statusHeader = this.getByText("Status", { exact: true });
    this.responsibleEngineerHeader = this.getByText("Responsible Engineer");
    this.deliveryDateHeader = this.getByText("Delvery Date");
    this.inventoryCountHeader = this.getByText("Inventory Count");
    this.rightClickPrompt = this.locator("span").filter({ hasText: "Right-click to insert..." }).first();
    this.emptyField = this.getByText("Empty");
    this.addNewStatusInput = this.getByPlaceholder(FORM_FIELDS.PLACEHOLDERS.ADD_STATUS);
    this.addNewStatusText = this.getByText("Add new status");
    this.addDescriptionOption = this.getByText("Add description...");
    this.descriptionInput = this.getByPlaceholder(FORM_FIELDS.PLACEHOLDERS.ADD_DESCRIPTION);
    this.statusItemDropdown = this.locator('.status-item-grid > .flex > div > [class*="-popover-target"] > [class*="-button"]').first();
    this.sidePanelSliding = this.getByTestId(SELECTORS.SIDE_PANEL);
    this.dateInput = this.getByPlaceholder(FORM_FIELDS.PLACEHOLDERS.DATE);
  }

  /**
   * Verify all project management headers are visible
   */
  async verifyProjectManagementHeaders(): Promise<void> {
    await this.verifyElementVisible(this.statusHeader);
    await this.verifyElementVisible(this.responsibleEngineerHeader);
    await this.verifyElementVisible(this.deliveryDateHeader);
    await this.verifyElementVisible(this.inventoryCountHeader);
    await this.verifyElementVisible(this.rightClickPrompt);
    await this.verifyElementVisible(this.emptyField);
    await this.verifyElementVisible(this.dateInput.nth(1));
  }

  /**
   * Add a new project status
   */
  async addNewStatus(statusName: string): Promise<void> {
    await this.safeClick(this.addNewStatusText);
    await this.safeFill(this.addNewStatusInput, statusName);
    await this.addNewStatusInput.press("Enter");
    await this.waitForElement(this.sidePanelSliding);
  }

  /**
   * Verify status is added
   */
  async verifyStatusAdded(statusName: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(statusName));
    await this.verifyElementVisible(this.getByText(`${statusName}Empty`));
  }

  /**
   * Add description to a status
   */
  async addDescription(description: string): Promise<void> {
    await this.safeClick(this.addDescriptionOption);
    await this.safeFill(this.descriptionInput, description);
    await this.descriptionInput.press("Enter");
  }

  /**
   * Verify description is added
   */
  async verifyDescriptionAdded(description: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(description));
  }

  /**
   * Select status item and perform action
   */
  async selectStatusItem(): Promise<void> {
    await this.safeClick(this.statusItemDropdown);
  }

  /**
   * Add text value to a field
   */
  async addTextValue(text: string): Promise<void> {
    await this.safeClick(this.getByRole("menuitem", { name: "Text" }));
    await this.safeClick(this.emptyField.first());
    const textArea = this.locator("textarea");
    await this.safeFill(textArea, text);
    await textArea.press("Enter");
  }

  /**
   * Verify text value is added
   */
  async verifyTextValueAdded(text: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(text));
  }

  /**
   * Add numeric value
   */
  async addNumericValue(value: string): Promise<void> {
    await this.safeClick(this.getByRole("menuitem", { name: "Numeric" }));
    await this.safeClick(this.emptyField.first());
    const numericInput = this.getByRole("spinbutton");
    await this.safeFill(numericInput, value);
    await numericInput.press("Enter");
  }

  /**
   * Verify numeric value is added
   */
  async verifyNumericValueAdded(value: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(value, { exact: true }));
  }

  /**
   * Add check field
   */
  async addCheckField(): Promise<void> {
    await this.safeClick(this.getByRole("menuitem", { name: "Check" }));
    await this.verifyElementVisible(this.locator(".component--status-type-check-editor"));
  }

  /**
   * Add date value
   */
  async addDateValue(): Promise<void> {
    await this.safeClick(this.getByRole("menuitem", { name: "Date" }));
    await this.safeClick(this.getByRole("button", { name: "Today" }));
  }

  /**
   * Clear value
   */
  async clearValue(): Promise<void> {
    await this.safeClick(this.getByRole("menuitem", { name: "Clear Value" }));
  }

  /**
   * Add single select value
   */
  async addSingleSelectValue(optionValue: string): Promise<void> {
    await this.safeClick(this.getByRole("menuitem", { name: "Single Select" }));
    await this.safeClick(this.getByPlaceholder("Empty").first());
    await this.safeClick(this.getByTestId(`menu-item_${optionValue}`));
  }

  /**
   * Verify single select value is added
   */
  async verifySingleSelectValueAdded(value: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(value).first());
  }

  /**
   * Add mention value
   */
  async addMentionValue(): Promise<void> {
    await this.safeClick(this.getByRole("menuitem", { name: "Mention" }));
    await this.safeClick(this.getByPlaceholder("Empty").first());
  }
}