import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";

/**
 * API Key Page Object - Refactored Version
 * Handles all API key management functionality including creation, editing, and deletion
 */
export class ApiKeyPage extends BasePage {
  // API Key input elements
  private readonly addApiKeyButton: Locator;
  private readonly apiKeyNameInput: Locator;
  private readonly searchApiKeyInput: Locator;
  private readonly createButton: Locator;
  private readonly updateButton: Locator;
  private readonly threeDottedMenuButton: Locator;
  private readonly editMenuItem: Locator;
  private readonly deleteMenuItem: Locator;
  private readonly confirmDeleteButton: Locator;

  // Rights/Permissions checkboxes
  private readonly workspacesRightsCheckbox: Locator;
  private readonly blocksRightsCheckbox: Locator;
  private readonly webhooksRightsCheckbox: Locator;
  private readonly propertyInstancesRightsCheckbox: Locator;
  private readonly propertyDefinitionsRightsCheckbox: Locator;
  private readonly attachmentsRightsCheckbox: Locator;
  private readonly discussionRightsCheckbox: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize API key input locators
    this.addApiKeyButton = this.getByTestId("button_new-api-keu");
    this.apiKeyNameInput = this.getByPlaceholder("Enter API key label...");
    this.searchApiKeyInput = this.getByPlaceholder("Search for API key...");
    this.createButton = this.locator("div").filter({ hasText: /^Create API keyCreate$/ }).getByTestId("button_update-create");
    this.updateButton = this.locator("div").filter({ hasText: /^Edit API keyUpdate$/ }).getByTestId("button_update-create");
    this.threeDottedMenuButton = this.getByTestId("button_show-menu").first();
    this.editMenuItem = this.getByTestId("menu-item_edit");
    this.deleteMenuItem = this.getByTestId("menu-item_delete");
    this.confirmDeleteButton = this.getByTestId("button_confirmation-dialog_delete_confirm");

    // Initialize rights/permissions locators
    this.workspacesRightsCheckbox = this.locator("label").filter({ hasText: /^workspaces$/ }).locator("span");
    this.blocksRightsCheckbox = this.locator("label").filter({ hasText: /^blocks$/ }).locator("span");
    this.webhooksRightsCheckbox = this.locator("label").filter({ hasText: /^webhooks$/ }).locator("span");
    this.propertyInstancesRightsCheckbox = this.locator("label").filter({ hasText: /^properties-instances$/ }).locator("span");
    this.propertyDefinitionsRightsCheckbox = this.locator("label").filter({ hasText: /^properties-definitions$/ }).locator("span");
    this.attachmentsRightsCheckbox = this.locator("label").filter({ hasText: /^attachments$/ }).locator("span");
    this.discussionRightsCheckbox = this.locator("label").filter({ hasText: /^discussions$/ }).locator("span");
  }

  /**
   * Click Add API Key button
   */
  async clickAddApiKey(): Promise<void> {
    await this.safeClick(this.addApiKeyButton);
  }

  /**
   * Enter API key name
   */
  async enterApiKeyName(name: string): Promise<void> {
    await this.safeClick(this.apiKeyNameInput);
    await this.safeFill(this.apiKeyNameInput, name);
  }

  /**
   * Select Workspaces rights
   */
  async selectWorkspacesRights(): Promise<void> {
    await this.safeClick(this.workspacesRightsCheckbox);
  }

  /**
   * Select Blocks rights
   */
  async selectBlocksRights(): Promise<void> {
    await this.safeClick(this.blocksRightsCheckbox);
  }

  /**
   * Select Webhooks rights
   */
  async selectWebhooksRights(): Promise<void> {
    await this.safeClick(this.webhooksRightsCheckbox);
  }

  /**
   * Select Property Instances rights
   */
  async selectPropertyInstancesRights(): Promise<void> {
    await this.safeClick(this.propertyInstancesRightsCheckbox);
  }

  /**
   * Select Property Definitions rights
   */
  async selectPropertyDefinitionsRights(): Promise<void> {
    await this.safeClick(this.propertyDefinitionsRightsCheckbox);
  }

  /**
   * Select Attachments rights
   */
  async selectAttachmentsRights(): Promise<void> {
    await this.safeClick(this.attachmentsRightsCheckbox);
  }

  /**
   * Select Discussion rights
   */
  async selectDiscussionRights(): Promise<void> {
    await this.safeClick(this.discussionRightsCheckbox);
  }

  /**
   * Click Create button
   */
  async clickCreate(): Promise<void> {
    await this.safeClick(this.createButton);
  }

  /**
   * Search for API key
   */
  async searchApiKey(name: string): Promise<void> {
    await this.safeClick(this.searchApiKeyInput);
    const searchSpan = this.locator("div").filter({ hasText: /^API keysAdd API key$/ }).locator("span").first();
    await this.safeClick(searchSpan);
    await this.safeFill(this.searchApiKeyInput, name);
  }

  /**
   * Clear API key search
   */
  async clearApiKeySearch(): Promise<void> {
    await this.safeClick(this.searchApiKeyInput);
    await this.searchApiKeyInput.press("Meta+a");
    await this.safeFill(this.searchApiKeyInput, "");
  }

  /**
   * Open API key actions menu
   */
  async openActionsMenu(): Promise<void> {
    await this.safeClick(this.threeDottedMenuButton);
  }

  /**
   * Edit API key name
   */
  async editApiKeyName(newName: string): Promise<void> {
    await this.safeClick(this.editMenuItem);
    await this.safeClick(this.apiKeyNameInput);
    await this.apiKeyNameInput.press("Meta+a");
    await this.safeFill(this.apiKeyNameInput, newName);
    await this.safeClick(this.updateButton);
  }

  /**
   * Delete API key
   */
  async deleteApiKey(): Promise<void> {
    await this.safeClick(this.deleteMenuItem);
    await this.safeClick(this.confirmDeleteButton);
  }

  /**
   * Verify API key is visible
   */
  async verifyApiKeyVisible(apiKeyName: string): Promise<void> {
    await this.verifyElementVisible(this.getByRole("heading", { name: apiKeyName }));
  }

  /**
   * Verify no API keys message
   */
  async verifyNoApiKeysMessage(): Promise<void> {
    await this.verifyElementVisible(this.getByText("You don't have any API keys meeting the filter criteria"));
  }

  /**
   * Set basic API key permissions
   */
  async setBasicPermissions(): Promise<void> {
    await this.selectWorkspacesRights();
    await this.selectBlocksRights();
    await this.selectWebhooksRights();
  }

  /**
   * Complete API key creation workflow
   */
  async createApiKeyWithBasicPermissions(apiKeyName: string): Promise<void> {
    await this.clickAddApiKey();
    await this.enterApiKeyName(apiKeyName);
    await this.setBasicPermissions();
    await this.clickCreate();
  }

  /**
   * Complete API key update workflow
   */
  async updateApiKeyName(oldName: string, newName: string): Promise<void> {
    await this.openActionsMenu();
    await this.editApiKeyName(newName);
    await this.clearApiKeySearch();
    await this.searchApiKey(newName);
  }
}