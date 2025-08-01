All data and URLs in this repository have been fuzzed to prevent exposure of real information.

# B2B SaaS Test Automation Framework

## Overview

This repository contains a comprehensive end-to-end test automation framework built with **Playwright** and **TypeScript** for testing a B2B SaaS application. The framework provides robust, scalable, and maintainable automated testing capabilities covering the entire application workflow from user authentication to complex business operations.

## 🚀 **Framework Capabilities**

### **Core Features**
- **End-to-End Testing**: Complete user journey automation from login to complex workflows
- **Cross-Browser Support**: Automated testing across Chrome, Firefox, and Safari
- **API Integration**: Seamless integration between UI and API testing
- **Email Testing**: Gmail integration for magic link and notification testing
- **File Upload Testing**: Support for various file formats (CAD, CSV, PDF, images)
- **Data-Driven Testing**: Faker.js integration for dynamic test data generation
- **Parallel Execution**: Fast test execution with configurable parallel workers
- **Visual Testing**: Screenshot capture and comparison capabilities

### **Application Coverage**
The framework comprehensively tests all major application areas:

#### **🏠 Workspace Management**
- Workspace creation (Engineering & Blank templates)
- Workspace duplication and import/export
- Multi-workspace navigation and management
- User permissions and access control

#### **🔧 System Modeling & Design**
- **Child Blocks**: Creation, management, and hierarchical organization
- **Properties**: Custom property creation, groups, calculations, and formulas
- **Analysis**: Code block creation, Python script execution, input/output validation
- **Bill of Materials (BOM)**: Component management and relationship tracking

#### **📊 Data Management**
- **Data Sources**: Live data connections, Google Sheets integration
- **Data Sinks**: Data export and external system integration
- **Import/Export**: CAD file imports, CSV processing, bulk data operations
- **Hardware Catalog**: Component library management with various upload methods

#### **💬 Collaboration Features**
- **Discussions**: Comment systems, threaded conversations
- **Attachments**: File uploads, Google Drive integration, GitHub linking
- **Notifications**: Inbox management, message handling
- **Templates**: Report templates and knowledge base management

#### **⚙️ Administration & Settings**
- **API Key Management**: Creation, filtering, and deletion
- **OAuth Applications**: Third-party integrations
- **Webhooks**: External system notifications
- **User Management**: Profile updates, avatar uploads, permissions

#### **📁 File Processing**
- **CAD Files**: SolidWorks, STEP, STL format support
- **Documents**: PDF upload and processing
- **Images**: JPEG, PNG upload with validation
- **Archives**: ZIP file extraction and processing

## 🏗️ **Architecture Overview**

### **Design Patterns**
The framework follows industry best practices with a clean, maintainable architecture:

#### **Page Object Model (POM)**
- **Base Page Class**: Common functionality and utilities shared across all page objects
- **Specialized Page Objects**: Dedicated classes for each application area
- **Inheritance Pattern**: Consistent behavior and error handling
- **Encapsulation**: UI interactions isolated from test logic

#### **Configuration Management**
- **Environment Variables**: Flexible configuration for different environments
- **Constants Management**: Centralized selectors, test data, and timeouts
- **URL Mapping**: Environment-specific URL management
- **Test Data**: Organized test resources and sample files

#### **Utility Layer**
- **API Helpers**: REST API interaction utilities
- **Email Integration**: Gmail testing capabilities
- **Data Generation**: Faker.js integration for dynamic data
- **File Handling**: Upload, download, and validation utilities

## 📁 **Project Structure**

```
playwright-tests-b2b-saas/
├── 📂 tests/                          # Test specifications organized by feature
│   ├── analysis/                      # Code block and analysis testing
│   ├── blocks/                        # Child blocks and modeling tests
│   ├── dashboard/                     # Main dashboard functionality
│   ├── dataConnections/               # Data source and sink testing
│   ├── discussion/                    # Comment and collaboration tests
│   ├── favourites/                    # Favorites management
│   ├── fileUploads/                   # File upload validation
│   ├── imports/                       # CAD and data import tests
│   ├── knowledgebase/                 # Templates and reports
│   ├── login/                         # Authentication workflows
│   ├── productDataManagement/         # Hardware catalog tests
│   ├── properties/                    # Property management tests
│   ├── requirements/                  # Requirements documentation
│   ├── settings/                      # System configuration tests
│   └── workspace/                     # Workspace management
├── 📂 pageobjects/                    # Page Object Model implementation
│   ├── base.po.ts                     # Base page class with common utilities
│   ├── homePage.po.ts                 # Main navigation and workspace
│   ├── analysis.po.ts                 # Code blocks and analysis
│   ├── property.po.ts                 # Property management
│   ├── projectManagement.po.ts        # Project status management
│   ├── csvUpload.po.ts                # CSV upload workflows
│   ├── discussion.po.ts               # Discussion and comments
│   ├── hardwareCatalog.po.ts          # Hardware catalog management
│   └── [additional page objects]      # Feature-specific page objects
├── 📂 utilities/                      # Framework utilities and helpers
│   ├── constants.ts                   # Centralized configuration
│   └── urlMapper.ts                   # Environment URL management
├── 📂 apiutils/                       # API testing utilities
│   └── apiHelper.ts                   # REST API interaction methods
├── 📂 emailutils/                     # Email testing integration
│   ├── gmailHelper.ts                 # Gmail API integration
│   └── token.json                     # OAuth tokens for email testing
├── 📂 resources/                      # Test data and sample files
│   ├── testSolidwork1.sldasm          # CAD test files
│   ├── importFile.csv                 # CSV test data
│   ├── test-image.jpg                 # Image upload samples
│   └── [additional test files]        # Various format samples
├── playwright.config.ts               # Playwright configuration
├── global-setup.ts                    # Global test setup
└── package.json                       # Dependencies and scripts
```

