// constants.ts

/**
 * Environment-specific configuration
 */
export const ENVIRONMENTS = {
  ASTRONAUT_DOLPHINS: {
    userEmail: "testing+dev@b2bSaas.ai",
  },
  LOCALHOST: {
    userEmail: "testing+dev@b2bSaas.ai",
  },
  PENGUIN_WARBEAR: {
    userEmail: "testing@b2bSaas.ai",
  },
  b2bSaas_AI: {
    userEmail: "testing+prod@b2bSaas.ai",
  },
  VERCEL: {
    userEmail: "testing+features@b2bSaas.ai",
  },
};

/**
 * Common CSS selectors and classes
 */
export const SELECTORS = {
  // BlueprintJS classes
  BUTTON: "bp5-button",
  ICON: "bp5-icon",
  MENU_ITEM: "bp5-menu-item",
  POPOVER_DISMISS: "bp5-popover-dismiss",
  SPINNER: ".bp5-spinner-head",
  
  // Common application selectors
  AG_GRID: ".ag-row-not-inline-editing",
  CANVAS: "#HoopsWebViewer-canvas-container canvas",
  SIDE_PANEL: "side-panel_sliding-panel",
  
  // Form elements
  TEXTBOX: "textbox",
  DROPDOWN: ".bp5-popover-target > .bp5-button",
  
  // Status indicators
  SUCCESS_MESSAGE: "Success",
  ERROR_MESSAGE: "Error",
};

/**
 * Test data and configuration
 */
export const TEST_DATA = {
  // File paths for test resources
  FILES: {
    SOLIDWORK_ASSEMBLY: "./resources/testSolidwork1.sldasm",
    CUBE_ASSEMBLY: "./resources/Cube.SLDASM",
    CSV_IMPORT: "./resources/importFile.csv",
    PDF_TEST: "./resources/test.pdf",
    IMAGE_TEST: "./resources/test-image.jpg",
  },
  
  // Common test values
  PROPERTY_VALUES: {
    MASS: "100 kg",
    LENGTH: "50 mm",
    TEMPERATURE: "25 °C",
  },
  
  // Timeouts (in milliseconds)
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 30000,
    LONG: 60000,
    EXTRA_LONG: 150000,
    FILE_UPLOAD: 120000,
  },
  
  // Common sheet configurations
  GOOGLE_SHEETS: {
    TEST_SHEET: {
      name: "e2e-testing-sheet",
      range: "A1:B1",
      expectedValue: "10 kg",
    },
  },
};

/**
 * Navigation menu items
 */
export const NAVIGATION = {
  ANALYSIS: "nav-link_menu-pane_analysis",
  DATA_SOURCES: "nav-link_data-sources",
  MODELING: "nav-link_menu-pane_modeling",
  HARDWARE_CATALOG: "nav-link_menu-pane_hardware-catalog",
  BOM: "nav-link_menu-pane_bom",
  IMPORTS: "nav-link_menu-pane_imports",
  SETTINGS: "menu-item_settings",
  INBOX: "nav-link_inbox",
  FAVORITES: "nav-link_favorites",
};

/**
 * Common button test IDs
 */
export const BUTTONS = {
  // General actions
  SUBMIT: "button_submit",
  CANCEL: "button_cancel",
  SAVE: "button_save",
  DELETE: "button_delete",
  EDIT: "button_edit",
  
  // Specific actions
  CREATE_CODE_BLOCK: "button_create-code-block",
  ADD_DATA_CONNECTION: "button_add-data-connection",
  CREATE_IMPORT: "button_create-import",
  ADD_CATALOG: "button_add-catalog-item",
  UPLOAD_IMAGE: "button_upload-image",
  
  // Menu actions
  MORE_ACTIONS: "button_more",
  CONTEXT_MENU: "button_attachment-context-menu",
};

/**
 * Form field test IDs and placeholders
 */
export const FORM_FIELDS = {
  PLACEHOLDERS: {
    EMAIL: "Email",
    SEARCH: "Search",
    ADD_PROPERTY: "Add new property",
    ADD_DESCRIPTION: "Add description...",
    ADD_STATUS: "Add new status",
    SELECT_HERE: "Select here",
    DATE: "MM/DD/YYYY",
  },
  
  LABELS: {
    PART_NAME: "Part name",
    UPLOAD_PHOTO: "Upload new photo",
  },
};

/**
 * Legacy constants (for backward compatibility)
 * @deprecated Use ENVIRONMENTS instead
 */
export const CONSTANTS = ENVIRONMENTS;
