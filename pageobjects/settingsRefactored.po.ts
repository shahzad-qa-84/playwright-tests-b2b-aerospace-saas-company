import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";

/**
 * Settings Page Object - Refactored Version
 * Handles all settings-related functionality including navigation and profile management
 */
export class SettingsPage extends BasePage {
  // Settings navigation elements
  private readonly settingsMenuItem: Locator;
  private readonly generalSettingsLink: Locator;
  private readonly apiKeysLink: Locator;
  private readonly webhooksLink: Locator;
  private readonly oAuthApplicationsLink: Locator;
  private readonly settingsBackButton: Locator;

  // Profile elements
  private readonly uploadProfilePicButton: Locator;
  private readonly uploadProfilePicInput: Locator;
  private readonly fullNameInput: Locator;
  private readonly roleInput: Locator;
  private readonly departmentInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize settings navigation locators
    this.settingsMenuItem = this.getByTestId("menu-item_settings");
    this.generalSettingsLink = this.getByTestId("nav-link_settings_menu_general");
    this.apiKeysLink = this.getByRole("link", { name: "API keys" });
    this.webhooksLink = this.getByRole("link", { name: "Webhooks" });
    this.oAuthApplicationsLink = this.getByRole("link", { name: "OAuth Applications" });
    this.settingsBackButton = this.getByTestId("button_settings-back-button");

    // Initialize profile locators
    this.uploadProfilePicButton = this.getByTestId("button_upload-file-button_upload-profile-photo");
    this.uploadProfilePicInput = this.getByTestId("input_upload-file-input_upload-profile-photo");
    this.fullNameInput = this.locator(".name-email-area label:nth-child(1) input:nth-child(1)");
    this.roleInput = this.locator("#app > div.settings-layout > div.settings-layout--content-pane > div > div:nth-child(5) > div > label:nth-child(1) > div > input");
    this.departmentInput = this.locator(".user-details-area label:nth-child(2) input");
    this.submitButton = this.getByTestId("button_settings-account_submit");
  }

  /**
   * Navigate to Settings
   */
  async clickSettings(): Promise<void> {
    await this.safeClick(this.settingsMenuItem);
  }

  /**
   * Navigate to General Settings
   */
  async clickGeneralSettings(): Promise<void> {
    await this.safeClick(this.generalSettingsLink);
  }

  /**
   * Navigate to API Keys section
   */
  async clickApiKeys(): Promise<void> {
    await this.safeClick(this.apiKeysLink);
  }

  /**
   * Navigate to Webhooks section
   */
  async clickWebhooks(): Promise<void> {
    await this.safeClick(this.webhooksLink);
  }

  /**
   * Navigate to OAuth Applications
   */
  async clickOAuthApplications(): Promise<void> {
    await this.safeClick(this.oAuthApplicationsLink);
  }

  /**
   * Go back from settings
   */
  async clickBackFromSettings(): Promise<void> {
    await this.safeClick(this.settingsBackButton);
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePic(picturePath: string): Promise<void> {
    await this.uploadFile(this.uploadProfilePicInput, picturePath);
    await this.reloadPage();
  }

  /**
   * Enter full name
   */
  async enterFullName(fullname: string): Promise<void> {
    await this.safeClick(this.fullNameInput);
    await this.fullNameInput.press("Meta+a");
    await this.safeFill(this.fullNameInput, fullname);
  }

  /**
   * Enter role
   */
  async enterRole(role: string): Promise<void> {
    await this.safeClick(this.roleInput);
    await this.roleInput.press("Meta+a");
    await this.safeFill(this.roleInput, role);
  }

  /**
   * Enter department
   */
  async enterDepartment(department: string): Promise<void> {
    await this.safeClick(this.departmentInput);
    await this.departmentInput.press("Meta+a");
    await this.safeFill(this.departmentInput, department);
  }

  /**
   * Submit settings changes
   */
  async clickSubmit(): Promise<void> {
    await this.safeClick(this.submitButton);
  }

  /**
   * Complete profile update workflow
   */
  async updateProfileInformation(fullName: string, role: string, department: string): Promise<void> {
    await this.enterFullName(fullName);
    await this.enterRole(role);
    await this.enterDepartment(department);
    await this.clickSubmit();
  }

  /**
   * Upload company logo
   */
  async uploadCompanyLogo(logoPath: string): Promise<void> {
    const logoInput = this.getByTestId("input_upload-file-input_upload-company-logo");
    await this.uploadFile(logoInput, logoPath);
    await this.reloadPage();
  }

  /**
   * Get current avatar source
   */
  async getCurrentAvatarSrc(): Promise<string | null> {
    const avatarImg = this.locator('img[class="org-profile-area--avatar-image"]');
    return await avatarImg.getAttribute("src");
  }

  /**
   * Get new avatar source
   */
  async getNewAvatarSrc(): Promise<string | null> {
    const avatarImg = this.locator('img[alt="User avatar"]');
    return await avatarImg.getAttribute("src");
  }

  /**
   * Verify avatar has changed
   */
  async verifyAvatarChanged(oldSrc: string | null, newSrc: string | null): Promise<void> {
    const extractedOldSrc = oldSrc?.split(".amazonaws.com/")[1];
    const extractedNewSrc = newSrc?.split(".amazonaws.com/")[1];
    
    // Verify sources are different
    if (extractedOldSrc === extractedNewSrc) {
      throw new Error("Avatar source did not change");
    }
  }

  /**
   * Enter organization name
   */
  async enterOrganizationName(name: string): Promise<void> {
    const orgNameInput = this.getByPlaceholder("Enter organization name...");
    await this.safeClick(orgNameInput);
    await this.safeFill(orgNameInput, name);
  }

  /**
   * Enter organization description
   */
  async enterOrganizationDescription(description: string): Promise<void> {
    const descInput = this.getByPlaceholder("Enter organization description...");
    await this.safeClick(descInput);
    await descInput.press("Meta+a");
    await this.safeFill(descInput, description);
  }

  /**
   * Add company domain tag
   */
  async addCompanyDomain(domain: string): Promise<void> {
    const domainInput = this.getByTestId("input_company-domains");
    await this.safeFill(domainInput.getByRole("textbox"), domain);
    await domainInput.getByRole("textbox").press("Enter");
  }

  /**
   * Remove company domain tag
   */
  async removeCompanyDomain(): Promise<void> {
    await this.safeClick(this.getByLabel("Remove tag").nth(1));
  }

  /**
   * Submit settings form
   */
  async submitSettings(): Promise<void> {
    await this.safeClick(this.getByTestId("button_settings_submit"));
  }

  /**
   * Verify organization info updated message
   */
  async verifyOrganizationInfoUpdated(): Promise<void> {
    await this.verifyElementVisible(this.getByText("Organization info updated"));
  }

  /**
   * Verify domain tag is visible
   */
  async verifyDomainTagVisible(domain: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(domain));
  }

  /**
   * Verify domain tag is hidden
   */
  async verifyDomainTagHidden(domain: string): Promise<void> {
    await this.verifyElementHidden(this.getByText(domain));
  }
}