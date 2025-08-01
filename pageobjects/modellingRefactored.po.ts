import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.po";

export class ModellingPage extends BasePage {
  // Navigation elements
  private readonly modellingNavLink: Locator;
  private readonly modelConfigurationNavLink: Locator;
  private readonly statusesNavLink: Locator;
  private readonly propertiesNavLink: Locator;
  private readonly tableNavLink: Locator;

  // Form elements
  private readonly addNewRowButton: Locator;
  private readonly addNewStatusInput: Locator;
  private readonly addNewPropertyInput: Locator;
  private readonly typeCellButton: Locator;
  private readonly addOptionButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Navigation
    this.modellingNavLink = this.getByTestId("nav-link_menu-pane_modeling");
    this.modelConfigurationNavLink = this.getByTestId("nav-link_model-configuration");
    this.statusesNavLink = this.getByTestId("nav-link_statuses");
    this.propertiesNavLink = this.getByTestId("nav-link_properties");
    this.tableNavLink = this.getByTestId("nav-link_menu-pane_table");

    // Form elements
    this.addNewRowButton = this.getByTestId("button_add-new-row");
    this.addNewStatusInput = this.getByPlaceholder("Add new status");
    this.addNewPropertyInput = this.getByPlaceholder("Add new property");
    this.typeCellButton = this.getByTestId("button_type-cell");
    this.addOptionButton = this.getByTestId("button_add-option");
  }

  // Navigation methods
  async clickModelling(): Promise<void> {
    await this.safeClick(this.modellingNavLink);
  }

  async clickModelConfiguration(): Promise<void> {
    await this.safeClick(this.modelConfigurationNavLink);
  }

  async clickStatuses(): Promise<void> {
    await this.safeClick(this.statusesNavLink);
  }

  async clickProperties(): Promise<void> {
    await this.safeClick(this.propertiesNavLink);
  }

  async clickTable(): Promise<void> {
    await this.safeClick(this.tableNavLink);
  }

  // Status management methods
  async addNewStatus(): Promise<void> {
    await this.safeClick(this.addNewRowButton);
  }

  async enterStatusName(statusName: string): Promise<void> {
    await this.safeFill(this.addNewStatusInput, statusName);
    await this.addNewStatusInput.press("Enter");
  }

  async clickStatusGridCell(index: number = 3): Promise<void> {
    await this.safeClick(this.getByRole("gridcell").nth(index));
  }

  async addStatusDescription(statusName: string, description: string): Promise<void> {
    const statusRow = this.getByRole("row", { name: `${statusName} No options can be applied to this type` });
    const textBox = statusRow.getByRole("textbox");
    await this.safeFill(textBox, description);
  }

  async setStatusType(type: string): Promise<void> {
    await this.safeClick(this.typeCellButton);
    await this.safeClick(this.getByTestId(`menu-item_type-cel_menu-item_${type}`));
  }

  async addStatusOptions(statusName: string, options: string[]): Promise<void> {
    await this.safeClick(this.addOptionButton);
    
    const statusRow = this.getByRole("row", { name: `${statusName} This is a test status` });
    const textBox = statusRow.getByRole("textbox");
    
    for (const option of options) {
      await this.safeFill(textBox, option);
      await textBox.press("Enter");
    }
  }

  async selectMultiSelectOptions(options: string[]): Promise<void> {
    await this.safeClick(this.getByPlaceholder("Empty"));
    
    for (const option of options) {
      await this.page.waitForTimeout(500);
      await this.safeClick(this.getByTestId(`menu-item_${option.toLowerCase().replace(/\s+/g, '-')}`));
    }
  }

  async removeMultiSelectTags(count: number): Promise<void> {
    const removeTagButtons = this.getByLabel("Remove tag");
    
    for (let i = count - 1; i >= 0; i--) {
      await this.safeClick(removeTagButtons.nth(i));
    }
  }

  async verifyEmptyPlaceholder(): Promise<void> {
    await this.verifyElementVisible(this.getByPlaceholder("Empty"));
  }

  async createNewStatusDirectly(statusName: string): Promise<void> {
    await this.safeClick(this.getByRole("heading", { name: "Select an Option or Create a New One" }));
    await this.safeClick(this.getByPlaceholder("Empty"));
    await this.safeFill(this.getByPlaceholder("Empty"), statusName);
    await this.safeClick(this.getByTestId("menu-item_create-new-item"));
  }

  async selectCreatedStatus(statusName: string): Promise<void> {
    const testId = statusName.toLowerCase().replace(/\s+/g, '-');
    await this.safeClick(this.getByTestId(`menu-item_${testId}`));
  }

  // Property management methods
  async addNewProperty(): Promise<void> {
    await this.safeClick(this.addNewRowButton);
  }

  async enterPropertyName(propertyName: string): Promise<void> {
    await this.safeFill(this.addNewPropertyInput, propertyName);
  }

  async submitPropertyName(): Promise<void> {
    await this.addNewPropertyInput.press("Enter");
  }

  async blurPropertyInput(): Promise<void> {
    await this.addNewPropertyInput.blur();
  }

  async deleteProperty(propertyName: string): Promise<void> {
    const propertyRow = this.getByRole("row", { name: new RegExp(propertyName) });
    await this.safeClick(propertyRow.getByTestId("button_actions-cell_drag"));
    await this.safeClick(this.getByTestId("menu-item_delete"));
  }

  async clickUnitCell(propertyName: string): Promise<void> {
    await this.safeClick(this.getByTestId(`ag-cell_unit_${propertyName}`));
  }

  async verifyPropertyVisible(propertyName: string): Promise<void> {
    await this.verifyElementVisible(this.getByTestId(`ag-cell_label_${propertyName}`));
  }

  async setPropertyGroup(propertyName: string, groupValue: string): Promise<void> {
    const groupRow = this.getByRole("row", { name: `${propertyName} scalar` });
    const textBox = groupRow.getByRole("textbox");
    await this.safeFill(textBox, groupValue);
    await textBox.press("Enter");
  }

  async setPropertyType(propertyName: string, type: string): Promise<void> {
    await this.safeClick(this.getByTestId(`button_type_${propertyName}`));
    await this.safeClick(this.getByTestId(`menu-item_type-cel_menu-item_${type}`));
  }

  async setPropertyUnit(propertyName: string, unit: string): Promise<void> {
    const propertyRow = this.getByRole("row", { name: new RegExp(propertyName) });
    const textBox = propertyRow.getByRole("textbox");
    await this.safeFill(textBox, unit);
    await textBox.press("Enter");
  }

  async verifyUnitVisible(unit: string): Promise<void> {
    await this.verifyElementVisible(this.getByRole("gridcell", { name: unit }));
  }

  // Field interaction methods for modelling section
  async setDateField(date: string): Promise<void> {
    await this.safeClick(this.getByPlaceholder("MM/DD/YYYY"));
    await this.safeClick(this.getByText(date, { exact: true }));
  }

  async setCheckboxField(fieldName: string): Promise<void> {
    await this.safeClick(this.getByRole("button", { name: fieldName }));
    await this.getByPlaceholder("Click to Edit").press("Tab");
    await this.getByTestId(`checkbox_${fieldName}`).press("Enter");
  }

  async setNumberField(fieldName: string, value: string): Promise<void> {
    await this.safeClick(this.getByRole("button", { name: `${fieldName} Empty` }));
    await this.getByPlaceholder("Click to Edit").press("Tab");
    await this.safeFill(this.getByRole("button", { name: fieldName }).getByPlaceholder("Empty"), value);
  }

  async setSingleSelectField(fieldName: string, value: string): Promise<void> {
    await this.safeClick(this.getByRole("button", { name: fieldName }));
    await this.getByPlaceholder("Click to Edit").press("Tab");
    const input = this.getByRole("button", { name: fieldName }).getByPlaceholder("Empty");
    await this.safeFill(input, value);
    await input.press("Enter");
  }

  async setMentionField(fieldName: string, mention: string): Promise<void> {
    await this.safeClick(this.getByRole("button", { name: fieldName }));
    await this.getByPlaceholder("Click to Edit").press("Tab");
    await this.safeFill(this.getByPlaceholder("Empty"), mention);
  }

  async verifyNoMatchVisible(): Promise<void> {
    await this.verifyElementVisible(this.getByTestId("menu-item_no-match"));
  }

  // Table management methods
  async clickTabNav(): Promise<void> {
    await this.safeClick(this.getByTestId("button_tab_nav"));
  }

  async duplicateTable(): Promise<void> {
    await this.safeClick(this.getByTestId("menu-item_duplicate"));
  }

  async verifyTableDuplicated(tableName: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(`${tableName} (copy)`));
  }

  async addNewChildBlock(childName: string): Promise<void> {
    await this.safeClick(this.locator('[data-icon="small-plus"]').first());
    await this.safeClick(this.getByTestId("menu-item_add-new-child-block"));
    await this.safeFill(this.getByPlaceholder("Name"), childName);
    await this.getByPlaceholder("Name").press("Enter");
  }

  async verifyChildBlockAdded(childName: string): Promise<void> {
    await this.verifyElementVisible(this.getByTestId(`input_${childName}_1`).getByText(childName));
  }

  async renameTable(currentName: string, newName: string): Promise<void> {
    const textBox = this.locator("ul").filter({ hasText: "NameDuplicateDelete" }).getByRole("textbox");
    await this.safeClick(textBox);
    await textBox.press("ArrowRight");
    await textBox.press("ArrowRight");
    await this.safeFill(textBox, `${currentName})`);
    await textBox.press("ArrowRight");
    await this.safeFill(textBox, newName);
    await textBox.press("Enter");
  }

  async verifyTableRenamed(newName: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(newName));
  }

  // Complete workflow methods
  async navigateToStatusConfiguration(): Promise<void> {
    await this.clickModelling();
    await this.clickModelConfiguration();
    await this.clickStatuses();
  }

  async navigateToPropertiesConfiguration(): Promise<void> {
    await this.clickModelling();
    await this.clickModelConfiguration();
    await this.clickProperties();
  }

  async createMultiSelectStatus(statusName: string, description: string, options: string[]): Promise<void> {
    await this.addNewStatus();
    await this.enterStatusName(statusName);
    await this.clickStatusGridCell();
    await this.addStatusDescription(statusName, description);
    await this.setStatusType("multi-select");
    await this.addStatusOptions(statusName, options);
  }

  async createStatusWithType(statusName: string, type: string): Promise<void> {
    await this.addNewStatus();
    await this.enterStatusName(statusName);
    await this.setStatusType(type);
  }
}