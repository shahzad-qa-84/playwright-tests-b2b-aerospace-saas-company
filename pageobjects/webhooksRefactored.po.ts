import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";

/**
 * Webhooks Page Object - Refactored Version
 * Handles all webhook management functionality including creation, editing, and deletion
 */
export class WebhooksPage extends BasePage {
  // Webhook input elements
  private readonly addWebhookButton: Locator;
  private readonly webhookNameInput: Locator;
  private readonly webhookUrlInput: Locator;
  private readonly searchWebhookInput: Locator;
  private readonly submitButton: Locator;

  // Event checkboxes
  private readonly workspaceEventCheckbox: Locator;
  private readonly blockEventCheckbox: Locator;
  private readonly bomTableEventCheckbox: Locator;
  private readonly attachmentEventCheckbox: Locator;
  private readonly commentEventCheckbox: Locator;
  private readonly bomTableCellEventCheckbox: Locator;

  // Advanced options
  private readonly advancedOptionsHeading: Locator;
  private readonly advancedOptionsCheckbox: Locator;
  private readonly keyInput: Locator;
  private readonly valueInput: Locator;

  // Action buttons
  private readonly threeDottedMenuButton: Locator;
  private readonly deleteMenuItem: Locator;
  private readonly confirmDeleteButton: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize webhook input locators
    this.addWebhookButton = this.getByTestId("button_add-new-webhook");
    this.webhookNameInput = this.getByPlaceholder("Enter webhook label...");
    this.webhookUrlInput = this.getByPlaceholder("Enter URL...");
    this.searchWebhookInput = this.getByPlaceholder("Search for webhook...");
    this.submitButton = this.getByTestId("button_submit").nth(1);

    // Initialize event checkbox locators
    this.workspaceEventCheckbox = this.locator("label").filter({ hasText: "workspace" }).locator("span");
    this.blockEventCheckbox = this.locator("label").filter({ hasText: "block" }).locator("span");
    this.bomTableEventCheckbox = this.getByText("bom-table", { exact: true });
    this.attachmentEventCheckbox = this.locator("label").filter({ hasText: "attachment" }).locator("span");
    this.commentEventCheckbox = this.locator("label").filter({ hasText: "comment" }).locator("span");
    this.bomTableCellEventCheckbox = this.locator("label").filter({ hasText: "bom-table-cell" }).locator("span");

    // Initialize advanced options locators
    this.advancedOptionsHeading = this.getByRole("heading", { name: "Advanced options" });
    this.advancedOptionsCheckbox = this.locator("div").filter({ hasText: /^Advanced options$/ }).locator("label span");
    this.keyInput = this.getByPlaceholder("Enter key...");
    this.valueInput = this.getByPlaceholder("Enter value...");

    // Initialize action button locators
    this.threeDottedMenuButton = this.getByTestId("button_show-menu").first();
    this.deleteMenuItem = this.getByTestId("menu-item_delete");
    this.confirmDeleteButton = this.getByTestId("button_confirmation-dialog_delete_confirm");
  }

  /**
   * Click Add Webhook button
   */
  async clickAddWebhook(): Promise<void> {
    await this.safeClick(this.addWebhookButton);
  }

  /**
   * Enter webhook name
   */
  async enterWebhookName(name: string): Promise<void> {
    await this.safeClick(this.webhookNameInput);
    await this.safeFill(this.webhookNameInput, name);
  }

  /**
   * Enter webhook URL
   */
  async enterWebhookUrl(url: string): Promise<void> {
    await this.safeClick(this.webhookUrlInput);
    await this.safeFill(this.webhookUrlInput, url);
  }

  /**
   * Select workspace event
   */
  async selectWorkspaceEvent(): Promise<void> {
    await this.safeClick(this.workspaceEventCheckbox);
  }

  /**
   * Select block event
   */
  async selectBlockEvent(): Promise<void> {
    await this.safeClick(this.blockEventCheckbox);
  }

  /**
   * Select BOM table event
   */
  async selectBomTableEvent(): Promise<void> {
    await this.safeClick(this.bomTableEventCheckbox);
  }

  /**
   * Select attachment event
   */
  async selectAttachmentEvent(): Promise<void> {
    await this.safeClick(this.attachmentEventCheckbox);
  }

  /**
   * Select comment event
   */
  async selectCommentEvent(): Promise<void> {
    await this.safeClick(this.commentEventCheckbox);
  }

  /**
   * Open advanced options
   */
  async openAdvancedOptions(): Promise<void> {
    await this.safeClick(this.advancedOptionsHeading);
  }

  /**
   * Select BOM table cell event
   */
  async selectBomTableCellEvent(): Promise<void> {
    await this.safeClick(this.bomTableCellEventCheckbox);
  }

  /**
   * Enable advanced options checkbox
   */
  async enableAdvancedOptions(): Promise<void> {
    await this.safeClick(this.advancedOptionsCheckbox);
  }

  /**
   * Enter advanced options key-value pair
   */
  async enterAdvancedOptions(key: string, value: string): Promise<void> {
    await this.safeClick(this.keyInput);
    await this.safeFill(this.keyInput, key);
    await this.safeFill(this.valueInput, value);
  }

  /**
   * Submit webhook creation
   */
  async submitWebhook(): Promise<void> {
    await this.safeClick(this.submitButton);
  }

  /**
   * Search for webhook
   */
  async searchWebhook(name: string): Promise<void> {
    await this.safeFill(this.searchWebhookInput, name);
  }

  /**
   * Open webhook actions menu
   */
  async openActionsMenu(): Promise<void> {
    await this.safeClick(this.threeDottedMenuButton);
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(): Promise<void> {
    await this.safeClick(this.deleteMenuItem);
    await this.safeClick(this.confirmDeleteButton);
  }

  /**
   * Verify webhook is visible
   */
  async verifyWebhookVisible(name: string): Promise<void> {
    await this.verifyElementVisible(this.getByRole("heading", { name: name }));
  }

  /**
   * Verify no webhooks message
   */
  async verifyNoWebhooksMessage(): Promise<void> {
    await this.verifyElementVisible(this.getByText("You don't have any webhooks meeting the filter criteria"));
  }

  /**
   * Select basic webhook events
   */
  async selectBasicEvents(): Promise<void> {
    await this.selectWorkspaceEvent();
    await this.selectBlockEvent();
    await this.selectBomTableEvent();
    await this.selectAttachmentEvent();
    await this.selectCommentEvent();
  }

  /**
   * Configure advanced webhook options
   */
  async configureAdvancedOptions(key: string, value: string): Promise<void> {
    await this.openAdvancedOptions();
    await this.selectBomTableCellEvent();
    await this.enableAdvancedOptions();
    await this.enterAdvancedOptions(key, value);
  }
}