const { test, expect } = require('@playwright/test');

test.describe('Institutional Financial Integrity Protocol', () => {
  
  test.beforeEach(async ({ page }) => {
    // Admin session initialization
    await page.goto('/#/login');
    await page.fill('input[type="email"]', 'admin@kisanstore.pk');
    await page.fill('input[type="password"]', 'admin123'); 
    await page.click('button:has-text("Initialize Session")');
    await page.waitForURL(/#\/admin\/dashboard/);
  });

  test('Accounting & Expense Management', async ({ page }) => {
    await page.goto('/#/admin/accounts');
    await page.waitForSelector('text=Treasury Assets');
    await expect(page.locator('text=Treasury Assets')).toBeVisible();
    
    // Add new expense / Operational Ledger
    await page.goto('/#/admin/expenses');
    await page.waitForSelector('text=Operational Ledger');
    await expect(page.locator('text=Operational Ledger')).toBeVisible();
    await page.click('button:has-text("+ Record Disbursement")');
    await page.fill('label:has-text("Disbursement Title") + input', 'Faisalabad Hub Utility Q1');
    await page.fill('label:has-text("Magnitude (Rs.)") + input', '12500');
    // The select for category
    await page.selectOption('select', 'Utilities');
    await page.click('button:has-text("AUTHORIZE DISBURSEMENT")');
    
    // Verify expense logged
    await expect(page.locator('text=Faisalabad Hub Utility Q1')).toBeVisible();
  });

  test('Stakeholder Credit & Debt Tracking', async ({ page }) => {
    await page.goto('/#/admin/credit');
    await page.waitForSelector('text=Credit Analysis Hub');
    await expect(page.locator('text=Credit Analysis Hub')).toBeVisible();
    
    // Initialize settlement for a stakeholder with debt
    // Note: The seeder creates a farmer with debt
    await page.click('button:has-text("Authorize Settlement")');
    // Should show the settlement modal/form
    await expect(page.locator('text=Execute Strategic Settlement')).toBeVisible();
  });

  test('POS Terminal & Quick Sales', async ({ page }) => {
    await page.goto('/#/admin/pos');
    await page.waitForSelector('text=Direct POS Terminal');
    await expect(page.locator('text=Direct POS Terminal')).toBeVisible();
    
    // Select a stakeholder (dropdown search)
    await page.fill('label:has-text("IDENTIFY STAKEHOLDER") + input', 'Ali Ahmed');
    await page.click('text=Ali Ahmed');
    
    // Add product (Nitrogen)
    await page.fill('label:has-text("INITIALIZE ASSET DISCOVERY") + input', 'Nitrogen');
    await page.click('text=Nitrogen');
    
    // Finalize POS - text is "AUTHORIZE DIRECT DISPATCH"
    await page.click('button:has-text("AUTHORIZE DIRECT DISPATCH")');
    
    // Should redirect to dashboard or show success
    await page.waitForURL(/#\/admin\/dashboard/);
  });
});
