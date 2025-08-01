import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.po";

export class propertyPage extends BasePage {
  readonly txtBxAddNewProperty: Locator;

  constructor(page: Page) {
    super(page);
    this.txtBxAddNewProperty = this.getByPlaceholder("Add new property");
  }

  async expandPropertyDetails() {
    await this.page.waitForTimeout(2000);
    await this.page.locator('[class*="-icon"][class*="-icon-drag-handle-vertical"]').first().click();
  }

  async lockProperty() {
    await this.expandPropertyDetails();
    await this.page.locator("label").filter({ hasText: "Lock value" }).locator("span").click();
  }

  async clickPinProperty() {
    await this.page.getByRole("menuitem", { name: "Pin property" }).click();
  }

  async clickUnPinProperty() {
    await this.page.getByRole("menuitem", { name: "Unpin property" }).click();
  }

  async unlockProperty() {
    await this.expandPropertyDetails();
    await this.expandPropertyDetails();
    await this.page.locator("label").filter({ hasText: "Lock value" }).locator("span").click();
  }
  async addPropertyValue(propertyName: string, value: string) {
    const locator = "editor-content_scalar-expression-editor_" + propertyName.toLowerCase();
    const txtBxProperty = this.page.getByTestId(locator).getByRole("paragraph");
    await txtBxProperty.click();
    await txtBxProperty.clear();
    await txtBxProperty.fill(value);
    await this.page.waitForTimeout(1000);
    await txtBxProperty.press("Enter");
  }

  async editPropertyValue(propertyName: string, value: string, newpage: Page) {
    const locator = "editor-content_scalar-expression-editor_" + propertyName.toLowerCase();
    const txtBxProperty = newpage.getByTestId(locator).getByRole("paragraph");
    await txtBxProperty.click();
    await txtBxProperty.clear();
    await txtBxProperty.fill(value);
    await txtBxProperty.press("Enter");
    await txtBxProperty.press("Escape");
  }

  async addNewPropertyFromMainWindow(propertyName: string) {
    await this.page.getByTestId("button_add-new-row").click();
    await this.page.getByPlaceholder("Add new property").fill(propertyName);
    await this.page.getByPlaceholder("Add new property").press("Enter");
  }

  async addPropertyOrGroupLink() {
    await this.page.getByText("Add property or group").click();
  }

  async addNewPropertyFromBlockSection(propertyName: string) {
    await this.txtBxAddNewProperty.click();
    await this.txtBxAddNewProperty.fill(propertyName);
    await this.page.getByRole("menuitem", { name: 'Create new definition for "' + propertyName + '"' }).click();
    await this.txtBxAddNewProperty.press("Enter");
  }

  async addGroup(groupName: string) {
    await this.page.getByRole("combobox").filter({ hasText: "Property" }).locator("svg").click();
    await this.page.getByText("Group", { exact: true }).click();
    const group = this.page.getByPlaceholder("Add new group");
    await group.click();
    await group.fill(groupName);
    await group.press("Enter");
  }

  async movePropertyToGroup(propertyName: string) {
    await this.page.getByRole("menuitem", { name: "" + propertyName + "" }).click();
    await this.page.getByText("" + propertyName + "").click();
  }
}
