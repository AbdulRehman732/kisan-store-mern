# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin_finance.spec.js >> Institutional Financial Integrity Protocol >> Accounting & Expense Management
- Location: tests\admin_finance.spec.js:14:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Faisalabad Hub Utility Q1')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Faisalabad Hub Utility Q1')

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
      - generic [ref=e50]:
        - heading "Operational Ledger SYSTEM-WIDE OUTGOING DISBURSEMENTS" [level=2] [ref=e51]:
          - text: Operational Ledger
          - generic [ref=e52]: SYSTEM-WIDE OUTGOING DISBURSEMENTS
        - button "+ Record Disbursement" [ref=e53] [cursor=pointer]
      - generic [ref=e54]:
        - generic [ref=e55]:
          - generic [ref=e56]: Gross Expenditure
          - generic [ref=e57]: Rs. 179,000
        - generic [ref=e58]:
          - generic [ref=e59]: Current Month Utilization
          - generic [ref=e60]: Rs. 125,000
        - generic [ref=e61]:
          - generic [ref=e62]: Total Ledger Entries
          - generic [ref=e63]: 11 Logged
        - generic [ref=e64]:
          - generic [ref=e65]: Highest Expense Vector
          - generic [ref=e66]: Other
          - generic [ref=e67]: Rs. 125,000
      - generic [ref=e68]:
        - combobox [ref=e69]:
          - option "All Categories"
          - option "Supplies"
          - option "Utilities" [selected]
          - option "Salary"
          - option "Rent"
          - option "Transport"
          - option "Marketing"
          - option "Maintenance"
          - option "Personal"
          - option "Other"
        - generic [ref=e70]:
          - generic [ref=e71]: FROM
          - textbox [ref=e72]
        - generic [ref=e73]:
          - generic [ref=e74]: TO
          - textbox [ref=e75]
        - button "RESET FILTERS" [ref=e76] [cursor=pointer]
      - generic [ref=e77]:
        - generic [ref=e78]: 💸
        - heading "No matching financial entries." [level=3] [ref=e79]
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
> 31 |     await expect(page.locator('text=Faisalabad Hub Utility Q1')).toBeVisible();
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
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
  57 |     await page.click('text=Nitrogen');
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