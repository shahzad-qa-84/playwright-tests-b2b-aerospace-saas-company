// pageobjects/dataSinkPage.po.ts
import { Page, expect } from "@playwright/test";

export class DataSinkPage {
  constructor(private page: Page) {}

  async openDataSinkSection() {
    await this.page.getByText("Data sources").click();
    await this.page.getByText("Data sinks1").click();
  }

  async createDataSink(name: string, description: string, key1: string, val1: string, key2: string, val2: string) {
    await this.page.getByTestId("button_add-data-connection").click();
    await this.page.locator("label:nth-child(2) > .bp5-control-indicator").click(); // Sink radio
    await this.page.getByTestId("button_continue").click();

    const textboxes = this.page.getByRole("textbox");
    await textboxes.nth(1).fill(name);
    await this.page.locator("textarea").fill(description);

    await textboxes.nth(3).fill(key1);
    await textboxes.nth(4).fill(val1);

    await this.page.getByTestId("button_add-property").click();
    const inputs = this.page.locator('input[type="text"]');
    await inputs.nth(3).fill(key2);
    await inputs.nth(4).fill(val2);

    await this.page.getByTestId("button_add-data-sink").click();
  }

  async editDataSink(name: string, newDescription: string, tag: string) {
    await this.page.getByLabel("Data sinks1").locator(".bp5-button.bp5-minimal").first().click();
    await this.page.getByText("Edit").click();

    await this.page.getByTestId("button_show-icon-selector-menu").click();
    await this.page.getByTestId("button_icon_airplane").click();

    const tagInput = this.page.getByRole("combobox").getByRole("textbox");
    await tagInput.fill(tag);
    await this.page.getByTestId("menu-item_create-new-item").click();

    const desc = this.page.getByTestId("side-panel_sliding-panel").getByText("this is a test");
    await desc.click();
    await desc.fill(newDescription);
    await this.page.getByTestId("button_add-data-sink").click();

    await expect(this.page.getByLabel("Data sinks1").getByText(name)).toBeVisible();
    await expect(this.page.getByRole("cell", { name: newDescription })).to
