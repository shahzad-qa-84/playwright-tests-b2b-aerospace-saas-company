import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";
import { FORM_FIELDS, TEST_DATA } from "../utilities/constants";

/**
 * Property Page Object - Refactored Version
 * Handles all property-related functionality including creation, editing, and management
 */
export class PropertyPage extends BasePage {
  // Property input elements
  private readonly addNewPropertyInput: Locator;
  private readonly addNewGroupInput: Locator;
  private readonly addPropertyOrGroupLink: Locator;
  private readonly addNewRowButton: Locator;

  // Property details elements
  private readonly propertyDetailsHandle: Locator;
  private readonly lockValueCheckbox: Locator;
  private readonly pinPropertyMenuItem: Locator;
  private readonly unpinPropertyMenuItem: Locator;

  // Group management elements
  private readonly propertyTypeDropdown: Locator;
  private readonly groupTypeOption: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize property input locators
    this.addNewPropertyInput = this.getByPlaceholder(FORM_FIELDS.PLACEHOLDERS.ADD_PROPERTY);
    this.addNewGroupInput = this.getByPlaceholder("Add new group");
    this.addPropertyOrGroupLink = this.getByText("Add property or group");
    this.addNewRowButton = this.getByTestId("button_add-new-row");

    // Initialize property details locators
    this.propertyDetailsHandle = this.locator('[class*="-icon"][class*="-icon-drag-handle-vertical"]');
    this.lockValueCheckbox = this.locator("label").filter({ hasText: "Lock value" }).locator("span");
    this.pinPropertyMenuItem = this.getByRole("menuitem", { name: "Pin property" });
    this.unpinPropertyMenuItem = this.getByRole("menuitem", { name: "Unpin property" });

