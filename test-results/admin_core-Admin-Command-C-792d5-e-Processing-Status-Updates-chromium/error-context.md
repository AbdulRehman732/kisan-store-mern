# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin_core.spec.js >> Admin Command Center Protocol >> Order Lifecycle: Processing & Status Updates
- Location: tests\admin_core.spec.js:40:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Procurement Logs')
Expected: visible
Error: strict mode violation: locator('text=Procurement Logs') resolved to 2 elements:
    1) <a aria-current="page" href="#/admin/orders" class="sc-ggqIjZ dWzkXs active">…</a> aka getByRole('link', { name: '📜 Procurement Logs' })
    2) <h2 class="sc-cPrPEy eDjjMv">…</h2> aka getByRole('heading', { name: 'Procurement Logs Operational' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Procurement Logs')

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
        - heading "Procurement Logs Operational Fulfillment & Logistics Control" [level=2] [ref=e51]:
          - text: Procurement Logs
          - generic [ref=e52]: Operational Fulfillment & Logistics Control
        - generic [ref=e53]:
          - button "📤 Bulk Report Export" [ref=e54] [cursor=pointer]
          - generic [ref=e55]: 1 ACTIVE RECORDS
      - generic [ref=e56]:
        - textbox "Filter by ID, entity or tactical contact..." [ref=e57]
        - combobox [ref=e58] [cursor=pointer]:
          - option "All Statuses" [selected]
          - option "🕒 Pending"
          - option "✅ FULFILLED"
          - option "❌ VOIDED"
        - generic [ref=e59]:
          - textbox [ref=e60]
          - generic [ref=e61]: →
          - textbox [ref=e62]
      - table [ref=e64]:
        - rowgroup [ref=e65]:
          - row "Ref ID Stakeholder Asset Manifest Financial Status Protocol Phase Logistics Operations" [ref=e66]:
            - columnheader "Ref ID" [ref=e67]
            - columnheader "Stakeholder" [ref=e68]
            - columnheader "Asset Manifest" [ref=e69]
            - columnheader "Financial Status" [ref=e70]
            - columnheader "Protocol Phase" [ref=e71]
            - columnheader "Logistics" [ref=e72]
            - columnheader "Operations" [ref=e73]
        - rowgroup [ref=e74]:
          - 'row "#6C0E5C37 Ali Ahmed 0300-1234567 💬 Urea Fertilizer Rs. 7,000 OWED: Rs. 7,000 Pending 4/7/2026 Print Pay Pending" [ref=e75]':
            - cell "#6C0E5C37" [ref=e76]:
              - generic [ref=e77]: "#6C0E5C37"
            - cell "Ali Ahmed 0300-1234567 💬" [ref=e78]:
              - generic [ref=e79]: Ali Ahmed
              - generic [ref=e80]:
                - generic [ref=e81]: 0300-1234567
                - button "💬" [ref=e82] [cursor=pointer]
            - cell "Urea Fertilizer" [ref=e83]
            - 'cell "Rs. 7,000 OWED: Rs. 7,000" [ref=e84]':
              - generic [ref=e85]: Rs. 7,000
              - generic [ref=e86]: "OWED: Rs. 7,000"
            - cell "Pending" [ref=e87]
            - cell "4/7/2026" [ref=e88]
            - cell "Print Pay Pending" [ref=e89]:
              - generic [ref=e90]:
                - button "Print" [ref=e91] [cursor=pointer]
                - button "Pay" [ref=e92] [cursor=pointer]
                - combobox [ref=e93]:
                  - option "Pending" [selected]
                  - option "FULFILLED"
                  - option "VOIDED"
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Admin Command Center Protocol', () => {
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
  14 |   test('Inventory Management: CRUD & Bulk Ops', async ({ page }) => {
  15 |     await page.goto('/#/admin/products');
  16 |     
  17 |     // Inventory Logic Sidebar check - using role to avoid strict mode violation
  18 |     await expect(page.getByRole('heading', { name: 'Inventory Logic' })).toBeVisible();
  19 |     
  20 |     // Add new asset
  21 |     await page.click('button:has-text("+ REGISTER ASSET")');
  22 |     await page.fill('label:has-text("Asset Specification") + input', 'Premium Wheat Seeds V2');
  23 |     await page.fill('label:has-text("Operational Reserve") + input', '500');
  24 |     await page.fill('label:has-text("Pricing Baseline") + input', '4500');
  25 |     await page.click('button:has-text("AUTHORIZE REGISTRY")');
  26 |     
  27 |     // Verify asset added
  28 |     await expect(page.locator('text=Premium Wheat Seeds V2')).toBeVisible();
  29 |     
  30 |     // Edit asset
  31 |     await page.click('button:has-text("Edit")');
  32 |     await page.fill('label:has-text("Pricing Baseline") + input', '4800');
  33 |     await page.click('button:has-text("AUTHORIZE REGISTRY")');
  34 |     
  35 |     // Delete asset
  36 |     await page.click('button:has-text("Delete")');
  37 |     await page.click('button:has-text("AUTHORIZE REMOVAL")');
  38 |   });
  39 | 
  40 |   test('Order Lifecycle: Processing & Status Updates', async ({ page }) => {
  41 |     await page.goto('/#/admin/orders');
  42 |     await page.waitForSelector('text=Procurement Logs');
  43 |     
  44 |     // Procurement Logs check
> 45 |     await expect(page.locator('text=Procurement Logs')).toBeVisible();
     |                                                         ^ Error: expect(locator).toBeVisible() failed
  46 |     
  47 |     // Find an order and update status - targeting the first select in the table body
  48 |     const statusSelect = page.locator('tbody select').first();
  49 |     
  50 |     // Select 'FULFILLED' (label matches snapshot)
  51 |     await statusSelect.selectOption({ label: 'FULFILLED' });
  52 |     
  53 |     // Verify status update in the badge (Term in UI is 'FULFILLED')
  54 |     await expect(page.locator('td').filter({ hasText: 'FULFILLED' }).first()).toBeVisible();
  55 |   });
  56 | 
  57 |   test('Stakeholder & Staff Directory Management', async ({ page }) => {
  58 |     await page.goto('/#/admin/farmers');
  59 |     await expect(page.locator('text=Stakeholder Registry')).toBeVisible();
  60 |     
  61 |     // View stakeholder cell
  62 |     await expect(page.locator('text=Institutional Identity')).toBeVisible();
  63 |     
  64 |     // Check staff
  65 |     await page.goto('/#/admin/staff');
  66 |     await expect(page.locator('text=Administrative Corps')).toBeVisible();
  67 |   });
  68 | });
  69 | 
```