const { test, expect } = require('@playwright/test');

test.describe('Stakeholder Institutional Experience Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Session initialization (using seeded farmer data)
    await page.goto('/#/login');
    await page.fill('input[type="email"]', 'ali@gmail.com'); 
    await page.fill('input[type="password"]', 'farmer123');
    await page.click('button:has-text("Initialize Session")');
    await page.waitForURL(/#\//);
  });

  test('Marketplace Dynamics & Assessment', async ({ page }) => {
    await page.goto('/#/products');
    // Asset Classes is the header for categories
    await page.waitForSelector('text=Asset Classes');
    await expect(page.locator('text=Asset Classes')).toBeVisible();
    
    // Search for Nitrogen (common fertilizer) - placeholder is "Search assets by name..."
    await page.fill('input[placeholder*="Search assets"]', 'Nitrogen');
    await page.waitForTimeout(1000); // Wait for debounce
    
    // Analyze Index is the search button
    await page.getByRole('button', { name: 'Analyze Index' }).click();
    
    // Each product card has "Authorize Purchase"
    await expect(page.locator('text=Authorize Purchase').first()).toBeVisible();
  });

  test('Procurement Dossier & Support Hub', async ({ page }) => {
    // Navigate via UI to ensure clean routing
    // Identity name is uppercase in UI due to CSS
    await page.locator('nav').locator('a[href="#/profile"]').first().click();
    await page.waitForURL(/#\/profile/);
    
    // Click Procurement History in footer or side menu (Drawer)
    await page.goto('/#/my-orders'); 
    await page.waitForSelector('text=Institutional Support Bridge', { state: 'visible', timeout: 10000 });
    
    // Verify Support Bridge and QR Hub
    await expect(page.locator('text=Institutional Support Bridge')).toBeVisible();
    await expect(page.locator('text=Scan to Chat')).toBeVisible();
    await expect(page.locator('.badge:has-text("VERIFIED")')).toBeVisible();
    
    const waLink = await page.getAttribute('a:has-text("Initiate Direct Correspondence")', 'href');
    expect(waLink).toContain('wa.me/923000000000');
  });

  test('Allocation Manifest & Finalization Flow', async ({ page }) => {
    await page.goto('/#/products');
    
    // Wait for institutional data to load
    await page.waitForSelector('text=Authorize Purchase', { state: 'visible', timeout: 15000 });
    
    // Add to cart button is "🛒" in the card - selecting the one specifically in the grid
    await page.locator('button:has-text("🛒")').first().click();
    
    // Navigate to Dossier (Cart) via navbar link specifically
    await page.locator('nav').locator('a[href="#/cart"]').first().click();
    await page.waitForURL(/#\/cart/);
    
    // Title is "Procurement Dossier"
    await expect(page.getByRole('heading', { name: 'Procurement Dossier' })).toBeVisible();
    
    // Set deployment date (required)
    const today = new Date().toISOString().split('T')[0];
    await page.fill('input[type="date"]', today);
    
    // Finalize button is "Confirm Strategic Mobilization"
    await page.click('button:has-text("Confirm Strategic Mobilization")');
    await page.waitForURL(/#\/my-orders/);
    await expect(page.locator('text=Institutional Support Bridge')).toBeVisible();
  });
});