    // Initialize group management locators
    this.propertyTypeDropdown = this.getByRole("combobox").filter({ hasText: "Property" }).locator("svg");
    this.groupTypeOption = this.getByText("Group", { exact: true });
  }

  /**
   * Expand property details panel
   */
  async expandPropertyDetails(): Promise<void> {
    await this.wait(2000); // Allow UI to stabilize
    await this.safeClick(this.propertyDetailsHandle.first());
  }

  /**
   * Lock a property to prevent editing
   */
  async lockProperty(): Promise<void> {
    await this.expandPropertyDetails();
    await this.safeClick(this.lockValueCheckbox);
  }

  /**
   * Unlock a property to allow editing
   */
  async unlockProperty(): Promise<void> {
    await this.expandPropertyDetails();
    await this.expandPropertyDetails(); // Double click might be needed
    await this.safeClick(this.lockValueCheckbox);
  }

  /**
   * Pin a property for quick access
   */
  async clickPinProperty(): Promise<void> {
    await this.safeClick(this.pinPropertyMenuItem);
  }

  /**
   * Unpin a property
   */
  async clickUnpinProperty(): Promise<void> {
    await this.safeClick(this.unpinPropertyMenuItem);
  }

  /**
   * Add or update a property value
   */
  async addPropertyValue(propertyName: string, value: string): Promise<void> {
    const propertyEditor = this.getPropertyEditor(propertyName);
    await this.safeClick(propertyEditor);
    await propertyEditor.clear();
    await this.safeFill(propertyEditor, value);
    await this.wait(1000); // Allow value to be processed
    await propertyEditor.press("Enter");
  }

  /**
   * Edit property value in a different page context
   */
  async editPropertyValue(propertyName: string, value: string, targetPage: any): Promise<void> {
    const locator = `editor-content_scalar-expression-editor_${propertyName.toLowerCase()}`;
    const propertyEditor = targetPage.getByTestId(locator).getByRole("paragraph");
    await propertyEditor.click();
    await propertyEditor.clear();
    await propertyEditor.fill(value);
    await propertyEditor.press("Enter");
    await propertyEditor.press("Escape");
  }

  /**
   * Add a new property from the main window
   */
  async addNewPropertyFromMainWindow(propertyName: string): Promise<void> {
    await this.safeClick(this.addNewRowButton);
    await this.safeFill(this.addNewPropertyInput, propertyName);
    await this.addNewPropertyInput.press("Enter");
  }

  /**
   * Click the "Add property or group" link
   */
  async addPropertyOrGroupLink(): Promise<void> {
    await this.safeClick(this.addPropertyOrGroupLink);
  }

  /**
   * Add a new property from the block section
   */
  async addNewPropertyFromBlockSection(propertyName: string): Promise<void> {
    await this.safeClick(this.addNewPropertyInput);
    await this.safeFill(this.addNewPropertyInput, propertyName);
    
    const createNewDefinitionOption = this.getByRole("menuitem", { 
      name: `Create new definition for "${propertyName}"` 
    });
    await this.safeClick(createNewDefinitionOption);
    await this.addNewPropertyInput.press("Enter");
  }

  /**
   * Add a new property group
   */
  async addGroup(groupName: string): Promise<void> {
    await this.safeClick(this.propertyTypeDropdown);
    await this.safeClick(this.groupTypeOption);
    await this.safeClick(this.addNewGroupInput);
    await this.safeFill(this.addNewGroupInput, groupName);
    await this.addNewGroupInput.press("Enter");
  }

  /**
   * Move a property to a specific group
   */
  async movePropertyToGroup(propertyName: string): Promise<void> {
    const propertyMenuItem = this.getByRole("menuitem", { name: propertyName });
    await this.safeClick(propertyMenuItem);
    
    const propertyText = this.getByText(propertyName);
    await this.safeClick(propertyText);
  }

  /**
   * Get property editor locator for a specific property
   */
  private getPropertyEditor(propertyName: string): Locator {
    const locator = `editor-content_scalar-expression-editor_${propertyName.toLowerCase()}`;
    return this.getByTestId(locator).getByRole("paragraph");
  }

  /**
   * Verify property value is set correctly
   */
  async verifyPropertyValue(propertyName: string, expectedValue: string): Promise<void> {
    const propertyText = this.getByText(expectedValue, { exact: true });
    await this.verifyElementVisible(propertyText.first());
  }

  /**
   * Verify property is locked (lock icon is visible)
   */
  async verifyPropertyLocked(): Promise<void> {
    const lockIcon = this.locator('svg[data-icon="lock"]').first();
    await this.verifyElementVisible(lockIcon);
  }

  /**
   * Verify property is visible in the properties list
   */
  async verifyPropertyExists(propertyName: string): Promise<void> {
    const propertyElement = this.getByText(propertyName);
    await this.verifyElementVisible(propertyElement);
  }

  /**
   * Verify group exists
   */
  async verifyGroupExists(groupName: string): Promise<void> {
    const groupElement = this.getByText(groupName);
    await this.verifyElementVisible(groupElement);
  }

  /**
   * Complete property creation workflow
   */
  async createPropertyWithValue(propertyName: string, value: string): Promise<void> {
    await this.addPropertyOrGroupLink();
    await this.addNewPropertyFromBlockSection(propertyName);
    await this.verifyPropertyExists(propertyName);
    await this.addPropertyValue(propertyName, value);
    await this.verifyPropertyValue(propertyName, value);
  }

  /**
   * Complete group creation workflow
   */
  async createGroupWithProperty(groupName: string, propertyName: string): Promise<void> {
    await this.addPropertyOrGroupLink();
    await this.addGroup(groupName);
    await this.verifyGroupExists(groupName);
    await this.addNewPropertyFromBlockSection(propertyName);
    await this.movePropertyToGroup(propertyName);
  }

  /**
   * Property locking workflow
   */
  async lockPropertyWorkflow(propertyName: string, value: string): Promise<void> {
    await this.addPropertyValue(propertyName, value);
    await this.lockProperty();
    await this.verifyPropertyLocked();
  }

  /**
   * Property unlocking and editing workflow
   */
  async unlockAndEditPropertyWorkflow(propertyName: string, newValue: string): Promise<void> {
    await this.unlockProperty();
    await this.addPropertyValue(propertyName, newValue);
    await this.verifyPropertyValue(propertyName, newValue);
  }
}