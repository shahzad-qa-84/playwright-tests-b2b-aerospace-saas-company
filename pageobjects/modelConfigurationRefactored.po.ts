import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./base.po";

export class ModelConfigurationPage extends BasePage {
  // Navigation elements
  private readonly propertiesNavLink: Locator;
  private readonly statusesNavLink: Locator;

  // Form elements
  private readonly addNewRowButton: Locator;
  private readonly addNewPropertyInput: Locator;
  private readonly addNewStatusInput: Locator;
  private readonly searchDefinitionsInput: Locator;
  private readonly actionsCellDragButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Navigation
    this.propertiesNavLink = this.getByTestId("nav-link_properties");
    this.statusesNavLink = this.getByTestId("nav-link_statuses");

    // Form elements
    this.addNewRowButton = this.getByTestId("button_add-new-row");
    this.addNewPropertyInput = this.getByPlaceholder("Add new property");
    this.addNewStatusInput = this.getByPlaceholder("Add new status");
    this.searchDefinitionsInput = this.getByPlaceholder("Search for Definitions");
    this.actionsCellDragButton = this.getByTestId("button_actions-cell_drag");
  }

  // Navigation methods
  async clickProperties(): Promise<void> {
    await this.safeClick(this.propertiesNavLink);
  }

  async clickStatuses(): Promise<void> {
    await this.safeClick(this.statusesNavLink);
  }

  // Property management methods
  async addNewProperty(): Promise<void> {
    await this.safeClick(this.addNewRowButton);
  }

  async enterPropertyName(propertyName: string): Promise<void> {
    await this.safeFill(this.addNewPropertyInput, propertyName);
    await this.addNewPropertyInput.press("Enter");
  }

  async setPropertyType(propertyName: string, type: string): Promise<void> {
    const typeButton = this.getByTestId(`button_type_${propertyName}`);
    await this.safeClick(typeButton);
    await this.safeClick(this.getByTestId(`menu-item_type-cel_menu-item_${type}`));
  }

  async clickPropertyCell(propertyName: string): Promise<void> {
    await this.safeClick(this.getByTestId(`ag-cell_label_${propertyName}`));
  }

  async editPropertyName(oldName: string, newName: string): Promise<void> {
    const propertyRow = this.getByRole("row", { name: `${oldName} scalar` });
    const textBox = propertyRow.getByRole("textbox");
    await this.safeFill(textBox, newName);
    
    // Click on the edited cell to confirm
    const editedCell = this.getByRole("gridcell", { name: newName });
    await this.safeClick(editedCell.locator("div").nth(1));
    
    // Click on the textbox again to finalize edit
    const editedRow = this.getByRole("row", { name: `${newName} scalar` });
    await this.safeClick(editedRow.getByRole("textbox"));
  }

  async searchProperty(propertyName: string): Promise<void> {
    await this.safeClick(this.searchDefinitionsInput);
    await this.safeFill(this.searchDefinitionsInput, propertyName);
    await this.searchDefinitionsInput.press("Enter");
  }

  async openActionsMenu(): Promise<void> {
    await this.safeClick(this.actionsCellDragButton);
  }

  async deleteProperty(): Promise<void> {
    await this.safeClick(this.actionsCellDragButton);
    await this.safeClick(this.getByTestId("menu-item_delete"));
  }

  async verifyPropertyInBlocksSection(propertyName: string): Promise<void> {
    // Navigate to blocks section
    await this.safeClick(this.locator("#bp5-tab-title_block-view-tabs_properties").getByText("Properties"));
    await this.safeClick(this.getByText("property", { exact: true }));
    await this.safeClick(this.getByPlaceholder("Add new property"));
    await this.safeClick(this.getByTestId(`menu-item_${propertyName}`));
    
    // Verify the property name in input
    const inputElement = this.locator('input.bp5-input[placeholder="Name"]');
    await expect(inputElement).toHaveValue(propertyName);
  }

  async verifyNoRowsToShow(): Promise<void> {
    await this.verifyElementVisible(this.getByText("No Rows To Show"));
  }

  // Status management methods
  async addNewStatus(): Promise<void> {
    await this.safeClick(this.addNewRowButton);
  }

  async enterStatusName(statusName: string): Promise<void> {
    await this.safeFill(this.addNewStatusInput, statusName);
    await this.addNewStatusInput.press("Enter");
  }

  async clickStatusCell(statusName: string): Promise<void> {
    await this.safeClick(this.getByTestId(`ag-cell_label_${statusName}`));
  }

  async editStatusName(oldName: string, newName: string): Promise<void> {
    const statusCell = this.getByRole("gridcell", { name: oldName });
    const textBox = statusCell.getByRole("textbox");
    await this.safeFill(textBox, newName);
    await textBox.press("Enter");
    
    // Click on the edited cell to confirm
    await this.safeClick(this.getByTestId(`ag-cell_label_${newName}`));
  }

  async verifyStatusInModelling(statusName: string): Promise<void> {
    const statusButton = this.getByRole("button", { name: `${statusName} Empty` });
    await this.verifyElementVisible(statusButton);
  }

  async deleteStatus(): Promise<void> {
    await this.safeClick(this.actionsCellDragButton);
    await this.safeClick(this.getByTestId("menu-item_delete"));
    await this.safeClick(this.locator(".ag-center-cols-viewport"));
  }

  // Complete workflow methods
  async createProperty(propertyName: string, type: string = "scalar"): Promise<void> {
    await this.addNewProperty();
    await this.enterPropertyName(propertyName);
    await this.setPropertyType(propertyName, "string");
    await this.setPropertyType(propertyName, type);
    await this.clickPropertyCell(propertyName);
  }

  async createAndEditProperty(originalName: string, editedName: string, type: string = "scalar"): Promise<void> {
    await this.createProperty(originalName, type);
    await this.editPropertyName(originalName, editedName);
  }

  async createStatus(statusName: string): Promise<void> {
    await this.addNewStatus();
    await this.enterStatusName(statusName);
  }

  async createAndEditStatus(originalName: string, editedName: string): Promise<void> {
    await this.createStatus(originalName);
    await this.editStatusName(originalName, editedName);
  }

  async searchAndDeleteProperty(propertyName: string): Promise<void> {
    await this.searchProperty(propertyName);
    await this.openActionsMenu();
    await this.deleteProperty();
    await this.verifyNoRowsToShow();
  }

  async deleteStatusAndVerify(): Promise<void> {
    await this.deleteStatus();
    await this.verifyNoRowsToShow();
  }
}