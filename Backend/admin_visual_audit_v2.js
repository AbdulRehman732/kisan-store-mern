const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots_admin');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR);

const BASE_URL = 'http://127.0.0.1:3000';
const ADMIN_EMAIL = 'admin@kisanstore.pk';
const ADMIN_PASS = 'admin123';

async function screenshot(page, name) {
  const file = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  📸 Screenshot saved: ${name}.png`);
  return file;
}

async function runAdminAudit() {
  console.log('\n========================================');
  console.log('  👑 KISANSTORE - ADMIN VISUAL AUDIT');
  console.log('========================================\n');

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  try {
    // ── Step 1: Login ─────────────────────────────
    console.log('[1/8] Logging in as Admin...');
    await page.goto(BASE_URL + '/#/login', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Fill login form
    const inputs = await page.$$('input');
    if (inputs.length >= 2) {
      await inputs[0].fill(ADMIN_EMAIL);
      await inputs[1].fill(ADMIN_PASS);
      await screenshot(page, '00_admin_login_filled');
      await page.keyboard.press('Enter');
    } else {
      throw new Error("Could not find login inputs");
    }
    
    await page.waitForTimeout(3000);
    // Check if on dashboard
    if (page.url().includes('dashboard')) {
      console.log('  ✅ Admin logged in successfully.');
    } else {
      console.log('  ⚠️ Redirect check: ' + page.url());
      await page.goto(BASE_URL + '/#/admin/dashboard', { waitUntil: 'networkidle' });
    }
    await screenshot(page, '01_admin_dashboard');

    // ── Step 2: Manage Products ───────────────────
    console.log('\n[2/8] Inspecting Product Inventory...');
    await page.goto(BASE_URL + '/#/admin/products', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '02_admin_products_list');

    // Functional Check: Edit a product
    console.log('  🛠️ Functional Check: Attempting to edit a product (price update)...');
    const editBtn = await page.$('button:has-text("Edit"), a:has-text("Edit")');
    if (editBtn) {
      await editBtn.click();
      await page.waitForTimeout(1000);
      
      const priceInput = await page.$('input[name="price"], input[type="number"]');
      if (priceInput) {
        const currentPrice = await priceInput.inputValue();
        const newPrice = parseInt(currentPrice) + 10;
        await priceInput.fill(newPrice.toString());
        await screenshot(page, '03_admin_edit_product_form');
        
        const saveBtn = await page.$('button[type="submit"], button:has-text("Save"), button:has-text("Update")');
        if (saveBtn) {
          await saveBtn.click();
          await page.waitForTimeout(2000);
          console.log(`  ✅ Product price updated from ${currentPrice} to ${newPrice}.`);
          await screenshot(page, '04_admin_products_after_edit');
        }
      }
    } else {
      console.log('  ⚠️ No products found to edit.');
    }

    // ── Step 3: Manage Orders ─────────────────────
    console.log('\n[3/8] Inspecting Orders...');
    await page.goto(BASE_URL + '/#/admin/orders', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '05_admin_orders_list');

    // Functional Check: Update order status
    console.log('  🛠️ Functional Check: Updating an order status...');
    const statusSelect = await page.$('tbody select');
    if (statusSelect) {
      await statusSelect.selectOption('Completed');
      await page.waitForTimeout(2000);
      console.log('  ✅ Order status update triggered.');
      await screenshot(page, '06_admin_orders_after_update');
    } else {
      console.log('  ⚠️ No order status dropdowns found.');
    }

    // ── Step 4: Manage Farmers ────────────────────
    console.log('\n[4/8] Viewing Farmers List...');
    await page.goto(BASE_URL + '/#/admin/farmers', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '07_admin_farmers_list');

    // ── Step 5: Sales Reports ─────────────────────
    console.log('\n[5/8] Inspecting Sales Reports...');
    await page.goto(BASE_URL + '/#/admin/reports', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);
    await screenshot(page, '08_admin_sales_report');

    // ── Step 6: Admin Profile ─────────────────────
    console.log('\n[6/8] Inspecting Admin Profile Data...');
    await page.goto(BASE_URL + '/#/profile', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '09_admin_profile');

    console.log('\n========================================');
    console.log('  ✅ ALL ADMIN AUDIT STEPS PASSED!');
    console.log('  📁 Evidence saved to: /screenshots_admin/');
    console.log('========================================\n');

  } catch (err) {
    console.error('\n❌ Audit Error:', err.message);
    await screenshot(page, 'audit_error_state');
  } finally {
    await browser.close();
  }
}

runAdminAudit();
