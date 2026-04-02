# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin_finance.spec.js >> Institutional Financial Integrity Protocol >> POS Terminal & Quick Sales
- Location: tests\admin_finance.spec.js:46:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Nitrogen')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: 🌾 KisanNexus
      - generic [ref=e7]: Institutional Control
    - navigation [ref=e8]:
      - link "📊 Command Hub" [ref=e9] [cursor=pointer]:
        - /url: "#/admin/dashboard"
        - generic [ref=e10]: 📊
        - text: Command Hub
      - link "🏪 Direct POS" [ref=e11] [cursor=pointer]:
        - /url: "#/admin/pos"
        - generic [ref=e12]: 🏪
        - text: Direct POS
      - link "📦 Inventory Logic" [ref=e13] [cursor=pointer]:
        - /url: "#/admin/products"
        - generic [ref=e14]: 📦
        - text: Inventory Logic
      - link "📜 Procurement Logs" [ref=e15] [cursor=pointer]:
        - /url: "#/admin/orders"
        - generic [ref=e16]: 📜
        - text: Procurement Logs
      - link "👥 Stakeholders" [ref=e17] [cursor=pointer]:
        - /url: "#/admin/farmers"
        - generic [ref=e18]: 👥
        - text: Stakeholders
      - link "📉 Credit Registry" [ref=e19] [cursor=pointer]:
        - /url: "#/admin/credit"
        - generic [ref=e20]: 📉
        - text: Credit Registry
      - link "🏛️ Treasury" [ref=e21] [cursor=pointer]:
        - /url: "#/admin/accounts"
        - generic [ref=e22]: 🏛️
        - text: Treasury
      - link "💸 Internal Burn" [ref=e23] [cursor=pointer]:
        - /url: "#/admin/expenses"
        - generic [ref=e24]: 💸
        - text: Internal Burn
      - link "🏦 Global Ledger" [ref=e25] [cursor=pointer]:
        - /url: "#/admin/finances"
        - generic [ref=e26]: 🏦
        - text: Global Ledger
      - link "🛡️ Executive Team" [ref=e27] [cursor=pointer]:
        - /url: "#/admin/staff"
        - generic [ref=e28]: 🛡️
        - text: Executive Team
      - link "💬 Feedback Loop" [ref=e29] [cursor=pointer]:
        - /url: "#/admin/reviews"
        - generic [ref=e30]: 💬
        - text: Feedback Loop
      - link "⚙️ Nexus Config" [ref=e31] [cursor=pointer]:
        - /url: "#/admin/settings"
        - generic [ref=e32]: ⚙️
        - text: Nexus Config
    - generic [ref=e33]:
      - generic [ref=e34]:
        - strong [ref=e35]: Agent Admin
        - text: admin@kisanstore.pk
      - button "Terminate Session" [ref=e36] [cursor=pointer]
  - main [ref=e37]:
    - generic [ref=e38]:
      - generic [ref=e40] [cursor=pointer]: 🔍 Search institutional data...
      - generic [ref=e41]:
        - button "☀️" [ref=e42] [cursor=pointer]:
          - generic [ref=e43]: ☀️
        - generic [ref=e44]:
          - generic [ref=e45]: Admin K.
          - generic [ref=e46]: "Level: Administrator"
        - generic [ref=e47]: 👨‍💼
    - generic [ref=e49]:
      - heading "Direct POS Terminal EXECUTIVE RETAIL ENGINE" [level=2] [ref=e51]:
        - text: Direct POS Terminal
        - generic [ref=e52]: EXECUTIVE RETAIL ENGINE
      - generic [ref=e53]:
        - generic [ref=e54]:
          - generic [ref=e55]:
            - heading "📡 Logistics & Asset Identification" [level=3] [ref=e56]
            - generic [ref=e57]:
              - generic [ref=e58]: IDENTIFY STAKEHOLDER
              - textbox "Enter Name, Entity ID or Contact..." [ref=e59]: Ali Ahmed (0300-1234567)
            - generic [ref=e60]:
              - generic [ref=e61]: INITIALIZE ASSET DISCOVERY
              - textbox "Specification, Category or Nutrient Index..." [active] [ref=e62]: Nitrogen
          - generic [ref=e63]:
            - heading "📜 Operational Inventory Log" [level=3] [ref=e64]
            - generic [ref=e65]: Initializing... No assets currently logged for mobilization.
        - generic [ref=e67]:
          - heading "🧾 Financial Summary Audit" [level=3] [ref=e68]
          - generic [ref=e69]:
            - generic [ref=e70]:
              - generic [ref=e71]: Asset Subtotal
              - generic [ref=e72]: Rs. 0
            - generic [ref=e73]:
              - generic [ref=e74]: Institutional Levy
              - generic [ref=e75]: Rs. 0
            - generic [ref=e76]:
              - text: TOTAL PAYABLE
              - generic [ref=e77]: Rs. 0
          - generic [ref=e78]:
            - heading "💰 Monetary Authorization" [level=3] [ref=e79]
            - generic [ref=e81]:
              - generic [ref=e82]: Initial Mobilization Fund (Rs.)
              - spinbutton [ref=e83]
          - button "AUTHORIZE DIRECT DISPATCH" [disabled]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Institutional Financial Integrity Protocol', () => {
  4  |   
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Admin session initialization
  7  |     await page.goto('/#/login');
  8  |     await page.fill('input[type="email"]', 'admin@kisanstore.pk');
  9  |     await page.fill('input[type="password"]', 'admin123'); 
  10 |     await page.click('button:has-text("Initialize Session")');
  11 |     await page.waitForURL(/#\/admin\/dashboard/);
  12 |   });
  13 | 
  14 |   test('Accounting & Expense Management', async ({ page }) => {
  15 |     await page.goto('/#/admin/accounts');
  16 |     await page.waitForSelector('text=Treasury Assets');
  17 |     await expect(page.locator('text=Treasury Assets')).toBeVisible();
  18 |     
  19 |     // Add new expense / Operational Ledger
  20 |     await page.goto('/#/admin/expenses');
  21 |     await page.waitForSelector('text=Operational Ledger');
  22 |     await expect(page.locator('text=Operational Ledger')).toBeVisible();
  23 |     await page.click('button:has-text("+ Record Disbursement")');
  24 |     await page.fill('label:has-text("Disbursement Title") + input', 'Faisalabad Hub Utility Q1');
  25 |     await page.fill('label:has-text("Magnitude (Rs.)") + input', '12500');
  26 |     // The select for category
  27 |     await page.selectOption('select', 'Utilities');
  28 |     await page.click('button:has-text("AUTHORIZE DISBURSEMENT")');
  29 |     
  30 |     // Verify expense logged
  31 |     await expect(page.locator('text=Faisalabad Hub Utility Q1')).toBeVisible();
  32 |   });
  33 | 
  34 |   test('Stakeholder Credit & Debt Tracking', async ({ page }) => {
  35 |     await page.goto('/#/admin/credit');
  36 |     await page.waitForSelector('text=Credit Analysis Hub');
  37 |     await expect(page.locator('text=Credit Analysis Hub')).toBeVisible();
  38 |     
  39 |     // Initialize settlement for a stakeholder with debt
  40 |     // Note: The seeder creates a farmer with debt
  41 |     await page.click('button:has-text("Authorize Settlement")');
  42 |     // Should show the settlement modal/form
  43 |     await expect(page.locator('text=Execute Strategic Settlement')).toBeVisible();
  44 |   });
  45 | 
  46 |   test('POS Terminal & Quick Sales', async ({ page }) => {
  47 |     await page.goto('/#/admin/pos');
  48 |     await page.waitForSelector('text=Direct POS Terminal');
  49 |     await expect(page.locator('text=Direct POS Terminal')).toBeVisible();
  50 |     
  51 |     // Select a stakeholder (dropdown search)
  52 |     await page.fill('label:has-text("IDENTIFY STAKEHOLDER") + input', 'Ali Ahmed');
  53 |     await page.click('text=Ali Ahmed');
  54 |     
  55 |     // Add product (Nitrogen)
  56 |     await page.fill('label:has-text("INITIALIZE ASSET DISCOVERY") + input', 'Nitrogen');
> 57 |     await page.click('text=Nitrogen');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  58 |     
  59 |     // Finalize POS - text is "AUTHORIZE DIRECT DISPATCH"
  60 |     await page.click('button:has-text("AUTHORIZE DIRECT DISPATCH")');
  61 |     
  62 |     // Should redirect to dashboard or show success
  63 |     await page.waitForURL(/#\/admin\/dashboard/);
  64 |   });
  65 | });
  66 | 
```