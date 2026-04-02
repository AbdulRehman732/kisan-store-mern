# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: farmer.spec.js >> Stakeholder Institutional Experience Flow >> Allocation Manifest & Finalization Flow
- Location: tests\farmer.spec.js:50:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("🛒")').first()
    - locator resolved to <button class="sc-dBmztB sc-fifgRQ fLnwKa iEZAGJ">🛒</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation:
    - generic [ref=e3]:
      - link "🌾 Agrotek Elite" [ref=e4] [cursor=pointer]:
        - /url: "#/"
        - generic [ref=e5]: 🌾
        - text: Agrotek
        - generic [ref=e6]: Elite
      - list [ref=e7]:
        - listitem [ref=e8]:
          - link "Home" [ref=e9] [cursor=pointer]:
            - /url: "#/"
        - listitem [ref=e10]:
          - link "Products" [ref=e11] [cursor=pointer]:
            - /url: "#/products"
        - listitem [ref=e12]:
          - link "Soil Intel" [ref=e13] [cursor=pointer]:
            - /url: "#/soil-registry"
        - listitem [ref=e14]:
          - link "Price List" [ref=e15] [cursor=pointer]:
            - /url: "#/price-list"
        - listitem [ref=e16]:
          - link "Contact" [ref=e17] [cursor=pointer]:
            - /url: "#/contact"
      - generic [ref=e18]:
        - button "☀️" [ref=e19] [cursor=pointer]:
          - generic [ref=e20]: ☀️
        - link "🛒" [ref=e21] [cursor=pointer]:
          - /url: "#/cart"
        - link "profile Ali" [ref=e22] [cursor=pointer]:
          - /url: "#/profile"
          - img "profile" [ref=e23]
          - generic [ref=e24]: Ali
  - generic [ref=e25]:
    - generic [ref=e26]:
      - heading "🌾 Menu" [level=3] [ref=e27]
      - button "✕" [ref=e28] [cursor=pointer]
    - generic [ref=e29]:
      - link "Home Intelligence" [ref=e30] [cursor=pointer]:
        - /url: "#/"
      - link "Asset Catalog" [ref=e31] [cursor=pointer]:
        - /url: "#/products"
      - link "Soil Analysis" [ref=e32] [cursor=pointer]:
        - /url: "#/soil-registry"
      - link "Market Dynamics" [ref=e33] [cursor=pointer]:
        - /url: "#/price-list"
      - link "Procurement Dossier" [ref=e34] [cursor=pointer]:
        - /url: "#/cart"
      - link "Member Identity" [ref=e35] [cursor=pointer]:
        - /url: "#/profile"
    - button "Terminate Session" [ref=e37] [cursor=pointer]
  - generic [ref=e38]:
    - generic [ref=e40]:
      - generic [ref=e41]:
        - generic [ref=e42]: ✦
        - text: "UREA INDEX: RS. 3,500/BAG"
      - generic [ref=e43]:
        - generic [ref=e44]: ✦
        - text: "DAP LIQUIDITY: RS. 9,800/BAG"
      - generic [ref=e45]:
        - generic [ref=e46]: ✦
        - text: "GENETIC SEED YIELD: +24%"
      - generic [ref=e47]:
        - generic [ref=e48]: ✦
        - text: "OPERATIONAL COVERAGE: 18 DISTRICTS"
      - generic [ref=e49]:
        - generic [ref=e50]: ✦
        - text: "AUTH DEBENTURES: VERIFIED"
      - generic [ref=e51]:
        - generic [ref=e52]: ✦
        - text: "INSTITUTIONAL TRUST: 99.8%"
      - generic [ref=e53]:
        - generic [ref=e54]: ✦
        - text: "UREA INDEX: RS. 3,500/BAG"
      - generic [ref=e55]:
        - generic [ref=e56]: ✦
        - text: "DAP LIQUIDITY: RS. 9,800/BAG"
      - generic [ref=e57]:
        - generic [ref=e58]: ✦
        - text: "GENETIC SEED YIELD: +24%"
      - generic [ref=e59]:
        - generic [ref=e60]: ✦
        - text: "OPERATIONAL COVERAGE: 18 DISTRICTS"
      - generic [ref=e61]:
        - generic [ref=e62]: ✦
        - text: "AUTH DEBENTURES: VERIFIED"
      - generic [ref=e63]:
        - generic [ref=e64]: ✦
        - text: "INSTITUTIONAL TRUST: 99.8%"
    - generic [ref=e67]:
      - generic [ref=e68]: 🏛️ Institutional Agricultural Gateway
      - heading "Pakistan's Elite Operational Hub" [level=1] [ref=e69]
      - paragraph [ref=e70]: Engineering the future of high-yield agriculture. We provide the institutional-grade assets required for modern, state-of-the-art production.
      - generic [ref=e71]:
        - link "Procure Assets 🚜" [ref=e72] [cursor=pointer]:
          - /url: "#/products"
        - link "Consult Officer 💬" [ref=e73] [cursor=pointer]:
          - /url: "#/contact"
    - generic [ref=e74]:
      - generic [ref=e75]:
        - generic [ref=e76]:
          - heading "22Y" [level=4] [ref=e77]
          - paragraph [ref=e78]: Operational Heritage
        - generic [ref=e79]:
          - heading "8.4k" [level=4] [ref=e80]
          - paragraph [ref=e81]: Verified Stakeholders
        - generic [ref=e82]:
          - heading "99.9%" [level=4] [ref=e83]
          - paragraph [ref=e84]: Purity Factor
        - generic [ref=e85]:
          - heading "Nexus" [level=4] [ref=e86]
          - paragraph [ref=e87]: Logistics Standard
      - generic [ref=e88]:
        - generic [ref=e89]:
          - generic [ref=e90]: 🏛️
          - heading "Elite Governance" [level=3] [ref=e91]
          - paragraph [ref=e92]: Serving the agricultural core of Pakistan with two decades of unparalleled quality and field-tested institutional trust.
        - generic [ref=e93]:
          - generic [ref=e94]: 🔬
          - heading "Precision Blueprints" [level=3] [ref=e95]
          - paragraph [ref=e96]: Our geneticists and soil experts provide exact fertilization maps to maximize seasonal deployment ROI.
        - generic [ref=e97]:
          - generic [ref=e98]: 🛰️
          - heading "Nexus Logistics" [level=3] [ref=e99]
          - paragraph [ref=e100]: Zero-latency supply chains ensure your mobilization never stalls. Premium field-side logistics as standard.
      - link "Initialize Inventory Discovery" [ref=e102] [cursor=pointer]:
        - /url: "#/products"
  - contentinfo [ref=e103]:
    - generic [ref=e104]:
      - generic [ref=e106]:
        - link "🌾 Agrotek Elite" [ref=e107] [cursor=pointer]:
          - /url: "#/"
          - text: 🌾 Agrotek
          - generic [ref=e108]: Elite
        - paragraph [ref=e109]: Empowering agricultural strategic operations through high-fidelity intelligence and institutional-grade resource mobilization.
        - generic [ref=e110]:
          - link "📘" [ref=e111] [cursor=pointer]:
            - /url: "#"
          - link "📸" [ref=e112] [cursor=pointer]:
            - /url: "#"
          - link "🐦" [ref=e113] [cursor=pointer]:
            - /url: "#"
          - link "💼" [ref=e114] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e115]:
        - heading "Strategic Exchange" [level=4] [ref=e116]
        - list [ref=e117]:
          - listitem [ref=e118]:
            - link "Asset Catalog" [ref=e119] [cursor=pointer]:
              - /url: "#/products"
          - listitem [ref=e120]:
            - link "Market Dynamics" [ref=e121] [cursor=pointer]:
              - /url: "#/price-list"
          - listitem [ref=e122]:
            - link "Tactical Recon" [ref=e123] [cursor=pointer]:
              - /url: "#/soil-registry"
          - listitem [ref=e124]:
            - link "Precision Diagnosis" [ref=e125] [cursor=pointer]:
              - /url: "#/crop-doctor"
      - generic [ref=e126]:
        - heading "Stakeholder Hub" [level=4] [ref=e127]
        - list [ref=e128]:
          - listitem [ref=e129]:
            - link "Member Identity" [ref=e130] [cursor=pointer]:
              - /url: "#/profile"
          - listitem [ref=e131]:
            - link "Procurement History" [ref=e132] [cursor=pointer]:
              - /url: "#/my-orders"
          - listitem [ref=e133]:
            - link "Dossier Manager" [ref=e134] [cursor=pointer]:
              - /url: "#/cart"
          - listitem [ref=e135]:
            - link "Crisis Support" [ref=e136] [cursor=pointer]:
              - /url: "#/contact"
      - generic [ref=e137]:
        - heading "Command Center" [level=4] [ref=e138]
        - generic [ref=e139]:
          - paragraph [ref=e140]:
            - text: 📍
            - generic [ref=e141]: Faisalabad Strategic Hub
          - paragraph [ref=e142]: 📞 +92 300 0000000
          - paragraph [ref=e143]: ✉️ command@agrotek-elite.com
          - paragraph [ref=e144]: "\"Rooting intelligence, harvesting excellence.\""
    - generic [ref=e145]:
      - generic [ref=e146]: © 2026 Agrotek Elite Intelligence Systems
      - generic [ref=e147]:
        - link "Privacy Protocol" [ref=e148] [cursor=pointer]:
          - /url: "#"
        - link "Operational Terms" [ref=e149] [cursor=pointer]:
          - /url: "#"
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Stakeholder Institutional Experience Flow', () => {
  4  |   
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Session initialization (using seeded farmer data)
  7  |     await page.goto('/#/login');
  8  |     await page.fill('input[type="email"]', 'ali@gmail.com'); 
  9  |     await page.fill('input[type="password"]', 'farmer123');
  10 |     await page.click('button:has-text("Initialize Session")');
  11 |     await page.waitForURL(/#\//);
  12 |   });
  13 | 
  14 |   test('Marketplace Dynamics & Assessment', async ({ page }) => {
  15 |     await page.goto('/#/products');
  16 |     // Asset Classes is the header for categories
  17 |     await page.waitForSelector('text=Asset Classes');
  18 |     await expect(page.locator('text=Asset Classes')).toBeVisible();
  19 |     
  20 |     // Search for Nitrogen (common fertilizer) - placeholder is "Search assets by name..."
  21 |     await page.fill('input[placeholder*="Search assets"]', 'Nitrogen');
  22 |     await page.waitForTimeout(1000); // Wait for debounce
  23 |     
  24 |     // Analyze Index is the search button
  25 |     await page.getByRole('button', { name: 'Analyze Index' }).click();
  26 |     
  27 |     // Each product card has "Authorize Purchase"
  28 |     await expect(page.locator('text=Authorize Purchase').first()).toBeVisible();
  29 |   });
  30 | 
  31 |   test('Procurement Dossier & Support Hub', async ({ page }) => {
  32 |     // Navigate via UI to ensure clean routing
  33 |     // Identity name is uppercase in UI due to CSS
  34 |     await page.locator('nav').locator('a[href="#/profile"]').first().click();
  35 |     await page.waitForURL(/#\/profile/);
  36 |     
  37 |     // Click Procurement History in footer or side menu (Drawer)
  38 |     await page.goto('/#/my-orders'); 
  39 |     await page.waitForSelector('text=Institutional Support Bridge', { state: 'visible', timeout: 10000 });
  40 |     
  41 |     // Verify Support Bridge and QR Hub
  42 |     await expect(page.locator('text=Institutional Support Bridge')).toBeVisible();
  43 |     await expect(page.locator('text=Scan to Chat')).toBeVisible();
  44 |     await expect(page.locator('.badge:has-text("VERIFIED")')).toBeVisible();
  45 |     
  46 |     const waLink = await page.getAttribute('a:has-text("Initiate Direct Correspondence")', 'href');
  47 |     expect(waLink).toContain('wa.me/923000000000');
  48 |   });
  49 | 
  50 |   test('Allocation Manifest & Finalization Flow', async ({ page }) => {
  51 |     await page.goto('/#/products');
  52 |     
  53 |     // Wait for institutional data to load
  54 |     await page.waitForSelector('text=Authorize Purchase', { state: 'visible', timeout: 15000 });
  55 |     
  56 |     // Add to cart button is "🛒" in the card - selecting the one specifically in the grid
> 57 |     await page.locator('button:has-text("🛒")').first().click();
     |                                                         ^ Error: locator.click: Test timeout of 30000ms exceeded.
  58 |     
  59 |     // Navigate to Dossier (Cart) via navbar link specifically
  60 |     await page.locator('nav').locator('a[href="#/cart"]').first().click();
  61 |     await page.waitForURL(/#\/cart/);
  62 |     
  63 |     // Title is "Procurement Dossier"
  64 |     await expect(page.getByRole('heading', { name: 'Procurement Dossier' })).toBeVisible();
  65 |     
  66 |     // Set deployment date (required)
  67 |     const today = new Date().toISOString().split('T')[0];
  68 |     await page.fill('input[type="date"]', today);
  69 |     
  70 |     // Finalize button is "Confirm Strategic Mobilization"
  71 |     await page.click('button:has-text("Confirm Strategic Mobilization")');
  72 |     await page.waitForURL(/#\/my-orders/);
  73 |     await expect(page.locator('text=Institutional Support Bridge')).toBeVisible();
  74 |   });
  75 | });
  76 | 
```