import { Page, Locator, expect } from "@playwright/test";

/**
 * Base Page Object class that provides common functionality for all page objects
 * Implements common patterns and best practices for Playwright automation
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly timeout: number;

  constructor(page: Page, timeout: number = 30000) {
    this.page = page;
    this.timeout = timeout;
  }

  /**
   * Wait for an element to be visible
   */
  protected async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: timeout || this.timeout });
  }

  /**
   * Wait for an element to be hidden
   */
  protected async waitForElementToHide(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "hidden", timeout: timeout || this.timeout });
  }

  /**
   * Safe click with wait
   */
  protected async safeClick(locator: Locator, timeout?: number): Promise<void> {
    await this.waitForElement(locator, timeout);
    await locator.click();
  }

  /**
   * Safe fill with wait and clear
   */
  protected async safeFill(locator: Locator, text: string, timeout?: number): Promise<void> {
    await this.waitForElement(locator, timeout);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Safe type with wait
   */
  protected async safeType(locator: Locator, text: string, timeout?: number): Promise<void> {
    await this.waitForElement(locator, timeout);
    await locator.type(text);
  }

  /**
   * Wait for loading to complete (spinner to disappear)
   */
  protected async waitForLoading(timeout: number = 150000): Promise<void> {
    await this.page.waitForSelector(".bp5-spinner-head", {
      state: "hidden",
      timeout: timeout,
    });
  }

  /**
   * Wait for a specific time
   */
  protected async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Get element by test ID
   */
  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Get element by role
   */
  protected getByRole(role: string, options?: { name?: string; exact?: boolean }): Locator {
    return this.page.getByRole(role as any, options);
  }

  /**
   * Get element by text
   */
  protected getByText(text: string, options?: { exact?: boolean }): Locator {
    return this.page.getByText(text, options);
  }

  /**
   * Get element by placeholder
   */
  protected getByPlaceholder(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder);
  }

  /**
   * Get element by label
   */
  protected getByLabel(label: string): Locator {
    return this.page.getByLabel(label);
  }

  /**
   * Get element by CSS selector
   */
  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Upload file to input element
   */
  protected async uploadFile(locator: Locator, filePath: string): Promise<void> {
    await locator.setInputFiles(filePath);
  }

  /**
   * Verify element is visible
   */
  protected async verifyElementVisible(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator).toBeVisible({ timeout: timeout || this.timeout });
  }

  /**
   * Verify element is hidden
   */
  protected async verifyElementHidden(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator).toBeHidden({ timeout: timeout || this.timeout });
  }

  /**
   * Verify text content
   */
  protected async verifyTextContent(locator: Locator, expectedText: string, timeout?: number): Promise<void> {
    await expect(locator).toHaveText(expectedText, { timeout: timeout || this.timeout });
  }

  /**
   * Select option from dropdown
   */
  protected async selectOption(dropdownLocator: Locator, optionText: string): Promise<void> {
    await this.safeClick(dropdownLocator);
    await this.safeClick(this.getByText(optionText));
  }

  /**
   * Handle dialog/modal confirmation
   */
  protected async handleDialog(accept: boolean = true): Promise<void> {
    this.page.on("dialog", async (dialog) => {
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Scroll element into view
   */
  protected async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Get current page URL
   */
  protected getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Navigate to URL
   */
  protected async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Reload current page
   */
  protected async reloadPage(): Promise<void> {
    await this.page.reload();
  }
}