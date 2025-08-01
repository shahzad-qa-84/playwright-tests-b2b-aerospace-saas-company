import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";

/**
 * Template Manager Page Object - Refactored Version
 * Handles all template management functionality including favourites
 */
export class TemplateManagerPage extends BasePage {
  // Template navigation elements
  private readonly templateListButton: Locator;
  private readonly useTemplateButton: Locator;
  private readonly favoritesTab: Locator;

  // Template elements
  private readonly untitledPlaceholder: Locator;
  private readonly templateTreeGrid: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize template navigation locators
    this.templateListButton = this.getByTestId("button_reports-teamplates-btn");
    this.useTemplateButton = this.getByTestId("button_use-template-btn");
    this.favoritesTab = this.getByTestId("nav-link_favorites").locator("svg").nth(1);

    // Initialize template elements
    this.untitledPlaceholder = this.getByPlaceholder("Untitled").first();
    this.templateTreeGrid = this.getByRole("treegrid");
  }

  /**
   * Open template list
   */
  async openTemplateList(): Promise<void> {
    await this.safeClick(this.templateListButton);
  }

  /**
   * Select template by name
   */
  async selectTemplateByName(templateName: string): Promise<void> {
    await this.safeClick(this.getByRole("menuitem", { name: templateName }));
  }

  /**
   * Use selected template
   */
  async useSelectedTemplate(): Promise<void> {
    await this.safeClick(this.useTemplateButton);
  }

  /**
   * Verify template is loaded
   */
  async verifyTemplateLoaded(expectedName: string): Promise<void> {
    await this.verifyElementVisible(this.untitledPlaceholder);
    await this.verifyElementVisible(this.templateTreeGrid.getByText(expectedName));
  }

  /**
   * Add template to favorites
   */
  async addTemplateToFavorites(templateRowName: string): Promise<void> {
    const templateRow = this.getByRole("row", { name: templateRowName });
    const addFavoriteButton = templateRow.getByTestId("button_add-favorite");
    await this.safeClick(addFavoriteButton);
  }

  /**
   * Open favorites tab
   */
  async openFavoritesTab(): Promise<void> {
    await this.safeClick(this.favoritesTab);
  }

  /**
   * Verify template is in favorites
   */
  async verifyTemplateInFavorites(templateId: string): Promise<void> {
    await this.verifyElementVisible(this.getByTestId(`nav-link_favorite-${templateId}`));
  }

  /**
   * Remove template from favorites
   */
  async removeTemplateFromFavorites(templateId: string): Promise<void> {
    const favoriteLink = this.getByTestId(`nav-link_favorite-${templateId}`);
    const removeFavoriteButton = this.getByTestId(`button_remove-favorite-${templateId}`);
    
    await favoriteLink.hover();
    await this.safeClick(removeFavoriteButton);
  }

  /**
   * Verify favorites is empty
   */
  async verifyFavoritesEmpty(): Promise<void> {
    await this.verifyElementVisible(this.getByText("Empty"));
  }

  /**
   * Select and use template workflow
   */
  async selectAndUseTemplate(templateName: string): Promise<void> {
    await this.openTemplateList();
    await this.selectTemplateByName(templateName);
    await this.useSelectedTemplate();
  }

  /**
   * Complete add to favorites workflow
   */
  async addToFavoritesWorkflow(templateRowName: string, templateId: string): Promise<void> {
    await this.addTemplateToFavorites(templateRowName);
    await this.openFavoritesTab();
    await this.verifyTemplateInFavorites(templateId);
  }

  /**
   * Complete remove from favorites workflow
   */
  async removeFromFavoritesWorkflow(templateId: string): Promise<void> {
    await this.removeTemplateFromFavorites(templateId);
    await this.verifyFavoritesEmpty();
  }
}