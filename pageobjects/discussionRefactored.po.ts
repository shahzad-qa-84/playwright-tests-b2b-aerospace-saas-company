import { Locator } from "@playwright/test";
import { BasePage } from "./base.po";

/**
 * Discussion Page Object - Refactored Version
 * Handles all discussion, comments, and history functionality
 */
export class DiscussionPage extends BasePage {
  // Discussion elements
  private readonly discussionTab: Locator;
  private readonly historyTab: Locator;
  private readonly commentsTab: Locator;
  private readonly commentEditor: Locator;
  private readonly commentEditorContent: Locator;
  private readonly sendCommentButton: Locator;
  private readonly commentActionsMenu: Locator;
  private readonly copyLinkMenuItem: Locator;
  private readonly historyCommentsToggle: Locator;
  private readonly programmaticsToggle: Locator;

  constructor(page: any) {
    super(page);
    
    // Initialize discussion locators
    this.discussionTab = this.getByText("Discussion");
    this.historyTab = this.getByText("History");
    this.commentsTab = this.getByTestId("tab_comments");
    this.commentEditor = this.locator(".comment-editor");
    this.commentEditorContent = this.getByTestId("editor-content_comment-editor");
    this.sendCommentButton = this.getByTestId("button_comment-editor-send");
    this.commentActionsMenu = this.getByTestId("button_comment-actions-menu");
    this.copyLinkMenuItem = this.getByTestId("menu-item_copy-link");
    this.historyCommentsToggle = this.getByTestId("button_toggle-history-and-comments-panel");
    this.programmaticsToggle = this.getByTestId("button_toggle-programmatics-panel");
  }

  /**
   * Navigate to Discussion section
   */
  async openDiscussion(): Promise<void> {
    await this.safeClick(this.discussionTab);
  }

  /**
   * Add a comment to the discussion
   */
  async addComment(commentText: string): Promise<void> {
    await this.safeClick(this.getByRole("paragraph"));
    await this.safeFill(this.commentEditorContent, commentText);
    await this.safeClick(this.sendCommentButton);
  }

  /**
   * Verify comment is visible
   */
  async verifyCommentVisible(commentText: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(commentText));
  }

  /**
   * Navigate to History tab
   */
  async clickHistory(): Promise<void> {
    await this.safeClick(this.historyTab);
  }

  /**
   * Verify comment appears in history
   */
  async verifyCommentInHistory(commentText: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(commentText).first());
  }

  /**
   * Toggle history and comments panel
   */
  async toggleHistoryCommentsPanel(): Promise<void> {
    await this.safeClick(this.historyCommentsToggle);
  }

  /**
   * Toggle programmatics panel
   */
  async toggleProgrammaticsPanel(): Promise<void> {
    await this.safeClick(this.programmaticsToggle);
  }

  /**
   * Open comment actions menu and copy link
   */
  async copyCommentLink(commentText: string): Promise<void> {
    await this.safeClick(this.getByText(commentText));
    await this.commentActionsMenu.hover();
    await this.safeClick(this.commentActionsMenu);
    await this.safeClick(this.copyLinkMenuItem);
  }

  /**
   * Switch to Comments tab
   */
  async switchToCommentsTab(): Promise<void> {
    await this.safeClick(this.commentsTab);
  }

  /**
   * Add comment using comment editor
   */
  async addCommentInEditor(commentText: string): Promise<void> {
    await this.safeClick(this.commentEditor);
    await this.safeFill(this.commentEditorContent, commentText);
    await this.safeClick(this.sendCommentButton);
  }

  /**
   * Complete comment workflow with verification
   */
  async addCommentWithVerification(commentText: string): Promise<void> {
    await this.addComment(commentText);
    await this.verifyCommentVisible(commentText);
  }

  /**
   * Complete history verification workflow
   */
  async verifyCommentInHistoryWorkflow(commentText: string): Promise<void> {
    await this.clickHistory();
    await this.verifyCommentInHistory(commentText);
  }

  /**
   * Complete comment copy link workflow
   */
  async copyCommentLinkWorkflow(commentText: string): Promise<void> {
    await this.toggleHistoryCommentsPanel();
    await this.toggleProgrammaticsPanel();
    await this.copyCommentLink(commentText);
  }

  /**
   * Complete comments tab workflow
   */
  async addCommentInTabWorkflow(commentText: string): Promise<void> {
    await this.switchToCommentsTab();
    await this.addCommentInEditor(commentText);
    await this.switchToCommentsTab();
    await this.verifyCommentVisible(commentText);
  }

  /**
   * Apply strike formatting
   */
  async applyStrike(): Promise<void> {
    await this.safeClick(this.getByTestId("button_comment-editor-action_strike"));
  }

  /**
   * Add list items to comment
   */
  async addListItems(items: string[]): Promise<void> {
    const commentBox = this.locator(".ProseMirror").first();
    for (const item of items) {
      await commentBox.type(item);
      await commentBox.press("Enter");
    }
  }

  /**
   * Select all text in comment editor
   */
  async selectAllText(): Promise<void> {
    const content = this.locator(".ProseMirror").first();
    await content.press("Meta+a"); // for macOS; use "Control+a" on Windows
  }

  /**
   * Apply ordered list formatting
   */
  async applyOrderedList(): Promise<void> {
    await this.safeClick(this.getByTestId("button_comment-editor-action_orderedlist"));
  }

  /**
   * Send comment
   */
  async sendComment(): Promise<void> {
    await this.safeClick(this.sendCommentButton.first());
  }

  /**
   * Verify text is visible
   */
  async expectTextVisible(text: string): Promise<void> {
    await this.verifyElementVisible(this.getByText(text));
  }

  /**
   * Attach image to comment
   */
  async attachImage(imagePath: string): Promise<void> {
    await this.safeClick(this.getByTestId("button_comment-editor-action_image"));
    const fileInput = this.locator(".file-drop-zone--input.cursor-pointer.file-drop-zone--input-active").first();
    await this.uploadFile(fileInput, imagePath);
  }

  /**
   * Verify image is visible in editor
   */
  async expectImageVisibleInEditor(): Promise<void> {
    const editor = this.getByTestId("editor-content_comment-editor");
    await this.verifyElementVisible(editor.getByRole("img"));
  }

  /**
   * Open link editor
   */
  async openLinkEditor(): Promise<void> {
    await this.safeClick(this.getByTestId("button_comment-editor-action_link").first());
    await this.verifyElementVisible(this.getByRole("heading", { name: "Add link" }));
  }

  /**
   * Unset link (cancel link addition)
   */
  async unsetLink(): Promise<void> {
    await this.safeFill(this.getByPlaceholder("Text"), "b2bSaas link");
    await this.safeFill(this.getByPlaceholder("example.com"), "https://app.b2bSaas.ai");
    await this.safeClick(this.getByRole("button", { name: "Unset" }));
    await this.verifyElementHidden(this.getByRole("heading", { name: "Add link" }));
  }

  /**
   * Add link with text and URL
   */
  async addLinkWithText(text: string, url: string): Promise<void> {
    await this.safeClick(this.getByTestId("button_comment-editor-action_link").first());
    await this.safeFill(this.getByPlaceholder("Text"), text);
    await this.safeFill(this.getByPlaceholder("example.com"), url);
    await this.safeClick(this.getByRole("button", { name: "Save" }));
  }

  /**
   * Click inserted link in comment
   */
  async clickInsertedLink(linkText: string): Promise<void> {
    await this.safeClick(this.getByRole("link", { name: linkText }));
  }
}