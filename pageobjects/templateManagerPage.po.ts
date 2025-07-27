// pageobjects/templateManagerPage.po.ts
import { Page, expect } from "@playwright/test";

export class TemplateManagerPage {
  constructor(private page: Page) {}

  async openTemplateList() {
    await this.page.getByTestId("button_reports-teamplates-btn").click();
  }

  async selectTemplateByName(templateName: string) {
    await this.page.getByRole("menuitem", { name: templateName }).click();
  }

  async useSelectedTemplate() {
    await this.page.getByTestId("button_use-template-btn").click();
  }

  async verifyTemplateLoaded(expectedName: string) {
    await expect(this.page.getByPlaceholder("Untitled").first()).toBeVisible();
    await expect(this.page.getByRole("treegrid").getByText(expectedName)).toBeVisible();
  }

  async addTemplateToFavorites(templateRowName: string) {
    await this.page
      .getByRole("row", { name: templateRowName })
      .getByTestId("button_add-favorite")
      .click();
  }

  async openFavoritesTab() {
    await this.page.getByTestId("nav-link_favorites").locator("svg").nth(1).click();
  }

  async verifyTemplateInFavorites(templateId: string) {
    await expect(this.page.getByTestId(`nav-link_favorite-${templateId}`)).toBeVisible();
  }

  async removeTemplateFromFavorites(templateId: string) {
    await this.page.getByTestId(`nav-link_favorite-${templateId}`).hover();
    await this.page.getByTestId(`button_remove-favorite-${templateId}`).click();
  }

  async verifyFavoritesEmpty() {
    await expect(this.page.getByText("Empty")).toBeVisible();
  }
}
