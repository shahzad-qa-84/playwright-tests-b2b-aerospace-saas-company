import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";

/**
 * OAuth Application Page Object - Refactored Version
 * Handles all OAuth application management functionality including creation, editing, and deletion
 */
export class OAuthApplicationPage extends BasePage {
  // OAuth Application input elements
  private readonly addOAuthApplicationButton: Locator;
  private readonly applicationNameInput: Locator;
  private readonly logoUrlInput: Locator;
  private readonly developerNameInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly developerUrlInput: Locator;
  private readonly callbackUrlInput: Locator;
  private readonly searchOAuthInput: Locator;

  // Action buttons
  private readonly addCallbackButton: Locator;
  private readonly deleteUrlButton: Locator;
  private readonly createButton: Locator;
  private readonly updateButton: Locator;
  private readonly threeDottedMenuButton: Locator;
  private readonly deleteMenuItem: Locator;
  private readonly confirmDeleteButton: Locator;

  // Webhooks section
  private readonly webhookHeading: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize OAuth application input locators
    this.addOAuthApplicationButton = this.getByTestId("button_add-new-oauth-application");
    this.applicationNameInput = this.getByPlaceholder("Enter application name...");
    this.logoUrlInput = this.getByPlaceholder("Enter logo URL...");
    this.developerNameInput = this.getByPlaceholder("Enter developer name...");
    this.descriptionInput = this.getByPlaceholder("Enter description name...");
    this.developerUrlInput = this.getByPlaceholder("Enter developer URL...");
    this.callbackUrlInput = this.getByPlaceholder("Enter callback URL...");
    this.searchOAuthInput = this.getByPlaceholder("Search for OAuth application...");

    // Initialize action button locators
    this.addCallbackButton = this.getByTestId("button_add-callback");
    this.deleteUrlButton = this.getByTestId("button_delete-url");
    this.createButton = this.getByTestId("button_update-create").nth(1);
    this.updateButton = this.getByTestId("button_update-create");
    this.threeDottedMenuButton = this.getByTestId("button_show-menu").first();
    this.deleteMenuItem = this.getByTestId("menu-item_delete");
    this.confirmDeleteButton = this.getByTestId("button_confirmation-dialog_delete_confirm");

    // Initialize webhook locators
    this.webhookHeading = this.getByRole("heading", { name: "Webhook" });
  }

  /**
   * Click Add OAuth Application button
   */
  async clickAddOAuthApplication(): Promise<void> {
    await this.safeClick(this.addOAuthApplicationButton);
  }

  /**
   * Enter application name
   */
  async enterApplicationName(name: string): Promise<void> {
    await this.safeClick(this.applicationNameInput);
    await this.safeFill(this.applicationNameInput, name);
  }

  /**
   * Enter logo URL
   */
  async enterLogoUrl(url: string): Promise<void> {
    await this.safeClick(this.logoUrlInput);
    await this.safeFill(this.logoUrlInput, url);
  }

  /**
   * Enter developer name
   */
  async enterDeveloperName(name: string): Promise<void> {
    await this.safeClick(this.developerNameInput);
    await this.safeFill(this.developerNameInput, name);
  }

  /**
   * Enter description
   */
  async enterDescription(description: string): Promise<void> {
    await this.safeClick(this.descriptionInput);
    await this.safeFill(this.descriptionInput, description);
  }

  /**
   * Enter developer URL
   */
  async enterDeveloperUrl(url: string): Promise<void> {
    await this.safeClick(this.developerUrlInput);
    await this.safeFill(this.developerUrlInput, url);
  }

  /**
   * Add callback URL
   */
  async addCallbackUrl(): Promise<void> {
    await this.safeClick(this.addCallbackButton);
  }

  /**
   * Delete callback URL
   */
  async deleteCallbackUrl(): Promise<void> {
    await this.safeClick(this.deleteUrlButton.first());
  }

  /**
   * Delete all callback URLs
   */
  async deleteAllCallbackUrls(): Promise<void> {
    await this.safeClick(this.deleteUrlButton.first());
    await this.safeClick(this.deleteUrlButton);
  }

  /**
   * Enter callback URL
   */
  async enterCallbackUrl(url: string): Promise<void> {
    await this.safeClick(this.callbackUrlInput);
    await this.safeFill(this.callbackUrlInput, url);
  }

  /**
   * Click webhook section
   */
  async clickWebhookSection(): Promise<void> {
    await this.safeClick(this.webhookHeading);
  }

  /**
   * Create OAuth application
   */
  async createOAuthApplication(): Promise<void> {
    await this.safeClick(this.createButton);
  }

  /**
   * Search for OAuth application
   */
  async searchOAuthApplication(name: string): Promise<void> {
    await this.safeClick(this.searchOAuthInput);
    await this.safeFill(this.searchOAuthInput, name);
    await this.safeClick(this.getByRole("heading", { name: name }));
  }

  /**
   * Open OAuth application actions menu
   */
  async openActionsMenu(): Promise<void> {
    await this.safeClick(this.threeDottedMenuButton);
  }

  /**
   * Delete OAuth application
   */
  async deleteOAuthApplication(): Promise<void> {
    await this.safeClick(this.deleteMenuItem);
    await this.safeClick(this.confirmDeleteButton);
  }

  /**
   * Verify OAuth application is visible
   */
  async verifyOAuthApplicationVisible(name: string): Promise<void> {
    await this.verifyElementVisible(this.getByRole("heading", { name: name }));
  }

  /**
   * Verify no OAuth applications message
   */
  async verifyNoOAuthApplicationsMessage(): Promise<void> {
    await this.verifyElementVisible(this.getByText("You don't have any OAuth applications meeting the filter criteria"));
  }

  /**
   * Fill basic OAuth application information
   */
  async fillBasicApplicationInfo(name: string, developerName: string, description: string): Promise<void> {
    await this.enterApplicationName(name);
    await this.enterLogoUrl("https://b2bSaas-avatars-dev.s3.us-west-1.amazonaws.com/b2bSaas-logo.png");
    await this.enterDeveloperName(developerName);
    await this.enterDescription(description);
    await this.enterDeveloperUrl("https://b2bSaas.ai");
  }

  /**
   * Configure callback URLs
   */
  async configureCallbackUrls(callbackUrl: string): Promise<void> {
    await this.addCallbackUrl();
    await this.deleteAllCallbackUrls();
    await this.enterCallbackUrl(callbackUrl);
  }

  /**
   * Complete OAuth application creation
   */
  async completeOAuthApplicationCreation(name: string): Promise<void> {
    await this.clickWebhookSection();
    await this.createOAuthApplication();
    await this.verifyOAuthApplicationVisible(name);
  }
}