## 🛠️ **Technology Stack**

### **Core Technologies**
- **[Playwright](https://playwright.dev/)**: Modern end-to-end testing framework
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript for robust code
- **[Node.js](https://nodejs.org/)**: Runtime environment for test execution

### **Testing Libraries & Tools**
- **[@faker-js/faker](https://fakerjs.dev/)**: Dynamic test data generation
- **[gmail-tester](https://www.npmjs.com/package/gmail-tester)**: Email testing integration
- **[cheerio](https://cheerio.js.org/)**: HTML parsing and manipulation
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Environment variable management

### **Development Tools**
- **[ESLint](https://eslint.org/)**: Code quality and consistency
- **[Prettier](https://prettier.io/)**: Code formatting
- **[TypeScript ESLint](https://typescript-eslint.io/)**: TypeScript-specific linting

## 🚦 **Getting Started**

### **Prerequisites**
- Node.js 16+ installed
- Chrome/Chromium browser
- Access to test environment
- Gmail account for email testing (optional)

### **Installation**
```bash
# Clone the repository
git clone [repository-url]
cd playwright-tests-b2b-saas

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### **Configuration**
1. **Environment Setup**: Create `.env` file with required variables
```bash
BASE_URL=https://your-test-environment.com
USER_EMAIL=test@example.com
```

2. **Authentication**: Run global setup to configure authentication
```bash
npm run setup
```

### **Running Tests**

#### **All Tests**
```bash
npm test                    # Run all tests
npm run test:headed         # Run with browser UI visible
```

#### **Specific Test Categories**
```bash
# Run tests by tag
npx playwright test --grep "@smokeTest"
npx playwright test --grep "@featureBranch"
npx playwright test --grep "@prod"

# Run specific test files
npx playwright test tests/analysis/
npx playwright test tests/properties/propertiesTests.spec.ts
```

#### **Parallel Execution**
```bash
# Configure workers in playwright.config.ts
workers: process.env.CI ? 2 : undefined
```

## 📊 **Test Scenarios & Coverage**

### **🔍 Critical User Journeys**

#### **Workspace Creation & Management**
```typescript
// Complete workspace setup workflow
test("Create engineering workspace with properties", async ({ page }) => {
  const homePage = new HomePage(page);
  const propertyPage = new PropertyPage(page);
  
  await homePage.openUrlAndCreateEngineeringWorkspace("MyWorkspace");
  await propertyPage.createPropertyWithValue("mass", "100 kg");
  await propertyPage.verifyPropertyValue("mass", "100 kg");
});
```

#### **Data Import & Processing**
```typescript
// CAD file import with validation
test("Import SolidWorks assembly", async ({ page }) => {
  const homePage = new HomePage(page);
  const importPage = new ImportPage(page);
  
  await homePage.clickImports();
  await importPage.uploadCadFile("./resources/testSolidwork1.sldasm");
  await importPage.verifyImportSuccess();
});
```

#### **Collaboration Workflows**
```typescript
// Discussion and attachment workflow
test("Add comment with file attachment", async ({ page }) => {
  const homePage = new HomePage(page);
  const discussionPage = new DiscussionPage(page);
  
  await homePage.clickDiscussion();
  await discussionPage.addComment("Review this design");
  await discussionPage.attachFile("./resources/design-review.pdf");
  await discussionPage.verifyAttachmentUploaded();
});
```

### **🎯 Test Categories**

#### **Smoke Tests (`@smokeTest`)**
- Critical path validation
- Core functionality verification
- Quick regression testing (15-20 minutes)

#### **Feature Branch Tests (`@featureBranch`)**
- New feature validation
- Integration testing
- Pre-production verification

#### **Production Tests (`@prod`)**
- Production environment validation
- Performance critical paths
- Business-critical workflows

## 🔧 **Framework Features**

### **Smart Wait Strategies**
```typescript
// Intelligent waiting for elements
await this.safeClick(locator);           // Waits for element to be clickable
await this.safeFill(locator, text);      // Waits and clears before filling
await this.waitForLoading();             // Waits for spinners to disappear
```

### **Error Handling & Resilience**
```typescript
// Built-in retry logic and timeout management
await this.verifyElementVisible(locator, 30000);  // Custom timeouts
await this.waitForElement(locator);               // Smart element waiting
await this.handleDialog(true);                    // Modal handling
```

### **File Upload Automation**
```typescript
// Comprehensive file handling
await csvUploadPage.uploadCsvFile("./resources/data.csv");
await cadImportPage.uploadCadFile("./resources/assembly.sldasm");
await attachmentPage.uploadImage("./resources/diagram.jpg");
```

### **Dynamic Data Generation**
```typescript
// Faker.js integration for realistic test data
const workspaceName = "AutomatedTest_" + faker.internet.userName();
const componentName = faker.commerce.productName();
const testEmail = faker.internet.email();
```

## 📈 **Reporting & CI/CD**

### **Test Reporting**
- **HTML Reports**: Comprehensive test results with screenshots
- **JUnit XML**: CI/CD integration format
- **Console Output**: Real-time test execution feedback

### **Continuous Integration**
```typescript
// Optimized for CI environments
workers: process.env.CI ? 2 : undefined,
retries: process.env.CI ? 2 : 0,
use: {
  trace: "on-first-retry",
  video: "on-first-retry",
  screenshot: "only-on-failure"
}
```

### **Environment Support**
- **Development**: Local testing with full debugging
- **Staging**: Pre-production validation
- **Production**: Critical path monitoring

## 🏷️ **Test Organization**

### **Test Tags & Filtering**
Tests are organized with tags for flexible execution:

- `@smokeTest`: Quick validation tests (< 5 minutes)
- `@featureBranch`: Feature-specific tests
- `@prod`: Production-safe tests
- `@regression`: Full regression suite
- `@api`: API-focused tests
- `@ui`: UI-focused tests

### **Serial vs Parallel Execution**
```typescript
// Serial execution for dependent tests
test.describe.serial("Workspace Creation Flow", () => {
  // Tests that must run in sequence
});

// Parallel execution for independent tests
test.describe("Property Management", () => {
  // Tests that can run simultaneously
});
```

## 🔍 **Quality Assurance**

### **Code Quality Standards**
- **TypeScript**: Strong typing for reliability
- **ESLint**: Consistent code style and best practices
- **Prettier**: Automated code formatting
- **Documentation**: Comprehensive inline comments

### **Test Data Management**
- **Isolated Test Data**: Each test creates its own data
- **Cleanup Procedures**: Automatic workspace cleanup after tests
- **Resource Management**: Organized test files and samples

### **Performance Optimization**
- **Parallel Workers**: Configurable parallel execution
- **Smart Timeouts**: Context-aware timeout settings
- **Resource Cleanup**: Memory and resource management
- **Fast Selectors**: Optimized element identification

## 🤝 **Team Collaboration**

### **Development Workflow**
1. **Feature Development**: Create feature-specific test files
2. **Page Object Updates**: Extend existing page objects or create new ones
3. **Constants Management**: Add new selectors/data to constants file
4. **Test Execution**: Run relevant test suites
5. **Code Review**: Ensure quality and consistency

### **Best Practices**
- **Page Objects**: Encapsulate UI interactions
- **Constants**: Use centralized configuration
- **Documentation**: Comment complex workflows
- **Error Handling**: Implement proper wait strategies
- **Test Isolation**: Ensure tests can run independently

## 📞 **Support & Maintenance**

### **Common Issues & Solutions**
- **Flaky Tests**: Use framework's built-in wait strategies
- **Element Changes**: Update page objects and constants
- **Environment Issues**: Check configuration and environment variables
- **Performance**: Adjust parallel workers and timeouts

### **Framework Maintenance**
- **Dependency Updates**: Regular package updates
- **Browser Updates**: Playwright browser maintenance
- **Test Review**: Regular test effectiveness evaluation
- **Documentation**: Keep guides and examples current

## 🚀 **Future Enhancements**

### **Planned Improvements**
- **API Testing Expansion**: Enhanced REST API test coverage
- **Mobile Testing**: Responsive design validation
- **Performance Testing**: Load and stress testing integration
- **Visual Regression**: Automated screenshot comparison
- **Data-Driven Testing**: Enhanced test data management

### **Scalability Considerations**
- **Microservice Testing**: Individual service validation
- **Cross-Platform Testing**: Multi-environment support
- **Advanced Reporting**: Custom dashboards and metrics
- **Test Analytics**: Performance and reliability insights

---

This framework provides a solid foundation for comprehensive B2B SaaS application testing, ensuring quality, reliability, and maintainability as your application evolves.