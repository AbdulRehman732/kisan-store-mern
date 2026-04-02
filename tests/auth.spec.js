const { test, expect } = require('@playwright/test');

test.describe('Institutional Authentication Protocol', () => {
  
  test('Farmer Enlistment & Session Initialization Flow', async ({ page }) => {
    // 1. Initial Access to Agrotek Elite
    await page.goto('/#/');
    
    // 2. Journey to Secure Portal
    await page.click('a:has-text("Join Platform")'); 
    await page.waitForURL(/#\/login/);
    
    // 3. Navigate to Register (Request Enlistment)
    await page.click('a:has-text("Request Enlistment")');
    await page.waitForURL(/#\/register/);
    
    // 4. Fill registration (Professional Labels)
    await page.fill('input[placeholder*="First Name"]', 'Strategic');
    await page.fill('input[placeholder*="Last Name"]', 'Stakeholder');
    await page.fill('input[type="email"]', 'strategic@agrotek.pk');
    await page.fill('input[type="password"]', 'strategic123');
    await page.fill('input[placeholder*="0300"]', '03001234567');
    await page.click('button:has-text("INITIALIZE ACCOUNT")');
    
    // 5. Automatic System Entry after registration
    // The system auto-logins and directs to landing page
    await page.waitForURL(/#\//);
    
    // Wait for institutional identity manifest
    await page.waitForSelector('text=/STRATEGIC/i', { timeout: 15000 });
    await expect(page.locator('text=/STRATEGIC/i').first()).toBeVisible();
  });

  test('System Admin Authentication (Institutional)', async ({ page }) => {
    await page.goto('/#/login');
    await page.fill('input[type="email"]', 'admin@kisanstore.pk');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Initialize Session")');
    
    await page.waitForURL(/#\/admin\/dashboard/);
    await expect(page.locator('text=Command Hub')).toBeVisible();
  });

  test('RBAC: Stakeholder cannot access Admin Command Hub', async ({ page }) => {
    // Login as farmer
    await page.goto('/#/login');
    await page.fill('input[type="email"]', 'ali@gmail.com');
    await page.fill('input[type="password"]', 'farmer123');
    await page.click('button:has-text("Initialize Session")');
    await page.waitForURL(/#\//);
    
    // Attempt unauthorized access
    await page.goto('/#/admin/dashboard');
    // Institutional RBAC should redirect to landing
    await page.waitForURL(/#\//);
  });
});
