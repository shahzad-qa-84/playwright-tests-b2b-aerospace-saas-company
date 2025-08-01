import { Page } from "@playwright/test";
import { BasePage } from "./base.po";

export class ModelingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async addPropertyWithDataSink(propertyName: string, dataSinkName: string, expectedValue: string): Promise<void> {
    // This is a placeholder method for the data sink test
    // The actual implementation would depend on the specific UI workflow
    await this.safeClick(this.getByTestId("button_add-property"));
    await this.safeFill(this.getByPlaceholder("Property name"), propertyName);
    // Add data sink connection logic here
  }
}
