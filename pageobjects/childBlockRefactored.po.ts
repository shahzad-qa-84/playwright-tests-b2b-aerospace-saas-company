import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";
import { SELECTORS } from "../utilities/constants";

/**
 * Child Block Page Object - Refactored Version
 * Handles all child block functionality including creation, management, and verification
 */
export class ChildBlockPage extends BasePage {
  // Child block input elements
  private readonly childBlockInput: Locator;
  private readonly subChildBlockInput: Locator;
  private readonly childNameInput: Locator;
  private readonly childBlocksSection: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize child block locators
    this.childBlockInput = this.getByPlaceholder("Add new child block");
    this.subChildBlockInput = this.getByRole("dialog", { name: "Add new child block" }).getByPlaceholder("Add new child block");
    this.childNameInput = this.getByRole("menu").filter({ hasText: "NameAdd child blockMultiplicityDelete" }).getByRole("textbox");
    this.childBlocksSection = this.getByText("Child Blocks");
  }

  /**
   * Navigate to Child Blocks section
   */
  async clickChildBlocks(): Promise<void> {
    await this.safeClick(this.childBlocksSection);
  }

  /**
   * Create a child block from the main bar
   */
  async createChildBlockFromMainBar(childBlockName: string): Promise<void> {
    await this.safeClick(this.childBlockInput);
    await this.safeFill(this.childBlockInput, childBlockName);
    await this.childBlockInput.press("Enter");
  }

  /**
   * Create a sub child block from the sidebar
   */
  async createSubChildBlockFromSideBar(childBlockName: string): Promise<void> {
    await this.safeClick(this.getByRole("menuitem", { name: "Add child block" }));
    await this.safeClick(this.subChildBlockInput);
    await this.safeFill(this.subChildBlockInput, childBlockName);
    await this.subChildBlockInput.press("Enter");
  }

  /**
   * Verify child count is displayed
   */
  async verifyChildCount(expectedCount: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(expectedCount, { exact: true }));
  }

  /**
   * Click on a child block by name
   */
  async clickChildByName(childName: string): Promise<void> {
    const childElement = this.getByText(childName).nth(1);
    await this.safeClick(childElement);
  }

  /**
   * Verify "no children" message is displayed
   */
  async verifyNoChildrenMessage(): Promise<void> {
    const noChildrenHeading = this.getByRole("heading", { name: "This block has no children." }).first();
    await this.verifyElementVisible(noChildrenHeading);
  }

  /**
   * Click on "New System" text
   */
  async clickNewSystem(): Promise<void> {
    await this.safeClick(this.getByRole("list").getByText("New System"));
  }

  /**
   * Rename a child block by position
   */
  async renameChild(childPosition: number, newName: string): Promise<void> {
    const adjustedPosition = childPosition - 1; // Convert to 0-based index
    const actionMenu = this.locator('[data-testid*="button_child-block-list-item-action-menu_"]').nth(adjustedPosition);
    await this.safeClick(actionMenu);
    
    const nameInput = this.getByTestId("input_document-name-input");
    await this.safeClick(nameInput);
    await this.safeFill(nameInput, newName);
    await nameInput.press("Enter");
  }

  /**
   * Delete a child block by position
   */
  async deleteChild(childPosition: number): Promise<void> {
    const actionMenu = this.locator('[data-testid*="button_child-block-list-item-action-menu_"]').nth(childPosition);
    await this.safeClick(actionMenu);
    await this.safeClick(this.getByRole("menuitem", { name: "Delete" }));
  }

  /**
   * Verify child block is hidden/deleted
   */
  async verifyChildDeleted(childName: string): Promise<void> {
    const childElement = this.getByText(childName, { exact: true }).first();
    await this.verifyElementHidden(childElement);
  }

  /**
   * Expand child details by name
   */
  async expandChildDetails(childName: string): Promise<void> {
    const childContainer = this.locator("li").filter({ hasText: childName });
    const expandIcon = childContainer.locator("svg").first();
    await this.safeClick(expandIcon);
  }

  /**
   * Complete child block creation and verification workflow
   */
  async createChildBlockWithVerification(childName: string, expectedCount: string): Promise<void> {
    await this.createChildBlockFromMainBar(childName);
    await this.verifyChildCount(expectedCount);
  }
}