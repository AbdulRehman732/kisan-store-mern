const { test, expect } = require('@playwright/test');

test.describe('Admin Command Center Protocol', () => {
  
  test.beforeEach(async ({ page }) => {
    // Admin session initialization
    await page.goto('/#/login');
    await page.fill('input[type="email"]', 'admin@kisanstore.pk');
    await page.fill('input[type="password"]', 'admin123'); 
    await page.click('button:has-text("Initialize Session")');
    await page.waitForURL(/#\/admin\/dashboard/);
  });

  test('Inventory Management: CRUD & Bulk Ops', async ({ page }) => {
    await page.goto('/#/admin/products');
    
    // Inventory Logic Sidebar check - using role to avoid strict mode violation
    await expect(page.getByRole('heading', { name: 'Inventory Logic' })).toBeVisible();
    
    // Add new asset
    await page.click('button:has-text("+ REGISTER ASSET")');
    await page.fill('label:has-text("Asset Specification") + input', 'Premium Wheat Seeds V2');
    await page.fill('label:has-text("Operational Reserve") + input', '500');
    await page.fill('label:has-text("Pricing Baseline") + input', '4500');
    await page.click('button:has-text("AUTHORIZE REGISTRY")');
    
    // Verify asset added
    await expect(page.locator('text=Premium Wheat Seeds V2')).toBeVisible();
    
    // Edit asset
    await page.click('button:has-text("Edit")');
    await page.fill('label:has-text("Pricing Baseline") + input', '4800');
    await page.click('button:has-text("AUTHORIZE REGISTRY")');
    
    // Delete asset
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("AUTHORIZE REMOVAL")');
  });

  test('Order Lifecycle: Processing & Status Updates', async ({ page }) => {
    await page.goto('/#/admin/orders');
    await page.waitForSelector('text=Procurement Logs');
    
    // Procurement Logs check
    await expect(page.locator('text=Procurement Logs')).toBeVisible();
    
    // Find an order and update status - targeting the first select in the table body
    const statusSelect = page.locator('tbody select').first();
    
    // Select 'FULFILLED' (label matches snapshot)
    await statusSelect.selectOption({ label: 'FULFILLED' });
    
    // Verify status update in the badge (Term in UI is 'FULFILLED')
    await expect(page.locator('td').filter({ hasText: 'FULFILLED' }).first()).toBeVisible();
  });

  test('Stakeholder & Staff Directory Management', async ({ page }) => {
    await page.goto('/#/admin/farmers');
    await expect(page.locator('text=Stakeholder Registry')).toBeVisible();
    
    // View stakeholder cell
    await expect(page.locator('text=Institutional Identity')).toBeVisible();
    
    // Check staff
    await page.goto('/#/admin/staff');
    await expect(page.locator('text=Administrative Corps')).toBeVisible();
  });
});
